-- תיקון מהיר לכל הבעיות
-- תעתיקי והריצי ב-Supabase SQL Editor

-- 1. צור/תקן user_profile
CREATE TABLE IF NOT EXISTS public.user_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  birth_year INTEGER,
  last_period_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- הוסף עמודות אם חסרות
DO $$
BEGIN
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

-- 2. הפעל RLS
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;

-- 3. צור פוליסות
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profile;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profile;

CREATE POLICY "Users can view own profile" ON public.user_profile FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.user_profile FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profile FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. צור user_profile למשתמש שלך
INSERT INTO public.user_profile (id, full_name, gender, birth_year, created_at, last_period_date)
SELECT id, 'ענבל דוד', 'female', 1975, NOW(), CURRENT_DATE - INTERVAL '45 days'
FROM auth.users WHERE email = 'inbald@sapir.ac.il'
ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    gender = EXCLUDED.gender,
    birth_year = EXCLUDED.birth_year,
    last_period_date = EXCLUDED.last_period_date,
    updated_at = NOW();

-- 5. צור daily_entries אם לא קיימת
CREATE TABLE IF NOT EXISTS public.daily_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  time_of_day TEXT NOT NULL CHECK (time_of_day IN ('morning', 'evening')),
  sleep_quality TEXT CHECK (sleep_quality IN ('poor', 'fair', 'good')),
  woke_up_night BOOLEAN DEFAULT FALSE,
  night_sweats BOOLEAN DEFAULT FALSE,
  energy_level TEXT CHECK (energy_level IN ('low', 'medium', 'high')),
  mood TEXT CHECK (mood IN ('calm', 'irritated', 'sad', 'happy', 'frustrated')),
  hot_flashes BOOLEAN DEFAULT FALSE,
  dryness BOOLEAN DEFAULT FALSE,
  pain BOOLEAN DEFAULT FALSE,
  bloating BOOLEAN DEFAULT FALSE,
  concentration_difficulty BOOLEAN DEFAULT FALSE,
  sleep_issues BOOLEAN DEFAULT FALSE,
  sexual_desire BOOLEAN DEFAULT FALSE,
  daily_insight TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date, time_of_day)
);

-- 6. הפעל RLS על daily_entries
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;

-- 7. צור פוליסות ל-daily_entries
DROP POLICY IF EXISTS "Users can view own daily entries" ON public.daily_entries;
DROP POLICY IF EXISTS "Users can create own daily entries" ON public.daily_entries;
DROP POLICY IF EXISTS "Users can update own daily entries" ON public.daily_entries;
DROP POLICY IF EXISTS "Users can delete own daily entries" ON public.daily_entries;

CREATE POLICY "Users can view own daily entries" ON public.daily_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own daily entries" ON public.daily_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own daily entries" ON public.daily_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own daily entries" ON public.daily_entries FOR DELETE USING (auth.uid() = user_id);

-- 8. בדיקה סופית
SELECT 'SUCCESS! ✅ Everything is ready!' as result;
SELECT 'user_profile:' as table_name, count(*) as count FROM public.user_profile
UNION ALL
SELECT 'daily_entries:', count(*) FROM public.daily_entries;
