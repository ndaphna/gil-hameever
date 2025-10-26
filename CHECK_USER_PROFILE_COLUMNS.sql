-- בדיקה מה יש בטבלת user_profile
-- תעתיקי והריצי ב-Supabase SQL Editor

-- 1. בדיקה מה יש בטבלת user_profile
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profile'
ORDER BY ordinal_position;

-- 2. בדיקה מה יש בטבלה עכשיו
SELECT * FROM public.user_profile LIMIT 3;
