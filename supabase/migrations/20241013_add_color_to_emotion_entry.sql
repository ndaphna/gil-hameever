-- Add color column to emotion_entry table
ALTER TABLE emotion_entry 
ADD COLUMN color text;

-- Add a comment for documentation
COMMENT ON COLUMN emotion_entry.color IS 'Pastel color chosen by user for the journal entry card';




