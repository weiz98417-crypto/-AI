/**
 * DataStore — a simple reactive persistence layer backed by localStorage.
 *
 * Each DataStore instance manages one typed key. Subscribers are notified
 * on every write(), enabling cross-context reactivity (admin ↔ user app).
 */

export class DataStore<T> {
  private key: string
  private seedData: T
  private listeners = new Set<(data: T) => void>()

  constructor(key: string, seedData: T) {
    this.key = key
    this.seedData = seedData
  }

  read(): T {
    try {
      const raw = localStorage.getItem(this.key)
      if (raw !== null) {
        return JSON.parse(raw) as T
      }
    } catch { /* corrupted data — fall through to seed */ }
    return this.seedData
  }

  write(data: T): void {
    localStorage.setItem(this.key, JSON.stringify(data))
    // Notify all subscribers synchronously
    for (const fn of this.listeners) {
      try { fn(data) } catch { /* swallow subscriber errors */ }
    }
  }

  subscribe(fn: (data: T) => void): () => void {
    this.listeners.add(fn)
    return () => { this.listeners.delete(fn) }
  }

  getSeed(): T {
    return this.seedData
  }

  /** Reset to seed data */
  reset(): void {
    localStorage.removeItem(this.key)
    this.write(this.seedData)
  }

  /** Check whether data exists in localStorage */
  exists(): boolean {
    return localStorage.getItem(this.key) !== null
  }
}
