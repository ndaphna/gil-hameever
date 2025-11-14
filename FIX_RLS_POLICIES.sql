-- תיקון מקיף ל-RLS Policies של user_profile
-- הרץ את זה ב-Supabase SQL Editor

-- 1. הסר את כל ה-policies הישנים
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.user_profile;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profile;

-- 2. ודא שכל השדות קיימים
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
        -- העתק ערכים מ-current_tokens אם קיים
        UPDATE public.user_profile 
        SET tokens_remaining = COALESCE(current_tokens, 0)
        WHERE tokens_remaining IS NULL;
    END IF;
END $$;

-- 3. צור policies חדשים (משתמשים יכולים לראות את הפרופיל שלהם)
CREATE POLICY "Users can view own profile" ON public.user_profile
  FOR SELECT 
  USING (auth.uid() = id);

-- 4. צור policy למנהלים (מנהלים יכולים לראות את כל הפרופילים)
-- שים לב: policy זה יעבוד רק אם השדה is_admin קיים
CREATE POLICY "Admins can view all profiles" ON public.user_profile
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profile up
      WHERE up.id = auth.uid() 
      AND up.is_admin = TRUE
    )
  );

-- 5. Policy לעדכון - משתמשים יכולים לעדכן את הפרופיל שלהם
CREATE POLICY "Users can update own profile" ON public.user_profile
  FOR UPDATE 
  USING (auth.uid() = id);

-- 6. Policy לעדכון - מנהלים יכולים לעדכן כל פרופיל
CREATE POLICY "Admins can update any profile" ON public.user_profile
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_profile up
      WHERE up.id = auth.uid() 
      AND up.is_admin = TRUE
    )
  );

-- 7. Policy להכנסה - משתמשים יכולים ליצור את הפרופיל שלהם
CREATE POLICY "Users can insert own profile" ON public.user_profile
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- 8. צור אינדקסים
CREATE INDEX IF NOT EXISTS idx_user_profile_is_admin ON public.user_profile(is_admin);

-- 9. בדוק שהכל עובד - בדוק את המבנה
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'user_profile'
ORDER BY ordinal_position;

-- 10. בדוק את ה-policies
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
WHERE tablename = 'user_profile'
ORDER BY policyname;


