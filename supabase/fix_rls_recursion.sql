-- ============================================
-- FIX INFINITE RECURSION IN RLS
-- ============================================

-- 1. Fix is_admin function to be SECURITY DEFINER with fixed search_path
-- This ensures it runs with permissions of the creator (postgres) and doesn't get caught in RLS loops
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if the user has the 'admin' or 'super_admin' role
  -- accessing public.users directly with SECURITY DEFINER bypasses RLS
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Drop existing problematic policies on gallery
DROP POLICY IF EXISTS "Anyone can view gallery" ON gallery;
DROP POLICY IF EXISTS "Admins can manage gallery" ON gallery;

-- 3. Re-create split policies for gallery to avoid checking is_admin() on SELECT
CREATE POLICY "Public can view gallery" ON gallery
  FOR SELECT USING (TRUE);

CREATE POLICY "Admins can insert gallery" ON gallery
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update gallery" ON gallery
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete gallery" ON gallery
  FOR DELETE USING (is_admin());

-- 4. Drop existing problematic policies on news_articles
DROP POLICY IF EXISTS "Anyone can view published news" ON news_articles;
DROP POLICY IF EXISTS "Admins can manage news" ON news_articles;

-- 5. Re-create split policies for news_articles
CREATE POLICY "Public can view published news" ON news_articles
  FOR SELECT USING (status = 'published' OR is_admin());

CREATE POLICY "Admins can insert news" ON news_articles
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update news" ON news_articles
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete news" ON news_articles
  FOR DELETE USING (is_admin());

-- 6. Ensure Users policies are correct (update existing ones if necessary)
-- The existing "Admins can view all profiles" uses is_admin(), which is now safe due to SECURITY DEFINER

-- 7. Fix daily_quota policies just in case
DROP POLICY IF EXISTS "Admins can manage quota" ON daily_quota;

CREATE POLICY "Admins can insert quota" ON daily_quota
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Admins can update quota" ON daily_quota
  FOR UPDATE USING (is_admin());

CREATE POLICY "Admins can delete quota" ON daily_quota
  FOR DELETE USING (is_admin());
