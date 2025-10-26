-- Fix cycle_entries schema
-- This script ensures the cycle_entries table has the correct structure

-- ============================================
-- Drop and recreate the cycle_entries table with correct schema
-- ============================================

-- First, drop the existing table if it exists
DROP TABLE IF EXISTS public.cycle_entries CASCADE;

-- Recreate the table with the correct schema
CREATE TABLE public.cycle_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_period BOOLEAN NOT NULL DEFAULT FALSE,
  bleeding_intensity TEXT CHECK (bleeding_intensity IN ('light', 'medium', 'heavy')),
  symptoms TEXT[], -- Array of symptom IDs
  notes TEXT,
  mood_level TEXT CHECK (mood_level IN ('very_low', 'low', 'neutral', 'good', 'excellent')),
  pain_level INTEGER CHECK (pain_level >= 0 AND pain_level <= 10),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure only one entry per user per date
  UNIQUE(user_id, date)
);

-- ============================================
-- Enable RLS
-- ============================================
ALTER TABLE public.cycle_entries ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Create RLS Policies
-- ============================================
CREATE POLICY "Users can view own cycle entries" ON public.cycle_entries
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own cycle entries" ON public.cycle_entries
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cycle entries" ON public.cycle_entries
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cycle entries" ON public.cycle_entries
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- Create Indexes
-- ============================================
CREATE INDEX idx_cycle_entries_user_id ON public.cycle_entries(user_id);
CREATE INDEX idx_cycle_entries_date ON public.cycle_entries(date);
CREATE INDEX idx_cycle_entries_is_period ON public.cycle_entries(is_period);

-- ============================================
-- Create Update Trigger
-- ============================================
CREATE TRIGGER update_cycle_entries_updated_at BEFORE UPDATE ON public.cycle_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

