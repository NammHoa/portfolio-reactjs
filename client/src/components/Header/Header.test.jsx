import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from './Header'

describe('Header', () => {
  it('renders the logo and nav links', () => {
    render(<Header />)

    expect(screen.getByText('.HN')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(screen.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '#projects')
    expect(screen.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#portfolio')
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '#skills')
  })

  it('toggles the mobile menu button state on click', () => {
    render(<Header />)

    const toggle = screen.getByRole('button', { name: /open menu/i })
    expect(toggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(toggle)

    expect(screen.getByRole('button', { name: /close menu/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    )
  })
})
