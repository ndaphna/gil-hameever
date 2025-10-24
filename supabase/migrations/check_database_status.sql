-- ============================================
-- Check Database Status
-- Run this to verify your database is properly configured
-- ============================================

-- 1. Check all tables exist
SELECT 
  'Tables Check' as check_type,
  table_name,
  CASE 
    WHEN table_name IN ('user_profile', 'emotion_entry', 'thread', 'message', 'subscription', 'token_ledger')
    THEN '✓ EXISTS'
    ELSE '✗ UNEXPECTED'
  END as status
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Check user_profile columns
SELECT 
  'user_profile Columns' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'user_profile'
ORDER BY ordinal_position;

-- 3. Check emotion_entry columns
SELECT 
  'emotion_entry Columns' as check_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'emotion_entry'
ORDER BY ordinal_position;

-- 4. Check foreign key relationships
SELECT
  'Foreign Keys' as check_type,
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  '✓ OK' as status
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- 5. Check RLS (Row Level Security) is enabled
SELECT
  'RLS Status' as check_type,
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✓ ENABLED'
    ELSE '✗ DISABLED'
  END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- 6. Check RLS policies
SELECT
  'RLS Policies' as check_type,
  schemaname,
  tablename,
  policyname,
  cmd as command_type,
  '✓ EXISTS' as status
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- 7. Count records in each table
SELECT 
  'Record Counts' as check_type,
  'user_profile' as table_name,
  COUNT(*) as record_count
FROM public.user_profile
UNION ALL
SELECT 
  'Record Counts',
  'emotion_entry',
  COUNT(*)
FROM public.emotion_entry
UNION ALL
SELECT 
  'Record Counts',
  'thread',
  COUNT(*)
FROM public.thread
UNION ALL
SELECT 
  'Record Counts',
  'message',
  COUNT(*)
FROM public.message;

-- 8. Check for users without profiles
SELECT
  'Users Without Profiles' as check_type,
  au.id,
  au.email,
  '✗ MISSING PROFILE' as status
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profile up WHERE up.id = au.id
);

-- 9. Check triggers
SELECT
  'Triggers' as check_type,
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  '✓ EXISTS' as status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- 10. Summary Report
SELECT 
  '=== DATABASE STATUS SUMMARY ===' as summary,
  (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public') as total_tables,
  (SELECT COUNT(*) FROM public.user_profile) as user_profiles,
  (SELECT COUNT(*) FROM public.emotion_entry) as emotion_entries,
  (SELECT COUNT(*) FROM auth.users WHERE NOT EXISTS (SELECT 1 FROM public.user_profile up WHERE up.id = auth.users.id)) as users_without_profiles,
  CASE 
    WHEN (SELECT COUNT(*) FROM auth.users WHERE NOT EXISTS (SELECT 1 FROM public.user_profile up WHERE up.id = auth.users.id)) = 0
    THEN '✓ ALL USERS HAVE PROFILES'
    ELSE '✗ SOME USERS MISSING PROFILES - RUN verify_and_fix_schema.sql'
  END as profile_status;




