import { useEffect } from 'react'
import './ProjectModal.css'

function ProjectModal({ project, onClose, onPrev, onNext }) {
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
        className="modal-panel"
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

        <div
          className="modal-visual"
          style={{ viewTransitionName: 'project-visual' }}
          aria-hidden="true"
        >
          {project.image ? (
            <img
              src={project.image}
              alt={`${project.name} preview`}
              className="modal-visual-img"
            />
          ) : (
            <>
              <span className="modal-visual-index">{project.index}</span>
              <span className="modal-visual-name">{project.name}</span>
            </>
          )}
        </div>

        <div className="modal-details">
          <div className="modal-top">
            <span className="modal-index">{project.index} / 03</span>
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

          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="modal-link"
            >
              Visit live site
              <span aria-hidden="true">↗</span>
            </a>
          )}

          <div className="modal-cta">
            <span>Have a project in mind?</span>
            <a href="#contact" onClick={onClose}>
              Let's build it
              <span aria-hidden="true">↗</span>
            </a>
          </div>

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
