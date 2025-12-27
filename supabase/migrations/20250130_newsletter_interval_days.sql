-- Add newsletter_interval_days to notification_preferences
-- Created: 2025-01-30
-- Purpose: Add default 4-day interval for personal newsletters

-- ============================================
-- 1. Update default email preferences to include newsletter_interval_days
-- ============================================

-- Update existing notification_preferences to add newsletter_interval_days: 4 if not exists
UPDATE public.notification_preferences
SET email = jsonb_set(
  email,
  '{newsletter_interval_days}',
  '4',
  true
)
WHERE email->>'newsletter_interval_days' IS NULL;

-- ============================================
-- 2. Update the default value in the table definition
-- ============================================

-- Alter the table to change the default email JSONB to include newsletter_interval_days
ALTER TABLE public.notification_preferences
ALTER COLUMN email SET DEFAULT '{"enabled": true, "frequency": "weekly", "time": "09:00", "newsletter_interval_days": 4}'::jsonb;

-- ============================================
-- 3. Create or update function to set default notification preferences for new users
-- ============================================

CREATE OR REPLACE FUNCTION public.create_default_notification_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notification_preferences (user_id, email, whatsapp, push, categories)
  VALUES (
    NEW.id,
    '{"enabled": true, "frequency": "weekly", "time": "09:00", "newsletter_interval_days": 4}'::jsonb,
    '{"enabled": false, "frequency": "daily", "time": "20:00"}'::jsonb,
    '{"enabled": true, "frequency": "daily", "time": "09:00"}'::jsonb,
    '{"reminders": true, "insights": true, "encouragements": true, "warnings": true}'::jsonb
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 4. Create trigger to auto-create notification preferences when user profile is created
-- ============================================

DROP TRIGGER IF EXISTS on_user_profile_created_notification_prefs ON public.user_profile;

CREATE TRIGGER on_user_profile_created_notification_prefs
  AFTER INSERT ON public.user_profile
  FOR EACH ROW EXECUTE FUNCTION public.create_default_notification_preferences();

