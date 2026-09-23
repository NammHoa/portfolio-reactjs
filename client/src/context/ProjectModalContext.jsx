import { createContext, useContext, useState } from 'react'
import { useTilt } from '../hooks/useTilt'
import ProjectModal from '../components/ProjectModal/ProjectModal'
import { ALL_PROJECTS } from '../data/projects'

const ProjectModalContext = createContext(null)

export function ProjectModalProvider({ children }) {
  const tilts = [useTilt(8), useTilt(8), useTilt(8), useTilt(8), useTilt(8)]
  const [openIndex, setOpenIndex] = useState(null)

  const openAt = (i) => setOpenIndex(i)
  const close = () => setOpenIndex(null)
  const prev = () =>
    setOpenIndex((current) => (current - 1 + ALL_PROJECTS.length) % ALL_PROJECTS.length)
  const next = () => setOpenIndex((current) => (current + 1) % ALL_PROJECTS.length)

  return (
    <ProjectModalContext.Provider value={{ tilts, openAt }}>
      {children}
      {openIndex !== null && (
        <ProjectModal
          project={ALL_PROJECTS[openIndex]}
          total={ALL_PROJECTS.length}
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
