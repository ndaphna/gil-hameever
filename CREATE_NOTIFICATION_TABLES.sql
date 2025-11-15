-- יצירת טבלאות התראות
-- הרץ את זה ב-Supabase SQL Editor

-- ============================================
-- 1. NOTIFICATION_PREFERENCES Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  email JSONB NOT NULL DEFAULT '{"enabled": true, "frequency": "weekly", "time": "09:00"}',
  whatsapp JSONB NOT NULL DEFAULT '{"enabled": false, "frequency": "daily", "time": "20:00"}',
  push JSONB NOT NULL DEFAULT '{"enabled": true, "frequency": "daily", "time": "09:00"}',
  categories JSONB NOT NULL DEFAULT '{"reminders": true, "insights": true, "encouragements": true, "warnings": true}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure only one preference record per user
  UNIQUE(user_id)
);

-- ============================================
-- 2. NOTIFICATION_TEMPLATES Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.notification_templates (
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

-- ============================================
-- 3. SCHEDULED_NOTIFICATIONS Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.scheduled_notifications (
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

-- ============================================
-- 4. NOTIFICATION_HISTORY Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.notification_history (
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

-- ============================================
-- 5. INSIGHT_ANALYSIS Table
-- ============================================
CREATE TABLE IF NOT EXISTS public.insight_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly', 'monthly')),
  insights_count INTEGER DEFAULT 0,
  high_priority_count INTEGER DEFAULT 0,
  analysis_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Create indexes for better performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_user_id ON public.scheduled_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_scheduled_for ON public.scheduled_notifications(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_scheduled_notifications_status ON public.scheduled_notifications(status);
CREATE INDEX IF NOT EXISTS idx_notification_history_user_id ON public.notification_history(user_id);
CREATE INDEX IF NOT EXISTS idx_notification_history_sent_at ON public.notification_history(sent_at);
CREATE INDEX IF NOT EXISTS idx_insight_analysis_user_id ON public.insight_analysis(user_id);
CREATE INDEX IF NOT EXISTS idx_insight_analysis_type ON public.insight_analysis(type);
CREATE INDEX IF NOT EXISTS idx_notification_preferences_user_id ON public.notification_preferences(user_id);

-- ============================================
-- Insert default notification templates (only if not exist)
-- ============================================
INSERT INTO public.notification_templates (template_id, type, title, message, category, triggers, priority)
SELECT * FROM (VALUES
  ('daily-reminder', 'reminder', 'זמן לעדכן את היומן שלך 🌸', 'היי! איך את מרגישה היום? בואי נעדכן את היומן יחד', 'journal', '{"daily_reminder"}'::TEXT[], 'medium'),
  ('weekly-insight', 'insight', 'יש לי תובנה חדשה עבורך! 💡', 'ניתחתי את הנתונים שלך השבוע ויש לי כמה תובנות מעניינות לשתף', 'insights', '{"weekly_analysis"}'::TEXT[], 'high'),
  ('symptom-warning', 'warning', 'זיהיתי דפוס שכדאי לשים לב אליו ⚠️', 'אני רואה שיש עלייה בתסמינים מסוימים. כדאי להתייעץ עם רופא', 'health', '{"symptom_increase"}'::TEXT[], 'high'),
  ('encouragement', 'encouragement', 'את עושה עבודה נהדרת! 🌟', 'אני רואה שיש שיפור במצב שלך. המשכי כך!', 'motivation', '{"improvement_detected"}'::TEXT[], 'low'),
  ('cycle-reminder', 'reminder', 'זמן לעדכן את מעקב המחזור 📅', 'בואי נעדכן את מעקב המחזור החודשי שלך', 'cycle', '{"cycle_reminder"}'::TEXT[], 'medium'),
  ('wellness-tip', 'insight', 'טיפ בריאותי מיוחד עבורך 💪', 'יש לי טיפ שיכול לעזור לך להתמודד עם התסמינים', 'wellness', '{"wellness_tip"}'::TEXT[], 'medium')
) AS v(template_id, type, title, message, category, triggers, priority)
WHERE NOT EXISTS (
  SELECT 1 FROM public.notification_templates WHERE template_id = v.template_id
);

-- ============================================
-- Create functions for notification management
-- ============================================

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
-- Create triggers for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_notification_preferences_updated_at ON public.notification_preferences;
CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON public.notification_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_scheduled_notifications_updated_at ON public.scheduled_notifications;
CREATE TRIGGER update_scheduled_notifications_updated_at
  BEFORE UPDATE ON public.scheduled_notifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_notification_templates_updated_at ON public.notification_templates;
CREATE TRIGGER update_notification_templates_updated_at
  BEFORE UPDATE ON public.notification_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Create RLS policies
-- ============================================
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheduled_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insight_analysis ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can insert their own notification preferences" ON public.notification_preferences;
DROP POLICY IF EXISTS "Users can update their own notification preferences" ON public.notification_preferences;

DROP POLICY IF EXISTS "Users can view their own scheduled notifications" ON public.scheduled_notifications;
DROP POLICY IF EXISTS "Users can insert their own scheduled notifications" ON public.scheduled_notifications;
DROP POLICY IF EXISTS "Users can update their own scheduled notifications" ON public.scheduled_notifications;

DROP POLICY IF EXISTS "Users can view their own notification history" ON public.notification_history;
DROP POLICY IF EXISTS "Users can insert their own notification history" ON public.notification_history;

DROP POLICY IF EXISTS "Users can view their own insight analysis" ON public.insight_analysis;
DROP POLICY IF EXISTS "Users can insert their own insight analysis" ON public.insight_analysis;

-- Notification preferences policies
CREATE POLICY "Users can view their own notification preferences" ON public.notification_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification preferences" ON public.notification_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notification preferences" ON public.notification_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Scheduled notifications policies
CREATE POLICY "Users can view their own scheduled notifications" ON public.scheduled_notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scheduled notifications" ON public.scheduled_notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scheduled notifications" ON public.scheduled_notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Notification history policies
CREATE POLICY "Users can view their own notification history" ON public.notification_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notification history" ON public.notification_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insight analysis policies
CREATE POLICY "Users can view their own insight analysis" ON public.insight_analysis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own insight analysis" ON public.insight_analysis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Grant permissions
-- ============================================
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
-- Success message
-- ============================================
DO $$
BEGIN
  RAISE NOTICE '✅ Notification tables created successfully!';
END $$;


