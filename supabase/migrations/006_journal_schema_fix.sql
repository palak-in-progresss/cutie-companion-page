-- =============================================
-- Migration 006: Journal Schema Fix
-- Align journal_entries with what the UI expects.
-- Adds: entry_text, mood, companion_reply, date
-- Removes: title, content (never used by the UI)
-- Also adds: name to users, UPDATE policy on users
-- =============================================

-- 1. Add new columns to journal_entries (safe - IF NOT EXISTS equivalent via DO block)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='journal_entries' AND column_name='entry_text') THEN
    ALTER TABLE journal_entries ADD COLUMN entry_text TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='journal_entries' AND column_name='mood') THEN
    ALTER TABLE journal_entries ADD COLUMN mood TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='journal_entries' AND column_name='companion_reply') THEN
    ALTER TABLE journal_entries ADD COLUMN companion_reply TEXT;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='journal_entries' AND column_name='date') THEN
    ALTER TABLE journal_entries ADD COLUMN date TEXT;
  END IF;
END $$;

-- 2. Backfill `date` from `created_at` for any existing rows
UPDATE journal_entries
SET date = TO_CHAR(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD')
WHERE date IS NULL;

-- 3. Drop old unused columns (title and content)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='journal_entries' AND column_name='title') THEN
    ALTER TABLE journal_entries DROP COLUMN title;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='journal_entries' AND column_name='content') THEN
    ALTER TABLE journal_entries DROP COLUMN content;
  END IF;
END $$;

-- 4. Add `name` column to users table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='name') THEN
    ALTER TABLE users ADD COLUMN name TEXT;
  END IF;
END $$;

-- 5. Add UPDATE RLS policy on users (so users can update their own name)
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 6. Add index for journal date queries
CREATE INDEX IF NOT EXISTS idx_journal_entries_date ON journal_entries(date);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_date ON journal_entries(user_id, date);
