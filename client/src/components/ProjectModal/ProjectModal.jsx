import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { IconCheck } from '../Icons/icons'
import { grow, prefersReducedMotion } from './modalTransition'
import '../Projects/Projects.css'
import './ProjectModal.css'

// Keep in sync with the "grow" closing length in modalTransition.js.
const CLOSE_MS = 420

const LINK_TEXT = {
  'live site': 'Visit live site',
  'company site': 'Visit company site',
  github: 'View on GitHub',
}

const linkText = (label) => LINK_TEXT[label.toLowerCase()] ?? `View ${label}`

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
  // The first link is the main call to action; any others sit below it as plain rows.
  const links = project.links?.length
    ? project.links
    : project.link
      ? [
          {
            label: project.linkLabel || (project.company ? 'Company site' : 'Live site'),
            href: project.link,
          },
        ]
      : []
  const [primaryLink, ...otherLinks] = links
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

  // A different project always starts at its top (on phones the whole panel scrolls).
  useLayoutEffect(() => {
    if (panelRef.current) panelRef.current.scrollTop = 0
  }, [project._id])

  // Move keyboard focus into the dialog, and hand it back to the opener on close.
  useEffect(() => {
    const opener = document.activeElement
    panelRef.current?.focus({ preventScroll: true })
    return () => {
      if (opener instanceof HTMLElement && opener.isConnected) {
        opener.focus({ preventScroll: true })
      }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (closing) return
      if (event.key === 'Escape') requestClose()
      if (event.key === 'ArrowLeft') onPrev()
      if (event.key === 'ArrowRight') onNext()

      // Keep Tab inside the dialog while it is open.
      if (event.key === 'Tab' && panelRef.current) {
        const focusable = [
          ...panelRef.current.querySelectorAll('a[href], button:not([disabled])'),
        ].filter((el) => el.offsetParent !== null)
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        const outside = !panelRef.current.contains(document.activeElement)
        const onPanel = document.activeElement === panelRef.current
        if (event.shiftKey && (document.activeElement === first || onPanel || outside)) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && (document.activeElement === last || outside)) {
          event.preventDefault()
          first.focus()
        }
      }
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
        tabIndex={-1}
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
          <div
            className={`modal-visual ${project.image ? '' : 'modal-visual--logo'}`}
            style={project.image ? { '--stage-image': `url("${project.image}")` } : undefined}
            aria-hidden="true"
          >
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

        <div className="modal-details" key={project._id}>
          {!hasVisual && (
            <span className="modal-ghost-index" aria-hidden="true">
              {project.index}
            </span>
          )}

          <div className="modal-scroll">
            <p className="modal-index">
              {project.index} / {total}
            </p>

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

            <dl className="modal-facts">
              <div>
                <dt>Role</dt>
                <dd>{project.role}</dd>
              </div>
              <div>
                <dt>Period</dt>
                <dd>{project.period}</dd>
              </div>
            </dl>

            <h3 className="modal-label">What I built</h3>
            <ul className="modal-highlights">
              {project.highlights.map((point) => (
                <li key={point}>
                  <span className="modal-highlight-icon">
                    <IconCheck />
                  </span>
                  {point}
                </li>
              ))}
            </ul>

            <h3 className="modal-label">Stack</h3>
            <div className="modal-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="modal-tag">
                  {tag}
                </span>
              ))}
            </div>

          </div>

          {primaryLink && (
            <div className="modal-actions">
              <a
                href={primaryLink.href}
                target="_blank"
                rel="noreferrer"
                className="modal-cta"
              >
                <span>{linkText(primaryLink.label)}</span>
                <span className="modal-cta-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>

              {otherLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-link"
                >
                  {linkText(link.label)}
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <footer className="modal-footer">
          <button type="button" onClick={onPrev}>
            <span aria-hidden="true">←</span>
            <span>
              Previous<span className="modal-footer-extra"> project</span>
            </span>
          </button>
          <span className="modal-footer-label">
            {project.category === 'experience' ? 'WORK EXPERIENCE' : 'SIDE BUILDS'}
          </span>
          <button type="button" onClick={onNext}>
            <span>
              Next<span className="modal-footer-extra"> project</span>
            </span>
            <span aria-hidden="true">→</span>
          </button>
        </footer>
      </div>
    </div>
  )
}

export default ProjectModal
