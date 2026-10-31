import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'portfolio:theme'
const DARK_QUERY = '(prefers-color-scheme: dark)'

function readStored() {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

function systemTheme() {
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

// The theme lives on <html data-theme>. /theme-init.js sets it before the first paint; this
// hook keeps React in step with it, saves an explicit choice, and (until the visitor has
// chosen) follows the system setting when it changes.
export function useTheme() {
  const [theme, setTheme] = useState(
    () => document.documentElement.dataset.theme || readStored() || systemTheme()
  )

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    const query = window.matchMedia(DARK_QUERY)
    const follow = (event) => {
      if (readStored() === null) setTheme(event.matches ? 'dark' : 'light')
    }
    query.addEventListener?.('change', follow)
    return () => query.removeEventListener?.('change', follow)
  }, [])

  const toggle = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch {
        // Private mode or blocked storage: the choice just lasts for this visit.
      }
      return next
    })
  }, [])

  return { theme, toggle }
}
