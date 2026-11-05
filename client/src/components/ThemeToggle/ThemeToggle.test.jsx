import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ThemeToggle from './ThemeToggle'

// A stand-in for the system's colour-scheme setting. The page must ignore it either way.
function mockSystemTheme(dark) {
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: dark,
    media: '(prefers-color-scheme: dark)',
    addEventListener: () => {},
    removeEventListener: () => {},
  }))
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts light when nothing is saved', () => {
    mockSystemTheme(false)
    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('still starts light when the system prefers dark', () => {
    mockSystemTheme(true)
    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('switches theme on click and does not remember it', () => {
    mockSystemTheme(false)
    localStorage.clear()
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button', { name: /switch to dark theme/i }))

    expect(document.documentElement.dataset.theme).toBe('dark')

    fireEvent.click(screen.getByRole('button', { name: /switch to light theme/i }))

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('portfolio:theme')).toBeNull()
  })

  it('starts light on the next visit, even after dark was chosen before', () => {
    mockSystemTheme(false)
    localStorage.setItem('portfolio:theme', 'dark') // left over from an older version
    document.documentElement.dataset.theme = 'dark'

    const { unmount } = render(<ThemeToggle />)
    unmount()
    delete document.documentElement.dataset.theme // a fresh page load

    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('light')
  })

})
