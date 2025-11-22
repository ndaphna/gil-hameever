-- תיקון סופי ל-RLS Policies - גרסה משופרת
-- הרץ את זה ב-Supabase SQL Editor

-- 1. ודא שכל השדות קיימים
DO $$
BEGIN
    -- is_admin
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profile' 
        AND column_name = 'is_admin'
    ) THEN
        ALTER TABLE public.user_profile ADD COLUMN is_admin BOOLEAN DEFAULT FALSE NOT NULL;
    END IF;

    -- full_name
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profile' 
        AND column_name = 'full_name'
    ) THEN
        ALTER TABLE public.user_profile ADD COLUMN full_name TEXT;
    END IF;

    -- tokens_remaining
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'user_profile' 
        AND column_name = 'tokens_remaining'
    ) THEN
        ALTER TABLE public.user_profile ADD COLUMN tokens_remaining INTEGER;
        UPDATE public.user_profile 
        SET tokens_remaining = COALESCE(current_tokens, 0)
        WHERE tokens_remaining IS NULL;
    END IF;
END $$;

-- 2. הסר את כל ה-policies הישנים
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.user_profile;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profile;

-- 3. צור function לבדיקת מנהל (יותר יעיל מ-subquery)
CREATE OR REPLACE FUNCTION public.is_admin_user(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.user_profile WHERE id = user_id),
    FALSE
  );
$$;

-- 4. Policy בסיסי - משתמשים יכולים לראות את הפרופיל שלהם
CREATE POLICY "Users can view own profile" ON public.user_profile
  FOR SELECT 
  USING (auth.uid() = id);

-- 5. Policy למנהלים - מנהלים יכולים לראות את כל הפרופילים
-- שים לב: policy זה יעבוד רק אם השדה is_admin קיים
CREATE POLICY "Admins can view all profiles" ON public.user_profile
  FOR SELECT 
  USING (public.is_admin_user(auth.uid()));

-- 6. Policy לעדכון - משתמשים יכולים לעדכן את הפרופיל שלהם
CREATE POLICY "Users can update own profile" ON public.user_profile
  FOR UPDATE 
  USING (auth.uid() = id);

-- 7. Policy לעדכון - מנהלים יכולים לעדכן כל פרופיל
CREATE POLICY "Admins can update any profile" ON public.user_profile
  FOR UPDATE 
  USING (public.is_admin_user(auth.uid()));

-- 8. Policy להכנסה - משתמשים יכולים ליצור את הפרופיל שלהם
CREATE POLICY "Users can insert own profile" ON public.user_profile
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 9. צור אינדקסים
CREATE INDEX IF NOT EXISTS idx_user_profile_is_admin ON public.user_profile(is_admin);

-- 10. בדוק שהכל עובד
SELECT 
    'Policies created successfully!' as status,
    COUNT(*) as policy_count
FROM pg_policies
WHERE tablename = 'user_profile';








