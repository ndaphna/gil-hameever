-- Clean up token storage - keep only one source of truth
-- Created: 2025-01-18

-- ============================================
-- 1. Remove tokens_used from message table
-- ============================================
ALTER TABLE public.message DROP COLUMN IF EXISTS tokens_used;

-- ============================================
-- 2. Drop token_ledger table completely
-- ============================================
DROP TABLE IF EXISTS public.token_ledger;

-- ============================================
-- 3. Ensure user_profile has current_tokens as the ONLY source
-- ============================================
-- Make sure current_tokens exists and is the primary source
DO $$ 
BEGIN
  -- If tokens_remaining exists, rename it to current_tokens
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile' 
    AND column_name = 'tokens_remaining'
  ) THEN
    ALTER TABLE public.user_profile RENAME COLUMN tokens_remaining TO current_tokens;
  END IF;
  
  -- If current_tokens doesn't exist, create it
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile' 
    AND column_name = 'current_tokens'
  ) THEN
    ALTER TABLE public.user_profile ADD COLUMN current_tokens INTEGER DEFAULT 100;
  END IF;
END $$;

-- ============================================
-- 4. Add comment to clarify this is the ONLY source of tokens
-- ============================================
COMMENT ON COLUMN public.user_profile.current_tokens IS 'ONLY source of truth for user tokens - all other token references should be removed';
