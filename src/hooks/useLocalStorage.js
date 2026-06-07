import { useState, useEffect } from 'react'

/**
 * useLocalStorage — a useState that transparently persists to localStorage.
 *
 * @param {string} key            localStorage key to read/write.
 * @param {*}      initialValue   value used when nothing is stored yet.
 * @returns [value, setValue]     same shape as useState.
 *
 * Reads once on mount (lazy initialiser) and writes on every change. Wrapped in
 * try/catch so a corrupt entry or a privacy-mode browser never crashes the app.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage might be full or disabled (private mode) — fail silently.
    }
  }, [key, value])

  return [value, setValue]
}
