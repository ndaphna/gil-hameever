# Supabase Edge Functions

כל הקריאות ל-OpenAI API מתבצעות דרך Edge Functions בלבד.

## Edge Functions קיימות

1. **aliza-chat** - שיחה עם עליזה
2. **analyze-insights** - ניתוח תובנות
3. **generate-aliza-message** - יצירת הודעת עליזה

## הגדרת משתני סביבה

ה-Edge Functions דורשות את המשתנים הבאים:

- `OPENAI_API_KEY` - מפתח API של OpenAI
- `SUPABASE_URL` - כתובת ה-URL של Supabase
- `SUPABASE_SERVICE_ROLE_KEY` - מפתח Service Role של Supabase

## פריסת Edge Functions

לפרוס את ה-Edge Functions, הרץ:

```bash
supabase functions deploy aliza-chat
supabase functions deploy analyze-insights
supabase functions deploy generate-aliza-message
```

או לפרוס את כולן:

```bash
supabase functions deploy
```

## הגדרת משתני סביבה ב-Supabase

1. עבור ל-Supabase Dashboard
2. בחר את הפרויקט שלך
3. עבור ל-Edge Functions → Settings
4. הוסף את המשתנים הבאים:
   - `OPENAI_API_KEY` - המפתח שלך מ-OpenAI

## בדיקה

לבדוק שהפונקציות עובדות, תוכל להשתמש ב-Supabase CLI:

```bash
supabase functions serve aliza-chat
```

או לבדוק דרך ה-API:

```bash
curl -X POST https://<your-project>.supabase.co/functions/v1/aliza-chat \
  -H "Authorization: Bearer <anon-key>" \
  -H "Content-Type: application/json" \
  -d '{"message": "שלום", "conversationHistory": [], "systemPrompt": "את עליזה"}'
```







