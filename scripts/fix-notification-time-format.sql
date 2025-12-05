-- ============================================================================
-- Quick Fix Script for Notification Time Format
-- Run this directly in Supabase SQL Editor or psql
-- ============================================================================

-- Fix email time format (example: "20:1" -> "20:01")
UPDATE public.notification_preferences
SET 
  email = jsonb_set(
    email,
    '{time}',
    to_jsonb(
      LPAD((split_part(email->>'time', ':', 1))::INTEGER::TEXT, 2, '0') || ':' ||
      LPAD((split_part(email->>'time', ':', 2))::INTEGER::TEXT, 2, '0')
    )
  ),
  updated_at = NOW()
WHERE 
  email->>'time' IS NOT NULL
  AND email->>'time' ~ '^[0-9]{1,2}:[0-9]{1,2}$'
  AND (
    length(split_part(email->>'time', ':', 1)) < 2
    OR length(split_part(email->>'time', ':', 2)) < 2
  );

-- Fix whatsapp time format
UPDATE public.notification_preferences
SET 
  whatsapp = jsonb_set(
    whatsapp,
    '{time}',
    to_jsonb(
      LPAD((split_part(whatsapp->>'time', ':', 1))::INTEGER::TEXT, 2, '0') || ':' ||
      LPAD((split_part(whatsapp->>'time', ':', 2))::INTEGER::TEXT, 2, '0')
    )
  ),
  updated_at = NOW()
WHERE 
  whatsapp->>'time' IS NOT NULL
  AND whatsapp->>'time' ~ '^[0-9]{1,2}:[0-9]{1,2}$'
  AND (
    length(split_part(whatsapp->>'time', ':', 1)) < 2
    OR length(split_part(whatsapp->>'time', ':', 2)) < 2
  );

-- Fix push time format
UPDATE public.notification_preferences
SET 
  push = jsonb_set(
    push,
    '{time}',
    to_jsonb(
      LPAD((split_part(push->>'time', ':', 1))::INTEGER::TEXT, 2, '0') || ':' ||
      LPAD((split_part(push->>'time', ':', 2))::INTEGER::TEXT, 2, '0')
    )
  ),
  updated_at = NOW()
WHERE 
  push->>'time' IS NOT NULL
  AND push->>'time' ~ '^[0-9]{1,2}:[0-9]{1,2}$'
  AND (
    length(split_part(push->>'time', ':', 1)) < 2
    OR length(split_part(push->>'time', ':', 2)) < 2
  );

-- Verify the fix
SELECT 
  user_id,
  email->>'time' as email_time,
  whatsapp->>'time' as whatsapp_time,
  push->>'time' as push_time,
  updated_at
FROM public.notification_preferences
ORDER BY updated_at DESC
LIMIT 10;

