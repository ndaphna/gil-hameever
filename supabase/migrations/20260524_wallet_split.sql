-- Phase 0 — Aliza token economy: wallet split.
--
-- Splits the single `current_tokens` balance into two independent wallets:
--   - chat_credits: spent on user-facing conversations with Aliza
--   - analysis_credits: spent on daily/weekly/monthly analyses, PDFs, insights
--
-- Platform actions (newsletters, content generation) bypass user wallets entirely.
--
-- Currency model:
--   The UI now speaks in "credits" (whole numbers). 1 chat ≈ 1 credit, expert
--   mode burns 10. The ledger continues to record raw Anthropic usage and adds
--   a cost-in-USD column so we can reconcile margin per action without back-
--   computing through a flat multiplier.
--
-- Backward compatibility:
--   `user_profile.current_tokens` and `tokens_remaining` are NOT dropped here.
--   Code paths are migrated to read/write the new columns; current_tokens is
--   left in place until Phase 2 ships and we verify nothing else reads it.
--   A trigger keeps current_tokens = chat_credits + analysis_credits as a
--   safety net for any legacy dashboard or query we haven't touched yet.
--
-- Backfill:
--   All existing users are admin/test accounts (no live payers). We grant
--   each profile 30 chat credits + 10 analysis credits so internal testing
--   keeps working. New signups will be handled by the trial-grant logic
--   in Phase 6.

-- ── user_profile: new wallet columns ──────────────────────────────────────
alter table public.user_profile
  add column if not exists chat_credits int not null default 0,
  add column if not exists analysis_credits int not null default 0,
  add column if not exists trial_expires_at timestamptz;

-- One-time backfill for existing accounts (all internal). Safe to re-run.
update public.user_profile
   set chat_credits = greatest(chat_credits, 30),
       analysis_credits = greatest(analysis_credits, 10)
 where chat_credits = 0
    or analysis_credits = 0;

-- Safety-net trigger: keep current_tokens reflecting the union of wallets
-- so legacy reads (sidebar, profile page) keep showing a sensible number
-- until Phase 2 ships the dual-counter UI.
create or replace function public.sync_legacy_token_columns()
returns trigger
language plpgsql
as $$
begin
  new.current_tokens := coalesce(new.chat_credits, 0) + coalesce(new.analysis_credits, 0);
  new.tokens_remaining := new.current_tokens;
  return new;
end;
$$;

drop trigger if exists trg_sync_legacy_token_columns on public.user_profile;
create trigger trg_sync_legacy_token_columns
  before insert or update of chat_credits, analysis_credits
  on public.user_profile
  for each row
  execute function public.sync_legacy_token_columns();

-- Run the trigger once for the existing rows so current_tokens is consistent.
update public.user_profile
   set chat_credits = chat_credits
 where true;

-- ── token_ledger: wallet column + real cost tracking ──────────────────────
alter table public.token_ledger
  add column if not exists wallet text,
  add column if not exists credits_deducted int,
  add column if not exists cost_usd_micros bigint,
  add column if not exists provider text,
  add column if not exists model text;

-- Soft constraint — accept the three known wallets, but allow null for legacy rows.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'token_ledger_wallet_check'
      and conrelid = 'public.token_ledger'::regclass
  ) then
    alter table public.token_ledger
      add constraint token_ledger_wallet_check
      check (wallet is null or wallet in ('chat', 'analysis', 'platform'));
  end if;
end$$;

create index if not exists token_ledger_wallet_idx
  on public.token_ledger (wallet, created_at desc);

create index if not exists token_ledger_user_wallet_idx
  on public.token_ledger (user_id, wallet, created_at desc);

-- ── observability view: per-user current wallets ──────────────────────────
create or replace view public.user_wallet_balance as
  select
    id              as user_id,
    chat_credits,
    analysis_credits,
    trial_expires_at,
    updated_at
    from public.user_profile;
