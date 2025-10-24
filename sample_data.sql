-- Sample data for nitzandaphna@gmail.com
-- Run this in Supabase Dashboard → SQL Editor

-- STEP 1: Delete existing user data completely
-- Delete all entries for the user
DELETE FROM public.daily_entries WHERE user_id IN (
  SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com'
);
DELETE FROM public.cycle_entries WHERE user_id IN (
  SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com'
);
DELETE FROM public.aliza_messages WHERE user_id IN (
  SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com'
);

-- Delete the user profile
DELETE FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com';

-- STEP 2: Create the user in Supabase Auth manually:
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. Click "Add user" 
-- 3. Email: nitzandaphna@gmail.com
-- 4. Password: test123456
-- 5. Auto Confirm User: Yes
-- 6. Copy the user ID and replace the UUID below

-- STEP 3: Create the user profile with the real user ID
-- Replace the UUID below with the actual user ID from Supabase Auth
INSERT INTO public.user_profile (id, email, name, subscription_status, current_tokens, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001', -- Replace with actual user ID from Supabase Auth
  'nitzandaphna@gmail.com',
  'ענבל דפנה',
  'active',
  100,
  NOW(),
  NOW()
);

-- STEP 4: Insert all tracking data for the user
-- Insert 35 daily entries for comprehensive tracking
INSERT INTO public.daily_entries (
  user_id, 
  date, 
  time_of_day, 
  sleep_quality, 
  woke_up_night, 
  night_sweats, 
  energy_level, 
  mood, 
  hot_flashes, 
  dryness, 
  pain, 
  bloating, 
  concentration_difficulty, 
  sleep_issues, 
  sexual_desire, 
  daily_insight
) VALUES 
-- Entry 1 - Morning, 3 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '3 days',
  'morning',
  'good',
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'הרגשתי נהדר הבוקר! השינה הייתה טובה ואני מלאת אנרגיה.'
),

-- Entry 2 - Evening, 3 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '3 days',
  'evening',
  NULL,
  false,
  false,
  'medium',
  'calm',
  true,
  false,
  false,
  true,
  false,
  false,
  false,
  'היו לי גלי חום קלים אחר הצהריים, אבל בסך הכל יום טוב.'
),

-- Entry 3 - Morning, 2 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '2 days',
  'morning',
  'fair',
  true,
  true,
  'low',
  'irritated',
  false,
  true,
  true,
  false,
  true,
  true,
  false,
  'הלילה היה קשה - התעוררתי כמה פעמים והזעתי. מרגישה עייפה.'
),

-- Entry 4 - Evening, 2 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '2 days',
  'evening',
  NULL,
  false,
  false,
  'medium',
  'sad',
  false,
  false,
  true,
  false,
  false,
  false,
  false,
  'הכאבים ממשיכים להטריד אותי. מקווה שמחר יהיה טוב יותר.'
),

-- Entry 5 - Morning, 1 day ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '1 day',
  'morning',
  'good',
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'בוקר נפלא! השינה הייתה טובה והכאבים פחתו.'
),

-- Entry 6 - Evening, 1 day ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '1 day',
  'evening',
  NULL,
  false,
  false,
  'medium',
  'calm',
  true,
  false,
  false,
  true,
  false,
  false,
  false,
  'גלי חום קלים בערב, אבל בסך הכל הרגשה טובה.'
),

-- Entry 7 - Morning, today
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE,
  'morning',
  'good',
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'בוקר מצוין! מרגישה מלאת אנרגיה ומוכנה ליום חדש.'
),

-- Entry 8 - Evening, today
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE,
  'evening',
  NULL,
  false,
  false,
  'medium',
  'calm',
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  'יום טוב בסך הכל. מרגישה רגועה ושלווה.'
),

-- Entry 9 - Morning, 4 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '4 days',
  'morning',
  'poor',
  true,
  true,
  'low',
  'frustrated',
  false,
  true,
  false,
  true,
  true,
  true,
  false,
  'לילה קשה עם הזעות לילה והתעוררויות. מרגישה מתוסכלת.'
),

-- Entry 10 - Evening, 4 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '4 days',
  'evening',
  NULL,
  false,
  false,
  'low',
  'sad',
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  'יום קשה עם הרבה תסמינים. מקווה שמחר יהיה טוב יותר.'
),

-- Entry 11 - Morning, 5 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '5 days',
  'morning',
  'excellent',
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'בוקר מושלם! השינה הייתה עמוקה ומרגישה מלאת אנרגיה.'
),

-- Entry 12 - Evening, 5 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '5 days',
  'evening',
  NULL,
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'יום נפלא! הרגשה טובה כל היום.'
),

-- Entry 13 - Morning, 6 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '6 days',
  'morning',
  'fair',
  true,
  false,
  'medium',
  'neutral',
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  'התעוררתי פעם אחת בלילה, אבל בסך הכל שינה סבירה.'
),

-- Entry 14 - Evening, 6 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '6 days',
  'evening',
  NULL,
  false,
  false,
  'medium',
  'calm',
  true,
  false,
  false,
  false,
  false,
  false,
  false,
  'גלי חום קלים בערב, אבל לא מפריעים.'
),

-- Entry 15 - Morning, 7 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '7 days',
  'morning',
  'poor',
  true,
  true,
  'low',
  'frustrated',
  false,
  true,
  true,
  true,
  true,
  true,
  false,
  'לילה קשה עם הזעות לילה והתעוררויות. מרגישה מתוסכלת ועייפה.'
),

-- Entry 16 - Evening, 7 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '7 days',
  'evening',
  NULL,
  false,
  false,
  'low',
  'sad',
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  'יום קשה עם הרבה תסמינים. מקווה שמחר יהיה טוב יותר.'
),

-- Entry 17 - Morning, 8 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '8 days',
  'morning',
  'good',
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'בוקר נהדר! השינה הייתה טובה ואני מלאת אנרגיה.'
),

-- Entry 18 - Evening, 8 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '8 days',
  'evening',
  NULL,
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'יום מושלם! הרגשה נהדרת כל היום.'
),

-- Entry 19 - Morning, 9 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '9 days',
  'morning',
  'fair',
  true,
  false,
  'medium',
  'neutral',
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  'התעוררתי פעם אחת בלילה, אבל בסך הכל שינה סבירה.'
),

-- Entry 20 - Evening, 9 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '9 days',
  'evening',
  NULL,
  false,
  false,
  'medium',
  'calm',
  true,
  false,
  false,
  false,
  false,
  false,
  false,
  'גלי חום קלים בערב, אבל לא מפריעים.'
),

-- Entry 21 - Morning, 10 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '10 days',
  'morning',
  'excellent',
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'בוקר מושלם! השינה הייתה עמוקה ומרגישה מלאת אנרגיה.'
),

-- Entry 22 - Evening, 10 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '10 days',
  'evening',
  NULL,
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'יום נפלא! הרגשה טובה כל היום.'
),

-- Entry 23 - Morning, 11 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '11 days',
  'morning',
  'poor',
  true,
  true,
  'low',
  'frustrated',
  false,
  true,
  true,
  true,
  true,
  true,
  false,
  'לילה קשה עם הזעות לילה והתעוררויות. מרגישה מתוסכלת ועייפה.'
),

-- Entry 24 - Evening, 11 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '11 days',
  'evening',
  NULL,
  false,
  false,
  'low',
  'sad',
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  'יום קשה עם הרבה תסמינים. מקווה שמחר יהיה טוב יותר.'
),

-- Entry 25 - Morning, 12 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '12 days',
  'morning',
  'good',
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'בוקר נהדר! השינה הייתה טובה ואני מלאת אנרגיה.'
),

-- Entry 26 - Morning, 13 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '13 days',
  'morning',
  'excellent',
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'בוקר מושלם! השינה הייתה עמוקה ומרגישה מלאת אנרגיה.'
),

-- Entry 27 - Evening, 13 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '13 days',
  'evening',
  NULL,
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'יום נפלא! הרגשה טובה כל היום.'
),

-- Entry 28 - Morning, 14 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '14 days',
  'morning',
  'fair',
  true,
  false,
  'medium',
  'neutral',
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  'התעוררתי פעם אחת בלילה, אבל בסך הכל שינה סבירה.'
),

-- Entry 29 - Evening, 14 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '14 days',
  'evening',
  NULL,
  false,
  false,
  'medium',
  'calm',
  true,
  false,
  false,
  false,
  false,
  false,
  false,
  'גלי חום קלים בערב, אבל לא מפריעים.'
),

-- Entry 30 - Morning, 15 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '15 days',
  'morning',
  'poor',
  true,
  true,
  'low',
  'frustrated',
  false,
  true,
  true,
  true,
  true,
  true,
  false,
  'לילה קשה עם הזעות לילה והתעוררויות. מרגישה מתוסכלת ועייפה.'
),

-- Entry 31 - Evening, 15 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '15 days',
  'evening',
  NULL,
  false,
  false,
  'low',
  'sad',
  true,
  true,
  true,
  true,
  true,
  true,
  false,
  'יום קשה עם הרבה תסמינים. מקווה שמחר יהיה טוב יותר.'
),

-- Entry 32 - Morning, 16 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '16 days',
  'morning',
  'good',
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'בוקר נהדר! השינה הייתה טובה ואני מלאת אנרגיה.'
),

-- Entry 33 - Evening, 16 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '16 days',
  'evening',
  NULL,
  false,
  false,
  'high',
  'happy',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'יום מושלם! הרגשה נהדרת כל היום.'
),

-- Entry 34 - Morning, 17 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '17 days',
  'morning',
  'fair',
  true,
  false,
  'medium',
  'neutral',
  false,
  false,
  false,
  false,
  false,
  false,
  false,
  'התעוררתי פעם אחת בלילה, אבל בסך הכל שינה סבירה.'
),

-- Entry 35 - Evening, 17 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '17 days',
  'evening',
  NULL,
  false,
  false,
  'medium',
  'calm',
  true,
  false,
  false,
  false,
  false,
  false,
  false,
  'גלי חום קלים בערב, אבל לא מפריעים.'
);

-- Insert cycle entries
INSERT INTO public.cycle_entries (
  user_id,
  date,
  is_period,
  bleeding_intensity,
  symptoms,
  notes
) VALUES 
-- Cycle entry 1 - 5 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '5 days',
  true,
  'medium',
  ARRAY['hot_flashes', 'mood_swings', 'cramps'],
  'תחילת המחזור - דימום בינוני עם התכווצויות'
),

-- Cycle entry 2 - 3 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '3 days',
  true,
  'light',
  ARRAY['fatigue', 'mood_swings'],
  'דימום קל - מרגישה עייפה אבל מצב הרוח טוב יותר'
),

-- Cycle entry 3 - today
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE,
  false,
  NULL,
  ARRAY['hot_flashes', 'dryness'],
  'סוף המחזור - רק גלי חום קלים ויובש'
),

-- Cycle entry 4 - 8 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '8 days',
  true,
  'heavy',
  ARRAY['hot_flashes', 'mood_swings', 'cramps', 'fatigue'],
  'דימום כבד עם התכווצויות ועייפות'
),

-- Cycle entry 5 - 6 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '6 days',
  true,
  'medium',
  ARRAY['mood_swings', 'cramps'],
  'דימום בינוני עם שינויים במצב הרוח'
),

-- Cycle entry 6 - 4 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '4 days',
  true,
  'light',
  ARRAY['fatigue'],
  'דימום קל עם עייפות'
),

-- Cycle entry 7 - 2 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '2 days',
  false,
  NULL,
  ARRAY['hot_flashes', 'dryness'],
  'סוף המחזור - רק גלי חום קלים ויובש'
),

-- Cycle entry 8 - 15 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '15 days',
  true,
  'heavy',
  ARRAY['hot_flashes', 'mood_swings', 'cramps', 'fatigue'],
  'דימום כבד עם התכווצויות ועייפות'
),

-- Cycle entry 9 - 13 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '13 days',
  true,
  'medium',
  ARRAY['mood_swings', 'cramps'],
  'דימום בינוני עם שינויים במצב הרוח'
),

-- Cycle entry 10 - 11 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '11 days',
  true,
  'light',
  ARRAY['fatigue'],
  'דימום קל עם עייפות'
);

-- Insert Aliza messages
INSERT INTO public.aliza_messages (
  user_id,
  type,
  message,
  emoji,
  action_url
) VALUES 
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  'morning',
  'בוקר טוב! איך עבר הלילה? אני כאן כדי לעזור לך להתחיל את היום בצורה הטובה ביותר.',
  '🌅',
  NULL
),
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  'encouragement',
  'אני גאה בך על כך שאת מתעדת את התסמינים שלך! זה עוזר לך להבין את הגוף שלך טוב יותר.',
  '💪',
  NULL
),
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  'tip',
  'טיפ: כשאת מרגישה גלי חום, נסי לשתות מים קרים ולנשום עמוק. זה יכול לעזור!',
  '💡',
  NULL
),
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  'evening',
  'ערב טוב! איך עבר היום? אני כאן כדי לעזור לך לסכם את היום בצורה הטובה ביותר.',
  '🌙',
  NULL
),
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  'support',
  'אני כאן בשבילך! כל יום הוא הזדמנות חדשה להתחיל מחדש.',
  '🤗',
  NULL
),
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  'reminder',
  'זכרי לשתות הרבה מים היום! זה עוזר עם גלי החום.',
  '💧',
  NULL
);