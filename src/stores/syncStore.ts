import { createSignal, createEffect, onCleanup } from 'solid-js'
import { isServer } from 'solid-js/web'
import { supabase } from '../lib/supabase'
import { timerDb } from '../db/timer.db'
import type { Database } from '../types/supabase.types'

type TimeEntry = Database['public']['Tables']['time_entries']['Row']

// Initialize signals with safe default values
export const [isOnline, setIsOnline] = createSignal(true)
export const [isSyncing, setIsSyncing] = createSignal(false)

// Only run this code on the client side
if (!isServer) {
  createEffect(() => {
    // Initialize online status
    setIsOnline(navigator?.onLine ?? true)

    // Setup event listeners
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Cleanup event listeners
    onCleanup(() => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    })
  })
}

async function syncTimeEntries() {
  if (!isOnline() || isSyncing()) return
  
  setIsSyncing(true)
  try {
    const unsyncedEntries = await timerDb.getUnsyncedEntries()
    
    for (const entry of unsyncedEntries) {
      if (typeof entry.id !== 'number') continue
      
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
      
      if (!error) {
        timerDb.markAsSynced(entry.id)
      }
    }
  } catch (error) {
    console.error('Sync failed:', error)
  } finally {
    setIsSyncing(false)
  }
}

export { syncTimeEntries }
