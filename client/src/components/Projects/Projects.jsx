import { useProjectModal } from '../../context/ProjectModalContext'
import ProjectList from '../ProjectRow/ProjectList'
import './Projects.css'

function Projects() {
  const { experienceProjects, loading, error, openAt } = useProjectModal()

  return (
    <section className="projects" id="projects">
      <div className="projects__meta">
        <span>02 / WORK EXPERIENCE</span>
        <span>2025 — 2026</span>
      </div>

      {loading && <p className="projects__status">Loading projects…</p>}
      {error && (
        <p className="projects__status projects__status--error">
          Couldn't load projects. Please try again later.
        </p>
      )}

      {!loading && !error && (
        <ProjectList projects={experienceProjects} onOpen={openAt} />
      )}
    </section>
  )
}

export default Projects
