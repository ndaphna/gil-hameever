-- Fix: notification_templates was missing RLS in the original migration
-- (20250118_notification_system.sql:192-195 enabled RLS on 4 sibling tables
-- but skipped notification_templates). Supabase Advisor flagged it as a
-- security error because the table sits in the public schema and is exposed
-- via PostgREST.
--
-- The table is a lookup of notification templates (no PII), so the policy
-- simply mirrors the existing GRANT: any authenticated user may SELECT.
-- Writes remain restricted to the service role (which bypasses RLS).

ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read notification templates"
  ON public.notification_templates
  FOR SELECT
  TO authenticated
  USING (true);
