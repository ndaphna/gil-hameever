# הגדרת CRON_SECRET

## מה זה CRON_SECRET?

`CRON_SECRET` הוא מפתח אבטחה שמגן על ה-cron job endpoint מפני גישה לא מורשית. רק בקשות עם ה-secret הנכון יוכלו להפעיל את ה-cron job.

## איך ליצור CRON_SECRET?

### אפשרות 1: יצירה ידנית
צור מחרוזת אקראית חזקה, למשל:
```
my-super-secret-cron-key-2025-xyz123
```

### אפשרות 2: יצירה אוטומטית (מומלץ)
הרץ את הפקודה הבאה בטרמינל:
```bash
# Linux/Mac
openssl rand -hex 32

# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

## איך להגדיר ב-Vercel?

### דרך Dashboard (מומלץ):

1. היכנס ל-Vercel Dashboard: https://vercel.com/dashboard
2. בחר את הפרויקט שלך
3. לך ל-Settings → Environment Variables
4. לחץ על "Add New"
5. מלא:
   - **Name**: `CRON_SECRET`
   - **Value**: הערך שיצרת (למשל: `a1b2c3d4e5f6...`)
   - **Environment**: בחר Production (או כל הסביבות)
6. לחץ "Save"
7. **חשוב**: אם הפרויקט כבר deployed, תצטרך ל-redeploy כדי שהמשתנה ייכנס לתוקף

### דרך Vercel CLI:

```bash
# התקן Vercel CLI אם עדיין לא
npm i -g vercel

# התחבר
vercel login

# הגדר את המשתנה
vercel env add CRON_SECRET production
# (תתבקש להזין את הערך)

# או דרך קובץ .env.local (לפיתוח מקומי)
echo "CRON_SECRET=your-secret-here" >> .env.local
```

## איך זה עובד?

כאשר Vercel מריץ את ה-cron job, הוא שולח את ה-secret ב-header:
```
Authorization: Bearer <CRON_SECRET>
```

ה-API route בודק את ה-secret ומאשר רק בקשות עם ה-secret הנכון.

## בדיקה שהכל עובד:

### 1. בדיקה מקומית (פיתוח):
```bash
# הרץ את השרת המקומי
npm run dev

# בחרוף אחר, נסה לקרוא ל-endpoint עם ה-secret
curl -H "Authorization: Bearer your-secret-here" http://localhost:3000/api/cron/daily-insights
```

### 2. בדיקה ב-Production:
לאחר deployment, Vercel יקרא אוטומטית ל-endpoint עם ה-secret הנכון.

אם תרצה לבדוק ידנית:
```bash
curl -H "Authorization: Bearer your-secret-here" https://your-app.vercel.app/api/cron/daily-insights
```

## הערות חשובות:

1. **אל תשתף את ה-secret** - שמור אותו בסוד
2. **השתמש בערכים שונים** לסביבות שונות (Production, Preview, Development)
3. **אם שינית את ה-secret**, תצטרך ל-redeploy את הפרויקט
4. **אם שכחת את ה-secret**, פשוט צור אחד חדש והגדר אותו מחדש

## מה קורה אם לא מגדירים CRON_SECRET?

אם לא מגדירים את המשתנה, ה-cron job עדיין יעבוד (כי יש בדיקה `if (cronSecret && ...)`), אבל זה פחות מאובטח. מומלץ מאוד להגדיר אותו.





