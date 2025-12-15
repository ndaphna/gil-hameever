# מדריך פתרון בעיות - ניוזלטרים

## בעיה: ניוזלטרים לא נשלחים למנויים

### שלב 1: אבחון מהיר

הפעל את endpoint האבחון:
```bash
GET https://your-domain.com/api/notifications/diagnose
```

או בדפדפן:
```
https://your-domain.com/api/notifications/diagnose
```

התגובה תכלול:
- ✅ מצב משתני סביבה (BREVO_API_KEY, וכו')
- ✅ רשימת כל המשתמשות והעדפותיהן
- ✅ האם צריך לשלוח עכשיו
- ✅ היסטוריית שליחות
- ✅ המלצות לפתרון

### שלב 2: בדיקת נקודות כשל אפשריות

#### 1. משתני סביבה חסרים

**סימפטום:** `BREVO_API_KEY: ❌ Missing`

**פתרון:**
1. היכנס ל-Vercel Dashboard
2. בחר את הפרויקט
3. Settings → Environment Variables
4. הוסף:
   - `BREVO_API_KEY` = המפתח שלך מ-Brevo
   - `BREVO_FROM_EMAIL` = noreply@gilhameever.com (או המייל שלך)
   - `BREVO_FROM_NAME` = עליזה - מנופאוזית וטוב לה
5. **חשוב:** בחר את כל הסביבות (Production, Preview, Development)
6. **Redeploy** את הפרויקט

#### 2. Cron Job לא רץ

**סימפטום:** `shouldSendNow > 0` אבל אין שליחות בפועל

**בדיקה:**
1. היכנס ל-Vercel Dashboard
2. בחר את הפרויקט
3. Settings → Cron Jobs
4. בדוק ש-`/api/notifications/cron` מוגדר עם `schedule: "0 * * * *"`

**פתרון:**
- אם אין cron job, הוסף ל-`vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/notifications/cron",
      "schedule": "0 * * * *"
    }
  ]
}
```
- Commit ו-push
- Vercel יזהה את השינוי ויוסיף את ה-cron job

**בדיקה ידנית:**
```bash
# שליחת request ידני (דורש CRON_SECRET)
curl -X GET "https://your-domain.com/api/notifications/cron" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

#### 3. משתמשות לא מוגדרות נכון

**סימפטום:** `activeSubscribers: 0` או `enabledEmails: 0`

**בדיקה:**
1. פתח את endpoint האבחון
2. בדוק את `users.details` - כל משתמשת צריכה:
   - `subscription_status: "active"`
   - `emailEnabled: true`
   - `frequency: "daily"` (או weekly/monthly)
   - `preferredTime: "HH:MM"` (למשל "21:00")

**פתרון:**
- המשתמשות צריכות להגדיר העדפות בפרופיל
- בדוק שהן מנויות (subscription_status = 'active')

**בדיקת משתמשת ספציפית:**
```
GET /api/notifications/check-user-preferences?email=user@example.com
```

#### 4. בעיית זמן (Timezone)

**סימפטום:** `willSendNow: false` למרות שהשעה נכונה

**הסבר:**
- המערכת משתמשת ב-Israel timezone (Asia/Jerusalem)
- ה-cron רץ כל שעה בדקה 0 (0 * * * *)
- אם משתמשת בחרה 21:02, המייל יישלח ב-21:00

**בדיקה:**
- בדוק את `cron.currentTime.israel` באבחון
- ודא שהשעה תואמת לשעה המועדפת של המשתמשת

#### 5. נשלח לאחרונה (Rate Limiting)

**סימפטום:** `sendReason: "Sent X hours ago (minimum 23h required)"`

**הסבר:**
- המערכת מונעת שליחה יותר מפעם ב-23 שעות
- גם אם התדירות היא "daily", יש הגבלה של 23 שעות

**פתרון:**
- זה התנהגות תקינה - המנויים יקבלו מייל ביום הבא

#### 6. בעיית Brevo API - Sender Email לא מאומת ⚠️ **נפוץ!**

**סימפטום:** 
- `Email sending failed` בלוגים
- שגיאה: "Sending has been rejected because the sender you used `xxx@example.com` is not valid"
- המייל נדחה ב-Brevo Dashboard

**הסיבה:**
- ה-email sender (`BREVO_FROM_EMAIL`) לא מאומת ב-Brevo
- Brevo דורש אימות של כל email sender לפני שליחה

**פתרון - אימות Email Sender:**

**אפשרות 1: אימות Email בודד (Gmail/Outlook)**
1. היכנס ל-Brevo Dashboard
2. Settings → Senders & IP → Senders
3. לחץ על "Add a sender"
4. הזן את ה-email (למשל `gil.hameever@gmail.com`)
5. לחץ "Send verification email"
6. פתח את תיבת הדואר של `gil.hameever@gmail.com`
7. לחץ על הקישור באימייל האימות
8. המתין לאימות (יכול לקחת כמה דקות)

**אפשרות 2: אימות Domain (מומלץ למיילים רבים)**
1. Brevo Dashboard → Settings → Senders & IP → Domains
2. לחץ "Add a domain"
3. הזן את ה-domain (למשל `gilhameever.com`)
4. הוסף את ה-DNS records שמופיעים:
   - SPF record
   - DKIM record
   - DMARC record (אופציונלי)
5. המתין לאימות (יכול לקחת עד 24 שעות)

**אפשרות 3: שימוש ב-Email מאומת אחר**
אם יש לך email אחר שכבר מאומת:
1. Vercel Dashboard → Settings → Environment Variables
2. עדכן את `BREVO_FROM_EMAIL` ל-email מאומת
3. Redeploy את הפרויקט

**בדיקה:**
- Brevo Dashboard → Email → Logs
- בדוק שהמיילים מופיעים כ-"Delivered" ולא "Error"
- אם עדיין יש שגיאה, בדוק את ה-Email Logs לפרטים

**⚠️ חשוב:**
- כל email sender צריך להיות מאומת לפני שימוש
- Gmail/Outlook emails דורשים אימות ידני (קישור באימייל)
- Domain emails דורשים אימות DNS
- אימות יכול לקחת כמה דקות עד 24 שעות

### שלב 3: בדיקות ידניות

#### בדיקת שליחת מייל ידנית

```bash
POST /api/notifications/send-newsletter-test-now
{
  "userId": "user-id-here"
}
```

או דרך הדפדפן:
```
POST https://your-domain.com/api/notifications/send-newsletter-test-now
```

#### בדיקת cron job ידנית

```bash
GET /api/notifications/cron
Headers:
  Authorization: Bearer YOUR_CRON_SECRET
```

### שלב 4: בדיקת לוגים

#### Vercel Logs
1. היכנס ל-Vercel Dashboard
2. בחר את הפרויקט
3. Functions → `/api/notifications/cron`
4. בדוק את ה-Logs:
   - האם יש שגיאות?
   - האם ה-cron רץ בכלל?
   - מה התוצאות של `processNewsletterScheduler()`?

#### Supabase Logs
1. היכנס ל-Supabase Dashboard
2. Logs → API Logs
3. חפש קריאות ל-`notification_preferences` ו-`notification_history`

### שלב 5: תיקון מהיר

אם אתה צריך לשלוח מייל עכשיו למשתמשת ספציפית:

```bash
POST /api/notifications/send-smart-email
{
  "userId": "user-id-here",
  "force": true
}
```

או דרך endpoint הבדיקה:
```bash
POST /api/notifications/send-newsletter-test-now
{
  "userId": "user-id-here"
}
```

## סיכום נקודות בדיקה

✅ **משתני סביבה:**
- BREVO_API_KEY מוגדר
- BREVO_FROM_EMAIL מוגדר
- BREVO_FROM_NAME מוגדר

✅ **Cron Job:**
- מוגדר ב-vercel.json
- רץ כל שעה (0 * * * *)
- נראה ב-Vercel Dashboard

✅ **משתמשות:**
- subscription_status = 'active'
- email.enabled = true
- email.frequency מוגדר
- email.time מוגדר

✅ **Brevo:**
- API key תקין
- Domain verified
- לא חרגת מ-limits

✅ **לוגים:**
- אין שגיאות ב-Vercel Logs
- ה-cron רץ בהצלחה
- שליחות מייל מצליחות

## קישורים שימושיים

- [Vercel Cron Jobs Documentation](https://vercel.com/docs/cron-jobs)
- [Brevo API Documentation](https://developers.brevo.com/)
- [Supabase Dashboard](https://app.supabase.com/)

