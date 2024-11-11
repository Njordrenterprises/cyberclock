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
async function initializeAuth() {
  try {
    const { data, error } = await supabase.auth.getSession()
    console.log('Auth init:', { session: data.session, error })
    if (error) {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error.message 
      }))
      return
    }
    
    if (data.session) {
      await checkAndSetAdminRole(data.session.user)
      setAuthState(prev => ({ 
        ...prev, 
        session: data.session, 
        user: data.session.user,
        isLoading: false 
      }))
    } else {
      setAuthState(prev => ({ 
        ...prev, 
        isLoading: false 
      }))
    }
  } catch (error) {
    console.error('Auth init error:', error)
    setAuthState(prev => ({ 
      ...prev, 
      isLoading: false, 
      error: (error as Error).message 
    }))
  }
}

// Listen for auth changes
supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
  console.log('Auth state change:', event, session)
  if (session) {
    await checkAndSetAdminRole(session.user)
  }
  setAuthState(prev => ({ ...prev, session, user: session?.user ?? null }))
})

// Function to check and set admin role
async function checkAndSetAdminRole(user: User): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (!error && data) {
      setAuthState(prev => ({ ...prev, isAdmin: data.role === 'admin' }))
    } else {
      console.warn('Failed to fetch user role:', error?.message)
      setAuthState(prev => ({ ...prev, isAdmin: false }))
    }
  } catch (error) {
    console.error('Error fetching user role:', error)
    setAuthState(prev => ({ ...prev, isAdmin: false }))
  }
}

// Initialize authentication on store load
initializeAuth()

export async function signInWithEmail(
  email: string, 
  password: string
): Promise<{ data: { user: User | null; session: Session | null } | null; error: AuthError | null }> {
  setAuthError(null)
  try {
    console.log('Attempting signInWithPassword...')
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    console.log('Auth response:', { data, error })
    
    if (error) {
      console.error('Auth error:', error)
      throw error
    }
    
    if (data.session) {
      console.log('Setting auth state...')
      await checkAndSetAdminRole(data.session.user)
      setAuthState(prev => ({
        ...prev,
        user: data.session.user,
        session: data.session,
        isLoading: false,
        error: null
      }))
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Caught error during sign-in:', error)
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
        emailRedirectTo: `${window.location.origin}/login`
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
