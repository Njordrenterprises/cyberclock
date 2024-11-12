import { createSignal, createEffect, onCleanup } from 'solid-js'
import { isServer } from 'solid-js/web'
import { supabase } from '~/lib/supabase'
import { timerDb } from '~/db/timer.db'
import { authState } from '~/stores/auth.store'
import type { Database } from '../types/supabase.types'

type TimeEntry = Database['public']['Tables']['time_entries']['Row']

// Initialize signals with safe default values
export const [isOnline, setIsOnline] = createSignal(true)
export const [isSyncing, setIsSyncing] = createSignal(false)
export const [syncError, setSyncError] = createSignal<string | null>(null)
export const [retryCount, setRetryCount] = createSignal(0)

const MAX_RETRIES = 3
const RETRY_DELAY = 1000

let initialized = false

function setupConnectionListeners() {
  if (isServer) return

  let onlineStatus = true
  try {
    onlineStatus = typeof navigator !== 'undefined' ? navigator.onLine : true
  } catch {
    console.warn('Navigator API not available, defaulting to online')
  }
  setIsOnline(onlineStatus)

  if (typeof window !== 'undefined') {
    const handleOnline = () => {
      setIsOnline(true)
      setSyncError(null)
      setRetryCount(0)
    }

    const handleOffline = () => {
      setIsOnline(false)
      setSyncError('Network connection lost')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    onCleanup(() => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    })
  }
}

export async function syncTimeEntries() {
  if (!isOnline() || isSyncing()) return
  
  setIsSyncing(true)
  setSyncError(null)

  try {
    const unsyncedEntries = await timerDb.getUnsyncedEntries()
    
    for (const entry of unsyncedEntries) {
      if (typeof entry.id !== 'number') continue
      
      try {
        const { error } = await supabase
          .from('time_entries')
          .upsert({
            id: entry.id.toString(),
            member_id: entry.member_id || '',
            project_id: entry.project_id || '',
            start_time: entry.start_time,
            end_time: entry.end_time,
            duration: entry.duration,
            synced: true,
            updated_at: new Date().toISOString()
          })
        
        if (error) throw error
        await timerDb.markAsSynced(entry.id)
        
      } catch (error) {
        if (retryCount() < MAX_RETRIES) {
          setRetryCount(count => count + 1)
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY))
          continue
        }
        throw error
      }
    }
  } catch (error) {
    console.error('Sync failed:', error)
    setSyncError(error instanceof Error ? error.message : 'Sync failed')
  } finally {
    setIsSyncing(false)
  }
}

// Single export for initialization
export function initializeSyncStore() {
  if (isServer || initialized) return
  initialized = true

  createEffect(() => {
    if (!authState().isLoading) {
      setupConnectionListeners()
    }
  })
}
