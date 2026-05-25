-- Per-user persistent memory for the Aliza chatbot.
-- One row per user. Holds a distilled summary of what Aliza has learned about
-- the woman across all her chat threads, so every new turn loads in O(1)
-- without re-reading the full message history.
--
-- Privacy:
--   - RLS enabled. Users can only SELECT their own row (future "what Aliza
--     remembers about me" screen). Writes are service-role only via API.
--   - ON DELETE CASCADE on auth.users → deleting the account wipes the row
--     (GDPR + Israeli Privacy Law).
--   - No raw message content is stored here; only a distilled, structured
--     summary. Raw messages live in newsletter? No — raw chat lives in the
--     public `message` table (existing).

create table if not exists newsletter.aliza_user_memory (
  user_id              uuid primary key references auth.users(id) on delete cascade,

  -- Distilled long-term summary (3-8 bullets in Hebrew). Rewritten by the
  -- distill-aliza-memory route every ~6 messages.
  context_summary      text,

  -- Structured slots that the model can use directly without parsing prose.
  current_stage        text check (current_stage is null or current_stage in (
    'pre_menopause', 'perimenopause', 'menopause', 'postmenopause', 'unknown'
  )),
  active_symptoms      text[] default '{}'::text[],
  things_tried         jsonb default '[]'::jsonb,
  preferences          jsonb default '{}'::jsonb,

  -- Bookkeeping for the distillation loop.
  message_count        int    not null default 0,
  last_distilled_at    timestamptz,

  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

create index if not exists aliza_user_memory_updated_at_idx
  on newsletter.aliza_user_memory (updated_at desc);

-- updated_at trigger.
create or replace function newsletter.aliza_user_memory_touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists aliza_user_memory_touch on newsletter.aliza_user_memory;
create trigger aliza_user_memory_touch
  before update on newsletter.aliza_user_memory
  for each row execute function newsletter.aliza_user_memory_touch_updated_at();

-- RLS.
alter table newsletter.aliza_user_memory enable row level security;

drop policy if exists aliza_user_memory_self_read on newsletter.aliza_user_memory;
create policy aliza_user_memory_self_read
  on newsletter.aliza_user_memory
  for select
  using (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policies for end-users. Service role bypasses RLS
-- and is the only writer (via API routes).

-- Allow the API layer to grant SELECT to authenticated users implicitly via RLS.
grant select on newsletter.aliza_user_memory to authenticated;
