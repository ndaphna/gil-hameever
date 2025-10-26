-- Check Journal Tables Status
-- Run this to see the current state of your journal tables

-- ============================================
-- 1. Check if tables exist
-- ============================================
SELECT 
  'Table Existence Check' as check_type,
  table_name,
  CASE 
    WHEN table_name IS NOT NULL THEN '✅ EXISTS'
    ELSE '❌ MISSING'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('daily_entries', 'cycle_entries', 'aliza_messages', 'journal_trends', 'journal_preferences')
ORDER BY table_name;

-- ============================================
-- 2. Check cycle_entries columns
-- ============================================
SELECT 
  'cycle_entries Columns' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'cycle_entries'
ORDER BY ordinal_position;

-- ============================================
-- 3. Check daily_entries columns
-- ============================================
SELECT 
  'daily_entries Columns' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'daily_entries'
ORDER BY ordinal_position;

-- ============================================
-- 4. Check RLS policies
-- ============================================
SELECT 
  'RLS Policies' as check_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('daily_entries', 'cycle_entries', 'aliza_messages')
ORDER BY tablename, policyname;

-- ============================================
-- 5. Check indexes
-- ============================================
SELECT 
  'Indexes' as check_type,
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('daily_entries', 'cycle_entries', 'aliza_messages')
ORDER BY tablename, indexname;

-- ============================================
-- 6. Check triggers
-- ============================================
SELECT 
  'Triggers' as check_type,
  trigger_schema,
  trigger_name,
  event_object_table as table_name,
  action_timing,
  event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN ('daily_entries', 'cycle_entries', 'aliza_messages')
ORDER BY event_object_table, trigger_name;

-- ============================================
-- 7. Check for the critical 'date' column
-- ============================================
SELECT 
  'Critical Date Column Check' as check_type,
  table_name,
  CASE 
    WHEN EXISTS (
      SELECT 1 
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
        AND table_name = t.table_name 
        AND column_name = 'date'
    ) THEN '✅ date column EXISTS'
    ELSE '❌ date column MISSING'
  END as status
FROM (
  SELECT 'daily_entries' as table_name
  UNION
  SELECT 'cycle_entries' as table_name
) t;

-- ============================================
-- 8. Count entries (if tables exist)
-- ============================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'daily_entries') THEN
    RAISE NOTICE 'daily_entries count: %', (SELECT COUNT(*) FROM public.daily_entries);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cycle_entries') THEN
    RAISE NOTICE 'cycle_entries count: %', (SELECT COUNT(*) FROM public.cycle_entries);
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'aliza_messages') THEN
    RAISE NOTICE 'aliza_messages count: %', (SELECT COUNT(*) FROM public.aliza_messages);
  END IF;
END $$;

-- ============================================
-- Summary
-- ============================================
SELECT 
  'Summary' as report_section,
  'Review the results above to identify any issues' as message,
  'Look for MISSING tables, columns, policies, or indexes' as action_needed;

