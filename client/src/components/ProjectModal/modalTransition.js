import { flushSync } from 'react-dom'

// The project visual on the page "flies" into the one inside the modal (and back)
// using the View Transitions API: the browser animates one shared element from
// its old rectangle to its new one. The look is set in ProjectModal.css.
const NAME = 'project-visual'

let running = null
const named = new Set()

export const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const canFly = () =>
  typeof document.startViewTransition === 'function' && !prefersReducedMotion()

function setName(element, value = NAME) {
  element.style.viewTransitionName = value
  named.add(element)
}

function clearNames() {
  named.forEach((element) => element.style.removeProperty('view-transition-name'))
  named.clear()
}

const radiusOf = (element) =>
  element ? getComputedStyle(element).borderTopLeftRadius : '0px'

// kind: 'open' | 'close' | 'change'
// from:   the visual shown before the update (or null)
// update: the state change that mounts / unmounts / swaps the modal
// to:     returns the visual that exists after the update (or null)
export function fly({ kind, from, update, to }) {
  const root = document.documentElement

  running?.skipTransition()
  clearNames()

  root.dataset.projectTransition = kind
  if (from) setName(from)
  const radiusFrom = radiusOf(from)

  const transition = document.startViewTransition(async () => {
    // Only one element may carry the name in the new state.
    if (from) from.style.viewTransitionName = 'none'
    flushSync(update)

    const target = to()
    if (!target) return

    const image = target.querySelector('img')
    if (image?.decode) await image.decode().catch(() => {})

    setName(target)
    root.style.setProperty('--vt-radius-from', radiusFrom)
    root.style.setProperty('--vt-radius-to', radiusOf(target))
  })

  running = transition

  const finish = () => {
    if (running !== transition) return
    running = null
    clearNames()
    delete root.dataset.projectTransition
    root.style.removeProperty('--vt-radius-from')
    root.style.removeProperty('--vt-radius-to')
  }

  transition.ready.catch(() => {})
  transition.finished.then(finish, finish)
}

// Fallback for projects without a visual (or browsers without View Transitions):
// the panel grows out of the card that was clicked and shrinks back into it.
export function grow(panel, origin, direction) {
  const from = origin.getBoundingClientRect()
  const to = panel.getBoundingClientRect()
  const scale = Math.max(0.3, Math.min(from.width / to.width, from.height / to.height, 1))
  const dx = from.left + from.width / 2 - (to.left + to.width / 2)
  const dy = from.top + from.height / 2 - (to.top + to.height / 2)

  const small = { opacity: 0, transform: `translate(${dx}px, ${dy}px) scale(${scale})` }
  const full = { opacity: 1, transform: 'none' }

  return panel.animate(direction === 'in' ? [small, full] : [full, small], {
    duration: direction === 'in' ? 600 : 420,
    easing: direction === 'in' ? 'cubic-bezier(0.22, 1, 0.36, 1)' : 'cubic-bezier(0.5, 0, 0.75, 0)',
    fill: 'both',
  })
}
