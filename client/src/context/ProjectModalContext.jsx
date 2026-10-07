import { createContext, useContext, useEffect, useState } from 'react'
import ProjectModal from '../components/ProjectModal/ProjectModal'
import { getProjects } from '../lib/api'
import { PROJECT_ASSETS } from '../data/projectAssets'
import { canFly, fly, prefersReducedMotion } from '../components/ProjectModal/modalTransition'

const ProjectModalContext = createContext(null)

const cardVisualFor = (id) =>
  document.querySelector(`[data-project-id="${CSS.escape(id)}"] .project__visual-frame`)

const isOnScreen = (element) => {
  const rect = element.getBoundingClientRect()
  return (
    rect.bottom > 0 &&
    rect.top < window.innerHeight &&
    rect.right > 0 &&
    rect.left < window.innerWidth
  )
}
const CACHE_KEY = 'portfolio:projects:v1'

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
  const cached = readCache()
  const [projects, setProjects] = useState(cached ? mergeProjects(cached) : [])
  const [loading, setLoading] = useState(!cached)
  const [error, setError] = useState(null)
  const [openIndex, setOpenIndex] = useState(null)
  // How the modal was opened: 'flight' | 'grow' | 'fade' (see ProjectModal).
  const [mode, setMode] = useState('fade')
  const [origin, setOrigin] = useState(null)

  useEffect(() => {
    let ignore = false

    getProjects()
      .then((data) => {
        if (ignore) return
        setProjects(mergeProjects(data))
        writeCache(data)
      })
      .catch((err) => {
        // With cached data already on screen, fail silently in the
        // background instead of replacing it with an error message.
        if (!ignore && !cached) setError(err.message)
      })
      .finally(() => {
        if (!ignore) setLoading(false)
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

    fly({
      kind: 'close',
      from: tile,
      update: close,
      to: () => cardVisualFor(id),
    })
    return true
  }

  const step = (delta) => {
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
      value={{ experienceProjects, portfolioProjects, loading, error, openAt }}
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
