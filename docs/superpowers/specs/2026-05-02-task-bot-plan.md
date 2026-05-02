# Task Bot — Implementation Plan
**Date:** 2026-05-02
**Spec:** `2026-05-02-task-bot-design.md`

---

## Phase 0 — Repo & Environment Setup

- [ ] `mkdir nitzan-task-bot && cd nitzan-task-bot && git init`
- [ ] `npm init -y` + install dependencies:
  ```bash
  npm install @supabase/supabase-js openai
  npm install -D typescript @types/node ts-node vercel
  npx tsc --init
  ```
- [ ] Create `.gitignore` (node_modules, .env.local, .vercel)
- [ ] Create `.env.local` with all 5 env vars (not committed)
- [ ] Create `vercel.json` with cron config
- [ ] Create Vercel project + link repo + set env vars in dashboard
- [ ] Create Telegram bot via @BotFather → get `TELEGRAM_BOT_TOKEN`
- [ ] Get personal `TELEGRAM_CHAT_ID` (message @userinfobot)

---

## Phase 1 — Supabase Table

- [ ] Open Supabase dashboard → project `pawsome-manager`
- [ ] Run migration SQL to create `bot_tasks` table:
  ```sql
  create type task_type as enum ('task', 'idea');
  create type task_priority as enum ('urgent', 'normal', 'low');
  create type task_status as enum ('open', 'done', 'cancelled');

  create table bot_tasks (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    context text,
    type task_type not null default 'task',
    priority task_priority not null default 'normal',
    status task_status not null default 'open',
    project_tag text,
    due_date date,
    raw_input text not null,
    created_at timestamptz not null default now(),
    completed_at timestamptz
  );

  alter table bot_tasks enable row level security;
  -- Service role bypasses RLS — no additional policies needed for server-only access
  ```

---

## Phase 2 — Lib Files

### `lib/supabase.ts`
- [ ] Initialize Supabase client with `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Export typed `supabase` client

### `lib/telegram.ts`
- [ ] `sendMessage(text: string): Promise<void>` — POST to Telegram Bot API
- [ ] Uses `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID`

### `lib/openai.ts`
- [ ] `parseIntent(text: string): Promise<ParsedIntent>` — GPT-4o with JSON schema response
- [ ] `transcribeVoice(fileUrl: string): Promise<string>` — download voice file from Telegram → Whisper API
- [ ] Define `ParsedIntent` TypeScript interface matching the JSON schema in the spec

---

## Phase 3 — Webhook Endpoint

### `api/webhook.ts`
- [ ] Receive POST from Telegram
- [ ] Detect message type: text or voice
- [ ] If voice → `transcribeVoice()` → text
- [ ] `parseIntent(text)` → get intent + fields
- [ ] Route by intent:
  - `add_task` / `add_idea` → INSERT into `bot_tasks` → reply "נשמר ✓"
  - `query` → SELECT relevant tasks → GPT formats Hebrew response → reply
  - `update_status` → find matching task (title similarity) → UPDATE → reply "עודכן ✓"
  - `context_question` → SELECT task → GPT answers from raw_input + context → reply
  - unknown → reply "לא הבנתי — משימה חדשה, עדכון, או שאלה?"
- [ ] Wrap in try/catch → on error reply "משהו השתבש, נסה שוב"

---

## Phase 4 — Cron Endpoints

### `api/cron/morning.ts`
- [ ] Verify request is from Vercel (check `Authorization` header)
- [ ] SELECT all `open` tasks, ordered by priority
- [ ] SELECT tasks created in last 24h
- [ ] Build Hebrew summary message and send via `sendMessage()`

### `api/cron/weekly.ts`
- [ ] Verify Vercel cron request
- [ ] SELECT tasks completed this week (`completed_at >= now() - interval '7 days'`)
- [ ] SELECT tasks open with no update for 7+ days (stuck)
- [ ] SELECT all still-open tasks
- [ ] Build Hebrew weekly summary and send via `sendMessage()`

---

## Phase 5 — Deploy & Wire Up

- [ ] `vercel deploy` → get production URL
- [ ] Register Telegram webhook:
  ```bash
  curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://nitzan-task-bot.vercel.app/api/webhook"
  ```
- [ ] Verify webhook: `getWebhookInfo`
- [ ] Send test message → confirm round-trip works
- [ ] Trigger cron manually via Vercel dashboard → confirm summary arrives

---

## Phase 6 — Smoke Test

- [ ] Add task via text: "להכין הצעת מחיר לענבל עד יום ראשון"
- [ ] Add idea via text: "רעיון: לשדרג את עמוד הנחיתה של גיל המעבר"
- [ ] Query: "מה פתוח?"
- [ ] Update: "סיימתי את הצעת המחיר"
- [ ] Add task via voice message
- [ ] Trigger morning cron manually → verify summary
