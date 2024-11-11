import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase.types'

// Try both Vite and regular environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

// Initialize status flag
export const isSupabaseInitialized = Boolean(supabaseUrl && supabaseKey)

// Create a dummy client for offline/fallback mode
const dummyClient = {
  auth: {
    getSession: () => Promise.resolve(null),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: null, error: null, subscription: { unsubscribe: () => {} } })
  }
} as unknown as ReturnType<typeof createClient>

// Initialize Supabase client with validated credentials or fallback
export const supabase = isSupabaseInitialized
  ? createClient<Database>(supabaseUrl!, supabaseKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : dummyClient

// Log initialization status (only in development)
if (import.meta.env.DEV && !isSupabaseInitialized) {
  console.warn(
    'Supabase credentials not found. Running in offline mode.\n' +
    'To enable online features, please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.'
  )
}
