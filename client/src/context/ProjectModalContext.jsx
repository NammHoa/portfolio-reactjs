import { createContext, useContext, useEffect, useState } from 'react'
import ProjectModal from '../components/ProjectModal/ProjectModal'
import { getProjects } from '../lib/api'
import { PROJECT_ASSETS } from '../data/projectAssets'
import fallbackProjects from '../data/projects.fallback.json'
import { canFly, fly, prefersReducedMotion } from '../components/ProjectModal/modalTransition'

const ProjectModalContext = createContext(null)

const cardVisualFor = (id) =>
  document.querySelector(`[data-project-id="${CSS.escape(id)}"] .project__visual-frame`)

// On phones the whole panel scrolls. Bring it back to the top first, so the picture is in
// view when it flies and the next project always starts at its beginning.
const scrollPanelToTop = () => {
  const panel = document.querySelector('.modal-panel')
  if (panel && panel.scrollTop > 0) panel.scrollTop = 0
}

const isOnScreen = (element) => {
  const rect = element.getBoundingClientRect()
  return (
    rect.bottom > 0 &&
    rect.top < window.innerHeight &&
    rect.right > 0 &&
    rect.left < window.innerWidth
  )
}

// v2: the first version could outrank the baked-in copy with stale data after a deploy.
const CACHE_KEY = 'portfolio:projects:v2'

function mergeProjects(data) {
  return data.map((project, i) => ({
    ...project,
    ...PROJECT_ASSETS[project.name],
    index: String(i + 1).padStart(2, '0'),
  }))
}

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(data))
  } catch {
    // Storage unavailable (private mode, quota) — safe to skip caching.
  }
}

export function ProjectModalProvider({ children }) {
  // The page never waits for the API: it starts from the last answer this browser
  // saw, or else from the copy baked into the build, and swaps in live data when
  // the API replies. A sleeping or failing API therefore changes nothing on screen.
  const [projects, setProjects] = useState(() =>
    mergeProjects(readCache() ?? fallbackProjects)
  )
  const [openIndex, setOpenIndex] = useState(null)
  // How the modal was opened: 'flight' | 'grow' | 'fade' (see ProjectModal).
  const [mode, setMode] = useState('fade')
  const [origin, setOrigin] = useState(null)

  useEffect(() => {
    let ignore = false

    getProjects()
      .then((data) => {
        // An empty or malformed answer must not wipe out what is already showing.
        if (ignore || !Array.isArray(data) || data.length === 0) return
        setProjects(mergeProjects(data))
        writeCache(data)
      })
      .catch(() => {
        // Offline, asleep or failing API: keep showing what we have.
      })

    return () => {
      ignore = true
    }
  }, [])

  const experienceProjects = projects.filter((p) => p.category === 'experience')
  const portfolioProjects = projects.filter((p) => p.category === 'project')

  // `article` is the project row / card that was clicked. If it has a visual,
  // that visual flies into the modal; otherwise the panel grows out of the card.
  const openAt = (id, article) => {
    const idx = projects.findIndex((p) => p._id === id)
    if (idx === -1) return

    const frame = article?.querySelector('.project__visual-frame')
    setOrigin(article ?? null)

    if (frame && canFly()) {
      setMode('flight')
      fly({
        kind: 'open',
        from: frame,
        update: () => setOpenIndex(idx),
        to: () => document.querySelector('.modal-visual-tile'),
      })
      return
    }

    setMode(prefersReducedMotion() ? 'fade' : 'grow')
    setOpenIndex(idx)
  }

  const close = () => setOpenIndex(null)

  // Returns true when the visual is flying back to its card (which also unmounts
  // the modal); false means the modal should play its own exit and call close.
  const requestClose = () => {
    if (mode !== 'flight' || !canFly()) return false
    const id = projects[openIndex]._id
    const tile = document.querySelector('.modal-visual-tile')
    const card = cardVisualFor(id)
    if (!tile || !card || !isOnScreen(card)) return false

    scrollPanelToTop()
    fly({
      kind: 'close',
      from: tile,
      update: close,
      to: () => cardVisualFor(id),
    })
    return true
  }

  const step = (delta) => {
    scrollPanelToTop()
    const apply = () =>
      setOpenIndex((current) => (current + delta + projects.length) % projects.length)

    if (mode === 'flight' && canFly()) {
      fly({
        kind: 'change',
        from: document.querySelector('.modal-visual-tile'),
        update: apply,
        to: () => document.querySelector('.modal-visual-tile'),
      })
    } else {
      apply()
    }
  }
  const prev = () => step(-1)
  const next = () => step(1)

  return (
    <ProjectModalContext.Provider
      value={{ experienceProjects, portfolioProjects, openAt }}
    >
      {children}
      {openIndex !== null && (
        <ProjectModal
          project={projects[openIndex]}
          total={projects.length}
          mode={mode}
          origin={origin}
          onRequestClose={requestClose}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </ProjectModalContext.Provider>
  )
}

export function useProjectModal() {
  const ctx = useContext(ProjectModalContext)
  if (!ctx) {
    throw new Error('useProjectModal must be used within a ProjectModalProvider')
  }
  return ctx
}
