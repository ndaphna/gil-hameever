-- בדיקה והגדרת מנהל
-- הרץ את זה ב-Supabase SQL Editor

-- 1. בדוק את המשתמש הנוכחי
SELECT 
    u.id,
    u.email,
    up.is_admin,
    up.full_name,
    up.email as profile_email
FROM auth.users u
LEFT JOIN public.user_profile up ON u.id = up.id
WHERE u.email = 'nitzandaphna@gmail.com';

-- 2. אם המשתמש קיים, הגדר אותו כמנהל
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- מצא את המשתמש
  SELECT id INTO admin_user_id
  FROM auth.users
  WHERE email = 'nitzandaphna@gmail.com'
  LIMIT 1;

  IF admin_user_id IS NOT NULL THEN
    -- ודא שיש פרופיל
    INSERT INTO public.user_profile (id, email, is_admin, full_name)
    VALUES (admin_user_id, 'nitzandaphna@gmail.com', TRUE, 'מנהל מערכת')
    ON CONFLICT (id) 
    DO UPDATE SET 
      is_admin = TRUE,
      email = COALESCE(user_profile.email, 'nitzandaphna@gmail.com');
    
    RAISE NOTICE '✅ Admin privileges granted to nitzandaphna@gmail.com (User ID: %)', admin_user_id;
  ELSE
    RAISE NOTICE '❌ User nitzandaphna@gmail.com not found in auth.users';
    RAISE NOTICE 'Please ensure the user has signed up first.';
  END IF;
END $$;

-- 3. בדוק שוב
SELECT 
    u.id,
    u.email,
    up.is_admin,
    up.full_name,
    CASE 
        WHEN up.is_admin = TRUE THEN '✅ YES'
        ELSE '❌ NO'
    END as admin_status
FROM auth.users u
LEFT JOIN public.user_profile up ON u.id = up.id
WHERE u.email = 'nitzandaphna@gmail.com';

-- 4. הצג את כל המנהלים
SELECT 
    id,
    email,
    full_name,
    is_admin,
    created_at
FROM public.user_profile
WHERE is_admin = TRUE;








