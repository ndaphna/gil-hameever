-- Personalized Insights Table
-- Created: 2025-01-28
-- Purpose: Store daily AI-generated insights for users

-- ============================================
-- 1. PERSONALIZED_INSIGHTS Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.personalized_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  insight_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pattern', 'recommendation', 'warning', 'encouragement')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  category TEXT NOT NULL CHECK (category IN ('sleep', 'symptoms', 'mood', 'cycle', 'hormones', 'lifestyle', 'general')),
  actionable BOOLEAN DEFAULT FALSE,
  comparison_to_norm JSONB,
  actionable_steps JSONB,
  visual_data JSONB,
  aliza_message TEXT NOT NULL,
  analysis_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one insight per user per insight_id per analysis_date
  UNIQUE(user_id, insight_id, analysis_date)
);

-- ============================================
-- 2. Add date field to aliza_messages for daily tracking
-- ============================================
ALTER TABLE public.aliza_messages 
  ADD COLUMN IF NOT EXISTS message_date DATE DEFAULT CURRENT_DATE;

-- Create index for daily queries
CREATE INDEX IF NOT EXISTS idx_aliza_messages_message_date 
  ON public.aliza_messages(user_id, message_date);

-- ============================================
-- 3. RLS Policies
-- ============================================
ALTER TABLE public.personalized_insights ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own personalized insights" 
  ON public.personalized_insights
  FOR SELECT USING (auth.uid() = user_id);

-- Admin can insert/update insights (via service role)
-- Users cannot directly insert/update - only via cron job

-- ============================================
-- 4. Indexes for Performance
-- ============================================
CREATE INDEX idx_personalized_insights_user_id 
  ON public.personalized_insights(user_id);

CREATE INDEX idx_personalized_insights_analysis_date 
  ON public.personalized_insights(analysis_date);

CREATE INDEX idx_personalized_insights_user_date 
  ON public.personalized_insights(user_id, analysis_date DESC);

CREATE INDEX idx_personalized_insights_priority 
  ON public.personalized_insights(priority);

-- ============================================
-- 5. Update Trigger
-- ============================================
CREATE TRIGGER update_personalized_insights_updated_at 
  BEFORE UPDATE ON public.personalized_insights
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

