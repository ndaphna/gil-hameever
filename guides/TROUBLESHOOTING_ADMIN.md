# פתרון בעיות - גישה לפאנל הניהול

## בעיה: "Admin access required" (403)

אם אתה מקבל שגיאה זו, יש כמה דברים לבדוק:

### שלב 1: ודא שהמשתמש מוגדר כמנהל במסד הנתונים

הרץ את הקובץ `CHECK_AND_SET_ADMIN.sql` ב-Supabase SQL Editor:

```sql
-- בדוק והגדר את המשתמש כמנהל
SELECT 
    u.id,
    u.email,
    up.is_admin,
    up.full_name
FROM auth.users u
LEFT JOIN public.user_profile up ON u.id = up.id
WHERE u.email = 'nitzandaphna@gmail.com';

-- הגדר כמנהל
UPDATE public.user_profile
SET is_admin = TRUE
WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'nitzandaphna@gmail.com'
);
```

### שלב 2: בדוק את ה-logs

בקונסול של השרת (terminal שבו רץ `npm run dev`), חפש הודעות כמו:
- `verifyAdmin: Checking user`
- `verifyAdmin: Profile found, is_admin =`
- `verifyAdmin: User is not admin`

### שלב 3: ודא שהסשן פעיל

1. פתח את DevTools (F12)
2. לך ל-Application → Cookies
3. חפש cookies שמתחילים ב-`sb-` או `supabase`
4. ודא שיש cookies פעילים

### שלב 4: נסה להתנתק ולהתחבר מחדש

1. התנתק מהמערכת
2. התחבר מחדש עם `nitzandaphna@gmail.com`
3. נסה לגשת שוב ל-`/admin`

### שלב 5: בדוק את ה-RLS Policies

הרץ את `QUICK_FIX_USER_PROFILE.sql` כדי לוודא שה-policies נכונים.

### שלב 6: בדוק את ה-API Route ישירות

נסה לגשת ל-`/api/admin/check-admin` ישירות בדפדפן או ב-Postman.

אמור להחזיר:
```json
{
  "isAdmin": true,
  "userId": "...",
  "email": "nitzandaphna@gmail.com"
}
```

אם זה מחזיר `isAdmin: false`, המשתמש לא מוגדר כמנהל במסד הנתונים.

## פתרונות נוספים

### אם `getAuthUser()` לא עובד

הבעיה יכולה להיות שהקוקיז לא מועברים נכון. נסה:

1. ודא שאתה משתמש ב-`https://` (לא `http://`)
2. בדוק שה-cookies לא חסומים
3. נסה בדפדפן אחר או במצב incognito

### אם הפרופיל לא קיים

אם המשתמש קיים ב-`auth.users` אבל לא ב-`user_profile`:

1. הרץ את `/api/create-profile` עם ה-userId
2. או הרץ את הסקריפט ב-`CHECK_AND_SET_ADMIN.sql`

## בדיקה מהירה

הרץ את זה ב-Supabase SQL Editor כדי לבדוק הכל:

```sql
-- בדוק את כל המנהלים
SELECT 
    u.id,
    u.email,
    up.is_admin,
    up.full_name,
    up.created_at
FROM auth.users u
LEFT JOIN public.user_profile up ON u.id = up.id
WHERE up.is_admin = TRUE OR u.email = 'nitzandaphna@gmail.com';
```

אם אין תוצאות, המשתמש לא קיים או לא מוגדר כמנהל.







