import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase.types'

// Access environment variables
const supabaseUrl = process.env.SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

// Ensure that environment variables are set
if (!supabaseUrl || !supabaseKey) {
  if (import.meta.env.DEV) {
    console.warn(
      'Supabase credentials not found. Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment variables.'
    )
  }
  throw new Error('Supabase credentials are missing. Application cannot run without them.')
}

// Initialize Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

// Log initialization status (only in development)
if (import.meta.env.DEV) {
  console.log('Supabase client initialized successfully.')
}
