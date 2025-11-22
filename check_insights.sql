-- Script to check insights for user nitzandaphna@gmail.com
-- Run this in Supabase SQL Editor

-- 1. Find user_id for the email
SELECT id, email, name, full_name 
FROM public.user_profile 
WHERE email = 'nitzandaphna@gmail.com';

-- 2. Check if there are ANY insights for this user (replace USER_ID with actual ID from step 1)
-- SELECT * 
-- FROM public.personalized_insights 
-- WHERE user_id = 'USER_ID_FROM_STEP_1'
-- ORDER BY analysis_date DESC, created_at DESC;

-- 3. Check insights count by date
-- SELECT 
--   analysis_date,
--   COUNT(*) as insights_count,
--   STRING_AGG(title, ', ') as titles
-- FROM public.personalized_insights 
-- WHERE user_id = 'USER_ID_FROM_STEP_1'
-- GROUP BY analysis_date
-- ORDER BY analysis_date DESC;

-- 4. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'personalized_insights';

-- 5. Check if table exists and has data
SELECT 
  COUNT(*) as total_insights,
  COUNT(DISTINCT user_id) as unique_users,
  MIN(analysis_date) as earliest_date,
  MAX(analysis_date) as latest_date
FROM public.personalized_insights;





