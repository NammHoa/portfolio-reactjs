import { useProjectModal } from '../../context/ProjectModalContext'
import { EXPERIENCE_PROJECTS, PORTFOLIO_PROJECTS } from '../../data/projects'
import ProjectRow from '../ProjectRow/ProjectRow'
import '../Projects/Projects.css'
import './Portfolio.css'

const GLOBAL_OFFSET = EXPERIENCE_PROJECTS.length

function Portfolio() {
  const { tilts, openAt } = useProjectModal()

  return (
    <section className="projects portfolio" id="portfolio">
      <div className="projects__meta">
        <span>03 / PROJECTS</span>
        <span>SIDE BUILDS</span>
      </div>

      <div className="projects__list">
        {PORTFOLIO_PROJECTS.map((project, i) => (
          <ProjectRow
            key={project.name}
            project={project}
            delayIndex={i}
            reverse={i % 2 === 1}
            tilt={tilts[GLOBAL_OFFSET + i]}
            onOpen={() => openAt(GLOBAL_OFFSET + i)}
          />
        ))}
      </div>
    </section>
  )
}

export default Portfolio
