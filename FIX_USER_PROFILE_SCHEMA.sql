-- תיקון אוטומטי לבעיית user_profile
-- תעתיקי והריצי ב-Supabase SQL Editor

-- 1. בדיקה מה יש בטבלת user_profile
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile'
) as user_profile_exists;

-- 2. אם הטבלה לא קיימת, צרי אותה
CREATE TABLE IF NOT EXISTS public.user_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  birth_year INTEGER,
  last_period_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. אם הטבלה קיימת אבל חסרות עמודות, הוסף אותן
DO $$
BEGIN
    -- הוספת עמודות אם לא קיימות
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profile' AND column_name = 'full_name') THEN
        ALTER TABLE public.user_profile ADD COLUMN full_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profile' AND column_name = 'gender') THEN
        ALTER TABLE public.user_profile ADD COLUMN gender TEXT CHECK (gender IN ('male', 'female', 'other'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profile' AND column_name = 'birth_year') THEN
        ALTER TABLE public.user_profile ADD COLUMN birth_year INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profile' AND column_name = 'last_period_date') THEN
        ALTER TABLE public.user_profile ADD COLUMN last_period_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profile' AND column_name = 'created_at') THEN
        ALTER TABLE public.user_profile ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profile' AND column_name = 'updated_at') THEN
        ALTER TABLE public.user_profile ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- 4. הפעלת RLS על user_profile
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

-- 5. יצירת פוליסות ל-user_profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profile;

CREATE POLICY "Users can view own profile" ON public.user_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profile
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profile
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 6. יצירת user_profile למשתמש שלך
INSERT INTO public.user_profile (id, full_name, gender, birth_year, created_at, last_period_date)
SELECT 
    id,
    'ענבל דוד' as full_name,
    'female' as gender,
    1975 as birth_year,
    NOW() as created_at,
    CURRENT_DATE - INTERVAL '45 days' as last_period_date
FROM auth.users 
WHERE email = 'inbald@sapir.ac.il'
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    gender = EXCLUDED.gender,
    birth_year = EXCLUDED.birth_year,
    last_period_date = EXCLUDED.last_period_date,
    updated_at = NOW();

-- 7. בדיקה שהכל עבד
SELECT 'user_profile created/updated successfully!' as result;
SELECT * FROM public.user_profile WHERE id IN (
    SELECT id FROM auth.users WHERE email = 'inbald@sapir.ac.il'
);
