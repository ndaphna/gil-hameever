-- Simple sample data - Run this in Supabase Dashboard → SQL Editor

-- First, let's check if the user exists and get their ID
SELECT id, email FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com';

-- If the user exists, delete any existing entries
DELETE FROM public.daily_entries WHERE user_id = (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1);
DELETE FROM public.cycle_entries WHERE user_id = (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1);
DELETE FROM public.aliza_messages WHERE user_id = (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1);

-- Insert sample daily entries (using different dates to avoid conflicts)
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
-- Entry 1 - Morning, 10 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '10 days',
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

-- Entry 2 - Evening, 10 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '10 days',
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

-- Entry 3 - Morning, 9 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '9 days',
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

-- Entry 4 - Evening, 9 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '9 days',
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

-- Entry 5 - Morning, 8 days ago
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
  'בוקר נפלא! השינה הייתה טובה והכאבים פחתו.'
),

-- Entry 6 - Evening, 8 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '8 days',
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

-- Entry 7 - Morning, 7 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '7 days',
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

-- Entry 8 - Evening, 7 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '7 days',
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

-- Entry 9 - Morning, 6 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '6 days',
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

-- Entry 10 - Evening, 6 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '6 days',
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
);

-- Add some cycle entries
INSERT INTO public.cycle_entries (
  user_id,
  date,
  is_period,
  bleeding_intensity,
  symptoms,
  notes
) VALUES 
-- Cycle entry 1 - 12 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '12 days',
  true,
  'medium',
  ARRAY['hot_flashes', 'mood_swings', 'cramps'],
  'תחילת המחזור - דימום בינוני עם התכווצויות'
),

-- Cycle entry 2 - 10 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '10 days',
  true,
  'light',
  ARRAY['fatigue', 'mood_swings'],
  'דימום קל - מרגישה עייפה אבל מצב הרוח טוב יותר'
),

-- Cycle entry 3 - 7 days ago
(
  (SELECT id FROM public.user_profile WHERE email = 'nitzandaphna@gmail.com' LIMIT 1),
  CURRENT_DATE - INTERVAL '7 days',
  false,
  NULL,
  ARRAY['hot_flashes', 'dryness'],
  'סוף המחזור - רק גלי חום קלים ויובש'
);

-- Add some Aliza messages
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
);
