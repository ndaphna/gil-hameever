-- ============================================
-- Fix Schema Consistency Issues
-- ============================================

-- 1. Rename full_name to name in user_profile (if exists)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile' 
    AND column_name = 'full_name'
  ) THEN
    ALTER TABLE public.user_profile RENAME COLUMN full_name TO name;
  END IF;
END $$;

-- 2. Update the trigger function to use 'name'
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profile (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Rename entry_date to date in emotion_entry (if exists)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'emotion_entry' 
    AND column_name = 'entry_date'
  ) THEN
    ALTER TABLE public.emotion_entry RENAME COLUMN entry_date TO date;
  END IF;
END $$;

-- 5. Rename tokens_remaining to current_tokens in user_profile (if exists)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile' 
    AND column_name = 'tokens_remaining'
  ) THEN
    ALTER TABLE public.user_profile RENAME COLUMN tokens_remaining TO current_tokens;
  END IF;
END $$;

-- 6. Rename subscription_tier to subscription_status if needed
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile' 
    AND column_name = 'subscription_tier'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile' 
    AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE public.user_profile RENAME COLUMN subscription_tier TO subscription_status;
  END IF;
END $$;

-- 7. Add color column to emotion_entry if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'emotion_entry' 
    AND column_name = 'color'
  ) THEN
    ALTER TABLE public.emotion_entry ADD COLUMN color TEXT;
  END IF;
END $$;

-- 8. Create user_profile for existing auth users who don't have one
INSERT INTO public.user_profile (id, email, name)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'name', au.raw_user_meta_data->>'full_name', split_part(au.email, '@', 1))
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profile up WHERE up.id = au.id
)
ON CONFLICT (id) DO NOTHING;


