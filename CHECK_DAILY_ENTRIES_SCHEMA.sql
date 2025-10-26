-- בדיקת הסכמה של טבלת daily_entries
-- תעתיקי ותריצי ב-Supabase SQL Editor

-- 1. בדיקה אם הטבלה קיימת
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'daily_entries'
) as table_exists;

-- 2. בדיקת העמודות בטבלה
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'daily_entries'
ORDER BY ordinal_position;

-- 3. בדיקת RLS policies
SELECT 
    policyname,
    cmd,
    permissive,
    roles,
    qual
FROM pg_policies
WHERE tablename = 'daily_entries';

-- 4. בדיקה אם RLS מופעל
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'daily_entries';

-- 5. בדיקת נתונים קיימים (לדוגמה)
SELECT 
    id,
    user_id,
    date,
    time_of_day,
    mood,
    created_at
FROM public.daily_entries
ORDER BY created_at DESC
LIMIT 5;
