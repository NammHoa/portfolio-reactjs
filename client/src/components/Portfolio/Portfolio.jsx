import { useProjectModal } from '../../context/ProjectModalContext'
import ProjectList from '../ProjectRow/ProjectList'
import '../Projects/Projects.css'
import './Portfolio.css'

function Portfolio() {
  const { portfolioProjects, openAt } = useProjectModal()

  return (
    <section className="projects portfolio" id="portfolio">
      <div className="projects__meta">
        <span>03 / PROJECTS</span>
        <span>SIDE BUILDS</span>
      </div>

      <ProjectList projects={portfolioProjects} onOpen={openAt} />
    </section>
  )
}

export default Portfolio
