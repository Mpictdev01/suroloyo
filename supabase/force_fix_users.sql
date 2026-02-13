-- ============================================
-- FORCE FIX: DROP ALL USERS POLICIES (DYNAMICALLY)
-- ============================================

-- 1. Dynamic Block to Drop ALL policies on 'users' table
-- This ignores the policy names and just wipes the slate clean for this table.
DO $$ 
DECLARE 
    pol record; 
BEGIN 
    FOR pol IN SELECT policyname FROM pg_policies WHERE tablename = 'users' AND schemaname = 'public' 
    LOOP 
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.users', pol.policyname); 
    END LOOP; 
END $$;

-- 2. Disable and Re-enable RLS to ensure clean state
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Create SIMPLEST SAFE POLICY
-- Only allow a user to view their own row.
-- NO admin checks here. No recursion possible.
CREATE POLICY "safe_view_own_profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Allow update own profile
CREATE POLICY "safe_update_own_profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- 4. Redefine is_admin just to be 100% sure it is safe for OTHER tables
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 5. Grant permissions (fix for 403 errors if any)
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO service_role;
