-- ============================================
-- FIX USERS TABLE RLS RECURSION
-- ============================================

-- 1. Redefine is_admin to be absolutely sure it's correct
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- We use a direct query. Because this function is SECURITY DEFINER,
  -- it should run as the table owner (postgres) and bypass RLS.
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Drop the problematic policy on users table
-- This policy was likely causing the recursion because it calls is_admin(), 
-- which queries users, which triggers this policy again.
DROP POLICY IF EXISTS "Admins can view all profiles" ON users;
DROP POLICY IF EXISTS "Users can view own profile" ON users; -- Drop to recreate cleanly
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- 3. Recreate Users policies
-- Basic policy for self-access (does NOT use is_admin, so no recursion risk here)
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Admin policy. 
-- Since is_admin() is SECURITY DEFINER and owned by postgres, it should bypass RLS.
-- However, if recursion persists, it means the check is still triggering RLS.
CREATE POLICY "Admins can view all profiles" ON users
  FOR SELECT USING (is_admin());

-- 4. Just in case, grant execute permission explicitly
GRANT EXECUTE ON FUNCTION public.is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin TO service_role;

-- 5. Fix Gallery and News (again, to be safe)
DROP POLICY IF EXISTS "Public can view gallery" ON gallery;
DROP POLICY IF EXISTS "Admins can insert gallery" ON gallery;
DROP POLICY IF EXISTS "Admins can update gallery" ON gallery;
DROP POLICY IF EXISTS "Admins can delete gallery" ON gallery;

CREATE POLICY "Public can view gallery" ON gallery FOR SELECT USING (TRUE);
CREATE POLICY "Admins can insert gallery" ON gallery FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update gallery" ON gallery FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete gallery" ON gallery FOR DELETE USING (is_admin());

DROP POLICY IF EXISTS "Public can view published news" ON news_articles;
DROP POLICY IF EXISTS "Admins can insert news" ON news_articles;
DROP POLICY IF EXISTS "Admins can update news" ON news_articles;
DROP POLICY IF EXISTS "Admins can delete news" ON news_articles;

CREATE POLICY "Public can view published news" ON news_articles FOR SELECT USING (status = 'published' OR is_admin());
CREATE POLICY "Admins can insert news" ON news_articles FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update news" ON news_articles FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete news" ON news_articles FOR DELETE USING (is_admin());
