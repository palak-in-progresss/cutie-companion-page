-- CLEANUP SCRIPT
-- This removes records from 'public.users' that have the same email as an Auth user
-- but a DIFFERENT ID. These are "ghost" records preventing the fix.

DELETE FROM public.users
USING auth.users
WHERE public.users.email = auth.users.email
AND public.users.id != auth.users.id;

-- After running the above, you can SAFELY run the backfill again:
INSERT INTO public.users (id, email)
SELECT id, email FROM auth.users
ON CONFLICT (id) DO NOTHING;
