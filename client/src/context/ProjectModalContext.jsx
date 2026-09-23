import { createContext, useContext, useEffect, useState } from 'react'
import ProjectModal from '../components/ProjectModal/ProjectModal'
import { getProjects } from '../lib/api'
import { PROJECT_ASSETS } from '../data/projectAssets'

const ProjectModalContext = createContext(null)

export function ProjectModalProvider({ children }) {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [openIndex, setOpenIndex] = useState(null)

  useEffect(() => {
    let ignore = false

    getProjects()
      .then((data) => {
        if (ignore) return
        const merged = data.map((project, i) => ({
          ...project,
          ...PROJECT_ASSETS[project.name],
          index: String(i + 1).padStart(2, '0'),
        }))
        setProjects(merged)
      })
      .catch((err) => {
        if (!ignore) setError(err.message)
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

  const openAt = (id) => {
    const idx = projects.findIndex((p) => p._id === id)
    if (idx !== -1) setOpenIndex(idx)
  }
  const close = () => setOpenIndex(null)
  const prev = () =>
    setOpenIndex((current) => (current - 1 + projects.length) % projects.length)
  const next = () => setOpenIndex((current) => (current + 1) % projects.length)

  return (
    <ProjectModalContext.Provider
      value={{ experienceProjects, portfolioProjects, loading, error, openAt }}
    >
      {children}
      {openIndex !== null && (
        <ProjectModal
          project={projects[openIndex]}
          total={projects.length}
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
