-- Mock Journal Data for ענבל (inbald@sapir.ac.il)
-- 15 entries with diverse symptoms, moods, and sleep quality

-- First, let's get the user ID for inbald@sapir.ac.il
-- Assuming the user exists in the system

-- Daily Entries for ענבל
INSERT INTO daily_entries (
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
  daily_insight,
  created_at,
  updated_at
) VALUES 
-- Entry 1: Good day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-15',
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
  'הרגשתי נהדר היום! שינה טובה ואנרגיה גבוהה',
  '2025-01-15 08:00:00',
  '2025-01-15 08:00:00'
),

-- Entry 2: Evening of same day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-15',
  'evening',
  'good',
  false,
  false,
  'medium',
  'content',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'יום נהדר הסתיים. הרגשתי מאוזנת ושלווה',
  '2025-01-15 20:30:00',
  '2025-01-15 20:30:00'
),

-- Entry 3: Challenging day with hot flashes
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-16',
  'morning',
  'poor',
  true,
  true,
  'low',
  'frustrated',
  true,
  false,
  false,
  false,
  true,
  true,
  false,
  'לילה קשה עם גלי חום והזעות לילה. התקשיתי לישון',
  '2025-01-16 07:30:00',
  '2025-01-16 07:30:00'
),

-- Entry 4: Evening of challenging day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-16',
  'evening',
  'poor',
  false,
  true,
  'low',
  'tired',
  true,
  true,
  false,
  true,
  true,
  true,
  false,
  'יום קשה עם גלי חום רבים. הרגשתי עייפה וחסרת אנרגיה',
  '2025-01-16 19:45:00',
  '2025-01-16 19:45:00'
),

-- Entry 5: Better day with some symptoms
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-17',
  'morning',
  'fair',
  false,
  false,
  'medium',
  'neutral',
  false,
  true,
  false,
  false,
  false,
  false,
  true,
  'שינה בסדר, אבל יש לי יובש. מצב הרוח בסדר',
  '2025-01-17 08:15:00',
  '2025-01-17 08:15:00'
),

-- Entry 6: Evening of better day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-17',
  'evening',
  'good',
  false,
  false,
  'medium',
  'content',
  false,
  true,
  false,
  false,
  false,
  false,
  true,
  'יום טוב יותר. עדיין יש יובש אבל הרגשה כללית טובה',
  '2025-01-17 20:00:00',
  '2025-01-17 20:00:00'
),

-- Entry 7: Day with bloating and pain
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-18',
  'morning',
  'fair',
  false,
  false,
  'low',
  'uncomfortable',
  false,
  false,
  true,
  true,
  false,
  false,
  false,
  'הרגשתי נפוחה וכואבת. קשה לי להתרכז',
  '2025-01-18 08:30:00',
  '2025-01-18 08:30:00'
),

-- Entry 8: Evening of bloating day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-18',
  'evening',
  'fair',
  false,
  false,
  'low',
  'uncomfortable',
  false,
  false,
  true,
  true,
  true,
  false,
  false,
  'עדיין נפוחה וכואבת. קשה לי להתרכז בעבודה',
  '2025-01-18 19:30:00',
  '2025-01-18 19:30:00'
),

-- Entry 9: Good day with exercise
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-19',
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
  'שינה מעולה אחרי אימון אתמול! הרגשה נהדרת',
  '2025-01-19 07:45:00',
  '2025-01-19 07:45:00'
),

-- Entry 10: Evening of exercise day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-19',
  'evening',
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
  'יום נהדר! אימון הבוקר עזר לי להרגיש אנרגטית כל היום',
  '2025-01-19 20:15:00',
  '2025-01-19 20:15:00'
),

-- Entry 11: Day with concentration issues
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-20',
  'morning',
  'fair',
  false,
  false,
  'medium',
  'foggy',
  false,
  false,
  false,
  false,
  true,
  false,
  false,
  'קשה לי להתרכז היום. הרגשה של ערפל במוח',
  '2025-01-20 08:00:00',
  '2025-01-20 08:00:00'
),

-- Entry 12: Evening of concentration day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-20',
  'evening',
  'fair',
  false,
  false,
  'medium',
  'foggy',
  false,
  false,
  false,
  false,
  true,
  false,
  false,
  'עדיין קשה להתרכז. הרגשה של ערפל במוח לא עברה',
  '2025-01-20 19:45:00',
  '2025-01-20 19:45:00'
),

-- Entry 13: Mixed symptoms day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-21',
  'morning',
  'poor',
  true,
  true,
  'low',
  'irritable',
  true,
  true,
  false,
  true,
  true,
  true,
  false,
  'לילה קשה עם גלי חום, הזעות לילה, יובש ונפיחות. הרגשה רעה',
  '2025-01-21 07:30:00',
  '2025-01-21 07:30:00'
),

-- Entry 14: Evening of mixed symptoms day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-21',
  'evening',
  'poor',
  false,
  true,
  'low',
  'irritable',
  true,
  true,
  false,
  true,
  true,
  true,
  false,
  'יום קשה עם תסמינים רבים. הרגשה של חוסר שליטה',
  '2025-01-21 20:00:00',
  '2025-01-21 20:00:00'
),

-- Entry 15: Recovery day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-22',
  'morning',
  'good',
  false,
  false,
  'medium',
  'hopeful',
  false,
  false,
  false,
  false,
  false,
  false,
  true,
  'הרגשה טובה יותר היום. התסמינים פחתו ואני מרגישה יותר אופטימית',
  '2025-01-22 08:00:00',
  '2025-01-22 08:00:00'
);

-- Cycle Entries for ענבל
INSERT INTO cycle_entries (
  user_id,
  cycle_start_date,
  cycle_length,
  period_length,
  flow_intensity,
  symptoms,
  mood_changes,
  notes,
  created_at,
  updated_at
) VALUES 
-- Cycle 1: Regular cycle
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2025-01-10',
  28,
  5,
  'medium',
  'mild cramps, bloating',
  'slightly irritable',
  'מחזור רגיל עם תסמינים קלים',
  '2025-01-10 00:00:00',
  '2025-01-10 00:00:00'
),

-- Cycle 2: Irregular cycle
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  '2024-12-15',
  35,
  3,
  'light',
  'hot flashes, night sweats',
  'mood swings, anxiety',
  'מחזור לא סדיר עם תסמיני גיל המעבר',
  '2024-12-15 00:00:00',
  '2024-12-15 00:00:00'
);

-- Emotion Entries for ענבל
INSERT INTO emotion_entry (
  user_id,
  emotion,
  color,
  notes,
  created_at,
  updated_at
) VALUES 
-- Emotion 1: Happy day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  'happy',
  '#FFB6C1',
  'הרגשתי נהדר היום! שינה טובה ואנרגיה גבוהה',
  '2025-01-15 08:00:00',
  '2025-01-15 08:00:00'
),

-- Emotion 2: Frustrated day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  'frustrated',
  '#FF6B6B',
  'לילה קשה עם גלי חום והזעות לילה. התקשיתי לישון',
  '2025-01-16 07:30:00',
  '2025-01-16 07:30:00'
),

-- Emotion 3: Content day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  'content',
  '#87CEEB',
  'יום טוב יותר. עדיין יש יובש אבל הרגשה כללית טובה',
  '2025-01-17 20:00:00',
  '2025-01-17 20:00:00'
),

-- Emotion 4: Uncomfortable day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  'uncomfortable',
  '#DDA0DD',
  'הרגשתי נפוחה וכואבת. קשה לי להתרכז',
  '2025-01-18 08:30:00',
  '2025-01-18 08:30:00'
),

-- Emotion 5: Hopeful day
(
  (SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'),
  'hopeful',
  '#98FB98',
  'הרגשה טובה יותר היום. התסמינים פחתו ואני מרגישה יותר אופטימית',
  '2025-01-22 08:00:00',
  '2025-01-22 08:00:00'
);
