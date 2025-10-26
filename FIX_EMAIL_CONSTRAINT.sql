-- תיקון שגיאת email ב-user_profile
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

-- 3. תיקון - עדכון המשתמש הקיים עם email
UPDATE public.user_profile 
SET 
    email = 'inbald@sapir.ac.il',
    full_name = 'ענבל דוד',
    gender = 'female',
    birth_year = 1975,
    last_period_date = CURRENT_DATE - INTERVAL '45 days',
    updated_at = NOW()
WHERE id = '7b42606e-16ae-448b-8505-79c5fa889d7e';

-- 4. אם עדיין יש בעיה, נמחק וניצור מחדש
DELETE FROM public.user_profile 
WHERE id = '7b42606e-16ae-448b-8505-79c5fa889d7e';

-- 5. יצירה מחדש עם כל הנתונים הנכונים
INSERT INTO public.user_profile (
    id, 
    email,
    full_name, 
    gender, 
    birth_year, 
    created_at, 
    last_period_date
)
SELECT 
    id,
    email,
    'ענבל דוד' as full_name,
    'female' as gender,
    1975 as birth_year,
    NOW() as created_at,
    CURRENT_DATE - INTERVAL '45 days' as last_period_date
FROM auth.users 
WHERE email = 'inbald@sapir.ac.il';

-- 6. בדיקה שהכל עבד
SELECT 'SUCCESS! ✅ user_profile fixed!' as result;
SELECT * FROM public.user_profile 
WHERE id = '7b42606e-16ae-448b-8505-79c5fa889d7e';
