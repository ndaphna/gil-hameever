-- בדיקת 7 הימים האחרונים עבור משתמש
-- הרץ את זה ב-Supabase SQL Editor

-- 1. מצא את ה-user_id של המשתמש
SELECT 
    u.id as user_id,
    u.email,
    up.full_name
FROM auth.users u
LEFT JOIN public.user_profile up ON u.id = up.id
WHERE u.email IN ('nitzandaphna@gmsil.com', 'nitzandaphna@gmail.com')
LIMIT 1;

-- 2. בדוק את כל ה-daily_entries של המשתמש ב-7 הימים האחרונים
-- (החלף את USER_ID_HERE ב-user_id מהשאילתה הקודמת)
WITH user_info AS (
    SELECT id as user_id
    FROM auth.users
    WHERE email IN ('nitzandaphna@gmsil.com', 'nitzandaphna@gmail.com')
    LIMIT 1
),
last_7_days AS (
    SELECT 
        CURRENT_DATE - INTERVAL '6 days' + (generate_series(0, 6))::int AS date
)
SELECT 
    l7d.date as expected_date,
    l7d.date::text as date_str,
    TO_CHAR(l7d.date, 'Day') as day_name_hebrew,
    COUNT(de.id) as entry_count,
    STRING_AGG(DISTINCT de.id::text, ', ') as entry_ids,
    BOOL_OR(de.hot_flashes) as has_hot_flash,
    BOOL_OR(de.sleep_quality = 'good') as has_good_sleep,
    BOOL_OR(de.mood IN ('sad', 'frustrated')) as has_low_mood,
    STRING_AGG(DISTINCT de.time_of_day, ', ') as time_of_day,
    STRING_AGG(DISTINCT de.sleep_quality, ', ') as sleep_qualities,
    STRING_AGG(DISTINCT de.mood, ', ') as moods
FROM last_7_days l7d
CROSS JOIN user_info ui
LEFT JOIN public.daily_entries de ON 
    de.user_id = ui.user_id 
    AND DATE(de.date) = l7d.date
GROUP BY l7d.date
ORDER BY l7d.date DESC;

-- 3. בדוק את כל ה-daily_entries של המשתמש (ללא הגבלת תאריך)
SELECT 
    de.id,
    de.date,
    DATE(de.date) as date_only,
    de.date::text as date_str,
    de.time_of_day,
    de.hot_flashes,
    de.sleep_quality,
    de.mood,
    de.created_at,
    de.updated_at
FROM public.daily_entries de
INNER JOIN auth.users u ON de.user_id = u.id
WHERE u.email IN ('nitzandaphna@gmsil.com', 'nitzandaphna@gmail.com')
ORDER BY de.date DESC, de.created_at DESC
LIMIT 20;

-- 4. בדוק את התאריכים המדויקים - השוואה בין מה שצריך להיות למה שיש
WITH user_info AS (
    SELECT id as user_id
    FROM auth.users
    WHERE email IN ('nitzandaphna@gmsil.com', 'nitzandaphna@gmail.com')
    LIMIT 1
),
expected_dates AS (
    SELECT 
        CURRENT_DATE - INTERVAL '6 days' + (generate_series(0, 6))::int AS date
),
actual_entries AS (
    SELECT 
        DATE(de.date) as entry_date,
        COUNT(*) as count
    FROM public.daily_entries de
    CROSS JOIN user_info ui
    WHERE de.user_id = ui.user_id
        AND DATE(de.date) >= CURRENT_DATE - INTERVAL '6 days'
    GROUP BY DATE(de.date)
)
SELECT 
    ed.date as expected_date,
    ed.date::text as date_string,
    COALESCE(ae.count, 0) as actual_entry_count,
    CASE 
        WHEN ae.count > 0 THEN '✓ יש דיווח'
        ELSE '○ אין דיווח'
    END as status
FROM expected_dates ed
LEFT JOIN actual_entries ae ON ae.entry_date = ed.date
ORDER BY ed.date DESC;

