import { useEffect, useRef, useState } from 'react'

// Tells a section when it has scrolled into view for the first time. The reveal plays once:
// after that the element stays shown, so scrolling up and down again does not replay it.
export function useReveal(options = {}) {
  const { threshold = 0.15, rootMargin = '0px' } = options
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [direction, setDirection] = useState('up')

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Still waiting for the first time: remember which side it will come in from.
          const viewportCenter = window.innerHeight / 2
          setDirection(entry.boundingClientRect.top > viewportCenter ? 'up' : 'down')
          return
        }
        setVisible(true)
        observer.disconnect()
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isVisible: visible, direction }
}
