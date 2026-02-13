-- ============================================
-- EMERGENCY FIX: STOP RECURSION
-- ============================================

-- Disable RLS momentarily to clear state if needed (optional but good for reset)
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Drop ALL policies on users table to ensure no hidden recursive policies remain
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can manage all bookings" ON public.users; -- Just in case generic names were used
DROP POLICY IF EXISTS "Enable read access for all users" ON public.users;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.users;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.users;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON public.users;

-- Re-enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create ONLY the critical "Self View" policy
-- This checks (auth.uid() = id) which is NOT recursive.
-- This allows the AdminContext to fetch the CURRENT user's profile to check their role.
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- NOTE: We are intentionally NOT adding "Admins can view all profiles" yet.
-- This policy was the source of the recursion loop.
-- Without it, the "List Users" page might not work for now, 
-- but LOGIN and DASHBOARD will work.

-- Fix complete.
