import { useState, useEffect, useCallback } from 'react'
import type { DataStore } from './DataStore'

/**
 * React Hook wrapping a DataStore instance.
 * Returns [data, setData] — reads on mount, subscribes to changes,
 * and writes through to the store on setData.
 */
export function useStore<T>(store: DataStore<T>): [T, (data: T | ((prev: T) => T)) => void] {
  const [data, setData] = useState<T>(() => store.read())

  useEffect(() => {
    // Subscribe to external writes (e.g. from another tab or the admin app)
    const unsub = store.subscribe((next) => setData(next))
    return unsub
  }, [store])

  const write = useCallback((update: T | ((prev: T) => T)) => {
    setData((prev) => {
      const next = typeof update === 'function'
        ? (update as (prev: T) => T)(prev)
        : update
      store.write(next)
      return next
    })
  }, [store])

  return [data, write]
}
