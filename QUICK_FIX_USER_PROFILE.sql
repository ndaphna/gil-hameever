-- תיקון מהיר לבעיות user_profile
-- הרץ את זה ב-Supabase SQL Editor

-- 1. הוסף שדה is_admin אם לא קיים
ALTER TABLE public.user_profile 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- 2. ודא שכל השדות הנדרשים קיימים
DO $$
BEGIN
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
        -- העתק ערכים מ-current_tokens אם קיים
        UPDATE public.user_profile 
        SET tokens_remaining = current_tokens 
        WHERE tokens_remaining IS NULL AND current_tokens IS NOT NULL;
    END IF;
END $$;

-- 3. הסר את כל ה-policies הישנים
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.user_profile;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profile;

-- 4. צור policies חדשים (משתמשים יכולים לראות את הפרופיל שלהם)
CREATE POLICY "Users can view own profile" ON public.user_profile
  FOR SELECT 
  USING (auth.uid() = id);

-- 5. צור function לבדיקת מנהל (יותר יעיל)
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

-- 6. צור policy למנהלים (מנהלים יכולים לראות את כל הפרופילים)
CREATE POLICY "Admins can view all profiles" ON public.user_profile
  FOR SELECT 
  USING (public.is_admin_user(auth.uid()));

-- 7. Policy לעדכון - משתמשים יכולים לעדכן את הפרופיל שלהם
CREATE POLICY "Users can update own profile" ON public.user_profile
  FOR UPDATE 
  USING (auth.uid() = id);

-- 8. Policy לעדכון - מנהלים יכולים לעדכן כל פרופיל
CREATE POLICY "Admins can update any profile" ON public.user_profile
  FOR UPDATE 
  USING (public.is_admin_user(auth.uid()));

-- 9. Policy להכנסה - משתמשים יכולים ליצור את הפרופיל שלהם
CREATE POLICY "Users can insert own profile" ON public.user_profile
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 10. צור אינדקסים
CREATE INDEX IF NOT EXISTS idx_user_profile_is_admin ON public.user_profile(is_admin);

-- 11. בדוק את המבנה
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_profile'
ORDER BY ordinal_position;

