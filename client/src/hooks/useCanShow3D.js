import { useEffect, useState } from 'react'

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
  } catch {
    return false
  }
}

export function useCanShow3D() {
  const [canShow, setCanShow] = useState(false)

  useEffect(() => {
    const isDesktop = window.matchMedia('(min-width: 900px)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setCanShow(isDesktop && !reducedMotion && hasWebGL())
  }, [])

  return canShow
}
