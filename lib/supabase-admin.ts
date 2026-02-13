import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("Missing Supabase Service Role Key. Make sure SUPABASE_SERVICE_ROLE_KEY is set in .env.local")
}

// Client with Service Role access - BYPASSES RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey || '', {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})
