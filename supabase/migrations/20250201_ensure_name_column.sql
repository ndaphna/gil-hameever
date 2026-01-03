-- ============================================
-- Ensure name column exists in user_profile
-- Created: 2025-02-01
-- ============================================

-- Add name column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'user_profile' 
    AND column_name = 'name'
  ) THEN
    ALTER TABLE public.user_profile ADD COLUMN name TEXT;
  END IF;
END $$;

-- Migrate existing data: combine first_name and last_name into name if name is null
UPDATE public.user_profile
SET name = CASE
  WHEN first_name IS NOT NULL AND last_name IS NOT NULL THEN first_name || ' ' || last_name
  WHEN first_name IS NOT NULL THEN first_name
  WHEN last_name IS NOT NULL THEN last_name
  ELSE name
END
WHERE name IS NULL OR name = '';

-- Add comment
COMMENT ON COLUMN public.user_profile.name IS 'Full name of the user (preferred over first_name/last_name)';

