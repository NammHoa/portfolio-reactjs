import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import ThemeToggle from './ThemeToggle'

// A controllable stand-in for the system's colour-scheme setting.
function mockSystemTheme(dark) {
  const listeners = new Set()
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: dark,
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_type, fn) => listeners.add(fn),
    removeEventListener: (_type, fn) => listeners.delete(fn),
  }))
  return (nextDark) => listeners.forEach((fn) => fn({ matches: nextDark }))
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    delete document.documentElement.dataset.theme
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('starts light when the system is light and nothing is saved', () => {
    mockSystemTheme(false)
    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(screen.getByRole('button', { name: /switch to dark theme/i })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('starts dark when the system prefers dark', () => {
    mockSystemTheme(true)
    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(screen.getByRole('button', { name: /switch to light theme/i })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('switches theme on click and remembers the choice', () => {
    mockSystemTheme(false)
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button', { name: /switch to dark theme/i }))

    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(localStorage.getItem('portfolio:theme')).toBe('dark')

    fireEvent.click(screen.getByRole('button', { name: /switch to light theme/i }))

    expect(document.documentElement.dataset.theme).toBe('light')
    expect(localStorage.getItem('portfolio:theme')).toBe('light')
  })

  it('uses the saved choice instead of the system setting', () => {
    mockSystemTheme(true)
    localStorage.setItem('portfolio:theme', 'light')
    document.documentElement.dataset.theme = 'light' // what /theme-init.js does before React

    render(<ThemeToggle />)

    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('follows the system while the visitor has not chosen, and stops once they have', () => {
    const changeSystem = mockSystemTheme(false)
    render(<ThemeToggle />)

    act(() => changeSystem(true))
    expect(document.documentElement.dataset.theme).toBe('dark')

    fireEvent.click(screen.getByRole('button', { name: /switch to light theme/i }))
    act(() => changeSystem(true))
    expect(document.documentElement.dataset.theme).toBe('light')
  })

  it('still works when storage is blocked', () => {
    mockSystemTheme(false)
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked')
    })
    render(<ThemeToggle />)

    fireEvent.click(screen.getByRole('button', { name: /switch to dark theme/i }))

    expect(document.documentElement.dataset.theme).toBe('dark')
  })
})
