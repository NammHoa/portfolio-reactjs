import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { useReveal } from './useReveal'

let observers

class FakeObserver {
  constructor(callback) {
    this.callback = callback
    this.disconnected = false
    observers.push(this)
  }
  observe() {}
  unobserve() {}
  disconnect() {
    this.disconnected = true
  }
  fire(isIntersecting, top = 0) {
    this.callback([{ isIntersecting, boundingClientRect: { top } }])
  }
}

function Probe() {
  const { ref, isVisible, direction } = useReveal()
  return (
    <div ref={ref} data-testid="probe">
      {isVisible ? 'visible' : `hidden-${direction}`}
    </div>
  )
}

describe('useReveal', () => {
  const original = global.IntersectionObserver

  beforeEach(() => {
    observers = []
    global.IntersectionObserver = FakeObserver
  })

  afterEach(() => {
    global.IntersectionObserver = original
  })

  it('starts hidden and shows the element when it first scrolls into view', () => {
    render(<Probe />)
    expect(screen.getByTestId('probe')).toHaveTextContent('hidden-up')

    act(() => observers[0].fire(true))

    expect(screen.getByTestId('probe')).toHaveTextContent('visible')
  })

  it('stays shown when the element leaves the screen again, so the reveal plays only once', () => {
    render(<Probe />)

    act(() => observers[0].fire(true))
    act(() => observers[0].fire(false, 2000))

    expect(screen.getByTestId('probe')).toHaveTextContent('visible')
  })

  it('stops watching once it has been revealed', () => {
    render(<Probe />)

    act(() => observers[0].fire(true))

    expect(observers[0].disconnected).toBe(true)
  })

  it('remembers which side a not-yet-seen element will come in from', () => {
    render(<Probe />)
    Object.defineProperty(window, 'innerHeight', { value: 800, configurable: true })

    act(() => observers[0].fire(false, -500))

    expect(screen.getByTestId('probe')).toHaveTextContent('hidden-down')
  })
})
