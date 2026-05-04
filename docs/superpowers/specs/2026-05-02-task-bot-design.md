# Task Bot — Design Spec
**Date:** 2026-05-02
**Author:** Nitzan Daphna
**Status:** Approved

---

## Problem

Tasks and ideas arrive from multiple sources (conversations with Inbal, meetings, random thoughts) and end up scattered across Google Sheets, sticky notes, Word files, or not captured at all. Result: forgotten tasks, missed deadlines, and lost context for why a task was opened.

---

## Solution

A personal Telegram bot that captures tasks and ideas in natural language (text or voice), stores them in Supabase, and proactively sends daily and weekly summaries.

---

## Architecture

```
[Telegram] ←→ [Vercel Serverless Bot]
                      ↓
               [OpenAI GPT-4o]     ← intent parsing
               [OpenAI Whisper]    ← voice transcription
                      ↓
               [Supabase DB]       ← bot_tasks table (pawsome-manager project)
                      ↑
               [Vercel Cron]       ← 08:00 daily + Sunday 09:00
                      ↓
               [Telegram]          ← proactive summaries
```

**Repo:** `nitzan-task-bot` (standalone, separate from all product repos)
**Stack:** Node.js + TypeScript, Vercel (Hobby), Supabase (existing pawsome-manager project), OpenAI API

---

## Data Model

Table: `bot_tasks` in Supabase project `pawsome-manager`

| Column | Type | Notes |
|---|---|---|
| `id` | uuid, PK | |
| `title` | text | Short task/idea description |
| `context` | text, nullable | Why it was created — AI extracts from message |
| `type` | enum: `task` / `idea` | |
| `priority` | enum: `urgent` / `normal` / `low` | AI estimates from wording |
| `status` | enum: `open` / `done` / `cancelled` | |
| `project_tag` | text, nullable | Free text: "גיל המעבר", "בית", "עבודה", etc. |
| `due_date` | date, nullable | AI extracts if mentioned |
| `raw_input` | text | Original message verbatim |
| `created_at` | timestamptz | |
| `completed_at` | timestamptz, nullable | |

**RLS:** Table accessible only via service role key (server-side only, no client access).

---

## Intent Types

| Intent | Example input | Action |
|---|---|---|
| `add_task` | "להכין הצעת מחיר לענבל עד יום ראשון" | INSERT → confirm "נשמר ✓" |
| `add_idea` | "רעיון: להוסיף וידאו לעמוד הנחיתה" | INSERT (type=idea) → confirm |
| `query` | "מה פתוח?", "מה הכי דחוף?" | SELECT → GPT formats response |
| `update_status` | "סיימתי את הצעת המחיר" | UPDATE status=done |
| `context_question` | "למה פתחתי את המשימה של הניוזלטר?" | SELECT raw_input+context → GPT answers |

**Fallback:** If intent is unclear → bot replies: "לא הבנתי — משימה חדשה, עדכון, או שאלה?"

---

## GPT-4o Intent Parser — Response Schema

```json
{
  "intent": "add_task",
  "title": "להכין הצעת מחיר לענבל",
  "type": "task",
  "priority": "urgent",
  "due_date": "2026-05-04",
  "project_tag": "גיל המעבר",
  "context": "ענבל ביקשה בפגישה"
}
```

---

## Proactive Summaries

**Daily — 08:00 (every day)**
- Total open tasks
- Top 3 by priority
- New tasks added yesterday

**Weekly — Sunday 09:00**
- Tasks completed this week
- Tasks still open
- Tasks with no activity for 7+ days (stuck)

---

## Project Structure

```
nitzan-task-bot/
├── api/
│   ├── webhook.ts          ← Telegram webhook (POST from Telegram)
│   └── cron/
│       ├── morning.ts      ← daily 08:00 summary
│       └── weekly.ts       ← Sunday 09:00 summary
├── lib/
│   ├── openai.ts           ← intent parsing + Whisper transcription
│   ├── supabase.ts         ← DB client (service role)
│   └── telegram.ts         ← sendMessage helper
├── vercel.json
├── package.json
└── .env.local              ← gitignored
```

**`vercel.json`:**
```json
{
  "crons": [
    { "path": "/api/cron/morning", "schedule": "0 5 * * *" },
    { "path": "/api/cron/weekly",  "schedule": "0 6 0 * *" }
  ]
}
```
*(Israel time UTC+3: 08:00 = 05:00 UTC, Sunday 09:00 = 06:00 UTC)*

---

## Environment Variables (Vercel)

```
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
OPENAI_API_KEY
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

---

## Telegram Webhook Registration

After first deploy:
```bash
curl "https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://nitzan-task-bot.vercel.app/api/webhook"
```

---

## Out of Scope (v1)

- Multi-user support
- Web dashboard / UI
- Integration with Google Calendar
- Recurring tasks
- Task assignment to others (e.g., delegating to Inbal)
