import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase.types'

// Try both Vite and regular environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Missing Supabase environment variables. ' +
    'Please ensure VITE_SUPABASE_URL/SUPABASE_URL and ' +
    'VITE_SUPABASE_ANON_KEY/SUPABASE_ANON_KEY are set.'
  )
}

// Initialize Supabase client with validated credentials
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Export initialization status for runtime checks
export const isSupabaseInitialized = Boolean(supabaseUrl && supabaseKey)
