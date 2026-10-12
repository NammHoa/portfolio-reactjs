import { useProjectModal } from '../../context/ProjectModalContext'
import ProjectList from '../ProjectRow/ProjectList'
import './Projects.css'

function Projects() {
  const { experienceProjects, openAt } = useProjectModal()

  return (
    <section className="projects" id="projects">
      <div className="projects__meta">
        <span>02 / WORK EXPERIENCE</span>
        <span>2025 — 2026</span>
      </div>

      <ProjectList projects={experienceProjects} onOpen={openAt} />
    </section>
  )
}

export default Projects
