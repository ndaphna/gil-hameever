-- Verify and create necessary database functions
-- This ensures all required functions exist before creating tables

-- ============================================
-- Create updated_at trigger function if it doesn't exist
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Verify uuid extension is enabled
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Verify that auth.uid() function works
-- ============================================
-- This is built-in to Supabase, but let's check it exists
DO $$
BEGIN
  -- Test if auth schema exists
  IF NOT EXISTS (SELECT 1 FROM pg_namespace WHERE nspname = 'auth') THEN
    RAISE EXCEPTION 'Auth schema does not exist. This must be run in Supabase.';
  END IF;
END $$;

-- ============================================
-- Verify user_profile table exists
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile'
  ) THEN
    RAISE EXCEPTION 'user_profile table does not exist. Please create it first.';
  END IF;
END $$;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'All required functions and dependencies verified successfully!';
END $$;

