-- Set nitzandaphna@gmail.com as admin
-- This can be run independently if the user already exists

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
    -- Ensure user_profile exists
    INSERT INTO public.user_profile (id, email, is_admin)
    VALUES (admin_user_id, 'nitzandaphna@gmail.com', TRUE)
    ON CONFLICT (id) 
    DO UPDATE SET is_admin = TRUE;
    
    RAISE NOTICE 'Admin privileges granted to nitzandaphna@gmail.com (User ID: %)', admin_user_id;
  ELSE
    RAISE NOTICE 'User nitzandaphna@gmail.com not found. Please ensure the user has signed up first.';
    RAISE NOTICE 'After the user signs up, run this script again to grant admin privileges.';
  END IF;
END $$;











