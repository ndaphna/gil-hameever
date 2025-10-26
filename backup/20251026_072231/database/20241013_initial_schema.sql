-- Initial Database Schema for Talking to Aliza
-- Created: 2024-10-13

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. USER_PROFILE Table
-- ============================================
CREATE TABLE public.user_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'trial' CHECK (subscription_tier IN ('trial', 'basic', 'premium')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'expired')),
  tokens_remaining INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. THREAD Table (Chat conversations)
-- ============================================
CREATE TABLE public.thread (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. MESSAGE Table (Chat messages)
-- ============================================
CREATE TABLE public.message (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.thread(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. EMOTION_ENTRY Table (Daily journal)
-- ============================================
CREATE TABLE public.emotion_entry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  emotion TEXT NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
  notes TEXT,
  ai_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. SUBSCRIPTION Table
-- ============================================
CREATE TABLE public.subscription (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('trial', 'basic', 'premium')),
  status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. TOKEN_LEDGER Table (Token usage tracking)
-- ============================================
CREATE TABLE public.token_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('chat', 'journal_analysis', 'refill')),
  tokens_used INTEGER NOT NULL,
  tokens_remaining INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RLS (Row Level Security) Policies
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_ledger ENABLE ROW LEVEL SECURITY;

-- USER_PROFILE Policies
CREATE POLICY "Users can view own profile" ON public.user_profile
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profile
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profile
  FOR INSERT WITH CHECK (auth.uid() = id);

-- THREAD Policies
CREATE POLICY "Users can view own threads" ON public.thread
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own threads" ON public.thread
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own threads" ON public.thread
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own threads" ON public.thread
  FOR DELETE USING (auth.uid() = user_id);

-- MESSAGE Policies
CREATE POLICY "Users can view own messages" ON public.message
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own messages" ON public.message
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own messages" ON public.message
  FOR DELETE USING (auth.uid() = user_id);

-- EMOTION_ENTRY Policies
CREATE POLICY "Users can view own emotions" ON public.emotion_entry
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own emotions" ON public.emotion_entry
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own emotions" ON public.emotion_entry
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own emotions" ON public.emotion_entry
  FOR DELETE USING (auth.uid() = user_id);

-- SUBSCRIPTION Policies
CREATE POLICY "Users can view own subscription" ON public.subscription
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own subscription" ON public.subscription
  FOR UPDATE USING (auth.uid() = user_id);

-- TOKEN_LEDGER Policies
CREATE POLICY "Users can view own token ledger" ON public.token_ledger
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- Indexes for Performance
-- ============================================
CREATE INDEX idx_thread_user_id ON public.thread(user_id);
CREATE INDEX idx_message_thread_id ON public.message(thread_id);
CREATE INDEX idx_message_user_id ON public.message(user_id);
CREATE INDEX idx_emotion_user_id ON public.emotion_entry(user_id);
CREATE INDEX idx_emotion_date ON public.emotion_entry(date);
CREATE INDEX idx_subscription_user_id ON public.subscription(user_id);
CREATE INDEX idx_token_ledger_user_id ON public.token_ledger(user_id);

-- ============================================
-- Functions & Triggers
-- ============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to relevant tables
CREATE TRIGGER update_user_profile_updated_at BEFORE UPDATE ON public.user_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_thread_updated_at BEFORE UPDATE ON public.thread
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emotion_entry_updated_at BEFORE UPDATE ON public.emotion_entry
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_updated_at BEFORE UPDATE ON public.subscription
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user_profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profile (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();





