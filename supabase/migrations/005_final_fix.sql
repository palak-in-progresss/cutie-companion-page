-- PART 1: CLEANUP CONFLICTS
-- This removes the "ghost" user that has the wrong ID but same email.
-- This allows the correct user to be inserted in Part 2.
DELETE FROM public.users
USING auth.users
WHERE public.users.email = auth.users.email
AND public.users.id != auth.users.id;

-- PART 2: SYNC CORRECT USER
-- Now that the conflict is gone, we insert your correct Authentication ID.
INSERT INTO public.users (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- PART 3: ENSURE TABLES EXIST
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  emoji TEXT,
  completed BOOLEAN DEFAULT FALSE,
  date TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PART 4: ENABLE SECURITY
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- PART 5: REFRESH POLICIES (Idempotent)
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can CRUD their own journal entries" ON journal_entries;
CREATE POLICY "Users can CRUD their own journal entries" ON journal_entries FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can CRUD their own mood entries" ON mood_entries;
CREATE POLICY "Users can CRUD their own mood entries" ON mood_entries FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can CRUD their own tasks" ON tasks;
CREATE POLICY "Users can CRUD their own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can CRUD their own habits" ON habits;
CREATE POLICY "Users can CRUD their own habits" ON habits FOR ALL USING (auth.uid() = user_id);

-- PART 6: FIX INDEXES
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_habits_user_id ON habits(user_id);
