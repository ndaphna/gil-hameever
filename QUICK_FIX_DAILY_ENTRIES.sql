-- תיקון מהיר לבעיית שמירת דיווחים
-- העתק והרץ ב-Supabase SQL Editor

-- יצירת user_profile אם לא קיים
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
ON CONFLICT (id) DO NOTHING;

-- וידוא שהטבלה קיימת
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

-- הפעלת RLS
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;

-- מחיקת פוליסות ישנות
DROP POLICY IF EXISTS "Users can view own daily entries" ON public.daily_entries;
DROP POLICY IF EXISTS "Users can create own daily entries" ON public.daily_entries;
DROP POLICY IF EXISTS "Users can update own daily entries" ON public.daily_entries;
DROP POLICY IF EXISTS "Users can delete own daily entries" ON public.daily_entries;

-- יצירת פוליסות חדשות
CREATE POLICY "Users can view own daily entries" ON public.daily_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own daily entries" ON public.daily_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily entries" ON public.daily_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily entries" ON public.daily_entries
  FOR DELETE USING (auth.uid() = user_id);

-- בדיקה אם עובד
SELECT 'SUCCESS! ✅ Now try saving a daily entry!' as result;
