import { useCallback, useEffect, useRef, useState } from 'react'
import { grow, prefersReducedMotion } from './modalTransition'
import '../Projects/Projects.css'
import './ProjectModal.css'

// Keep in sync with the "grow" closing length in modalTransition.js.
const CLOSE_MS = 420

// mode: how the modal was opened. 'flight' = the card's visual flew in (View
// Transitions), 'grow' = the panel grew out of the card, 'fade' = reduced motion.
function ProjectModal({
  project,
  total,
  mode,
  origin,
  onRequestClose,
  onClose,
  onPrev,
  onNext,
}) {
  const hasVisual = Boolean(project.image || project.logo)
  const panelRef = useRef(null)
  const [closing, setClosing] = useState(false)

  // The View Transition handles closing itself; otherwise play our own exit.
  const requestClose = useCallback(() => {
    if (closing) return
    if (onRequestClose()) return
    setClosing(true)
  }, [closing, onRequestClose])

  useEffect(() => {
    if (!closing) return
    const panel = panelRef.current
    if (mode === 'grow' && panel && origin?.isConnected && !prefersReducedMotion()) {
      grow(panel, origin, 'out')
    }
    const timer = setTimeout(onClose, mode === 'grow' ? CLOSE_MS : 150)
    return () => clearTimeout(timer)
  }, [closing, mode, origin, onClose])

  useEffect(() => {
    const panel = panelRef.current
    if (mode !== 'grow' || !panel || !origin?.isConnected) return
    const animation = grow(panel, origin, 'in')
    return () => animation.cancel()
    // Only on first mount: moving between projects keeps the panel in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (closing) return
      if (event.key === 'Escape') requestClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [closing, requestClose, onPrev, onNext])

  return (
    <div
      className={[
        'modal-backdrop',
        `modal-backdrop--${mode}`,
        closing ? 'modal-backdrop--closing' : '',
      ].join(' ')}
      onClick={requestClose}
    >
      <div
        ref={panelRef}
        className={[
          'modal-panel',
          `modal-panel--${mode}`,
          hasVisual ? '' : 'modal-panel--text-only',
        ].join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={project.name}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="modal-close"
          onClick={requestClose}
          aria-label="Close"
        >
          ×
        </button>

        {hasVisual && (
          <div className="modal-visual" aria-hidden="true">
            {/* The tile the card's visual flies into; same 2:1 shape as on the page. */}
            <div className="modal-visual-tile">
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

          {project.links?.length > 0 ? (
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
