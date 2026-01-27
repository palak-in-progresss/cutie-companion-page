-- Create a trigger function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- BACKFILL: Insert missing users from auth.users into public.users
INSERT INTO public.users (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- OPTIONAL: Clean up orphaned records in related tables if needed
-- (Be careful with DELETEs, but for consistency if you had bad data)
-- DELETE FROM public.journal_entries WHERE user_id NOT IN (SELECT id FROM public.users);
-- DELETE FROM public.mood_entries WHERE user_id NOT IN (SELECT id FROM public.users);
-- DELETE FROM public.tasks WHERE user_id NOT IN (SELECT id FROM public.users);
-- DELETE FROM public.habits WHERE user_id NOT IN (SELECT id FROM public.users);
