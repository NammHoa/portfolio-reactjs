import { useEffect } from 'react'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

// Smooth, inertial scrolling for the whole page (wheel, trackpad and nav-link clicks), the way
// vgang.studio does it. Skipped for people who asked their system for reduced motion. The
// project dialog opts out with data-lenis-prevent, so it scrolls natively.
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({
      autoRaf: true,
      anchors: true,
      lerp: 0.1,
    })
    return () => lenis.destroy()
  }, [])
}
