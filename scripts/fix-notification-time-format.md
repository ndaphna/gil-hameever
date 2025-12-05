# 🔧 תיקון פורמט שעה בהעדפות התראות

סקריפטים לתיקון פורמט השעה בהעדפות התראות (email, whatsapp, push).

## הבעיה

חלק מההעדפות מכילות פורמט שעה לא תקין:
- `"20:1"` במקום `"20:01"`
- `"9:5"` במקום `"09:05"`
- `"19:25"` ✅ (תקין)

## פתרונות

### אפשרות 1: SQL Script (מומלץ)

**קובץ:** `scripts/fix-notification-time-format.sql`

1. פתחי את Supabase Dashboard
2. לכי ל-SQL Editor
3. העתיקי והדביקי את התוכן של הקובץ
4. הרצי את הסקריפט

```sql
-- Fix email time format
UPDATE public.notification_preferences
SET 
  email = jsonb_set(
    email,
    '{time}',
    to_jsonb(
      LPAD((split_part(email->>'time', ':', 1))::INTEGER::TEXT, 2, '0') || ':' ||
      LPAD((split_part(email->>'time', ':', 2))::INTEGER::TEXT, 2, '0')
    )
  ),
  updated_at = NOW()
WHERE 
  email->>'time' IS NOT NULL
  AND email->>'time' ~ '^[0-9]{1,2}:[0-9]{1,2}$'
  AND (
    length(split_part(email->>'time', ':', 1)) < 2
    OR length(split_part(email->>'time', ':', 2)) < 2
  );
```

### אפשרות 2: Migration Script

**קובץ:** `supabase/migrations/20251205_fix_notification_time_format.sql`

הרצי את ה-migration דרך Supabase CLI:

```bash
supabase db push
```

או העתיקי את התוכן ל-SQL Editor ב-Supabase Dashboard.

### אפשרות 3: Node.js Script

**קובץ:** `scripts/fix-notification-time-format.js`

```bash
# ודאי שיש לך .env.local עם:
# NEXT_PUBLIC_SUPABASE_URL=...
# SUPABASE_SERVICE_ROLE_KEY=...

node scripts/fix-notification-time-format.js
```

## בדיקה

לאחר הרצת הסקריפט, בדקי את התוצאות:

```sql
SELECT 
  user_id,
  email->>'time' as email_time,
  whatsapp->>'time' as whatsapp_time,
  push->>'time' as push_time,
  updated_at
FROM public.notification_preferences
ORDER BY updated_at DESC;
```

כל השעות צריכות להיות בפורמט `HH:MM` עם אפסים מובילים.

## דוגמאות לתיקון

| לפני | אחרי |
|------|------|
| `"20:1"` | `"20:01"` |
| `"9:5"` | `"09:05"` |
| `"19:25"` | `"19:25"` (לא משתנה) |
| `"8:0"` | `"08:00"` |
| `"23:59"` | `"23:59"` (לא משתנה) |

## הערות

- הסקריפט מתקן רק ערכים לא תקינים
- ערכים תקינים לא משתנים
- `updated_at` מתעדכן אוטומטית
- הסקריפט בטוח להרצה מספר פעמים

