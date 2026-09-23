import { useEffect } from 'react'
import '../Projects/Projects.css'
import './ProjectModal.css'

function ProjectModal({ project, total, onClose, onPrev, onNext }) {
  const hasVisual = Boolean(project.image || project.logo)
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, onPrev, onNext])

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className={`modal-panel ${hasVisual ? '' : 'modal-panel--text-only'}`}
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>

        {hasVisual && (
          <div className="modal-visual" aria-hidden="true">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.name} preview`}
                className="modal-visual-img"
              />
            ) : (
              <div className="modal-visual-logo-wrap">
                <img
                  src={project.logo}
                  alt={`${project.company} logo`}
                  className="modal-visual-logo"
                />
                <span className="modal-visual-company">{project.company}</span>
              </div>
            )}
          </div>
        )}

        <div className="modal-details">
          {!hasVisual && (
            <span className="modal-ghost-index" aria-hidden="true">
              {project.index}
            </span>
          )}

          <div className="modal-top">
            <span className="modal-index">
              {project.index} / {total}
            </span>
            <span className="modal-role">
              {project.role} · {project.period}
            </span>
          </div>

          <h2 className="modal-headline">
            {project.headlineLines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </h2>

          <p className="modal-name">{project.name}</p>

          <p className="modal-description">{project.description}</p>

          <ul className="modal-highlights">
            {project.highlights.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          <div className="modal-tags">
            {project.tags.map((tag) => (
              <span key={tag} className="modal-tag">
                {tag}
              </span>
            ))}
          </div>

          {project.links ? (
            <div className="modal-links-group">
              {project.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-link"
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
                className="modal-link"
              >
                {project.linkLabel || (project.company ? 'Visit company site' : 'Visit live site')}
                <span aria-hidden="true">↗</span>
              </a>
            )
          )}

          <div className="modal-nav">
            <button type="button" onClick={onPrev}>
              <span aria-hidden="true">←</span> Previous project
            </button>
            <button type="button" onClick={onNext}>
              Next project <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal
