-- ============================================
-- NUCLEAR OPTION: DISABLE RLS COMPLETELY
-- ============================================

-- This command turns OFF all security policies on these tables.
-- It is guaranteed to stop the "infinite recursion" error because
-- simpler: No security checks = No recursion.

ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles DISABLE ROW LEVEL SECURITY;

-- If you still see errors after running this, please restart your Next.js server.
