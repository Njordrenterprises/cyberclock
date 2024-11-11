import { createSignal } from 'solid-js'
import { supabase } from '~/lib/supabase'
import type { AuthError, Session, User, AuthChangeEvent } from '@supabase/supabase-js'
import type { Database } from '~/types/supabase.types'

type UserRole = Database['public']['Tables']['user_roles']['Row']

interface AuthState {
  user: User | null
  session: Session | null
  isAdmin: boolean
  isLoading: boolean
  error: string | null
}

export const [authState, setAuthState] = createSignal<AuthState>({
  user: null,
  session: null,
  isAdmin: false,
  isLoading: true,
  error: null
})

export const [authError, setAuthError] = createSignal<string | null>(null)

// Initialize auth state
supabase.auth.getSession().then(({ data: { session }, error }) => {
  console.log('Auth init:', { session, error })
  if (error) {
    setAuthState(prev => ({ 
      ...prev, 
      isLoading: false, 
      error: error.message 
    }))
    return
  }
  
  if (session) {
    checkAndSetAdminRole(session.user)
  }
  
  setAuthState(prev => ({ 
    ...prev, 
    session, 
    user: session?.user ?? null, 
    isLoading: false 
  }))
}).catch(error => {
  console.error('Auth init error:', error)
  setAuthState(prev => ({ 
    ...prev, 
    isLoading: false, 
    error: error.message 
  }))
})

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
  if (session) {
    await checkAndSetAdminRole(session.user)
  }
  setAuthState(prev => ({ ...prev, session, user: session?.user ?? null }))
})

async function checkAndSetAdminRole(user: User): Promise<void> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!error && data) {
    setAuthState(prev => ({ ...prev, isAdmin: data.role === 'admin' }))
  }
}

export async function signInWithEmail(
  email: string, 
  password: string
): Promise<{ data: { user: User | null; session: Session | null } | null; error: AuthError | null }> {
  setAuthError(null)
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    const authError = error as AuthError
    setAuthError(authError.message)
    return { data: null, error: authError }
  }
}

export async function signUp(
  email: string, 
  password: string
): Promise<{ data: { user: User | null; session: Session | null } | null; error: AuthError | null }> {
  setAuthError(null)
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    })

    if (error) {
      setAuthError(error.message)
      return { data: null, error }
    }

    // Handle email confirmation message
    if (data.user && data.user.identities?.length === 0) {
      setAuthError('Email already registered. Please sign in.')
      return { data: null, error: { message: 'Email exists' } as AuthError }
    }

    if (data.user && !data.user.confirmed_at) {
      setAuthError('Please check your email to confirm your account.')
    }
    
    return { data, error: null }
  } catch (error) {
    const authError = error as AuthError
    setAuthError(authError.message)
    return { data: null, error: authError }
  }
}

export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setAuthError(error.message)
      return
    }
    // Clear state before navigation
    setAuthState({
      user: null,
      session: null,
      isAdmin: false,
      isLoading: false,
      error: null
    })
    setAuthError(null)
  } catch (error) {
    console.error('Sign out error:', error)
    setAuthError('Error during sign out')
  }
}
