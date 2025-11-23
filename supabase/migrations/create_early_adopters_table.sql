-- Create early_adopters table for waitlist signups
-- Created: 2025-01-XX

CREATE TABLE IF NOT EXISTS public.early_adopters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_early_adopters_email ON public.early_adopters(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_early_adopters_created_at ON public.early_adopters(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE public.early_adopters ENABLE ROW LEVEL SECURITY;

-- Policy: Allow public inserts (for signup form)
CREATE POLICY "Allow public inserts" ON public.early_adopters
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access" ON public.early_adopters
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_early_adopters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_early_adopters_updated_at
  BEFORE UPDATE ON public.early_adopters
  FOR EACH ROW
  EXECUTE FUNCTION update_early_adopters_updated_at();

-- Add comment
COMMENT ON TABLE public.early_adopters IS 'Early adopter waitlist signups for book launch';








