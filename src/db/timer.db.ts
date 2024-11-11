// Type definitions
interface TimeEntry {
  id?: number;
  member_id?: string;
  project_id?: string;
  start_time: number;
  end_time?: number | null;
  duration?: number | null;
  synced?: boolean;
  created_at?: number;
  updated_at?: number;
}

interface DbAdapter {
  startTimer(memberId?: string, projectId?: string): number;
  stopTimer(id: number): void;
  getLastSession(): TimeEntry | null;
  getTotalTime(): { total: number } | null;
  getUnsyncedEntries(): TimeEntry[];
  markAsSynced(id: number): void;
}

// Memory store for development and client-side
class MemoryAdapter implements DbAdapter {
  private store: Map<number, TimeEntry> = new Map();
  private lastId = 0;

  constructor() {
    this.initializeFromStorage();
  }

  private initializeFromStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('timerEntries');
        if (stored) {
          const entries = JSON.parse(stored);
          entries.forEach(([id, entry]: [number, TimeEntry]) => {
            this.store.set(id, entry);
            this.lastId = Math.max(this.lastId, id);
          });
        }
      } catch (error) {
        console.error('Failed to load from storage:', error);
      }
    }
  }

  private persistToStorage(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('timerEntries', 
          JSON.stringify(Array.from(this.store.entries()))
        );
      } catch (error) {
        console.error('Failed to persist to storage:', error);
      }
    }
  }

  startTimer(memberId?: string, projectId?: string): number {
    this.lastId++;
    const now = Date.now();
    const entry: TimeEntry = {
      id: this.lastId,
      member_id: memberId,
      project_id: projectId,
      start_time: now,
      created_at: Math.floor(now / 1000),
      updated_at: Math.floor(now / 1000),
      synced: false
    };
    this.store.set(this.lastId, entry);
    this.persistToStorage();
    return this.lastId;
  }

  stopTimer(id: number): void {
    const entry = this.store.get(id);
    if (entry) {
      const now = Date.now();
      entry.end_time = now;
      entry.duration = now - entry.start_time;
      entry.updated_at = Math.floor(now / 1000);
      entry.synced = false;
      this.store.set(id, entry);
      this.persistToStorage();
    }
  }

  getLastSession(): TimeEntry | null {
    if (this.store.size === 0) return null;
    return Array.from(this.store.values()).pop() || null;
  }

  getTotalTime(): { total: number } | null {
    const total = Array.from(this.store.values())
      .reduce((acc, entry) => acc + (entry.duration || 0), 0);
    return { total };
  }

  getUnsyncedEntries(): TimeEntry[] {
    return Array.from(this.store.values())
      .filter(entry => !entry.synced);
  }

  markAsSynced(id: number): void {
    const entry = this.store.get(id);
    if (entry) {
      entry.synced = true;
      entry.updated_at = Math.floor(Date.now() / 1000);
      this.store.set(id, entry);
      this.persistToStorage();
    }
  }
}

// Use MemoryAdapter by default
let dbAdapter: DbAdapter = new MemoryAdapter();

// Only try to load SQLite in Bun environment
if (typeof process !== 'undefined' && process.versions?.bun) {
  try {
    const { Database } = require('bun:sqlite');
    const db = new Database('timer.db', { 
      readwrite: true,
      create: true 
    });

    db.run("PRAGMA journal_mode = WAL;");
    
    db.run(`
      CREATE TABLE IF NOT EXISTS time_entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        member_id TEXT,
        project_id TEXT,
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        duration INTEGER,
        synced BOOLEAN DEFAULT 0,
        created_at INTEGER DEFAULT (unixepoch()),
        updated_at INTEGER DEFAULT (unixepoch())
      )
    `);

    dbAdapter = {
      startTimer: (memberId?: string, projectId?: string) => {
        const now = Date.now();
        return db.run(
          `INSERT INTO time_entries (
            member_id, project_id, start_time, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?)`,
          [memberId, projectId, now, Math.floor(now / 1000), Math.floor(now / 1000)]
        ).lastInsertRowId;
      },
      stopTimer: (id: number) => {
        const now = Date.now();
        db.run(
          `UPDATE time_entries 
           SET end_time = ?,
               duration = ? - start_time,
               updated_at = ?,
               synced = 0
           WHERE id = ?`,
          [now, now, Math.floor(now / 1000), id]
        );
      },
      getLastSession: () => {
        return db.query(
          'SELECT * FROM time_entries ORDER BY id DESC LIMIT 1'
        ).get() as TimeEntry | null;
      },
      getTotalTime: () => {
        return db.query(
          'SELECT SUM(duration) as total FROM time_entries'
        ).get() as { total: number } | null;
      },
      getUnsyncedEntries: () => {
        return db.query(
          'SELECT * FROM time_entries WHERE synced = 0'
        ).all() as TimeEntry[];
      },
      markAsSynced: (id: number) => {
        const now = Math.floor(Date.now() / 1000);
        db.run(
          'UPDATE time_entries SET synced = 1, updated_at = ? WHERE id = ?',
          [now, id]
        );
      }
    };
  } catch (error) {
    console.error('Failed to initialize SQLite:', error);
  }
}

export { dbAdapter as timerDb };
