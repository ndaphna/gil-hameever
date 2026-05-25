-- Extend token_ledger to match what ai-usage-service.ts has been trying to log.
-- Existing columns: tokens_used, tokens_remaining, description, action_type.
-- The service code expects: openai_tokens, tokens_deducted, tokens_before,
-- tokens_after, token_multiplier, metadata. Without these columns the INSERTs
-- failed silently and we had zero audit trail.
--
-- Also drop the restrictive action_type CHECK (only chat|journal_analysis|refill)
-- which blocked richer values like 'chat_aliza', 'chat_expert' the engine emits.

alter table public.token_ledger
  add column if not exists openai_tokens int,
  add column if not exists tokens_deducted int,
  add column if not exists tokens_before int,
  add column if not exists tokens_after int,
  add column if not exists token_multiplier numeric(6,3),
  add column if not exists metadata jsonb not null default '{}'::jsonb;

do $$
declare
  c text;
begin
  for c in
    select conname
    from pg_constraint
    where conrelid = 'public.token_ledger'::regclass
      and contype  = 'c'
      and pg_get_constraintdef(oid) ilike '%action_type%'
  loop
    execute format('alter table public.token_ledger drop constraint %I', c);
  end loop;
end$$;

alter table public.token_ledger
  add constraint token_ledger_action_type_shape
  check (action_type is not null and char_length(action_type) between 1 and 64);

alter table public.token_ledger alter column tokens_used drop not null;
alter table public.token_ledger alter column tokens_remaining drop not null;

create index if not exists token_ledger_user_created_idx
  on public.token_ledger (user_id, created_at desc);

create index if not exists token_ledger_action_type_idx
  on public.token_ledger (action_type);
