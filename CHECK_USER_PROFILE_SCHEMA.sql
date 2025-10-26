-- בדיקה מה יש בטבלת user_profile
-- תעתיקי והריצי ב-Supabase SQL Editor

-- 1. בדיקה אם הטבלה קיימת בכלל
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile'
) as user_profile_exists;

-- 2. אם הטבלה קיימת, בדיקה מה יש בה
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profile'
ORDER BY ordinal_position;

-- 3. בדיקה אם יש טבלה אחרת למשתמשים
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%user%' 
OR table_name LIKE '%profile%';

-- 4. בדיקה מה יש ב-auth.users
SELECT column_name, data_type 
FROM information_schema.columns
WHERE table_schema = 'auth'
AND table_name = 'users'
ORDER BY ordinal_position;
