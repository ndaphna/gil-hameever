-- ============================================================================
-- Newsletter Dashboard — Phase 1 Foundation
-- ----------------------------------------------------------------------------
-- Architecture: Option B (Supabase schedules + state-of-truth, Brevo sends).
-- Isolated under `newsletter` schema; does not touch existing `public` tables.
-- ============================================================================

create extension if not exists vector;
create extension if not exists pg_trgm;
create extension if not exists pgcrypto;

create schema if not exists newsletter;

grant usage on schema newsletter to authenticated, service_role;
alter default privileges in schema newsletter
  grant select, insert, update, delete on tables to authenticated, service_role;
alter default privileges in schema newsletter
  grant usage, select on sequences to authenticated, service_role;

-- ============================================================================
-- ROLES
-- ============================================================================

create type newsletter.app_role as enum ('admin', 'campaign_manager', 'content_creator');

create table newsletter.user_roles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  role       newsletter.app_role not null,
  created_at timestamptz not null default now()
);

-- Role hierarchy check. admin > campaign_manager > content_creator.
create or replace function newsletter.has_role(required newsletter.app_role)
returns boolean
language sql
stable
security definer
set search_path = newsletter, public
as $$
  select exists (
    select 1 from newsletter.user_roles
    where user_id = auth.uid()
      and (
        role = required
        or (required = 'campaign_manager' and role = 'admin')
        or (required = 'content_creator'  and role in ('admin','campaign_manager'))
      )
  );
$$;

-- ============================================================================
-- SEQUENCES (one master list to start; supports many)
-- ============================================================================

create table newsletter.sequences (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  brevo_list_id   bigint,                       -- Brevo master list id
  is_active       boolean not null default true,
  total_emails    int,                          -- soft cap, e.g. 20
  default_delay_days int not null default 4,    -- between consecutive emails
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================================
-- SUBSCRIBERS (mirror of Brevo contacts on master list)
-- ============================================================================

create table newsletter.subscribers (
  id                uuid primary key default gen_random_uuid(),
  brevo_contact_id  bigint unique,
  email             text not null,
  first_name        text,
  last_name         text,
  attributes        jsonb not null default '{}'::jsonb,
  brevo_list_ids    int[] not null default '{}',
  signed_up_at      timestamptz,
  is_blocked        boolean not null default false,
  blocked_reason    text,
  last_synced_at    timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create unique index ix_subscribers_email_lower
  on newsletter.subscribers (lower(email));

-- ============================================================================
-- SIGNATURES
-- ============================================================================

create table newsletter.signatures (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  body_mjml   text not null,
  body_html   text,
  image_url   text,
  is_default  boolean not null default false,
  created_at  timestamptz not null default now()
);

create unique index ix_signatures_one_default
  on newsletter.signatures (is_default) where is_default = true;

-- ============================================================================
-- EMAIL DRAFTS (the source of truth for content; Brevo templates are mirror)
-- ============================================================================

create table newsletter.email_drafts (
  id                  uuid primary key default gen_random_uuid(),
  sequence_id         uuid references newsletter.sequences(id) on delete set null,
  order_key           numeric,                  -- decimal: 1.0, 2.0, 7.5...
  subject             text not null,
  body_mjml           text,
  body_html           text,
  body_text           text,                     -- extracted for ilike search
  signature_id        uuid references newsletter.signatures(id),
  brevo_template_id   bigint,
  delay_days          int,                      -- per-email override
  tags                text[] not null default '{}',
  locale              text not null default 'he-IL',
  status              text not null default 'draft'
                       check (status in ('draft','published','archived')),
  is_ai_generated     boolean not null default false,
  created_by          uuid references auth.users(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index ix_drafts_status_seq_order
  on newsletter.email_drafts (status, sequence_id, order_key);
create index ix_drafts_tags
  on newsletter.email_drafts using gin (tags);
create index ix_drafts_body_trgm
  on newsletter.email_drafts using gin (body_text gin_trgm_ops);
create index ix_drafts_subject_trgm
  on newsletter.email_drafts using gin (subject gin_trgm_ops);

-- Version history
create table newsletter.email_draft_versions (
  id          bigserial primary key,
  draft_id    uuid not null references newsletter.email_drafts(id) on delete cascade,
  version     int not null,
  subject     text not null,
  body_mjml   text,
  body_html   text,
  changed_by  uuid references auth.users(id),
  changed_at  timestamptz not null default now(),
  unique (draft_id, version)
);

-- Auto-version on UPDATE (only when body changes)
create or replace function newsletter.snapshot_draft_version()
returns trigger language plpgsql as $$
declare next_version int;
begin
  if (new.body_mjml is distinct from old.body_mjml)
     or (new.subject is distinct from old.subject)
     or (new.body_html is distinct from old.body_html) then
    select coalesce(max(version), 0) + 1 into next_version
      from newsletter.email_draft_versions where draft_id = old.id;
    insert into newsletter.email_draft_versions
      (draft_id, version, subject, body_mjml, body_html, changed_by)
    values
      (old.id, next_version, old.subject, old.body_mjml, old.body_html, auth.uid());
  end if;
  return new;
end;
$$;

create trigger trg_drafts_snapshot
  before update on newsletter.email_drafts
  for each row execute function newsletter.snapshot_draft_version();

-- ============================================================================
-- SUBSCRIBER PROGRESS (per-subscriber state within a sequence)
-- This is what Option B's scheduler reads to decide what to send next.
-- ============================================================================

create table newsletter.subscriber_progress (
  subscriber_id        uuid not null references newsletter.subscribers(id) on delete cascade,
  sequence_id          uuid not null references newsletter.sequences(id) on delete cascade,
  current_order_key    numeric,                 -- last delivered position
  next_eligible_at     timestamptz,             -- when can next be sent
  last_sent_at         timestamptz,
  last_delivered_at    timestamptz,
  last_opened_at       timestamptz,
  last_clicked_at      timestamptz,
  state                text not null default 'active'
                        check (state in ('active','paused','completed','unsubscribed','bounced')),
  pause_until          timestamptz,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  primary key (subscriber_id, sequence_id)
);

create index ix_progress_eligible
  on newsletter.subscriber_progress (state, next_eligible_at)
  where state = 'active';

-- ============================================================================
-- EMAIL EVENTS (immutable log from Brevo webhook)
-- ============================================================================

create table newsletter.email_events (
  id                bigserial primary key,
  subscriber_id     uuid references newsletter.subscribers(id) on delete set null,
  draft_id          uuid references newsletter.email_drafts(id) on delete set null,
  brevo_message_id  text,
  brevo_contact_id  bigint,
  brevo_template_id bigint,
  email             text,
  event_type        text not null,             -- delivered, opened, click, hard_bounce, etc.
  event_at          timestamptz not null,
  link_url          text,
  reason            text,
  user_agent        text,
  ip                text,
  raw               jsonb not null,
  received_at       timestamptz not null default now()
);

create index ix_events_sub_time      on newsletter.email_events (subscriber_id, event_at desc);
create index ix_events_type_time     on newsletter.email_events (event_type, event_at desc);
create index ix_events_msg           on newsletter.email_events (brevo_message_id);
create index ix_events_draft_time    on newsletter.email_events (draft_id, event_at desc);

-- ============================================================================
-- BROADCASTS (one-off campaigns, not part of sequence)
-- ============================================================================

create table newsletter.broadcasts (
  id                  uuid primary key default gen_random_uuid(),
  subject             text not null,
  body_mjml           text,
  body_html           text,
  signature_id        uuid references newsletter.signatures(id),
  target_filter       jsonb not null default '{}'::jsonb,  -- e.g. {"min_health_score": 70}
  brevo_campaign_id   bigint,
  scheduled_for       timestamptz,
  sent_at             timestamptz,
  status              text not null default 'draft'
                       check (status in ('draft','scheduled','sending','sent','failed','cancelled')),
  created_by          uuid references auth.users(id),
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================================
-- NOTIFICATIONS SENT (idempotency for system alerts to Inbal)
-- ============================================================================

create table newsletter.notifications_sent (
  id              bigserial primary key,
  subscriber_id   uuid references newsletter.subscribers(id) on delete cascade,
  kind            text not null,                -- 'near_end', 'stagnant', 'at_risk', ...
  context         jsonb not null default '{}'::jsonb,
  sent_at         timestamptz not null default now(),
  unique (subscriber_id, kind)
);

-- ============================================================================
-- ACTIVITY LOG (audit trail for multi-user)
-- ============================================================================

create table newsletter.activity_log (
  id           bigserial primary key,
  user_id      uuid references auth.users(id),
  action       text not null,                   -- 'draft.publish', 'broadcast.send', ...
  entity_type  text,
  entity_id    uuid,
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);

create index ix_activity_user_time on newsletter.activity_log (user_id, created_at desc);

-- ============================================================================
-- INBAL CORPUS (RAG source for AI auto-content)
-- ============================================================================
-- Uses 1536-dim embeddings (text-embedding-3-large with `dimensions: 1536`
-- or text-embedding-3-small native). 1536 is the largest dim supported by HNSW.

create table newsletter.inbal_corpus (
  id                    uuid primary key default gen_random_uuid(),
  source                text not null
                         check (source in ('book','website','instagram','newsletter','manual')),
  source_ref            text,                    -- page#, post-id, url, etc.
  title                 text,
  body                  text not null,
  locale                text not null default 'he-IL',
  published_at          timestamptz,
  tags                  text[] not null default '{}',
  performance_metrics   jsonb,                   -- {open_rate, click_rate} for newsletters
  embedding             vector(1536),
  created_at            timestamptz not null default now()
);

-- Regular unique constraint (PostgreSQL default: NULLs are distinct,
-- so multiple rows with null source_ref are still allowed).
alter table newsletter.inbal_corpus
  add constraint inbal_corpus_source_ref_uk unique (source, source_ref);

create index ix_corpus_source on newsletter.inbal_corpus (source);
create index ix_corpus_locale on newsletter.inbal_corpus (locale);
create index ix_corpus_embedding
  on newsletter.inbal_corpus using hnsw (embedding vector_cosine_ops);

-- ============================================================================
-- STYLE GUIDE (one active per locale)
-- ============================================================================

create table newsletter.style_guide (
  id          uuid primary key default gen_random_uuid(),
  locale      text not null default 'he-IL',
  version     int not null,
  content_md  text not null,
  is_active   boolean not null default false,
  notes       text,
  created_at  timestamptz not null default now(),
  unique (locale, version)
);

create unique index ix_style_guide_one_active_per_locale
  on newsletter.style_guide (locale) where is_active = true;

-- ============================================================================
-- TOPIC TAXONOMY + CANDIDATES (Phase 2 AI pipeline foundation)
-- ============================================================================

create table newsletter.topic_taxonomy (
  id                 uuid primary key default gen_random_uuid(),
  category           text not null,             -- physiological / emotional / relational / lifestyle
  topic              text not null,
  keywords_he        text[] not null default '{}',
  keywords_en        text[] not null default '{}',
  is_active          boolean not null default true,
  performance_score  numeric not null default 0,
  created_at         timestamptz not null default now()
);

create table newsletter.topic_candidates (
  id                 uuid primary key default gen_random_uuid(),
  taxonomy_id        uuid references newsletter.topic_taxonomy(id),
  title              text not null,
  summary            text,
  sources            jsonb not null default '[]'::jsonb,
  relevance_score    numeric,
  trendiness_score   numeric,
  freshness_score    numeric,
  novelty_score      numeric,
  combined_score     numeric,
  status             text not null default 'pending'
                      check (status in ('pending','selected','rejected','used','expired')),
  selected_at        timestamptz,
  selected_by        uuid references auth.users(id),
  created_at         timestamptz not null default now()
);

create index ix_topic_candidates_status_score
  on newsletter.topic_candidates (status, combined_score desc);

-- ============================================================================
-- ARTICLE DRAFTS (AI-generated, awaiting approval)
-- ============================================================================

create table newsletter.article_drafts (
  id                       uuid primary key default gen_random_uuid(),
  topic_candidate_id       uuid references newsletter.topic_candidates(id),
  email_draft_id           uuid references newsletter.email_drafts(id), -- when approved → linked draft
  status                   text not null default 'topic_pending'
                            check (status in (
                              'topic_pending','topic_selected','generating',
                              'compliance_review','awaiting_approval','approved',
                              'distributed','rejected','archived'
                            )),
  title                    text,
  body_mjml                text,
  body_html                text,
  outline                  jsonb,
  critique                 jsonb,
  compliance_flags         jsonb,
  image_options            jsonb not null default '[]'::jsonb,  -- [{url, prompt, selected}]
  selected_image_url       text,
  generation_metadata      jsonb,                  -- {models, latencies, retries}
  generation_cost_usd      numeric,
  approved_by              uuid references auth.users(id),
  approved_at              timestamptz,
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================

create or replace function newsletter.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_seq_touch       before update on newsletter.sequences           for each row execute function newsletter.touch_updated_at();
create trigger trg_sub_touch       before update on newsletter.subscribers         for each row execute function newsletter.touch_updated_at();
create trigger trg_drafts_touch    before update on newsletter.email_drafts        for each row execute function newsletter.touch_updated_at();
create trigger trg_progress_touch  before update on newsletter.subscriber_progress for each row execute function newsletter.touch_updated_at();
create trigger trg_bcast_touch     before update on newsletter.broadcasts          for each row execute function newsletter.touch_updated_at();
create trigger trg_article_touch   before update on newsletter.article_drafts      for each row execute function newsletter.touch_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

alter table newsletter.user_roles            enable row level security;
alter table newsletter.sequences             enable row level security;
alter table newsletter.subscribers           enable row level security;
alter table newsletter.signatures            enable row level security;
alter table newsletter.email_drafts          enable row level security;
alter table newsletter.email_draft_versions  enable row level security;
alter table newsletter.subscriber_progress   enable row level security;
alter table newsletter.email_events          enable row level security;
alter table newsletter.broadcasts            enable row level security;
alter table newsletter.notifications_sent    enable row level security;
alter table newsletter.activity_log          enable row level security;
alter table newsletter.inbal_corpus          enable row level security;
alter table newsletter.style_guide           enable row level security;
alter table newsletter.topic_taxonomy        enable row level security;
alter table newsletter.topic_candidates      enable row level security;
alter table newsletter.article_drafts        enable row level security;

-- Read: any team member with a role.
-- Write: per-table sensitivity. Service-role bypasses RLS implicitly.

create policy r_roles          on newsletter.user_roles            for select using (newsletter.has_role('content_creator'));
create policy w_roles          on newsletter.user_roles            for all    using (newsletter.has_role('admin'))            with check (newsletter.has_role('admin'));

create policy r_sequences      on newsletter.sequences             for select using (newsletter.has_role('content_creator'));
create policy w_sequences      on newsletter.sequences             for all    using (newsletter.has_role('campaign_manager')) with check (newsletter.has_role('campaign_manager'));

create policy r_subscribers    on newsletter.subscribers           for select using (newsletter.has_role('content_creator'));
create policy w_subscribers    on newsletter.subscribers           for all    using (newsletter.has_role('campaign_manager')) with check (newsletter.has_role('campaign_manager'));

create policy r_signatures     on newsletter.signatures            for select using (newsletter.has_role('content_creator'));
create policy w_signatures     on newsletter.signatures            for all    using (newsletter.has_role('campaign_manager')) with check (newsletter.has_role('campaign_manager'));

create policy r_drafts         on newsletter.email_drafts          for select using (newsletter.has_role('content_creator'));
create policy iud_drafts       on newsletter.email_drafts          for all    using (newsletter.has_role('content_creator')) with check (newsletter.has_role('content_creator'));

create policy r_draft_versions on newsletter.email_draft_versions  for select using (newsletter.has_role('content_creator'));

create policy r_progress       on newsletter.subscriber_progress   for select using (newsletter.has_role('content_creator'));
create policy w_progress       on newsletter.subscriber_progress   for all    using (newsletter.has_role('campaign_manager')) with check (newsletter.has_role('campaign_manager'));

create policy r_events         on newsletter.email_events          for select using (newsletter.has_role('content_creator'));
-- Inserts to email_events happen via service-role only (webhook handler)

create policy r_broadcasts     on newsletter.broadcasts            for select using (newsletter.has_role('content_creator'));
create policy w_broadcasts     on newsletter.broadcasts            for all    using (newsletter.has_role('campaign_manager')) with check (newsletter.has_role('campaign_manager'));

create policy r_notifications  on newsletter.notifications_sent    for select using (newsletter.has_role('content_creator'));

create policy r_activity       on newsletter.activity_log          for select using (newsletter.has_role('admin'));

create policy r_corpus         on newsletter.inbal_corpus          for select using (newsletter.has_role('content_creator'));
create policy w_corpus         on newsletter.inbal_corpus          for all    using (newsletter.has_role('admin'))            with check (newsletter.has_role('admin'));

create policy r_style          on newsletter.style_guide           for select using (newsletter.has_role('content_creator'));
create policy w_style          on newsletter.style_guide           for all    using (newsletter.has_role('admin'))            with check (newsletter.has_role('admin'));

create policy r_taxonomy       on newsletter.topic_taxonomy        for select using (newsletter.has_role('content_creator'));
create policy w_taxonomy       on newsletter.topic_taxonomy        for all    using (newsletter.has_role('admin'))            with check (newsletter.has_role('admin'));

create policy r_topic_cand     on newsletter.topic_candidates      for select using (newsletter.has_role('content_creator'));
create policy w_topic_cand     on newsletter.topic_candidates      for all    using (newsletter.has_role('campaign_manager')) with check (newsletter.has_role('campaign_manager'));

create policy r_article_drafts on newsletter.article_drafts        for select using (newsletter.has_role('content_creator'));
create policy w_article_drafts on newsletter.article_drafts        for all    using (newsletter.has_role('content_creator')) with check (newsletter.has_role('content_creator'));

-- ============================================================================
-- SEED: initial taxonomy + admin role for Inbal/Nitzan
-- ============================================================================

insert into newsletter.topic_taxonomy (category, topic, keywords_he, keywords_en) values
  ('physiological', 'גלי חום',         array['גלי חום','הזעות לילה','חום פתאומי'],            array['hot flashes','night sweats']),
  ('physiological', 'שינה מופרעת',      array['שינה','נדודי שינה','אינסומניה'],                  array['sleep','insomnia']),
  ('physiological', 'יובש',             array['יובש','עור יבש','יובש בנרתיק'],                  array['dryness','vaginal dryness']),
  ('physiological', 'עלייה במשקל',      array['משקל','שומן בטני','חילוף חומרים'],               array['weight gain','metabolism']),
  ('physiological', 'בריאות עצמות',     array['עצמות','אוסטאופורוזיס','סידן'],                  array['bones','osteoporosis']),
  ('physiological', 'בריאות הלב',       array['לב','לחץ דם','כולסטרול'],                        array['heart','cardiovascular']),
  ('physiological', 'ערפול קוגניטיבי',  array['ערפול','זיכרון','ריכוז','ערפל מוחי'],            array['brain fog','memory','concentration']),
  ('emotional',     'חרדה',             array['חרדה','דאגה','מתח'],                              array['anxiety']),
  ('emotional',     'דיכאון',           array['דיכאון','עצב','אדישות'],                          array['depression']),
  ('emotional',     'תנודות מצב רוח',   array['מצב רוח','עצבנות','רגשנות'],                     array['mood swings','irritability']),
  ('emotional',     'זהות עצמית',       array['זהות','משמעות','אני','התחדשות'],                 array['identity','self','reinvention']),
  ('relational',    'זוגיות',           array['זוגיות','נישואין','קשר','אינטימיות'],            array['relationship','marriage','intimacy']),
  ('relational',    'אמהות מבוגרת',     array['אמהות','ילדים','קן ריק'],                         array['parenting','empty nest']),
  ('relational',    'חברות',            array['חברות','בדידות','קהילה'],                         array['friendship','loneliness','community']),
  ('lifestyle',     'תזונה',            array['תזונה','אוכל','דיאטה','חלבון'],                  array['nutrition','diet','protein']),
  ('lifestyle',     'פעילות גופנית',    array['ספורט','אימון','הליכה','כוח'],                   array['exercise','training','walking','strength']),
  ('lifestyle',     'מיינדפולנס',       array['מדיטציה','נשימה','מודעות'],                       array['mindfulness','meditation','breathing']),
  ('lifestyle',     'קריירה ושינוי',    array['קריירה','שינוי','עסק','פרישה'],                  array['career','reinvention','retirement'])
on conflict do nothing;
