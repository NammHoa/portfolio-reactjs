import { useProjectModal } from '../../context/ProjectModalContext'
import { EXPERIENCE_PROJECTS } from '../../data/projects'
import ProjectRow from '../ProjectRow/ProjectRow'
import './Projects.css'

function Projects() {
  const { tilts, openAt } = useProjectModal()

  return (
    <section className="projects" id="projects">
      <div className="projects__meta">
        <span>02 / WORK EXPERIENCE</span>
        <span>2025 — 2026</span>
      </div>

      <div className="projects__list">
        {EXPERIENCE_PROJECTS.map((project, i) => (
          <ProjectRow
            key={project.name}
            project={project}
            delayIndex={i}
            reverse={i % 2 === 1}
            tilt={tilts[i]}
            onOpen={() => openAt(i)}
          />
        ))}
      </div>
    </section>
  )
}

export default Projects
