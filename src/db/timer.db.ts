// Type definitions
interface TimeEntry {
  id?: number;
  start_time: number;
  end_time?: number;
  duration?: number;
  created_at?: number;
}

interface DbAdapter {
  startTimer(): number;
  stopTimer(id: number): void;
  getLastSession(): TimeEntry | null;
  getTotalTime(): { total: number } | null;
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

  startTimer(): number {
    this.lastId++;
    const entry: TimeEntry = {
      id: this.lastId,
      start_time: Date.now(),
      created_at: Math.floor(Date.now() / 1000)
    };
    this.store.set(this.lastId, entry);
    this.persistToStorage();
    return this.lastId;
  }

  stopTimer(id: number): void {
    const entry = this.store.get(id);
    if (entry) {
      const end_time = Date.now();
      entry.end_time = end_time;
      entry.duration = end_time - entry.start_time;
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
        start_time INTEGER NOT NULL,
        end_time INTEGER,
        duration INTEGER,
        created_at INTEGER DEFAULT (unixepoch())
      )
    `);

    dbAdapter = {
      startTimer: () => {
        return db.run(
          'INSERT INTO time_entries (start_time) VALUES (?)',
          [Date.now()]
        ).lastInsertRowId;
      },
      stopTimer: (id: number) => {
        const end_time = Date.now();
        db.run(
          `UPDATE time_entries 
           SET end_time = ?, 
               duration = ? - start_time 
           WHERE id = ?`,
          [end_time, end_time, id]
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
      }
    };
  } catch (error) {
    console.error('Failed to initialize SQLite:', error);
  }
}

export { dbAdapter as timerDb };
