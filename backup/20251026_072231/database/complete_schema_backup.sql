-- Complete Database Schema Backup for Gil Hameever
-- Generated: 2025-01-26 07:22:31
-- Project: Menopause Support Platform with AI Chat

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- User Profile Table
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

-- Chat Threads Table
CREATE TABLE public.thread (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE public.message (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES public.thread(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Emotion Entry Table (Journal)
CREATE TABLE public.emotion_entry (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  emotion TEXT NOT NULL,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5),
  notes TEXT,
  ai_summary TEXT,
  color TEXT DEFAULT '#FF6B6B',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscription Table
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

-- Token Ledger Table
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
-- NOTIFICATION SYSTEM TABLES
-- ============================================

-- Notification Preferences Table
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  email JSONB NOT NULL DEFAULT '{"enabled": true, "frequency": "weekly", "time": "09:00"}',
  whatsapp JSONB NOT NULL DEFAULT '{"enabled": false, "frequency": "daily", "time": "20:00"}',
  push JSONB NOT NULL DEFAULT '{"enabled": true, "frequency": "daily", "time": "09:00"}',
  categories JSONB NOT NULL DEFAULT '{"reminders": true, "insights": true, "encouragements": true, "warnings": true}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Notification Templates Table
CREATE TABLE public.notification_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_id TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('reminder', 'insight', 'encouragement', 'warning')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL,
  triggers TEXT[] NOT NULL DEFAULT '{}',
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scheduled Notifications Table
CREATE TABLE public.scheduled_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  template_id TEXT NOT NULL,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')),
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'push')),
  content JSONB NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification History Table
CREATE TABLE public.notification_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'push')),
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed', 'delivered', 'read')),
  sent_at TIMESTAMPTZ NOT NULL,
  read_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insight Analysis Table
CREATE TABLE public.insight_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
  insights_count INTEGER DEFAULT 0,
  high_priority_count INTEGER DEFAULT 0,
  analysis_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_thread_user_id ON public.thread(user_id);
CREATE INDEX idx_message_thread_id ON public.message(thread_id);
CREATE INDEX idx_message_user_id ON public.message(user_id);
CREATE INDEX idx_emotion_user_id ON public.emotion_entry(user_id);
CREATE INDEX idx_emotion_date ON public.emotion_entry(date);
CREATE INDEX idx_subscription_user_id ON public.subscription(user_id);
CREATE INDEX idx_token_ledger_user_id ON public.token_ledger(user_id);
CREATE INDEX idx_scheduled_notifications_user_id ON public.scheduled_notifications(user_id);
CREATE INDEX idx_scheduled_notifications_scheduled_for ON public.scheduled_notifications(scheduled_for);
CREATE INDEX idx_scheduled_notifications_status ON public.scheduled_notifications(status);
CREATE INDEX idx_notification_history_user_id ON public.notification_history(user_id);
CREATE INDEX idx_notification_history_sent_at ON public.notification_history(sent_at);
CREATE INDEX idx_insight_analysis_user_id ON public.insight_analysis(user_id);
CREATE INDEX idx_insight_analysis_type ON public.insight_analysis(type);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- Function to get pending notifications
CREATE OR REPLACE FUNCTION get_pending_notifications()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  template_id TEXT,
  scheduled_for TIMESTAMPTZ,
  channel TEXT,
  content JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    sn.id,
    sn.user_id,
    sn.template_id,
    sn.scheduled_for,
    sn.channel,
    sn.content
  FROM public.scheduled_notifications sn
  WHERE sn.status = 'pending' 
    AND sn.scheduled_for <= NOW()
  ORDER BY sn.scheduled_for ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to mark notification as sent
CREATE OR REPLACE FUNCTION mark_notification_sent(notification_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.scheduled_notifications 
  SET status = 'sent', sent_at = NOW(), updated_at = NOW()
  WHERE id = notification_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user notification preferences
CREATE OR REPLACE FUNCTION get_user_notification_preferences(user_uuid UUID)
RETURNS TABLE (
  email JSONB,
  whatsapp JSONB,
  push JSONB,
  categories JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    np.email,
    np.whatsapp,
    np.push,
    np.categories
  FROM public.notification_preferences np
  WHERE np.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Apply update trigger to relevant tables
CREATE TRIGGER update_user_profile_updated_at BEFORE UPDATE ON public.user_profile
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_thread_updated_at BEFORE UPDATE ON public.thread
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_emotion_entry_updated_at BEFORE UPDATE ON public.emotion_entry
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_updated_at BEFORE UPDATE ON public.subscription
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_scheduled_notifications_updated_at
  BEFORE UPDATE ON public.scheduled_notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to auto-create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.user_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.message ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emotion_entry ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscription ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_analysis ENABLE ROW LEVEL SECURITY;

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

-- NOTIFICATION Policies
CREATE POLICY "Users can view their own notification preferences" ON public.notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences" ON public.notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences" ON public.notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own scheduled notifications" ON public.scheduled_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled notifications" ON public.scheduled_notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled notifications" ON public.scheduled_notifications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own notification history" ON public.notification_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification history" ON public.notification_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own insight analysis" ON public.insight_analysis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insight analysis" ON public.insight_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- PERMISSIONS
-- ============================================
GRANT ALL ON public.user_profile TO authenticated;
GRANT ALL ON public.thread TO authenticated;
GRANT ALL ON public.message TO authenticated;
GRANT ALL ON public.emotion_entry TO authenticated;
GRANT ALL ON public.subscription TO authenticated;
GRANT ALL ON public.token_ledger TO authenticated;
GRANT ALL ON public.notification_preferences TO authenticated;
GRANT ALL ON public.scheduled_notifications TO authenticated;
GRANT ALL ON public.notification_history TO authenticated;
GRANT ALL ON public.insight_analysis TO authenticated;
GRANT SELECT ON public.notification_templates TO authenticated;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION get_pending_notifications() TO authenticated;
GRANT EXECUTE ON FUNCTION mark_notification_sent(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_notification_preferences(UUID) TO authenticated;

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default notification templates
INSERT INTO public.notification_templates (template_id, type, title, message, category, triggers, priority) VALUES
('daily-reminder', 'reminder', 'זמן לעדכן את היומן שלך 🌸', 'היי! איך את מרגישה היום? בואי נעדכן את היומן יחד', 'journal', '{"daily_reminder"}', 'medium'),
('weekly-insight', 'insight', 'יש לי תובנה חדשה עבורך! 💡', 'ניתחתי את הנתונים שלך השבוע ויש לי כמה תובנות מעניינות לשתף', 'insights', '{"weekly_analysis"}', 'high'),
('symptom-warning', 'warning', 'זיהיתי דפוס שכדאי לשים לב אליו ⚠️', 'אני רואה שיש עלייה בתסמינים מסוימים. כדאי להתייעץ עם רופא', 'health', '{"symptom_increase"}', 'high'),
('encouragement', 'encouragement', 'את עושה עבודה נהדרת! 🌟', 'אני רואה שיש שיפור במצב שלך. המשכי כך!', 'motivation', '{"improvement_detected"}', 'low'),
('cycle-reminder', 'reminder', 'זמן לעדכן את מעקב המחזור 📅', 'בואי נעדכן את מעקב המחזור החודשי שלך', 'cycle', '{"cycle_reminder"}', 'medium'),
('wellness-tip', 'insight', 'טיפ בריאותי מיוחד עבורך 💪', 'יש לי טיפ שיכול לעזור לך להתמודד עם התסמינים', 'wellness', '{"wellness_tip"}', 'medium');

-- ============================================
-- BACKUP COMPLETION
-- ============================================
-- This backup includes:
-- 1. Complete database schema
-- 2. All tables with proper relationships
-- 3. Indexes for performance
-- 4. Functions and triggers
-- 5. Row Level Security policies
-- 6. Permissions and grants
-- 7. Default notification templates
-- 
-- To restore this backup:
-- 1. Create a new Supabase project
-- 2. Run this SQL script in the SQL editor
-- 3. Update environment variables
-- 4. Deploy the application
