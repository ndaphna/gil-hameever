-- Add phone number and profile image to user_profile
-- Created: 2025-01-30
-- Purpose: Allow users to add phone number and profile image

-- ============================================
-- 1. Add phone_number column
-- ============================================
ALTER TABLE public.user_profile 
ADD COLUMN IF NOT EXISTS phone_number TEXT;

-- ============================================
-- 2. Add profile_image_url column
-- ============================================
ALTER TABLE public.user_profile 
ADD COLUMN IF NOT EXISTS profile_image_url TEXT;

-- ============================================
-- 3. Add index for phone_number (optional, for faster searches)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_user_profile_phone_number 
ON public.user_profile(phone_number) 
WHERE phone_number IS NOT NULL;

-- ============================================
-- 4. Add comment for documentation
-- ============================================
COMMENT ON COLUMN public.user_profile.phone_number IS 'User mobile phone number';
COMMENT ON COLUMN public.user_profile.profile_image_url IS 'URL to user profile image (stored in Supabase Storage)';

