import { useTheme } from '../../hooks/useTheme'
import './ThemeToggle.css'

// A round switch for the header. The icon shows what a click will switch TO, which is the
// usual convention: a moon while the page is light, a sun while it is dark.
function ThemeToggle() {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
    >
      {isDark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M20.2 14.6A8.6 8.6 0 0 1 9.4 3.8a8.6 8.6 0 1 0 10.8 10.8Z" />
        </svg>
      )}
    </button>
  )
}

export default ThemeToggle
