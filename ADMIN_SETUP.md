# הוראות התקנת מערכת הניהול

## סקירה כללית

נוצרה מערכת ניהול מלאה למנהלי מערכת, הכוללת:

1. **מסד נתונים**: שדה `is_admin` בטבלת `user_profile`
2. **API Routes**: נתיבי API מוגנים לניהול משתמשים וסטטיסטיקות
3. **ממשק ניהול**: דפי ניהול מלאים עם UI מודרני
4. **אבטחה**: הגנות ובדיקות הרשאות בכל הרמות

## שלבי התקנה

### 1. הרצת מיגרציות מסד הנתונים

הרץ את המיגרציות הבאות ב-Supabase SQL Editor:

```sql
-- 1. הוסף שדה is_admin
ALTER TABLE public.user_profile 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- 2. צור אינדקס
CREATE INDEX IF NOT EXISTS idx_user_profile_is_admin ON public.user_profile(is_admin);

-- 3. עדכן RLS policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profile;
CREATE POLICY "Admins can view all profiles" ON public.user_profile
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.user_profile 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

DROP POLICY IF EXISTS "Admins can update any profile" ON public.user_profile;
CREATE POLICY "Admins can update any profile" ON public.user_profile
  FOR UPDATE USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.user_profile 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );
```

או הרץ את הקובץ המלא:
- `supabase/migrations/20250127_add_admin_support.sql`

### 2. הגדרת משתמש כמנהל

להגדרת `nitzandaphna@gmail.com` כמנהל, הרץ:

```sql
-- מצא את המשתמש והגדר כמנהל
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'nitzandaphna@gmail.com'
  LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    INSERT INTO public.user_profile (id, email, is_admin)
    VALUES (admin_user_id, 'nitzandaphna@gmail.com', TRUE)
    ON CONFLICT (id) 
    DO UPDATE SET is_admin = TRUE;
    
    RAISE NOTICE 'Admin privileges granted to nitzandaphna@gmail.com';
  ELSE
    RAISE NOTICE 'User not found. Please ensure the user has signed up first.';
  END IF;
END $$;
```

או הרץ את הקובץ:
- `supabase/migrations/20250127_set_admin_user.sql`

**הערה**: אם המשתמש עדיין לא נרשם, הרץ את הסקריפט שוב לאחר ההרשמה.

### 3. גישה לפאנל הניהול

לאחר הגדרת המשתמש כמנהל:

1. התחבר למערכת עם `nitzandaphna@gmail.com`
2. בסיידבר תופיע אפשרות "פאנל ניהול" (⚙️)
3. או גש ישירות ל-`/admin`

## מבנה המערכת

### API Routes

כל נתיבי ה-API מוגנים וזמינים רק למנהלים:

- `GET /api/admin/check-admin` - בדיקת סטטוס מנהל
- `GET /api/admin/get-users` - קבלת רשימת משתמשים
- `PUT /api/admin/update-user` - עדכון משתמש
- `GET /api/admin/system-stats` - סטטיסטיקות מערכת

### דפי ניהול

- `/admin` - דשבורד ניהול עם סטטיסטיקות
- `/admin/users` - ניהול משתמשים (עריכה, חיפוש, סינון)

### רכיבי אבטחה

- `AdminGuard` - רכיב המגן על דפי ניהול
- `useAuth` - Hook מעודכן עם בדיקת `isAdmin`
- RLS Policies - הגנות ברמת מסד הנתונים

## תכונות פאנל הניהול

### דשבורד (`/admin`)

- סטטיסטיקות כלליות (משתמשים, שיחות, הודעות)
- פילוח מנויים
- רשימת משתמשים חדשים

### ניהול משתמשים (`/admin/users`)

- רשימת כל המשתמשים
- חיפוש לפי אימייל או שם
- עריכת פרטי משתמש:
  - שם מלא
  - סוג מנוי (trial/basic/premium)
  - סטטוס מנוי (active/cancelled/expired)
  - מספר טוקנים
  - הרשאות מנהל
- עמודים (pagination)

## אבטחה

1. **בדיקת הרשאות בשרת**: כל API route בודק שהמשתמש הוא מנהל
2. **RLS Policies**: הגנות ברמת מסד הנתונים
3. **Client-side Guard**: `AdminGuard` מונע גישה לדפים ללא הרשאה
4. **Session-based Auth**: שימוש ב-cookies של Supabase

## פתרון בעיות

### המשתמש לא רואה את קישור הניהול

1. ודא שהמיגרציה רצה בהצלחה
2. בדוק שהמשתמש מוגדר כ-`is_admin = TRUE` במסד הנתונים
3. התנתק והתחבר מחדש
4. בדוק את הקונסול לדיווחי שגיאות

### שגיאת "Admin access required"

1. ודא שהמשתמש מחובר
2. בדוק שהמשתמש מוגדר כמנהל במסד הנתונים
3. בדוק את ה-RLS policies

### המשתמש לא יכול לערוך משתמשים אחרים

1. ודא שה-RLS policy "Admins can update any profile" קיים
2. בדוק שהמשתמש הוא באמת מנהל (`is_admin = TRUE`)

## הערות נוספות

- רק מנהלים יכולים לראות ולגשת לפאנל הניהול
- מנהל לא יכול להסיר את הסטטוס המנהל של עצמו
- כל הפעולות מתועדות ב-logs של השרת
- המערכת משתמשת רק בנתונים אמיתיים ממסד הנתונים (ללא mock data)

## תמיכה

לשאלות או בעיות, בדוק:
1. את ה-logs של השרת
2. את ה-console בדפדפן
3. את ה-Supabase logs

