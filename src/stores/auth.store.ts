import { createSignal, createRoot, onMount } from 'solid-js'
import { isServer } from 'solid-js/web'
import { supabase } from '../lib/supabase'
import type { User, AuthError, Session } from '@supabase/supabase-js'

export type AuthState = {
  user: User | null
  session: Session | null
  initialized: boolean
  isLoading: boolean
}

const createAuthStore = () => {
  const [authState, setAuthState] = createSignal<AuthState>({
    user: null,
    session: null,
    initialized: isServer,
    isLoading: !isServer
  })

  const [authError, setAuthError] = createSignal<string | null>(null)
  let initialized = false

  const initializeAuth = async () => {
    if (isServer || initialized) return
    initialized = true

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      setAuthState(prev => ({
        ...prev,
        user: session?.user || null,
        session,
        initialized: true,
        isLoading: false
      }))

      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setAuthState(prev => ({
            ...prev,
            user: session?.user || null,
            session,
            isLoading: false
          }))

          if (event === 'SIGNED_OUT') {
            try {
              localStorage.clear()
            } catch (error) {
              console.warn('Failed to clear localStorage:', error)
            }
          }
        }
      )

      if (typeof window !== 'undefined') {
        window.addEventListener('beforeunload', () => {
          subscription.unsubscribe()
        })
      }

    } catch (error) {
      console.error('Auth initialization error:', error)
      setAuthState(prev => ({
        ...prev,
        initialized: true,
        isLoading: false
      }))
    }
  }

  if (!isServer) {
    queueMicrotask(initializeAuth)
  }

  return {
    authState,
    authError,
    setAuthError,
    signOut: async () => {
      setAuthError(null)
      try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        return { error: null }
      } catch (error) {
        const authError = error as AuthError
        setAuthError(authError.message)
        return { error: authError }
      }
    },
    signInWithEmail: async (email: string, password: string) => {
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
    },
    signUp: async (email: string, password: string) => {
      setAuthError(null)
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`
          }
        })
        if (error) throw error
        return { data, error: null }
      } catch (error) {
        const authError = error as AuthError
        setAuthError(authError.message)
        return { data: null, error: authError }
      }
    }
  }
}

export const { authState, authError, setAuthError, signOut, signInWithEmail, signUp } = createRoot(createAuthStore)
