-- Journal Enhancement Fields
-- Created: 2025-01-26
-- Purpose: Add fields to support enhanced journal features

-- ============================================
-- 1. Add fields to daily_entries for better tracking
-- ============================================
ALTER TABLE public.daily_entries ADD COLUMN IF NOT EXISTS 
  sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24);

ALTER TABLE public.daily_entries ADD COLUMN IF NOT EXISTS 
  water_intake INTEGER CHECK (water_intake >= 0 AND water_intake <= 20);

ALTER TABLE public.daily_entries ADD COLUMN IF NOT EXISTS 
  exercise_minutes INTEGER CHECK (exercise_minutes >= 0 AND exercise_minutes <= 480);

-- ============================================
-- 2. Add fields to cycle_entries for better insights
-- ============================================
ALTER TABLE public.cycle_entries ADD COLUMN IF NOT EXISTS 
  mood_level TEXT CHECK (mood_level IN ('very_low', 'low', 'neutral', 'good', 'excellent'));

ALTER TABLE public.cycle_entries ADD COLUMN IF NOT EXISTS 
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10);

-- ============================================
-- 3. Create a trends table for storing calculated insights
-- ============================================
CREATE TABLE IF NOT EXISTS public.journal_trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  trend_type TEXT NOT NULL CHECK (trend_type IN ('sleep', 'mood', 'symptoms', 'cycle', 'energy')),
  period TEXT NOT NULL CHECK (period IN ('week', 'month', 'quarter')),
  trend_direction TEXT CHECK (trend_direction IN ('improving', 'stable', 'declining')),
  trend_data JSONB NOT NULL,
  insights TEXT[],
  calculated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint for one trend per user per type per period
  UNIQUE(user_id, trend_type, period)
);

-- ============================================
-- 4. Add reminder preferences to aliza_messages
-- ============================================
ALTER TABLE public.aliza_messages ADD COLUMN IF NOT EXISTS 
  reminder_time TIME;

ALTER TABLE public.aliza_messages ADD COLUMN IF NOT EXISTS 
  is_read BOOLEAN DEFAULT FALSE;

ALTER TABLE public.aliza_messages ADD COLUMN IF NOT EXISTS 
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium';

-- ============================================
-- 5. Create user journal preferences table
-- ============================================
CREATE TABLE IF NOT EXISTS public.journal_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  morning_reminder_time TIME DEFAULT '08:00:00',
  evening_reminder_time TIME DEFAULT '20:00:00',
  enable_morning_reminder BOOLEAN DEFAULT TRUE,
  enable_evening_reminder BOOLEAN DEFAULT TRUE,
  enable_cycle_predictions BOOLEAN DEFAULT TRUE,
  enable_symptom_insights BOOLEAN DEFAULT TRUE,
  preferred_language TEXT DEFAULT 'he',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- One preference per user
  UNIQUE(user_id)
);

-- ============================================
-- 6. RLS Policies for new tables
-- ============================================
ALTER TABLE public.journal_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_preferences ENABLE ROW LEVEL SECURITY;

-- Journal Trends Policies
CREATE POLICY "Users can view own journal trends" ON public.journal_trends
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journal trends" ON public.journal_trends
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal trends" ON public.journal_trends
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journal trends" ON public.journal_trends
  FOR DELETE USING (auth.uid() = user_id);

-- Journal Preferences Policies
CREATE POLICY "Users can view own journal preferences" ON public.journal_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own journal preferences" ON public.journal_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journal preferences" ON public.journal_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- ============================================
-- 7. Indexes for performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_journal_trends_user_type ON public.journal_trends(user_id, trend_type);
CREATE INDEX IF NOT EXISTS idx_journal_trends_calculated ON public.journal_trends(calculated_at);
CREATE INDEX IF NOT EXISTS idx_aliza_messages_is_read ON public.aliza_messages(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_aliza_messages_priority ON public.aliza_messages(user_id, priority);

-- ============================================
-- 8. Update triggers for new tables
-- ============================================
CREATE TRIGGER update_journal_preferences_updated_at BEFORE UPDATE ON public.journal_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 9. Default preferences for existing users
-- ============================================
-- Insert default preferences for users who don't have them yet
INSERT INTO public.journal_preferences (user_id)
SELECT id FROM public.user_profile
WHERE id NOT IN (SELECT user_id FROM public.journal_preferences)
ON CONFLICT DO NOTHING;
