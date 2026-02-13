import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key are required. Check your .env.local file.')
}

// Singleton pattern to prevent multiple instances in development/Turbopack
const supabaseClientSingleton = () => {
    return createClient(supabaseUrl, supabaseAnonKey)
}

declare global {
    var supabase: undefined | ReturnType<typeof supabaseClientSingleton>
}

export const supabase = globalThis.supabase ?? supabaseClientSingleton()

if (process.env.NODE_ENV !== 'production') globalThis.supabase = supabase
