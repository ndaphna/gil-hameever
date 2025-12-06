-- Enhanced Token System Migration V2
-- Created: 2025-01-23
-- 
-- This migration enhances the token system to support:
-- 1. Comprehensive token usage logging
-- 2. All AI action types (chat, analysis, automation, etc.)
-- 3. Detailed transparency and auditing
-- 4. Token history tracking

-- ============================================
-- 1. Update user_profile table with current_tokens
-- ============================================

-- Add current_tokens column if it doesn't exist (for newer implementations)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profile' 
    AND column_name = 'current_tokens'
  ) THEN
    ALTER TABLE public.user_profile 
    ADD COLUMN current_tokens INTEGER DEFAULT 100;
    
    -- Sync current_tokens with tokens_remaining
    UPDATE public.user_profile 
    SET current_tokens = COALESCE(tokens_remaining, 100);
  END IF;
END $$;

-- Add subscription_tier and status columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profile' 
    AND column_name = 'subscription_tier'
  ) THEN
    ALTER TABLE public.user_profile 
    ADD COLUMN subscription_tier TEXT DEFAULT 'free' 
    CHECK (subscription_tier IN ('free', 'basic', 'plus', 'pro'));
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_profile' 
    AND column_name = 'subscription_status'
  ) THEN
    ALTER TABLE public.user_profile 
    ADD COLUMN subscription_status TEXT DEFAULT 'active' 
    CHECK (subscription_status IN ('active', 'cancelled', 'expired', 'paused'));
  END IF;
END $$;

-- ============================================
-- 2. Drop and recreate token_ledger with enhanced schema
-- ============================================

-- Drop existing token_ledger if it exists
DROP TABLE IF EXISTS public.token_ledger CASCADE;

-- Create new enhanced token_ledger table
CREATE TABLE public.token_ledger (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.user_profile(id) ON DELETE CASCADE,
  
  -- Action details
  action_type TEXT NOT NULL CHECK (action_type IN (
    'chat_aliza',
    'chat_expert',
    'daily_analysis',
    'weekly_analysis',
    'monthly_analysis',
    'comprehensive_analysis',
    'sleep_analysis',
    'symptoms_analysis',
    'mood_analysis',
    'cycle_analysis',
    'hormones_analysis',
    'trends_analysis',
    'newsletter_generation',
    'insight_generation',
    'personalized_plan',
    'file_analysis',
    'pdf_report',
    'text_analysis',
    'aliza_message',
    'smart_notification',
    'content_generation',
    'other_ai_task',
    'refill',
    'subscription_renewal',
    'manual_adjustment'
  )),
  
  -- Token usage
  openai_tokens INTEGER DEFAULT 0,      -- Actual tokens consumed by OpenAI
  tokens_deducted INTEGER NOT NULL,     -- Tokens deducted from user (openai_tokens * multiplier)
  tokens_before INTEGER NOT NULL,       -- Balance before deduction
  tokens_after INTEGER NOT NULL,        -- Balance after deduction
  token_multiplier DECIMAL(10,2) DEFAULT 2.0, -- Multiplier used for this transaction
  
  -- Transparency and metadata
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,   -- Additional context (conversation_id, file_name, etc.)
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_token_amounts CHECK (
    tokens_deducted >= 0 AND 
    tokens_before >= 0 AND 
    tokens_after >= 0
  )
);

-- ============================================
-- 3. Create indexes for performance
-- ============================================

CREATE INDEX idx_token_ledger_user_id ON public.token_ledger(user_id);
CREATE INDEX idx_token_ledger_action_type ON public.token_ledger(action_type);
CREATE INDEX idx_token_ledger_created_at ON public.token_ledger(created_at DESC);
CREATE INDEX idx_token_ledger_user_created ON public.token_ledger(user_id, created_at DESC);

-- ============================================
-- 4. Enable RLS on token_ledger
-- ============================================

ALTER TABLE public.token_ledger ENABLE ROW LEVEL SECURITY;

-- Users can view their own token history
CREATE POLICY "Users can view own token history" ON public.token_ledger
  FOR SELECT USING (auth.uid() = user_id);

-- Only system can insert token records (via service role)
CREATE POLICY "Service role can insert token records" ON public.token_ledger
  FOR INSERT WITH CHECK (true);

-- ============================================
-- 5. Create token_usage_summary view for analytics
-- ============================================

CREATE OR REPLACE VIEW public.token_usage_summary AS
SELECT 
  user_id,
  action_type,
  COUNT(*) as usage_count,
  SUM(tokens_deducted) as total_tokens_used,
  SUM(openai_tokens) as total_openai_tokens,
  AVG(tokens_deducted) as avg_tokens_per_action,
  MAX(created_at) as last_used,
  MIN(created_at) as first_used
FROM public.token_ledger
WHERE action_type NOT IN ('refill', 'subscription_renewal', 'manual_adjustment')
GROUP BY user_id, action_type;

-- Grant access to authenticated users for their own summary
GRANT SELECT ON public.token_usage_summary TO authenticated;

-- ============================================
-- 6. Create helper function for token deduction
-- ============================================

CREATE OR REPLACE FUNCTION public.deduct_tokens(
  p_user_id UUID,
  p_action_type TEXT,
  p_openai_tokens INTEGER,
  p_token_multiplier DECIMAL DEFAULT 2.0,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  success BOOLEAN,
  tokens_after INTEGER,
  message TEXT
) AS $$
DECLARE
  v_tokens_before INTEGER;
  v_tokens_deducted INTEGER;
  v_tokens_after INTEGER;
BEGIN
  -- Get current token balance
  SELECT COALESCE(current_tokens, 0) INTO v_tokens_before
  FROM public.user_profile
  WHERE id = p_user_id;
  
  -- Calculate tokens to deduct
  v_tokens_deducted := CEIL(p_openai_tokens * p_token_multiplier);
  
  -- Check if user has enough tokens
  IF v_tokens_before < v_tokens_deducted THEN
    RETURN QUERY SELECT FALSE, v_tokens_before, 'Insufficient tokens'::TEXT;
    RETURN;
  END IF;
  
  -- Calculate new balance
  v_tokens_after := v_tokens_before - v_tokens_deducted;
  
  -- Update user balance
  UPDATE public.user_profile
  SET 
    current_tokens = v_tokens_after,
    tokens_remaining = v_tokens_after,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Log the transaction
  INSERT INTO public.token_ledger (
    user_id,
    action_type,
    openai_tokens,
    tokens_deducted,
    tokens_before,
    tokens_after,
    token_multiplier,
    description,
    metadata
  ) VALUES (
    p_user_id,
    p_action_type,
    p_openai_tokens,
    v_tokens_deducted,
    v_tokens_before,
    v_tokens_after,
    p_token_multiplier,
    p_description,
    p_metadata
  );
  
  RETURN QUERY SELECT TRUE, v_tokens_after, 'Success'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.deduct_tokens TO authenticated;
GRANT EXECUTE ON FUNCTION public.deduct_tokens TO service_role;

-- ============================================
-- 7. Create function for adding tokens (refills/renewals)
-- ============================================

CREATE OR REPLACE FUNCTION public.add_tokens(
  p_user_id UUID,
  p_tokens INTEGER,
  p_action_type TEXT DEFAULT 'refill',
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE (
  success BOOLEAN,
  tokens_after INTEGER,
  message TEXT
) AS $$
DECLARE
  v_tokens_before INTEGER;
  v_tokens_after INTEGER;
BEGIN
  -- Get current token balance
  SELECT COALESCE(current_tokens, 0) INTO v_tokens_before
  FROM public.user_profile
  WHERE id = p_user_id;
  
  -- Calculate new balance
  v_tokens_after := v_tokens_before + p_tokens;
  
  -- Update user balance
  UPDATE public.user_profile
  SET 
    current_tokens = v_tokens_after,
    tokens_remaining = v_tokens_after,
    updated_at = NOW()
  WHERE id = p_user_id;
  
  -- Log the transaction
  INSERT INTO public.token_ledger (
    user_id,
    action_type,
    openai_tokens,
    tokens_deducted,
    tokens_before,
    tokens_after,
    token_multiplier,
    description,
    metadata
  ) VALUES (
    p_user_id,
    p_action_type,
    0,
    -p_tokens, -- Negative value indicates addition
    v_tokens_before,
    v_tokens_after,
    0,
    COALESCE(p_description, 'Token refill'),
    p_metadata
  );
  
  RETURN QUERY SELECT TRUE, v_tokens_after, 'Success'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.add_tokens TO authenticated;
GRANT EXECUTE ON FUNCTION public.add_tokens TO service_role;

-- ============================================
-- 8. Migrate existing data (if any)
-- ============================================

-- If there's old token_ledger data in a backup table, we can migrate it
-- For now, this is a clean slate

-- ============================================
-- 9. Create indexes on user_profile for token queries
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_profile_tokens ON public.user_profile(current_tokens);
CREATE INDEX IF NOT EXISTS idx_user_profile_subscription ON public.user_profile(subscription_tier, subscription_status);

-- ============================================
-- VERIFICATION QUERIES (for manual testing)
-- ============================================

-- To test token deduction:
-- SELECT * FROM public.deduct_tokens(
--   '<user_id>'::UUID,
--   'chat_aliza',
--   100,
--   2.0,
--   'Test deduction',
--   '{"test": true}'::jsonb
-- );

-- To test token addition:
-- SELECT * FROM public.add_tokens(
--   '<user_id>'::UUID,
--   10000,
--   'refill',
--   'Test refill',
--   '{"payment_id": "test123"}'::jsonb
-- );

-- To view token history:
-- SELECT * FROM public.token_ledger
-- WHERE user_id = '<user_id>'
-- ORDER BY created_at DESC
-- LIMIT 20;

-- To view usage summary:
-- SELECT * FROM public.token_usage_summary
-- WHERE user_id = '<user_id>'
-- ORDER BY total_tokens_used DESC;














