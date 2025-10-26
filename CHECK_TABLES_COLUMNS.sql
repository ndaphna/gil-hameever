-- ================================
-- בדיקת עמודות בטבלאות היומן
-- הריצי את זה כדי לראות אילו עמודות יש לך
--
-- 💡 למה זה שימושי?
-- לפני הכנסת נתוני דמה - בדקי שהעמודות קיימות
-- אם חסרות עמודות - תדעי מה צריך לתקן
-- ================================

-- בדיקת daily_entries
SELECT 'daily_entries' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'daily_entries'
ORDER BY ordinal_position;

-- בדיקת cycle_entries
SELECT 'cycle_entries' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'cycle_entries'
ORDER BY ordinal_position;

-- בדיקת aliza_messages
SELECT 'aliza_messages' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'aliza_messages'
ORDER BY ordinal_position;

-- בדיקת journal_preferences
SELECT 'journal_preferences' as table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'journal_preferences'
ORDER BY ordinal_position;

