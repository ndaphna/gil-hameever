# מנגנון התראות חכמות - הוראות התקנה

## סקירה כללית

מערכת התראות חכמה ששולחת הודעות מייל למשתמשות מנויות רק כשיש ערך אמיתי:
- תובנות מותאמות אישית על בסיס הנתונים שלהן
- דפוסים מעניינים שזוהו בנתונים
- טיפים רלוונטיים
- עידוד כשמזוהה שיפור

**המערכת לא מציקה** - שולחת התראה רק כשיש ערך אמיתי, ולא יותר מפעם בשבוע (או לפי העדפות המשתמשת).

## קבצים שנוצרו

1. **`src/lib/smart-notification-service.ts`** - שירות חכם לניתוח נתונים ויצירת תובנות
2. **`src/lib/email-templates.ts`** - תבניות מייל יפות בעברית
3. **`src/app/api/notifications/send-smart-email/route.ts`** - API endpoint לשליחת מיילים
4. **`src/app/api/notifications/cron/route.ts`** - Cron endpoint לבדיקה אוטומטית

## שלב 1: הגדרת שירות שליחת מיילים

המערכת תומכת במספר שירותי שליחת מיילים. בחרי אחד:

### אופציה 1: Brevo (לשעבר Sendinblue) - מומלץ! ⭐

**יתרונות:**
- 300 מיילים ביום בחינם
- API פשוט ומהיר
- תמיכה מעולה בעברית
- ממשק נוח לניהול

**הגדרה:**

1. הירשמי ל-[Brevo](https://www.brevo.com) (חינם)
2. לך ל-Settings → API Keys
3. צרי API key חדש
4. הוסף ל-`.env.local`:
```env
BREVO_API_KEY=your-brevo-api-key-here
BREVO_FROM_EMAIL=noreply@gilhameever.com
BREVO_FROM_NAME=עליזה - מנופאוזית וטוב לה
```

5. ודאי שהדומיין שלך מאומת ב-Brevo (Settings → Senders & IP)

**הקוד כבר מוכן!** המערכת תזהה את `BREVO_API_KEY` ותשתמש בו אוטומטית.

### אופציה 2: Resend

1. הירשמי ל-[Resend](https://resend.com)
2. צרי API key
3. הוסף ל-`.env.local`:
```env
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

**הקוד כבר מוכן!** המערכת תזהה את `RESEND_API_KEY` ותשתמש בו אוטומטית.

### אופציה 3: SendGrid

1. הירשמי ל-[SendGrid](https://sendgrid.com)
2. צרי API key
3. הוסף ל-`.env.local`:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
```

**הקוד כבר מוכן!** המערכת תזהה את `SENDGRID_API_KEY` ותשתמש בו אוטומטית.

### אופציה 4: AWS SES

אם תרצי להשתמש ב-AWS SES, תצטרכי להוסיף את הקוד בעצמך ב-`sendEmail` function.

### הערה חשובה

המערכת בודקת את המשתנים לפי סדר עדיפות:
1. `BREVO_API_KEY` (אם קיים - משתמש ב-Brevo)
2. `RESEND_API_KEY` (אם קיים - משתמש ב-Resend)
3. `SENDGRID_API_KEY` (אם קיים - משתמש ב-SendGrid)

אם אין אף אחד מהם, במצב פיתוח זה רק יודפס לוג (לא ישלח מייל אמיתי).

## שלב 2: הגדרת Cron Job

### אופציה 1: Vercel Cron (אם מפרסמים ב-Vercel)

צרי קובץ `vercel.json` בתיקייה הראשית:

```json
{
  "crons": [
    {
      "path": "/api/notifications/cron",
      "schedule": "0 9 * * 1"
    }
  ]
}
```

זה יריץ את הבדיקה כל יום שני ב-9:00.

### אופציה 2: External Cron Service

השתמשי בשירות כמו:
- [cron-job.org](https://cron-job.org)
- [EasyCron](https://www.easycron.com)

הגדרי קריאה ל:
```
https://your-domain.com/api/notifications/cron
```

עם header:
```
Authorization: Bearer YOUR_CRON_SECRET
```

הוסף ל-`.env.local`:
```env
CRON_SECRET=your-secret-key-here
```

### אופציה 3: Manual Testing

תוכלי לבדוק ידנית על ידי קריאה ל:
```bash
curl -X POST https://your-domain.com/api/notifications/send-smart-email \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-here"}'
```

או לבדוק משתמש ספציפי:
```bash
curl -X POST https://your-domain.com/api/notifications/send-smart-email \
  -H "Content-Type: application/json" \
  -d '{"userId": "user-id-here", "force": true}'
```

## שלב 3: בדיקה

1. ודאי שיש לך משתמשת מנויה עם נתונים במסד הנתונים
2. קראי ל-API endpoint:
```bash
POST /api/notifications/send-smart-email
Body: {"userId": "user-id"}
```

3. בדקי את הלוגים ב-console
4. בדקי את ה-email inbox (או logs של שירות המיילים)

## איך זה עובד

1. **ניתוח נתונים**: המערכת בודקת את הנתונים האחרונים של המשתמשת
2. **זיהוי דפוסים**: מחפשת דפוסים מעניינים (גלי חום, שינה, מצב רוח)
3. **יצירת תובנה**: יוצרת תובנה מותאמת אישית על בסיס הנתונים
4. **בדיקת תדירות**: בודקת מתי נשלחה ההתראה האחרונה (לא יותר מדי)
5. **שליחת מייל**: שולחת מייל יפה בעברית עם התובנה
6. **שמירה בהיסטוריה**: שומרת את ההתראה בהיסטוריה

## סוגי התראות

### 1. דפוסים מעניינים
- גלי חום בתדירות גבוהה
- בעיות שינה
- מצב רוח נמוך

### 2. שיפורים
- ירידה בגלי חום
- שיפור בשינה
- שיפור במצב הרוח

### 3. טיפים מותאמים אישית
- טיפים על בסיס התסמינים הנפוצים ביותר
- קישורים למאמרים רלוונטיים

### 4. עידוד
- כשמזוהה שיפור
-שתמשת עקבית

### 5. תזכורות עדינות
- אם לא דיווחה זמן רב (רק אחרי 3+ ימים)

## התאמה אישית

תוכלי להתאים את הלוגיקה ב-`src/lib/smart-notification-service.ts`:
- שינוי תנאים לזיהוי דפוסים
- הוספת סוגי תובנות חדשים
- שינוי תדירות מינימלית בין התראות

## הערות חשובות

1. **לא מציק**: המערכת בודקת תדירות ולא שולחת יותר מדי
2. **רק ערך אמיתי**: שולחת רק כשיש תובנה/דפוס/טיפ רלוונטי
3. **מותאם אישית**: כל התראה מבוססת על הנתונים הספציפיים של המשתמשת
4. **עברית מלאה**: כל התבניות בעברית עם RTL support

## פתרון בעיות

### מיילים לא נשלחים
1. בדקי שה-API key מוגדר נכון (BREVO_API_KEY, RESEND_API_KEY, או SENDGRID_API_KEY)
2. בדקי את הלוגים ב-console - המערכת תדווח איזה שירות היא מנסה להשתמש
3. ודאישתמשת מנויה (subscription_status = 'active')
4. בדקי שה-email preferences מופעלות
5. אם משתמשת ב-Brevo: ודאי שהדומיין מאומת (Settings → Senders & IP)
6. בדקי את ה-API logs בשירות המיילים (Brevo/Resend/SendGrid dashboard)

### התראות לא נשלחות
1. בדקי מתי נשלחה ההתראה האחרונה (לא יותר מדי קרוב)
2. בדקי שיש מספיק נתונים לניתוח (לפחות 3 דיווחים)
3. בדקי את הלוגים - המערכת תסביר למה לא נשלחה

### Cron לא עובד
1. בדקי שה-vercel.json מוגדר נכון
2. בדקי שה-CRON_SECRET מוגדר
3. בדקי את ה-logs ב-Vercel dashboard

## תמיכה

אם יש בעיות, בדקי:
1. הלוגים ב-console
2. ה-logs ב-Vercel/שירות האירוח
3. את ה-email logs של שירות המיילים

