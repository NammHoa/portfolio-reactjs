import { useCallback, useEffect, useState } from 'react'

// The theme lives on <html data-theme>. The page always opens light (no data-theme means light)
// and dark only appears after the visitor switches to it. Nothing is remembered: the next visit
// starts light again.
export function useTheme() {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggle }
}
