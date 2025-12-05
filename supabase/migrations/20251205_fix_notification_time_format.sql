-- ============================================================================
-- Fix Notification Time Format
-- Created: 2025-12-05
-- 
-- This migration fixes invalid time formats in notification_preferences
-- Examples of fixes:
--   "20:1" -> "20:01"
--   "9:5" -> "09:05"
--   "19:25" -> "19:25" (already correct)
-- ============================================================================

-- Function to normalize time format (HH:MM)
CREATE OR REPLACE FUNCTION normalize_time_format(time_str TEXT)
RETURNS TEXT AS $$
DECLARE
  hour_part INTEGER;
  minute_part INTEGER;
  normalized_hour TEXT;
  normalized_minute TEXT;
BEGIN
  -- Check if time string is valid
  IF time_str IS NULL OR time_str = '' THEN
    RETURN '09:00'; -- Default time
  END IF;

  -- Split by colon
  IF position(':' IN time_str) = 0 THEN
    RETURN '09:00'; -- Invalid format, return default
  END IF;

  -- Extract hour and minute
  hour_part := CAST(split_part(time_str, ':', 1) AS INTEGER);
  minute_part := CAST(split_part(time_str, ':', 2) AS INTEGER);

  -- Validate range
  IF hour_part < 0 OR hour_part > 23 OR minute_part < 0 OR minute_part > 59 THEN
    RETURN '09:00'; -- Invalid values, return default
  END IF;

  -- Normalize with leading zeros
  normalized_hour := LPAD(hour_part::TEXT, 2, '0');
  normalized_minute := LPAD(minute_part::TEXT, 2, '0');

  RETURN normalized_hour || ':' || normalized_minute;
END;
$$ LANGUAGE plpgsql;

-- Fix email time format
UPDATE public.notification_preferences
SET 
  email = jsonb_set(
    email,
    '{time}',
    to_jsonb(normalize_time_format(email->>'time'))
  ),
  updated_at = NOW()
WHERE 
  email->>'time' IS NOT NULL
  AND (
    -- Find times that don't match HH:MM format (with leading zeros)
    email->>'time' !~ '^[0-9]{2}:[0-9]{2}$'
    OR
    -- Find times with single digit hour or minute
    length(split_part(email->>'time', ':', 1)) < 2
    OR
    length(split_part(email->>'time', ':', 2)) < 2
  );

-- Fix whatsapp time format
UPDATE public.notification_preferences
SET 
  whatsapp = jsonb_set(
    whatsapp,
    '{time}',
    to_jsonb(normalize_time_format(whatsapp->>'time'))
  ),
  updated_at = NOW()
WHERE 
  whatsapp->>'time' IS NOT NULL
  AND (
    whatsapp->>'time' !~ '^[0-9]{2}:[0-9]{2}$'
    OR
    length(split_part(whatsapp->>'time', ':', 1)) < 2
    OR
    length(split_part(whatsapp->>'time', ':', 2)) < 2
  );

-- Fix push time format
UPDATE public.notification_preferences
SET 
  push = jsonb_set(
    push,
    '{time}',
    to_jsonb(normalize_time_format(push->>'time'))
  ),
  updated_at = NOW()
WHERE 
  push->>'time' IS NOT NULL
  AND (
    push->>'time' !~ '^[0-9]{2}:[0-9]{2}$'
    OR
    length(split_part(push->>'time', ':', 1)) < 2
    OR
    length(split_part(push->>'time', ':', 2)) < 2
  );

-- Log the changes
DO $$
DECLARE
  email_fixed_count INTEGER;
  whatsapp_fixed_count INTEGER;
  push_fixed_count INTEGER;
BEGIN
  -- Count fixed records (this is approximate since we already updated)
  SELECT COUNT(*) INTO email_fixed_count
  FROM public.notification_preferences
  WHERE email->>'time' ~ '^[0-9]{2}:[0-9]{2}$';

  SELECT COUNT(*) INTO whatsapp_fixed_count
  FROM public.notification_preferences
  WHERE whatsapp->>'time' ~ '^[0-9]{2}:[0-9]{2}$';

  SELECT COUNT(*) INTO push_fixed_count
  FROM public.notification_preferences
  WHERE push->>'time' ~ '^[0-9]{2}:[0-9]{2}$';

  RAISE NOTICE 'Time format fix completed:';
  RAISE NOTICE '  - Email times normalized: % records', email_fixed_count;
  RAISE NOTICE '  - WhatsApp times normalized: % records', whatsapp_fixed_count;
  RAISE NOTICE '  - Push times normalized: % records', push_fixed_count;
END $$;

-- Clean up: Drop the helper function (optional, can keep it for future use)
-- DROP FUNCTION IF EXISTS normalize_time_format(TEXT);

-- ============================================================================
-- Verification Query (run this to check results)
-- ============================================================================
-- SELECT 
--   user_id,
--   email->>'time' as email_time,
--   whatsapp->>'time' as whatsapp_time,
--   push->>'time' as push_time
-- FROM public.notification_preferences
-- ORDER BY updated_at DESC;

