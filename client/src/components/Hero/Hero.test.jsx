import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from './Hero'

describe('Hero', () => {
  it('renders the headline and the explore-work call to action', () => {
    render(<Hero />)

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Ideas into/i)
    expect(screen.getByRole('link', { name: /Explore my work/i })).toHaveAttribute(
      'href',
      '#projects'
    )
  })
})
