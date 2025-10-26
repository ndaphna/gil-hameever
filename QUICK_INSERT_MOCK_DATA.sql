-- ================================
-- נתוני דמה מהירים למשתמשת inbald@sapir.ac.il
-- העתק והדבק את הכל ב-SQL Editor של Supabase
-- 
-- ✅ גרסה מתוקנת - לא נכשל אם journal_preferences לא קיים
-- ================================

DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- מציאת המשתמשת
  SELECT up.id INTO v_user_id
  FROM public.user_profile up
  INNER JOIN auth.users u ON u.id = up.id
  WHERE u.email = 'inbald@sapir.ac.il';
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User inbald@sapir.ac.il not found!';
  END IF;
  
  -- מחיקת נתונים קיימים (רק אם הטבלאות קיימות)
  DELETE FROM public.daily_entries WHERE user_id = v_user_id;
  DELETE FROM public.cycle_entries WHERE user_id = v_user_id;
  DELETE FROM public.aliza_messages WHERE user_id = v_user_id;
  
  -- מחיקה מ-journal_preferences רק אם הטבלה קיימת
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journal_preferences') THEN
    DELETE FROM public.journal_preferences WHERE user_id = v_user_id;
  END IF;
  
  -- 15 ימי דיווח (29 רשומות - בוקר+ערב)
  INSERT INTO public.daily_entries (user_id, date, time_of_day, sleep_quality, woke_up_night, night_sweats, energy_level, mood, hot_flashes, dryness, pain, bloating, concentration_difficulty, daily_insight) VALUES 
  (v_user_id, CURRENT_DATE - 14, 'morning', 'fair', true, true, 'medium', 'irritated', true, false, false, true, false, 'התעוררתי פעמיים בלילה עם הזעות'),
  (v_user_id, CURRENT_DATE - 14, 'evening', NULL, NULL, NULL, 'low', 'frustrated', true, false, true, false, true, 'יום מתיש, גלי חום כל היום'),
  (v_user_id, CURRENT_DATE - 13, 'morning', 'poor', true, true, 'low', 'sad', false, true, true, true, false, 'לילה קשה, כמעט לא ישנתי'),
  (v_user_id, CURRENT_DATE - 13, 'evening', NULL, NULL, NULL, 'low', 'sad', false, false, true, true, false, 'עייפות קשה'),
  (v_user_id, CURRENT_DATE - 12, 'morning', 'fair', true, false, 'medium', 'calm', true, false, false, false, false, 'שינה קצת יותר טובה'),
  (v_user_id, CURRENT_DATE - 12, 'evening', NULL, NULL, NULL, 'medium', 'calm', true, false, false, false, false, 'יום רגוע יחסית'),
  (v_user_id, CURRENT_DATE - 11, 'morning', 'good', false, false, 'high', 'happy', false, false, false, false, false, 'לילה מצוין!'),
  (v_user_id, CURRENT_DATE - 11, 'evening', NULL, NULL, NULL, 'high', 'happy', false, false, false, false, false, 'יום נהדר!'),
  (v_user_id, CURRENT_DATE - 10, 'morning', 'good', false, false, 'high', 'happy', false, false, false, false, false, 'עוד לילה טוב'),
  (v_user_id, CURRENT_DATE - 10, 'evening', NULL, NULL, NULL, 'medium', 'calm', true, false, false, false, false, 'אנרגיה ירדה אחה"צ'),
  (v_user_id, CURRENT_DATE - 9, 'morning', 'fair', false, false, 'low', 'irritated', false, false, true, true, false, 'התקופה הגיעה. כאבי בטן'),
  (v_user_id, CURRENT_DATE - 9, 'evening', NULL, NULL, NULL, 'low', 'sad', false, false, true, true, false, 'כואב וקשה'),
  (v_user_id, CURRENT_DATE - 8, 'morning', 'fair', true, false, 'low', 'irritated', false, false, true, false, false, 'עדיין כואב אבל פחות'),
  (v_user_id, CURRENT_DATE - 8, 'evening', NULL, NULL, NULL, 'medium', 'calm', false, false, false, false, false, 'התחיל להשתפר'),
  (v_user_id, CURRENT_DATE - 7, 'morning', 'good', false, false, 'medium', 'calm', true, false, false, false, false, 'כבר עובר'),
  (v_user_id, CURRENT_DATE - 7, 'evening', NULL, NULL, NULL, 'medium', 'happy', false, false, false, false, false, 'יום טוב!'),
  (v_user_id, CURRENT_DATE - 6, 'morning', 'good', false, false, 'high', 'happy', false, false, false, false, false, 'מרגישה מעולה!'),
  (v_user_id, CURRENT_DATE - 6, 'evening', NULL, NULL, NULL, 'high', 'happy', false, false, false, false, false, 'יום אנרגטי'),
  (v_user_id, CURRENT_DATE - 5, 'morning', 'fair', true, true, 'medium', 'calm', true, false, false, false, false, 'התעוררתי פעם אחת'),
  (v_user_id, CURRENT_DATE - 5, 'evening', NULL, NULL, NULL, 'medium', 'calm', true, false, false, false, false, 'יום רגיל'),
  (v_user_id, CURRENT_DATE - 4, 'morning', 'poor', true, true, 'low', 'frustrated', true, false, false, true, true, 'לילה גרוע'),
  (v_user_id, CURRENT_DATE - 4, 'evening', NULL, NULL, NULL, 'low', 'frustrated', true, false, false, false, true, 'יום קשה'),
  (v_user_id, CURRENT_DATE - 3, 'morning', 'fair', true, false, 'medium', 'irritated', true, false, false, false, false, 'עדיין לא שיפור גדול'),
  (v_user_id, CURRENT_DATE - 3, 'evening', NULL, NULL, NULL, 'medium', 'calm', false, false, false, false, false, 'ערב רגוע'),
  (v_user_id, CURRENT_DATE - 2, 'morning', 'good', false, false, 'high', 'happy', false, false, false, false, false, 'לילה מצוין!'),
  (v_user_id, CURRENT_DATE - 2, 'evening', NULL, NULL, NULL, 'high', 'happy', false, false, false, false, false, 'יום מוצלח'),
  (v_user_id, CURRENT_DATE - 1, 'morning', 'good', false, false, 'high', 'happy', false, false, false, false, false, 'התעוררתי רעננה'),
  (v_user_id, CURRENT_DATE - 1, 'evening', NULL, NULL, NULL, 'medium', 'calm', true, false, false, false, false, 'יום טוב'),
  (v_user_id, CURRENT_DATE, 'morning', 'good', false, false, 'high', 'happy', false, false, false, false, false, 'התחלת שבוע מעולה!');
  
  -- 3 מחזורים (רק עמודות בסיסיות)
  INSERT INTO public.cycle_entries (user_id, date, is_period, bleeding_intensity, symptoms, notes) VALUES 
  (v_user_id, CURRENT_DATE - 60, true, 'medium', ARRAY['cramps', 'mood_irritable', 'bloating', 'fatigue'], 'תחילת המחזור - כאבים בינוניים'),
  (v_user_id, CURRENT_DATE - 59, true, 'heavy', ARRAY['cramps', 'mood_sad', 'bloating', 'fatigue', 'headache'], 'דימום חזק - היום הכי קשה'),
  (v_user_id, CURRENT_DATE - 58, true, 'heavy', ARRAY['cramps', 'bloating', 'fatigue'], 'עדיין חזק - כאבים פחות'),
  (v_user_id, CURRENT_DATE - 57, true, 'medium', ARRAY['fatigue', 'mood_irritable'], 'מתחיל להיות קל'),
  (v_user_id, CURRENT_DATE - 56, true, 'light', ARRAY['fatigue'], 'כמעט נגמר'),
  (v_user_id, CURRENT_DATE - 32, true, 'light', ARRAY['mood_irritable', 'fatigue'], 'מחזור קל הפעם'),
  (v_user_id, CURRENT_DATE - 31, true, 'medium', ARRAY['cramps', 'bloating', 'fatigue'], 'דימום בינוני'),
  (v_user_id, CURRENT_DATE - 30, true, 'medium', ARRAY['cramps', 'fatigue'], 'עדיין בינוני'),
  (v_user_id, CURRENT_DATE - 29, true, 'light', ARRAY['fatigue'], 'כמעט נגמר'),
  (v_user_id, CURRENT_DATE - 9, true, 'light', ARRAY['cramps', 'mood_irritable', 'bloating'], 'מחזור קצר - לא חזק'),
  (v_user_id, CURRENT_DATE - 8, true, 'medium', ARRAY['cramps', 'bloating', 'fatigue'], 'קצת יותר חזק'),
  (v_user_id, CURRENT_DATE - 7, true, 'light', ARRAY['fatigue'], 'נגמר מהר'),
  (v_user_id, CURRENT_DATE - 20, false, NULL, ARRAY['mood_sensitive'], 'יום רגוע'),
  (v_user_id, CURRENT_DATE - 15, false, NULL, ARRAY['increased_desire'], 'אנרגיה גבוהה'),
  (v_user_id, CURRENT_DATE - 5, false, NULL, NULL, 'יום רגיל');
  
  -- הודעות עליזה (רק עמודות בסיסיות)
  INSERT INTO public.aliza_messages (user_id, type, message, emoji, action_url) VALUES 
  (v_user_id, 'morning', 'בוקר טוב ענבל! 🌅 איך עבר הלילה? זכרי לדווח על השינה שלך כדי שאוכל לעזור לך טוב יותר.', '🌅', '/journal'),
  (v_user_id, 'evening', 'ערב טוב! 🌙 הגיע הזמן לסכם את היום. איך הרגשת? יש לך 3 דקות לעדכן את היומן שלך.', '🌙', '/journal'),
  (v_user_id, 'cycle', 'שמתי לב שהמחזורים שלך הולכים ומתקצרים - מ-5 ימים ל-3 ימים. זה תקין לגיל המעבר. הממוצע שלך: 28 ימים בין מחזורים.', '🌸', '/journal?tab=cycle'),
  (v_user_id, 'encouragement', 'כל הכבוד! 🎉 עשית דיווח כבר 15 ימים ברציפות! המעקב העקבי שלך עוזר לי לזהות דפוסים ולתת לך תובנות מדויקות יותר.', '🎉', NULL),
  (v_user_id, 'tip', 'טיפ מעליזה: שמתי לב שבימים שאת ישנה טוב יותר, יש לך פחות גלי חום ביום שאחרי. נסי לשמור על שגרת שינה קבועה - זה באמת עוזר! 😴', '💡', '/menopausal-sleep'),
  (v_user_id, 'tip', 'התובנה שלי: המצב רוח שלך משתפר משמעותית 2-3 ימים אחרי סוף המחזור. תכנני פעילויות חשובות לתקופה הזו! 📊', '📊', '/insights');
  
  -- העדפות (רק אם הטבלה קיימת)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'journal_preferences') THEN
    INSERT INTO public.journal_preferences (user_id, morning_reminder_time, evening_reminder_time, enable_morning_reminder, enable_evening_reminder, enable_cycle_predictions, enable_symptom_insights, preferred_language)
    VALUES (v_user_id, '08:00:00', '20:30:00', true, true, true, true, 'he');
    RAISE NOTICE 'העדפות יומן: הוכנס';
  ELSE
    RAISE NOTICE 'טבלת journal_preferences לא קיימת - דילוג';
  END IF;
  
  RAISE NOTICE '================================';
  RAISE NOTICE 'נתוני דמה הוכנסו בהצלחה! ✅';
  RAISE NOTICE '================================';
  RAISE NOTICE 'סיכום למשתמשת: inbald@sapir.ac.il';
  RAISE NOTICE 'דיווחים יומיים: 29 (15 ימים - בוקר+ערב)';
  RAISE NOTICE 'רשומות מחזור: 15 (3 מחזורים מלאים)';
  RAISE NOTICE 'הודעות עליזה: 6';
  RAISE NOTICE '================================';
  RAISE NOTICE 'עכשיו תוכלי לבדוק את כל הפיצ''רים!';
  RAISE NOTICE 'היכנסי כ-inbald@sapir.ac.il ולכי ל-/journal';
  RAISE NOTICE '================================';
END $$;

