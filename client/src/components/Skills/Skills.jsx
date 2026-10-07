import { useReveal } from '../../hooks/useReveal'
import './Skills.css'

const SKILL_GROUPS = [
  {
    title: 'Languages',
    items: ['Dart', 'Java', 'JavaScript'],
    tone: 'peach',
  },
  {
    title: 'Frontend',
    items: ['React.js', 'Flutter'],
    tone: 'forest',
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express.js', 'ASP.NET Core', 'RESTful API'],
    tone: 'sage',
  },
  {
    title: 'Databases',
    items: ['MongoDB', 'SQL Server', 'Firebase'],
    tone: 'peach',
  },
  {
    title: 'Tools & Workflow',
    items: ['Git/GitHub', 'Figma', 'Jira', 'Postman'],
    tone: 'sage',
  },
]

function Skills() {
  const { ref, isVisible, direction } = useReveal()
  const classes = [
    'skills',
    'reveal',
    isVisible ? 'reveal--visible' : `reveal--hidden-${direction}`,
  ].join(' ')

  return (
    <section ref={ref} className={classes} id="skills">
      <div className="skills__meta">
        <span>04 / SKILLS</span>
        <span>WHAT I WORK WITH</span>
      </div>

      <div className="skills__layout">
        <h2 className="skills__intro">
          Tools I reach for
          <br />
          to ship real products.
        </h2>

        <div className="skills__grid">
          {SKILL_GROUPS.map((group, index) => (
            <article
              key={group.title}
              className={`skills__group skills__group--${group.tone}`}
            >
              <span className="skills__num">{String(index + 1).padStart(2, '0')}</span>
              <h3>{group.title}</h3>
              <div className="skills__tags">
                {group.items.map((item) => (
                  <span key={item} className="skills__tag">
                    {item}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Skills
