# בדיקת שליחת מייל - Brevo

## בדיקה מהירה

### 1. בדיקת משתני סביבה

ודאי שיש לך ב-`.env.local`:
```env
BREVO_API_KEY=your-key-here
BREVO_FROM_EMAIL=noreply@gilhameever.com
BREVO_FROM_NAME=עליזה - מנופאוזית וטוב לה
```

### 2. בדיקה ידנית - שליחת מייל למשתמשת ספציפית

**שיטה 1: דרך Test Endpoint (הכי קל!) ⭐**

```bash
# עם email (הכי נוח)
curl -X POST http://localhost:3000/api/notifications/test-email \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

או עם PowerShell:
```powershell
$body = @{
    email = "user@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/notifications/test-email" `
  -Method POST `
  -ContentType "application/json" `
  -Body $body
```

**שיטה 2: דרך API endpoint הרגיל**

```bash
# עם userId
curl -X POST http://localhost:3000/api/notifications/send-smart-email \
  -H "Content-Type: application/json" \
  -d '{"userId": "USER_ID_HERE"}'
```

**שיטה 3: דרך הדפדפן (Postman/Thunder Client)**

1. פתחי Postman או Thunder Client ב-VS Code
2. צרי בקשה POST ל: `http://localhost:3000/api/notifications/test-email`
3. Body (JSON):
```json
{
  "email": "user@example.com"
}
```
או:
```json
{
  "userId": "USER_ID_HERE"
}
```

### 3. בדיקת כל המשתמשות המנויות

```bash
curl -X POST http://localhost:3000/api/notifications/send-smart-email \
  -H "Content-Type: application/json" \
  -d '{}'
```

זה יבדוק את כל המשתמשות המנויות וישלח להן התראות אם צריך.

### 4. בדיקת הלוגים

אחרי הבדיקה, בדקי את ה-console של השרת. אמור להופיע:
- `✅ Email sent via Brevo: {...}` - אם הצליח
- `Brevo API error: ...` - אם יש שגיאה

### 5. בדיקה ב-Brevo Dashboard

1. לך ל-Brevo Dashboard
2. לך ל-Statistics → Email activity
3. אמור לראות את המיילים שנשלחו

## מה לבדוק אם יש בעיות

### שגיאת API Key
אם מקבלת שגיאה על API key:
- ודאי שה-key נכון
- ודאי שה-key לא פג תוקף
- בדקי ב-Brevo Dashboard → Settings → API Keys

### שגיאת דומיין
אם מקבלת שגיאה על sender:
- ודאי שהדומיין מאומת
- בדקי ב-Settings → Senders & IP
- ודאי שה-DNS records נכונים

### מייל לא מגיע
- בדקי את ה-spam folder
- בדקי ב-Brevo Dashboard → Statistics
- בדקי את ה-logs ב-console

## בדיקת Cron Job

אם תרצי לבדוק את ה-cron job:

```bash
curl http://localhost:3000/api/notifications/cron
```

או עם secret (אם הגדרת):
```bash
curl -H "Authorization: Bearer YOUR_CRON_SECRET" \
  http://localhost:3000/api/notifications/cron
```

## הצעדים הבאים

1. ✅ בדקי שליחת מייל למשתמשת אחת
2. ✅ ודאי שהמייל מגיע
3. ✅ בדקי את העיצוב והתוכן
4. ✅ הגדרי cron job (אם עדיין לא)
5. ✅ בדקי שהכל עובד אוטומטית

