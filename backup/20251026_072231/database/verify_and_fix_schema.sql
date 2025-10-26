-- ============================================
-- Verify and Fix Database Schema
-- Run this to ensure all tables are properly configured
-- ============================================

-- 1. Verify user_profile table structure
DO $$ 
BEGIN
  -- Ensure 'name' column exists (not 'full_name')
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile' 
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.user_profile RENAME COLUMN full_name TO name;
  END IF;

  -- Ensure 'current_tokens' column exists (not 'tokens_remaining')
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile' 
    AND column_name = 'tokens_remaining'
  ) THEN
    ALTER TABLE public.user_profile RENAME COLUMN tokens_remaining TO current_tokens;
  END IF;

  -- subscription_status should already exist from initial schema
  -- If it doesn't exist, it will be created with proper constraints
END $$;

-- 2. Verify emotion_entry table structure
DO $$ 
BEGIN
  -- Ensure 'date' column exists (not 'entry_date')
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'emotion_entry' 
    AND column_name = 'entry_date'
  ) THEN
    ALTER TABLE public.emotion_entry RENAME COLUMN entry_date TO date;
  END IF;

  -- Ensure 'color' column exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'emotion_entry' 
    AND column_name = 'color'
  ) THEN
    ALTER TABLE public.emotion_entry ADD COLUMN color TEXT;
  END IF;
END $$;

-- 3. Update the trigger function to use correct column names
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profile (id, email, name, subscription_tier, subscription_status, current_tokens)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(
      NEW.raw_user_meta_data->>'name', 
      NEW.raw_user_meta_data->>'full_name', 
      split_part(NEW.email, '@', 1),
      'משתמשת'
    ),
    'trial',
    'active',
    500
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Create missing profiles for existing users
INSERT INTO public.user_profile (id, email, name, subscription_tier, subscription_status, current_tokens)
SELECT 
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'name', 
    au.raw_user_meta_data->>'full_name', 
    split_part(au.email, '@', 1),
    'משתמשת'
  ),
  'trial',
  'active',
  500
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profile up WHERE up.id = au.id
)
ON CONFLICT (id) DO UPDATE SET
  subscription_tier = COALESCE(EXCLUDED.subscription_tier, 'trial'),
  subscription_status = COALESCE(EXCLUDED.subscription_status, 'active'),
  current_tokens = COALESCE(EXCLUDED.current_tokens, 500);

-- 6. Verify all relationships exist
DO $$
BEGIN
  -- Check if user_profile references auth.users correctly
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'user_profile' 
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name = 'id'
  ) THEN
    ALTER TABLE public.user_profile 
      ADD CONSTRAINT user_profile_id_fkey 
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Check if emotion_entry references user_profile correctly
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    WHERE tc.table_name = 'emotion_entry' 
    AND tc.constraint_type = 'FOREIGN KEY'
    AND kcu.column_name = 'user_id'
  ) THEN
    ALTER TABLE public.emotion_entry 
      ADD CONSTRAINT emotion_entry_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES public.user_profile(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 7. Verify RLS is enabled and policies exist
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_entry ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies for user_profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profile;

CREATE POLICY "Users can view own profile" ON public.user_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profile
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profile
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Recreate RLS policies for emotion_entry
DROP POLICY IF EXISTS "Users can view own emotions" ON public.emotion_entry;
DROP POLICY IF EXISTS "Users can create own emotions" ON public.emotion_entry;
DROP POLICY IF EXISTS "Users can update own emotions" ON public.emotion_entry;
DROP POLICY IF EXISTS "Users can delete own emotions" ON public.emotion_entry;

CREATE POLICY "Users can view own emotions" ON public.emotion_entry
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own emotions" ON public.emotion_entry
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emotions" ON public.emotion_entry
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own emotions" ON public.emotion_entry
  FOR DELETE USING (auth.uid() = user_id);

-- Display final status
SELECT 
  'user_profile' as table_name,
  COUNT(*) as row_count
FROM public.user_profile
UNION ALL
SELECT 
  'emotion_entry' as table_name,
  COUNT(*) as row_count
FROM public.emotion_entry;

