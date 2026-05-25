# Bot Brief Platform — Operating Doc

מערכת קליטה לבריפי ManyChat. ענבל ממלאת טופס בעברית → ניצן מקבל spec מובנה ב-email/WhatsApp → בונה את ה-flow ב-ManyChat ידנית → לוחץ Mark Live → ענבל מקבלת notification שהבוט פעיל.

המסמך הזה הוא single source of truth ל-iteration שמופעלת. עדכן אותו בכל שינוי חוזי (schema, env var חדש, מגבלה חדשה).

---

## Critical constraint — ManyChat API

ה-Public API של ManyChat **לא** מאפשר יצירת flows/triggers. תומך רק ב:
- ✅ Tags (create, add to subscriber)
- ✅ Custom Fields (create)
- ✅ Send Content / Trigger existing Flow
- ❌ Create flow / Comment-to-DM rule / Story Reply trigger

→ הפלטפורמה לעולם לא תאוטומט את בנייית ה-flow עצמו. עוצרת ב-"spec sheet + notify". אם עתידית רוצים flow auto-creation — צריך מעבר ל-CreatorFlow או Meta Graph API ישירות.

---

## Architecture

```
ענבל → /admin/bots/new (wizard 7 steps, RTL)
   ↓
Supabase: bots.briefs + bots.brief_assets (schema `bots`, exposed via PostgREST)
   ↓
ענבל לוחצת "הגש" → POST /api/admin/bots/[id]/submit
   ↓
Brevo email לניצן + Make.com webhook (WhatsApp/Telegram)
   ↓
ניצן בונה flow ידנית ב-ManyChat ב-~3 דק' לפי spec
   ↓
ניצן ב-/admin/bots/[id]: "Mark Live" + paste Flow ID
   ↓
ManyChat API: create Tag + Custom Field (idempotent)
+ Brevo email לענבל + WhatsApp דרך Make.com (אם phone על תיק)
```

---

## DB schema — `bots` schema (Supabase)

PostgREST exposed schemas: `public, graphql_public, newsletter, bots`. אם מוסיף schema חדש, חייב להוסיף ב-Dashboard → Settings → API → Exposed schemas.

### `bots.briefs`

| עמודה | סוג | הערה |
|---|---|---|
| `id` | uuid pk | gen_random_uuid |
| `created_by` | uuid fk auth.users | restrict delete |
| `title` | text | פנימי, לא נראה למשתמשות |
| `type` | enum `brief_type` | `comment_to_dm` / `story_reply` / `story_mention` |
| `status` | enum `brief_status` | `draft` → `submitted` → `building` → `live` → `archived` |
| `post_scope` | enum `post_scope` | `specific_post` / `all_posts_and_reels` / `all_posts` / `all_reels` — default `specific_post` במיגרציה, ברירת מחדל ב-UI היא `all_posts_and_reels` |
| `post_url` | text | רק אם scope = specific_post |
| `keyword_triggers` | text[] | לcomment_to_dm |
| `story_label` | text | תיאור הסטורי לreply/mention |
| `dm_message` | text | הודעת DM ראשונה. תומך `{{first_name}}` (Brevo/Mustache style) |
| `cta_button_text` | text | טקסט הכפתור ב-DM. ריק = בלי כפתור |
| `lead_magnet_url` | text | יעד הכפתור (לינק חיצוני) |
| `followup_dm_message` | text | תזכורת DM ב-ManyChat (אם NULL — לא נשלחת) |
| `followup_dm_delay_minutes` | int | default 10. בין 1 ל-10080 (7 ימים) |
| `brevo_template_id` | bigint | Brevo Transactional Template ID |
| `followup_delay_hours` | int | default 24 — לemail בלבד |
| `followup_enabled` | boolean | default false |
| `manychat_flow_id` | text | מולא ב-Mark Live |
| `manychat_tag` | text | אוטוגנרציה מ-title דרך `deriveTag()` |
| `notes` | text | הערות חופשיות |
| timestamps | | created_at, submitted_at, live_at, archived_at, updated_at |

### `bots.brief_assets`
- `id`, `brief_id`, `kind` (`image`/`pdf`/`video`/`other`), `storage_path`, `filename`, `mime`, `size_bytes`, `uploaded_by`, `created_at`
- Storage bucket: `bot-brief-assets` (private, 25MB/file)

### Status transition trigger
`bots.enforce_brief_transition` אוכף:
- Creator: draft → submitted, draft/submitted → archived בלבד
- Admin: כל transition
- Auto-stamps submitted_at/live_at/archived_at

### RLS — `bots.briefs`
- **SELECT**: own או admin
- **INSERT**: self + content_creator role
- **UPDATE**: draft של own (creator), כל מקום (admin)
- **DELETE**: own draft (creator), כל מקום (admin)

### RLS — `bots.brief_assets`
- כל הפעולות עוברות דרך גישה ל-brief המקושר
- Storage policy: read-via-brief (signed URLs מומלצות)

### `newsletter.user_roles` (תלות חיצונית)
- enum `app_role`: `admin`, `campaign_manager`, `content_creator`
- function: `newsletter.has_role(required app_role)` — security definer
- ענבל = content_creator (UUID: `2965a32d-54ee-498c-85a0-8d19cfeb16dc`)
- ניצן = admin (UUID: `cdc3a10d-6db8-4f62-a3bc-c45f87745620`)

---

## Migrations (run order)

```
supabase/migrations/
  20260522_bot_briefs.sql                  -- schema, tables, RLS, storage
  20260522_bot_briefs_post_scope.sql       -- post_scope enum + column
  20260522_bot_briefs_cta_button.sql       -- cta_button_text
  20260522_bot_briefs_followup_dm.sql      -- followup_dm_message + delay_minutes
  20260522_bot_briefs_creator_delete.sql   -- RLS: creator can delete own draft
```

כולן ירוצו ב-prod כבר. אם יוצרים מיגרציה חדשה — שם בפורמט `YYYYMMDD_bot_briefs_<change>.sql`.

---

## Files map

```
src/lib/bots/
  schema.ts                  -- types, enums, labels, validators, deriveTag()
  spec-renderer.ts           -- renderSpecMarkdown() + renderSpecHtml()
  notify.ts                  -- notifyBriefSubmitted() + notifyBriefLive()
  brevo-templates.ts         -- listBrevoTemplates() with 5-min cache
  manychat-client.ts         -- bootstrapBriefInManyChat() (Tag + Custom Field)

src/app/api/admin/bots/
  route.ts                   -- POST create / GET list
  brevo-templates/route.ts   -- GET templates dropdown
  bulk-delete/route.ts       -- POST bulk delete
  [id]/
    route.ts                 -- GET / PATCH / DELETE single
    status/route.ts          -- POST manual status change (≠ live)
    submit/route.ts          -- draft → submitted + notify
    mark-live/route.ts       -- submitted/building → live + ManyChat bootstrap + notify Inbal
    assets/route.ts          -- POST upload (multipart)
    assets/[assetId]/route.ts -- DELETE asset

src/app/admin/bots/
  page.tsx                   -- list (server) → briefs-list.tsx (client)
  briefs-list.tsx            -- checkboxes + bulk delete
  bots.module.css
  new/
    page.tsx                 -- wizard entry — exports BriefWizard component
    emoji-picker.tsx         -- emoji picker for textareas
    new.module.css
  [id]/
    page.tsx                 -- detail view
    status-changer.tsx       -- status dropdown
    mark-live-form.tsx       -- admin-only Mark Live
    detail.module.css
    edit/page.tsx            -- pre-fill BriefWizard with draft data
```

---

## env vars (`.env.local`)

```bash
# Already shared with newsletter module:
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
BREVO_API_KEY=...
BREVO_FROM_EMAIL=inbal@gilhameever.com
BREVO_FROM_NAME=מנופאוזית וטוב לה

# Bot Brief specific:
MANYCHAT_API_TOKEN=<from ManyChat → Settings → API>
MAKE_WHATSAPP_WEBHOOK_URL=<from Make.com scenario — empty disables WhatsApp>
BOTS_NOTIFY_TO_EMAIL=nitzandaphna@gmail.com   # default if unset

# Optional:
NEXT_PUBLIC_APP_URL=https://gilhameever.com   # for spec links
```

---

## Make.com scenario — WhatsApp notifications

One scenario, one webhook URL, two events handled via Router by `event` field.

**Webhook payloads**:

`bot_brief_submitted` (ענבל → ניצן):
```json
{ "event": "bot_brief_submitted", "brief_id", "title", "type", "type_label", "text", "admin_url" }
```

`bot_brief_live` (Mark Live → ענבל):
```json
{ "event": "bot_brief_live", "brief_id", "title", "type", "type_label", "recipient_name", "recipient_phone", "text", "admin_url" }
```

**Scenario structure**:
1. Custom Webhook trigger
2. Router → 2 branches filtered by `event`
3. Each branch: WhatsApp/Telegram Send Message
   - submitted branch: hardcoded `+972…` (ניצן)
   - live branch: `{{1.recipient_phone}}` (ענבל)

Webhook URL goes into `MAKE_WHATSAPP_WEBHOOK_URL`. Failure mode: best-effort — email always sends through Brevo even if Make.com is down.

---

## UI flow

**Wizard (7 steps)** — `/admin/bots/new`:
1. סוג בוט (3 options) + title
2. טריגר — for comment_to_dm: post_scope selector; for stories: text label
3. מילות מפתח (chips, comment_to_dm only)
4. הודעת DM (with emoji picker, 1000 char limit, supports `{{first_name}}`)
5. Lead magnet (URL + multi-file upload + CTA button text, default "תני לי גישה")
6. הודעות המשך (DM reminder with delay_minutes + Brevo email follow-up)
7. סקירה + הגש

Step navigation: dots are clickable (jumps + auto-save). New mode default state = INITIAL with template text. Edit mode = `/admin/bots/[id]/edit` pre-fills from DB (only for status=draft, otherwise redirect to detail).

**List** — `/admin/bots`:
- Filter pills by status
- Bulk select + delete (creator: own drafts only; admin: any)
- Row click → edit (if draft) or detail (otherwise)

**Detail** — `/admin/bots/[id]`:
- Header with status dropdown (excludes `live` — that path is Mark Live form)
- All brief data displayed read-only
- Mark Live form for admin when status ∈ {submitted, building}

---

## Iteration backlog

Not yet built, in priority order:

1. **Subscriber → Brevo sync** — ManyChat webhook (Pro plan) or cron pulls subscribers tagged by a brief into Brevo contact list, triggers follow-up email automation. Currently `followup_template_id` is stored but no automation fires on it.
2. **Analytics dashboard** — comments triggered → DMs sent → CTA clicks → follow-up opens. Requires Brevo webhook integration first (events table).
3. **Bot templates / duplication** — once we see ≥3 briefs with similar structure, add "duplicate from previous" button.
4. **Story mention vs reply differentiation** — currently same UX; ManyChat treats them as different triggers. Add a sub-toggle if needed.
5. **Phone capture on user_profile** — Inbal needs `phone_number` populated for WhatsApp Live notification. Currently the column exists but is unset for her account.

---

## Common gotchas

- **PostgREST schema exposure** — adding a new schema needs Dashboard config, can't be done via SQL alone.
- **Auth trigger creates `user_profile` automatically** — when creating users via SQL, use UPSERT on user_profile to avoid duplicate-key on the trigger's pre-created row.
- **`{{first_name}}` vs `{first_name}`** — we use the double-brace Brevo/Mustache style across all fields. ManyChat actually uses `{{First Name}}` (capitalized). Spec to Nitzan documents this so he maps correctly during flow build.
- **Notification = best-effort** — email/WhatsApp failures never roll back status changes. Errors surface in API response but the brief still progresses.
- **Step bar click auto-saves** — but only if title+type are set. Empty drafts that user navigates around won't accidentally persist.

---

## E2E verification checklist

1. Inbal signs in → `/admin/bots/new` → wizard → upload PDF → submit
2. DB: `select * from bots.briefs where status='submitted' order by created_at desc limit 1`
3. Storage: `bot-brief-assets/<brief_id>/...` contains uploaded file
4. Email to `nitzandaphna@gmail.com` with spec + signed URLs (7-day TTL)
5. (If `MAKE_WHATSAPP_WEBHOOK_URL` set) WhatsApp to Nitzan
6. Nitzan: build dummy flow in ManyChat → copy Flow ID → Mark Live
7. DB: `manychat_flow_id` + `manychat_tag` populated, status=live
8. ManyChat UI: new Tag visible
9. Inbal receives "הבוט שלך פעיל" email + (if phone) WhatsApp
