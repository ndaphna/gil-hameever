-- Fix daily_entries schema
-- This script ensures the daily_entries table has the correct structure

-- ============================================
-- Drop and recreate the daily_entries table with correct schema
-- ============================================

-- First, drop the existing table if it exists
DROP TABLE IF EXISTS public.daily_entries CASCADE;

-- Recreate the table with the correct schema
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
  sleep_hours DECIMAL(3,1) CHECK (sleep_hours >= 0 AND sleep_hours <= 24),
  water_intake INTEGER CHECK (water_intake >= 0 AND water_intake <= 20),
  exercise_minutes INTEGER CHECK (exercise_minutes >= 0 AND exercise_minutes <= 480),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure only one entry per user per date per time_of_day
  UNIQUE(user_id, date, time_of_day)
);

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE public.daily_entries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create RLS Policies
-- ============================================
CREATE POLICY "Users can view own daily entries" ON public.daily_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own daily entries" ON public.daily_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily entries" ON public.daily_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily entries" ON public.daily_entries
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Create Indexes
-- ============================================
CREATE INDEX idx_daily_entries_user_id ON public.daily_entries(user_id);
CREATE INDEX idx_daily_entries_date ON public.daily_entries(date);
CREATE INDEX idx_daily_entries_time_of_day ON public.daily_entries(time_of_day);

-- ============================================
-- Create Update Trigger
-- ============================================
CREATE TRIGGER update_daily_entries_updated_at BEFORE UPDATE ON public.daily_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

