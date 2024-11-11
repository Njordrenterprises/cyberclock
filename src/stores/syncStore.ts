import { createSignal, createEffect } from 'solid-js'
import { supabase } from '../lib/supabase'
import { timerDb } from '../db/timer.db'
import type { Database } from '../types/supabase.types'

type TimeEntry = Database['public']['Tables']['time_entries']['Row']

export const [isOnline, setIsOnline] = createSignal(navigator.onLine)
export const [isSyncing, setIsSyncing] = createSignal(false)

// Listen for online/offline events
window.addEventListener('online', () => {
  setIsOnline(true)
  syncTimeEntries()
})
window.addEventListener('offline', () => setIsOnline(false))

async function syncTimeEntries() {
  if (!isOnline() || isSyncing()) return
  
  setIsSyncing(true)
  try {
    const unsyncedEntries = await timerDb.getUnsyncedEntries()
    
    for (const entry of unsyncedEntries) {
      if (typeof entry.id !== 'number') continue;
      
      const { error } = await supabase
        .from('time_entries')
        .upsert({
          id: entry.id.toString(), // Convert to string for Supabase
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

// Auto-sync when online
createEffect(() => {
  if (isOnline()) {
    syncTimeEntries()
  }
})
