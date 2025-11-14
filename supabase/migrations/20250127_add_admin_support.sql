-- Add admin support to user_profile table
-- Created: 2025-01-27

-- Add is_admin column to user_profile
ALTER TABLE public.user_profile 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE NOT NULL;

-- Create index for admin queries
CREATE INDEX IF NOT EXISTS idx_user_profile_is_admin ON public.user_profile(is_admin);

-- Update RLS policies to allow admins to view all profiles
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profile;
CREATE POLICY "Admins can view all profiles" ON public.user_profile
  FOR SELECT USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.user_profile 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Allow admins to update any profile
DROP POLICY IF EXISTS "Admins can update any profile" ON public.user_profile;
CREATE POLICY "Admins can update any profile" ON public.user_profile
  FOR UPDATE USING (
    auth.uid() = id OR 
    EXISTS (
      SELECT 1 FROM public.user_profile 
      WHERE id = auth.uid() AND is_admin = TRUE
    )
  );

-- Set nitzandaphna@gmail.com as admin
-- This will be executed when the user with this email exists
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Find user by email
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'nitzandaphna@gmail.com'
  LIMIT 1;

  -- If user exists, set as admin
  IF admin_user_id IS NOT NULL THEN
    UPDATE public.user_profile
    SET is_admin = TRUE
    WHERE id = admin_user_id;
    
    RAISE NOTICE 'Admin privileges granted to nitzandaphna@gmail.com';
  ELSE
    RAISE NOTICE 'User nitzandaphna@gmail.com not found. Please set admin manually after user signs up.';
  END IF;
END $$;


