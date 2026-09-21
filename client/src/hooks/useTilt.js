import { useRef } from 'react'

export function useTilt(strength = 12) {
  const innerRef = useRef(null)

  const onMouseMove = (event) => {
    const el = innerRef.current
    if (!el) return
    const rect = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width - 0.5
    const y = (event.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `rotateY(${x * strength}deg) rotateX(${-y * strength}deg)`
  }

  const onMouseLeave = () => {
    const el = innerRef.current
    if (!el) return
    el.style.transform = 'rotateY(0deg) rotateX(0deg)'
  }

  return { innerRef, onMouseMove, onMouseLeave }
}
