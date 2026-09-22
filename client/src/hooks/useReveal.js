import { useEffect, useRef, useState } from 'react'

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
        const viewportCenter = window.innerHeight / 2
        const comingFromBelow = entry.boundingClientRect.top > viewportCenter
        setDirection(comingFromBelow ? 'up' : 'down')
        setVisible(entry.isIntersecting)
      },
      { threshold, rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isVisible: visible, direction }
}
