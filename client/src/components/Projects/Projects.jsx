import { useState } from 'react'
import { flushSync } from 'react-dom'
import { useTilt } from '../../hooks/useTilt'
import { useReveal } from '../../hooks/useReveal'
import ProjectModal from '../ProjectModal/ProjectModal'
import grade10Cover from '../../assets/projects/grade10-cover.jpg'
import sunliesCover from '../../assets/projects/sunilies-cover.jpg'
import leadLogo from '../../assets/projects/lead-logo.png'
import './Projects.css'

function withViewTransition(el, updateFn) {
  if (!document.startViewTransition || !el) {
    updateFn()
    return
  }
  el.style.viewTransitionName = 'project-visual'
  const transition = document.startViewTransition(() => {
    flushSync(updateFn)
  })
  transition.finished.finally(() => {
    el.style.viewTransitionName = ''
  })
}

const PROJECTS = [
  {
    index: '01',
    name: 'Grade 10 Enrollment Registration System',
    role: 'Fullstack Developer · Team of 2',
    period: 'Jun 2026 – Aug 2026',
    headlineLines: ['Enrollment,', 'without the chaos.'],
    description:
      'A full-stack registration for THPT Ham Thuan Nam, handling 600+ students with dynamic subject-combination logic, real-time status tracking, and an asynchronous email queue for automated confirmations.',
    highlights: [
      'Admin dashboard with Chart.js analytics',
      'Excel import/export via PhpSpreadsheet',
      'BCrypt hashing, CSRF protection, brute-force rate limiting, and SQL-injection-safe prepared statements',
    ],
    tags: ['PHP 8.1', 'MySQL', 'HTML/CSS', 'JavaScript'],
    link: 'https://nguyenvong.thpthamthuannam.edu.vn/',
    image: grade10Cover,
    imageAspect: '1024 / 489',
  },
  {
    index: '02',
    name: 'SUNILIES',
    role: 'Fullstack Developer · Team of 2',
    period: 'Feb 2026 – Jun 2026',
    headlineLines: ['Commerce,', 'secured end to end.'],
    description:
      'An e-commerce covering product management, order processing, and user authentication, with MoMo Payment Gateway integrated for real-time transaction confirmation.',
    highlights: [
      'HMAC-SHA256 signed MoMo payments with async IPN webhook handling',
      'Firebase Storage, Stringee Voice OTP, and JavaMail integrations',
      'Session-fixation prevention, brute-force rate limiting, and XSS sanitization',
    ],
    tags: ['Spring Boot', 'Thymeleaf', 'Firebase', 'MoMo API'],
    link: 'https://sunilies.vn/',
    image: sunliesCover,
    imageAspect: '1024 / 487',
  },
  {
    index: '03',
    name: 'Sample Management System',
    role: 'Fullstack Mobile Dev Intern · Team of 6',
    period: 'Aug 2025 – Nov 2025',
    headlineLines: ['Lab work,', 'digitized.'],
    description:
      'A mobile solution that digitizes laboratory workflows — from sample tracking to automated reporting — independently owned end-to-end within a 6-person team.',
    highlights: [
      'Structured schema managing 10+ critical field parameters',
      'Role-based access control segregating permissions across departments',
      'Real-time data synchronization with change-log auditing',
    ],
    tags: ['Flutter', 'Node.js', 'Firebase'],
    link: 'https://leaderp.vn/',  
    logo: leadLogo,
    company: 'Lead Management Solutions',
  },
]

function ProjectRow({ project, index, reverse, onOpen, tilt }) {
  const { ref, isVisible, direction } = useReveal()

  const classes = [
    'project',
    reverse ? 'project--reverse' : '',
    isVisible ? 'project--visible' : `project--hidden-${direction}`,
  ].join(' ')

  return (
    <article
      ref={ref}
      className={classes}
      style={{ '--reveal-delay': `${index * 0.08}s` }}
    >
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
          ) : project.logo ? (
            <div className="project__visual-logo-wrap">
              <img
                src={project.logo}
                alt={`${project.company} logo`}
                className="project__visual-logo"
              />
              <span className="project__visual-company">{project.company}</span>
            </div>
          ) : (
            <>
              <span className="project__visual-index">{project.index}</span>
              <span className="project__visual-name">{project.name}</span>
            </>
          )}
        </div>
      </div>

      <div className="project__content">
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
          {project.link && (
            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="project__link"
            >
              {project.company ? 'Company site' : 'Live site'}
              <span aria-hidden="true">↗</span>
            </a>
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

function Projects() {
  const tilts = [useTilt(8), useTilt(8), useTilt(8)]
  const [openIndex, setOpenIndex] = useState(null)

  const openProject = (i) => {
    withViewTransition(tilts[i].innerRef.current, () => setOpenIndex(i))
  }
  const closeModal = () => {
    const activeVisual =
      openIndex !== null ? tilts[openIndex].innerRef.current : null
    withViewTransition(activeVisual, () => setOpenIndex(null))
  }
  const showPrev = () =>
    setOpenIndex((current) => (current - 1 + PROJECTS.length) % PROJECTS.length)
  const showNext = () =>
    setOpenIndex((current) => (current + 1) % PROJECTS.length)

  return (
    <section className="projects" id="projects">
      <div className="projects__meta">
        <span>02 / WORK EXPERIENCE</span>
        <span>2025 — 2026</span>
      </div>

      <div className="projects__list">
        {PROJECTS.map((project, i) => (
          <ProjectRow
            key={project.name}
            project={project}
            index={i}
            reverse={i % 2 === 1}
            tilt={tilts[i]}
            onOpen={() => openProject(i)}
          />
        ))}
      </div>

      {openIndex !== null && (
        <ProjectModal
          project={PROJECTS[openIndex]}
          onClose={closeModal}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}
    </section>
  )
}

export default Projects
