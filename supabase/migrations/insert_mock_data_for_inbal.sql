-- ================================
-- נתוני דמה למשתמשת inbald@sapir.ac.il
-- ================================
-- 
-- הסקריפט הזה יוצר:
-- 1. 15 דיווחים יומיים (בוקר וערב) - 30 רשומות סה"כ
-- 2. 3 מחזורים עם תסמינים
-- 3. הודעות מעליזה
-- 4. העדפות יומן
-- ================================

-- מציאת ה-user_id של המשתמשת
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- מחפשים את המשתמשת לפי email
  SELECT up.id INTO v_user_id
  FROM public.user_profile up
  INNER JOIN auth.users u ON u.id = up.id
  WHERE u.email = 'inbald@sapir.ac.il';
  
  -- אם לא מצאנו - נדפיס הודעה
  IF v_user_id IS NULL THEN
    RAISE NOTICE 'User with email inbald@sapir.ac.il not found!';
    RAISE NOTICE 'Please make sure the user exists in auth.users and user_profile tables.';
    RETURN;
  END IF;
  
  RAISE NOTICE 'Found user_id: %', v_user_id;
  
  -- ================================
  -- 1. מחיקת נתונים קיימים (אופציונלי)
  -- ================================
  DELETE FROM public.daily_entries WHERE user_id = v_user_id;
  DELETE FROM public.cycle_entries WHERE user_id = v_user_id;
  DELETE FROM public.aliza_messages WHERE user_id = v_user_id;
  
  -- מחיקה מ-journal_preferences רק אם הטבלה קיימת
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journal_preferences') THEN
    DELETE FROM public.journal_preferences WHERE user_id = v_user_id;
  END IF;
  
  RAISE NOTICE 'Cleared existing data for user';
  
  -- ================================
  -- 2. דיווחים יומיים - 15 ימים (בוקר + ערב)
  -- ================================
  
  -- יום 1 - לפני 14 ימים
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 14, 'morning', 'fair', true, true, 'medium', 'irritated', true, false, false, true, false, false, 'התעוררתי פעמיים בלילה עם הזעות. קצת עצבני הבוקר.'),
    (v_user_id, CURRENT_DATE - 14, 'evening', NULL, NULL, NULL, 'low', 'frustrated', true, false, true, false, true, false, 'יום מתיש, גלי חום כל היום. קשה להתרכז.');
  
  -- יום 2 - לפני 13 ימים
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 13, 'morning', 'poor', true, true, 'low', 'sad', false, true, true, true, false, true, 'לילה קשה, כמעט לא ישנתי. כואב לי הגב.'),
    (v_user_id, CURRENT_DATE - 13, 'evening', NULL, NULL, NULL, 'low', 'sad', false, false, true, true, false, false, 'עייפות קשה. צריכה לנוח.');
  
  -- יום 3 - לפני 12 ימים - שיפור קל
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 12, 'morning', 'fair', true, false, 'medium', 'calm', true, false, false, false, false, false, 'שינה קצת יותר טובה. פחות הזעות.'),
    (v_user_id, CURRENT_DATE - 12, 'evening', NULL, NULL, NULL, 'medium', 'calm', true, false, false, false, false, false, 'יום רגוע יחסית.');
  
  -- יום 4 - לפני 11 ימים
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 11, 'morning', 'good', false, false, 'high', 'happy', false, false, false, false, false, false, 'לילה מצוין! התעוררתי רעננה ומלאת אנרגיה.'),
    (v_user_id, CURRENT_DATE - 11, 'evening', NULL, NULL, NULL, 'high', 'happy', false, false, false, false, false, false, 'יום נהדר! הרגשתי טוב כל היום.');
  
  -- יום 5 - לפני 10 ימים
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 10, 'morning', 'good', false, false, 'high', 'happy', false, false, false, false, false, false, 'עוד לילה טוב! כיף להתעורר ככה.'),
    (v_user_id, CURRENT_DATE - 10, 'evening', NULL, NULL, NULL, 'medium', 'calm', true, false, false, false, false, false, 'אנרגיה ירדה אחה"צ, אבל בסדר.');
  
  -- יום 6 - לפני 9 ימים - תחילת מחזור
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 9, 'morning', 'fair', false, false, 'low', 'irritated', false, false, true, true, false, false, 'התקופה הגיעה. כאבי בטן.'),
    (v_user_id, CURRENT_DATE - 9, 'evening', NULL, NULL, NULL, 'low', 'sad', false, false, true, true, false, false, 'כואב וקשה. רוצה שיעבור מהר.');
  
  -- יום 7 - לפני 8 ימים
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 8, 'morning', 'fair', true, false, 'low', 'irritated', false, false, true, false, false, false, 'עדיין כואב אבל פחות.'),
    (v_user_id, CURRENT_DATE - 8, 'evening', NULL, NULL, NULL, 'medium', 'calm', false, false, false, false, false, false, 'התחיל להשתפר.');
  
  -- יום 8 - לפני 7 ימים
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 7, 'morning', 'good', false, false, 'medium', 'calm', true, false, false, false, false, false, 'כבר עובר. התחלתי להרגיש טוב יותר.'),
    (v_user_id, CURRENT_DATE - 7, 'evening', NULL, NULL, NULL, 'medium', 'happy', false, false, false, false, false, false, 'יום טוב!');
  
  -- יום 9 - לפני 6 ימים
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 6, 'morning', 'good', false, false, 'high', 'happy', false, false, false, false, false, false, 'מרגישה מעולה!'),
    (v_user_id, CURRENT_DATE - 6, 'evening', NULL, NULL, NULL, 'high', 'happy', false, false, false, false, false, false, 'יום אנרגטי ונעים.');
  
  -- יום 10 - לפני 5 ימים
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 5, 'morning', 'fair', true, true, 'medium', 'calm', true, false, false, false, false, false, 'התעוררתי פעם אחת, אבל חזרתי לישון מהר.'),
    (v_user_id, CURRENT_DATE - 5, 'evening', NULL, NULL, NULL, 'medium', 'calm', true, false, false, false, false, false, 'יום רגיל.');
  
  -- יום 11 - לפני 4 ימים
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 4, 'morning', 'poor', true, true, 'low', 'frustrated', true, false, false, true, true, true, 'לילה גרוע. הזעות והתעוררויות. קשה להתרכז.'),
    (v_user_id, CURRENT_DATE - 4, 'evening', NULL, NULL, NULL, 'low', 'frustrated', true, false, false, false, true, false, 'יום קשה. הכל מעצבן אותי.');
  
  -- יום 12 - לפני 3 ימים
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 3, 'morning', 'fair', true, false, 'medium', 'irritated', true, false, false, false, false, false, 'עדיין לא שיפור גדול בשינה.'),
    (v_user_id, CURRENT_DATE - 3, 'evening', NULL, NULL, NULL, 'medium', 'calm', false, false, false, false, false, false, 'ערב רגוע יותר.');
  
  -- יום 13 - אתמול
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 2, 'morning', 'good', false, false, 'high', 'happy', false, false, false, false, false, false, 'לילה מצוין! חזרתי לרוטינה טובה.'),
    (v_user_id, CURRENT_DATE - 2, 'evening', NULL, NULL, NULL, 'high', 'happy', false, false, false, false, false, false, 'יום פרודוקטיבי ומוצלח.');
  
  -- יום 14 - היום
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE - 1, 'morning', 'good', false, false, 'high', 'happy', false, false, false, false, false, false, 'התעוררתי רעננה ומוכנה ליום חדש!'),
    (v_user_id, CURRENT_DATE - 1, 'evening', NULL, NULL, NULL, 'medium', 'calm', true, false, false, false, false, false, 'יום טוב בסך הכל.');
  
  -- יום 15 - היום בבוקר בלבד
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, sleep_issues, daily_insight)
  VALUES 
    (v_user_id, CURRENT_DATE, 'morning', 'good', false, false, 'high', 'happy', false, false, false, false, false, false, 'התחלת שבוע מעולה!');
  
  RAISE NOTICE 'Inserted 29 daily entries (15 days)';
  
  -- 3 מחזורים (רק עמודות בסיסיות)
  INSERT INTO public.cycle_entries (user_id, date, is_period, bleeding_intensity, symptoms, notes)
  VALUES 
    -- מחזור 1 - לפני 60 ימים (5 ימים)
    (v_user_id, CURRENT_DATE - 60, true, 'medium', ARRAY['cramps', 'mood_irritable', 'bloating', 'fatigue'], 'תחילת המחזור - כאבים בינוניים'),
    (v_user_id, CURRENT_DATE - 59, true, 'heavy', ARRAY['cramps', 'mood_sad', 'bloating', 'fatigue', 'headache'], 'היום הכי קשה - דימום חזק, כאבים עזים'),
    (v_user_id, CURRENT_DATE - 58, true, 'heavy', ARRAY['cramps', 'bloating', 'fatigue'], 'עדיין דימום חזק - כאבים פחות'),
    (v_user_id, CURRENT_DATE - 57, true, 'medium', ARRAY['fatigue', 'mood_irritable'], 'מתחיל להיות קל יותר'),
    (v_user_id, CURRENT_DATE - 56, true, 'light', ARRAY['fatigue'], 'כמעט נגמר - רק עייפות'),
    
    -- מחזור 2 - לפני 32 ימים (4 ימים - קצר יותר)
    (v_user_id, CURRENT_DATE - 32, true, 'light', ARRAY['mood_irritable', 'fatigue'], 'מחזור קל הפעם'),
    (v_user_id, CURRENT_DATE - 31, true, 'medium', ARRAY['cramps', 'bloating', 'fatigue'], 'דימום בינוני - כאבים בטן'),
    (v_user_id, CURRENT_DATE - 30, true, 'medium', ARRAY['cramps', 'fatigue'], 'עדיין בינוני'),
    (v_user_id, CURRENT_DATE - 29, true, 'light', ARRAY['fatigue'], 'כמעט נגמר'),
    
    -- מחזור 3 - לפני 9 ימים (3 ימים - קצר מאוד)
    (v_user_id, CURRENT_DATE - 9, true, 'light', ARRAY['cramps', 'mood_irritable', 'bloating'], 'מחזור קצר - לא חזק'),
    (v_user_id, CURRENT_DATE - 8, true, 'medium', ARRAY['cramps', 'bloating', 'fatigue'], 'קצת יותר חזק היום'),
    (v_user_id, CURRENT_DATE - 7, true, 'light', ARRAY['fatigue'], 'נגמר מהר - רק עייפות'),
    
    -- ימים נוספים (ללא מחזור)
    (v_user_id, CURRENT_DATE - 20, false, NULL, ARRAY['mood_sensitive'], 'יום רגוע - רגישות רגשית קלה'),
    (v_user_id, CURRENT_DATE - 15, false, NULL, ARRAY['increased_desire'], 'אנרגיה גבוהה - תקופה טובה'),
    (v_user_id, CURRENT_DATE - 5, false, NULL, NULL, 'יום רגיל - ללא תסמינים');
  
  RAISE NOTICE 'Inserted 16 cycle entries (3 periods + additional tracking)';
  
  -- ================================
  -- 4. הודעות מעליזה (רק עמודות בסיסיות)
  -- ================================
  
  INSERT INTO public.aliza_messages (user_id, type, message, emoji, action_url)
  VALUES 
    -- הודעת בוקר
    (v_user_id, 'morning', 'בוקר טוב ענבל! 🌅 איך עבר הלילה? זכרי לדווח על השינה שלך כדי שאוכל לעזור לך טוב יותר.', '🌅', '/journal'),
    
    -- הודעת ערב
    (v_user_id, 'evening', 'ערב טוב! 🌙 הגיע הזמן לסכם את היום. איך הרגשת? יש לך 3 דקות לעדכן את היומן שלך.', '🌙', '/journal'),
    
    -- תובנה על המחזור
    (v_user_id, 'cycle', 'שמתי לב שהמחזורים שלך הולכים ומתקצרים - מ-5 ימים ל-3 ימים. זה תקין לגיל המעבר. הממוצע שלך: 28 ימים בין מחזורים.', '🌸', '/journal?tab=cycle'),
    
    -- עידוד
    (v_user_id, 'encouragement', 'כל הכבוד! 🎉 עשית דיווח כבר 15 ימים ברציפות! המעקב העקבי שלך עוזר לי לזהות דפוסים ולתת לך תובנות מדויקות יותר.', '🎉', NULL),
    
    -- טיפ על שינה
    (v_user_id, 'tip', 'טיפ מעליזה: שמתי לב שבימים שאת ישנה טוב יותר, יש לך פחות גלי חום ביום שאחרי. נסי לשמור על שגרת שינה קבועה - זה באמת עוזר! 😴', '💡', '/menopausal-sleep'),
    
    -- תובנה על מצב רוח
    (v_user_id, 'tip', 'התובנה שלי: המצב רוח שלך משתפר משמעותית 2-3 ימים אחרי סוף המחזור. תכנני פעילויות חשובות לתקופה הזו! 📊', '📊', '/insights');
  
  RAISE NOTICE 'Inserted 6 Aliza messages';
  
  -- ================================
  -- 5. העדפות יומן (רק אם הטבלה קיימת)
  -- ================================
  
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journal_preferences') THEN
    INSERT INTO public.journal_preferences (
      user_id, 
      morning_reminder_time, 
      evening_reminder_time,
      enable_morning_reminder,
      enable_evening_reminder,
      enable_cycle_predictions,
      enable_symptom_insights,
      preferred_language
    )
    VALUES (
      v_user_id,
      '08:00:00',
      '20:30:00',
      true,
      true,
      true,
      true,
      'he'
    );
    
    RAISE NOTICE 'Inserted journal preferences';
  ELSE
    RAISE NOTICE 'Table journal_preferences does not exist - skipping';
  END IF;
  
  -- ================================
  -- סיכום
  -- ================================
  
  RAISE NOTICE '================================';
  RAISE NOTICE '✅ נתוני דמה הוכנסו בהצלחה!';
  RAISE NOTICE '================================';
  RAISE NOTICE 'Summary for user: inbald@sapir.ac.il';
  RAISE NOTICE '- Daily entries: 29 (15 days, morning + evening)';
  RAISE NOTICE '- Cycle entries: 15 (3 periods + tracking)';
  RAISE NOTICE '- Aliza messages: 6';
  RAISE NOTICE '- Journal preferences: 1 (if table exists)';
  RAISE NOTICE '================================';
  RAISE NOTICE 'Cycle patterns:';
  RAISE NOTICE '- Period 1: 60 days ago, 5 days, medium-heavy';
  RAISE NOTICE '- Period 2: 32 days ago, 4 days, light-medium';
  RAISE NOTICE '- Period 3: 9 days ago, 3 days, light';
  RAISE NOTICE '- Average cycle: 28 days';
  RAISE NOTICE '- Trend: Shortening periods (typical for menopause)';
  RAISE NOTICE '================================';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Login as inbald@sapir.ac.il';
  RAISE NOTICE '2. Go to /journal';
  RAISE NOTICE '3. Test all features!';
  RAISE NOTICE '================================';
  
END $$;

