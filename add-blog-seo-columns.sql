-- Blog admin saves these fields; if any are missing, Supabase rejects the save.
-- Run once in the Supabase SQL editor. Safe to re-run.
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_title TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS meta_description TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS seo_settings JSONB DEFAULT '{}'::jsonb;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'published';
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS author TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS tags TEXT;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS comments_count INTEGER DEFAULT 0;
ALTER TABLE blogs ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
NOTIFY pgrst, 'reload schema';
