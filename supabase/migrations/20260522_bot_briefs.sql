-- ============================================================================
-- Bot Brief Platform — Phase 1 Foundation
-- ----------------------------------------------------------------------------
-- Intake forms for Inbal's ManyChat bots (Comment-to-DM, Story Reply/Mention).
-- ManyChat API cannot create flows programmatically; this module collects a
-- structured spec + assets, notifies Nitzan, and tracks the bot lifecycle.
-- Reuses newsletter.has_role() for admin gating.
-- ============================================================================

create schema if not exists bots;

grant usage on schema bots to authenticated, service_role;
alter default privileges in schema bots
  grant select, insert, update, delete on tables to authenticated, service_role;
alter default privileges in schema bots
  grant usage, select on sequences to authenticated, service_role;

-- ============================================================================
-- TYPES
-- ============================================================================

create type bots.brief_type as enum (
  'comment_to_dm',
  'story_reply',
  'story_mention'
);

create type bots.brief_status as enum (
  'draft',
  'submitted',
  'building',
  'live',
  'archived'
);

create type bots.asset_kind as enum (
  'image',
  'pdf',
  'video',
  'other'
);

-- ============================================================================
-- BRIEFS
-- ============================================================================

create table bots.briefs (
  id                      uuid primary key default gen_random_uuid(),
  created_by              uuid not null references auth.users(id) on delete restrict,
  title                   text not null,
  type                    bots.brief_type not null,
  status                  bots.brief_status not null default 'draft',

  -- Trigger spec
  post_url                text,                            -- Instagram post/reel URL
  keyword_triggers        text[] not null default '{}',    -- only for comment_to_dm
  story_label             text,                            -- description for story_reply/mention

  -- DM payload
  dm_message              text,                            -- supports {first_name} placeholder
  lead_magnet_url         text,                            -- destination link (external or storage path)

  -- Follow-up
  brevo_template_id       bigint,                          -- Brevo Transactional Template ID
  followup_delay_hours    int not null default 24,
  followup_enabled        boolean not null default false,

  -- ManyChat linkage (filled when Nitzan marks Live)
  manychat_flow_id        text,
  manychat_tag            text,                            -- auto-generated from title

  notes                   text,

  created_at              timestamptz not null default now(),
  submitted_at            timestamptz,
  live_at                 timestamptz,
  archived_at             timestamptz,
  updated_at              timestamptz not null default now()
);

create index ix_briefs_creator_status on bots.briefs (created_by, status);
create index ix_briefs_status_created on bots.briefs (status, created_at desc);
create index ix_briefs_manychat_flow  on bots.briefs (manychat_flow_id) where manychat_flow_id is not null;

-- ============================================================================
-- ASSETS
-- ============================================================================

create table bots.brief_assets (
  id            uuid primary key default gen_random_uuid(),
  brief_id      uuid not null references bots.briefs(id) on delete cascade,
  kind          bots.asset_kind not null,
  storage_path  text not null,                       -- path inside bot-brief-assets bucket
  filename      text not null,
  mime          text not null,
  size_bytes    bigint not null,
  uploaded_by   uuid references auth.users(id),
  created_at    timestamptz not null default now()
);

create index ix_assets_brief on bots.brief_assets (brief_id);

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================

create or replace function bots.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_briefs_touch
  before update on bots.briefs
  for each row execute function bots.touch_updated_at();

-- ============================================================================
-- STATUS TRANSITION GUARDS
-- ============================================================================
-- Briefs progress: draft → submitted → building → live → archived
-- Inbal can move draft → submitted; only admin can advance further.
-- Editing brief content is allowed only in 'draft' state for the creator;
-- admins can edit at any state.

create or replace function bots.enforce_brief_transition()
returns trigger language plpgsql as $$
declare
  is_admin boolean := newsletter.has_role('admin');
begin
  -- Stamp transition timestamps
  if new.status = 'submitted' and old.status = 'draft' then
    new.submitted_at := coalesce(new.submitted_at, now());
  elsif new.status = 'live' and old.status in ('submitted','building') then
    new.live_at := coalesce(new.live_at, now());
  elsif new.status = 'archived' then
    new.archived_at := coalesce(new.archived_at, now());
  end if;

  -- Block illegal transitions
  if old.status = new.status then
    return new;  -- no-op transition is fine
  end if;

  if not is_admin then
    -- Creator can only move draft → submitted, or → archived from any non-live state
    if not (
      (old.status = 'draft'     and new.status = 'submitted')
      or (old.status in ('draft','submitted') and new.status = 'archived')
    ) then
      raise exception 'transition % → % requires admin', old.status, new.status;
    end if;
  end if;

  return new;
end;
$$;

create trigger trg_briefs_transition
  before update on bots.briefs
  for each row when (old.status is distinct from new.status)
  execute function bots.enforce_brief_transition();

-- ============================================================================
-- RLS
-- ============================================================================

alter table bots.briefs       enable row level security;
alter table bots.brief_assets enable row level security;

-- Briefs: creator sees own, admin sees all
create policy briefs_select_own_or_admin on bots.briefs
  for select using (
    created_by = auth.uid() or newsletter.has_role('admin')
  );

create policy briefs_insert_self on bots.briefs
  for insert with check (
    created_by = auth.uid()
    and newsletter.has_role('content_creator')
  );

-- Updates: creator can update own draft only; admin can update anything
create policy briefs_update_own_draft_or_admin on bots.briefs
  for update using (
    newsletter.has_role('admin')
    or (created_by = auth.uid() and status = 'draft')
  )
  with check (
    newsletter.has_role('admin')
    or (created_by = auth.uid() and status in ('draft','submitted','archived'))
  );

-- Delete: admin only
create policy briefs_delete_admin on bots.briefs
  for delete using (newsletter.has_role('admin'));

-- Assets follow brief access
create policy assets_select_via_brief on bots.brief_assets
  for select using (
    exists (
      select 1 from bots.briefs b
      where b.id = brief_id
        and (b.created_by = auth.uid() or newsletter.has_role('admin'))
    )
  );

create policy assets_insert_via_brief on bots.brief_assets
  for insert with check (
    exists (
      select 1 from bots.briefs b
      where b.id = brief_id
        and (
          newsletter.has_role('admin')
          or (b.created_by = auth.uid() and b.status = 'draft')
        )
    )
  );

create policy assets_delete_via_brief on bots.brief_assets
  for delete using (
    exists (
      select 1 from bots.briefs b
      where b.id = brief_id
        and (
          newsletter.has_role('admin')
          or (b.created_by = auth.uid() and b.status = 'draft')
        )
    )
  );

-- ============================================================================
-- STORAGE BUCKET (private; reads via signed URLs only)
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bot-brief-assets',
  'bot-brief-assets',
  false,
  25 * 1024 * 1024,                                   -- 25 MB per file
  array[
    'image/png','image/jpeg','image/webp',
    'application/pdf',
    'video/mp4','video/quicktime'
  ]
)
on conflict (id) do update set
  public            = excluded.public,
  file_size_limit   = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Authenticated users can read their own brief assets (via signed URL flow,
-- this also lets the in-app preview work for admin + creator).
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage' and tablename = 'objects'
      and policyname = 'bot_brief_assets_read_via_brief'
  ) then
    create policy bot_brief_assets_read_via_brief
      on storage.objects for select
      using (
        bucket_id = 'bot-brief-assets'
        and exists (
          select 1 from bots.brief_assets a
          join bots.briefs b on b.id = a.brief_id
          where a.storage_path = storage.objects.name
            and (b.created_by = auth.uid() or newsletter.has_role('admin'))
        )
      );
  end if;
end$$;
