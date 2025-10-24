-- Menopause Journal Tables
-- Created: 2024-10-24

-- ============================================
-- 1. DAILY_ENTRIES Table (Daily symptoms tracking)
-- ============================================
CREATE TABLE public.daily_entries (
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
  
  -- Ensure only one entry per user per date per time_of_day
  UNIQUE(user_id, date, time_of_day)
);

-- ============================================
-- 2. CYCLE_ENTRIES Table (Menstrual cycle tracking)
-- ============================================
CREATE TABLE public.cycle_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_period BOOLEAN NOT NULL DEFAULT FALSE,
  bleeding_intensity TEXT CHECK (bleeding_intensity IN ('light', 'medium', 'heavy')),
  symptoms TEXT[], -- Array of symptom IDs
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure only one entry per user per date
  UNIQUE(user_id, date)
);

-- ============================================
-- 3. ALIZA_MESSAGES Table (Smart messages from Aliza)
-- ============================================
CREATE TABLE public.aliza_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('morning', 'evening', 'cycle', 'encouragement', 'tip')),
  message TEXT NOT NULL,
  emoji TEXT NOT NULL,
  action_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS (Row Level Security) Policies
-- ============================================

-- Enable RLS on new tables
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cycle_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aliza_messages ENABLE ROW LEVEL SECURITY;

-- DAILY_ENTRIES Policies
CREATE POLICY "Users can view own daily entries" ON public.daily_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own daily entries" ON public.daily_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily entries" ON public.daily_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily entries" ON public.daily_entries
  FOR DELETE USING (auth.uid() = user_id);

-- CYCLE_ENTRIES Policies
CREATE POLICY "Users can view own cycle entries" ON public.cycle_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cycle entries" ON public.cycle_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycle entries" ON public.cycle_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cycle entries" ON public.cycle_entries
  FOR DELETE USING (auth.uid() = user_id);

-- ALIZA_MESSAGES Policies
CREATE POLICY "Users can view own aliza messages" ON public.aliza_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own aliza messages" ON public.aliza_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own aliza messages" ON public.aliza_messages
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_daily_entries_user_id ON public.daily_entries(user_id);
CREATE INDEX idx_daily_entries_date ON public.daily_entries(date);
CREATE INDEX idx_daily_entries_time_of_day ON public.daily_entries(time_of_day);

CREATE INDEX idx_cycle_entries_user_id ON public.cycle_entries(user_id);
CREATE INDEX idx_cycle_entries_date ON public.cycle_entries(date);
CREATE INDEX idx_cycle_entries_is_period ON public.cycle_entries(is_period);

CREATE INDEX idx_aliza_messages_user_id ON public.aliza_messages(user_id);
CREATE INDEX idx_aliza_messages_type ON public.aliza_messages(type);
CREATE INDEX idx_aliza_messages_created_at ON public.aliza_messages(created_at);

-- ============================================
-- Update Triggers
-- ============================================

-- Apply update trigger to new tables
CREATE TRIGGER update_daily_entries_updated_at BEFORE UPDATE ON public.daily_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cycle_entries_updated_at BEFORE UPDATE ON public.cycle_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
