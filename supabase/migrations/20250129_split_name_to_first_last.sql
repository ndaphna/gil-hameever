-- ============================================
-- Split name into first_name and last_name
-- Created: 2025-01-29
-- ============================================

-- 1. Add first_name and last_name columns if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile' 
    AND column_name = 'first_name'
  ) THEN
    ALTER TABLE public.user_profile ADD COLUMN first_name TEXT;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile' 
    AND column_name = 'last_name'
  ) THEN
    ALTER TABLE public.user_profile ADD COLUMN last_name TEXT;
  END IF;
END $$;

-- 2. Migrate existing data: split name/full_name into first_name and last_name
-- This handles both 'name' and 'full_name' columns (whichever exists)
DO $$
DECLARE
  rec RECORD;
  name_parts TEXT[];
  first_part TEXT;
  last_part TEXT;
BEGIN
  FOR rec IN 
    SELECT 
      id,
      COALESCE(name, full_name) as current_name
    FROM public.user_profile
    WHERE COALESCE(name, full_name) IS NOT NULL
      AND (first_name IS NULL OR last_name IS NULL)
  LOOP
    -- Split by space, take first part as first_name, rest as last_name
    name_parts := string_to_array(trim(rec.current_name), ' ');
    
    IF array_length(name_parts, 1) > 0 THEN
      first_part := name_parts[1];
      
      -- If there are more parts, join them as last_name
      IF array_length(name_parts, 1) > 1 THEN
        last_part := array_to_string(name_parts[2:], ' ');
      ELSE
        last_part := NULL;
      END IF;
      
      -- Update the record
      UPDATE public.user_profile
      SET 
        first_name = first_part,
        last_name = last_part
      WHERE id = rec.id;
    END IF;
  END LOOP;
END $$;

-- 3. Update the trigger function to use first_name and last_name
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  full_name_value TEXT;
  name_parts TEXT[];
  first_part TEXT;
  last_part TEXT;
BEGIN
  -- Get the full name from metadata
  full_name_value := COALESCE(
    NEW.raw_user_meta_data->>'name', 
    NEW.raw_user_meta_data->>'full_name', 
    split_part(NEW.email, '@', 1)
  );
  
  -- Split into first and last name
  name_parts := string_to_array(trim(full_name_value), ' ');
  
  IF array_length(name_parts, 1) > 0 THEN
    first_part := name_parts[1];
    
    IF array_length(name_parts, 1) > 1 THEN
      last_part := array_to_string(name_parts[2:], ' ');
    ELSE
      last_part := NULL;
    END IF;
  ELSE
    first_part := split_part(NEW.email, '@', 1);
    last_part := NULL;
  END IF;
  
  INSERT INTO public.user_profile (id, email, first_name, last_name, name, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    first_part,
    last_part,
    full_name_value, -- Keep for backward compatibility
    full_name_value  -- Keep for backward compatibility
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();





