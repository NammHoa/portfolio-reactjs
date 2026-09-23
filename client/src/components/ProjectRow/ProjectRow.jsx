import { useReveal } from '../../hooks/useReveal'
import '../Projects/Projects.css'

function ProjectRow({ project, delayIndex, reverse, onOpen, tilt }) {
  const { ref, isVisible, direction } = useReveal()
  const hasVisual = Boolean(project.image || project.logo)

  const classes = [
    'project',
    reverse ? 'project--reverse' : '',
    hasVisual ? '' : 'project--text-only',
    isVisible ? 'project--visible' : `project--hidden-${direction}`,
  ].join(' ')

  return (
    <article
      ref={ref}
      className={classes}
      style={{ '--reveal-delay': `${delayIndex * 0.08}s` }}
    >
      {hasVisual && (
        <div
          className="project__visual-frame"
          aria-hidden="true"
          onMouseMove={tilt.onMouseMove}
          onMouseLeave={tilt.onMouseLeave}
          onClick={onOpen}
        >
          <div
            className="project__visual"
            ref={tilt.innerRef}
            style={project.imageAspect ? { aspectRatio: project.imageAspect } : undefined}
          >
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.name} preview`}
                className="project__visual-img"
              />
            ) : (
              <div className="project__visual-logo-wrap">
                <img
                  src={project.logo}
                  alt={`${project.company} logo`}
                  className="project__visual-logo"
                />
                <span className="project__visual-company">{project.company}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="project__content">
        {!hasVisual && (
          <span className="project__ghost-index" aria-hidden="true">
            {project.index}
          </span>
        )}

        <div className="project__top">
          <span className="project__index">{project.index}</span>
          <span className="project__role">{project.role}</span>
          <span className="project__period">{project.period}</span>
        </div>

        <h3 className="project__headline">
          {project.headlineLines.map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </h3>

        <p className="project__description">{project.description}</p>

        <ul className="project__highlights">
          {project.highlights.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>

        <div className="project__tags">
          {project.tags.map((tag) => (
            <span key={tag} className="project__tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="project__footer">
          {project.links ? (
            <div className="project__links-group">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="project__link"
                >
                  {link.label}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          ) : (
            project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="project__link"
              >
                {project.linkLabel || (project.company ? 'Company site' : 'Live site')}
                <span aria-hidden="true">↗</span>
              </a>
            )
          )}
          <button
            type="button"
            className="project__details-btn"
            onClick={onOpen}
          >
            Explore the details
            <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
    </article>
  )
}

export default ProjectRow
