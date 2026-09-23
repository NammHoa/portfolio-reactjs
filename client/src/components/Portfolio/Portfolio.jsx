import { useProjectModal } from '../../context/ProjectModalContext'
import ProjectRow from '../ProjectRow/ProjectRow'
import '../Projects/Projects.css'
import './Portfolio.css'

function Portfolio() {
  const { portfolioProjects, loading, error, openAt } = useProjectModal()

  return (
    <section className="projects portfolio" id="portfolio">
      <div className="projects__meta">
        <span>03 / PROJECTS</span>
        <span>SIDE BUILDS</span>
      </div>

      {loading && <p className="projects__status">Loading projects…</p>}
      {error && (
        <p className="projects__status projects__status--error">
          Couldn't load projects. Please try again later.
        </p>
      )}

      {!loading && !error && (
        <div className="projects__list">
          {portfolioProjects.map((project, i) => (
            <ProjectRow
              key={project._id}
              project={project}
              delayIndex={i}
              reverse={i % 2 === 1}
              onOpen={() => openAt(project._id)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Portfolio
