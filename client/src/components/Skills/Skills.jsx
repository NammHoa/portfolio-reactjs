import './Skills.css'

const SKILL_GROUPS = [
  {
    title: 'Languages',
    items: ['Dart', 'Java', 'JavaScript'],
  },
  {
    title: 'Frontend',
    items: ['React.js', 'Flutter'],
  },
  {
    title: 'Backend',
    items: ['Node.js', 'Express.js', 'ASP.NET Core', 'RESTful API'],
  },
  {
    title: 'Databases',
    items: ['MongoDB', 'SQL Server', 'Firebase'],
  },
  {
    title: 'Tools & Workflow',
    items: ['Git/GitHub', 'Figma', 'Jira', 'Postman'],
  },
]

function Skills() {
  return (
    <section className="skills" id="skills">
      <div className="skills__meta">
        <span>04 / SKILLS</span>
        <span>WHAT I WORK WITH</span>
      </div>

      <h2 className="skills__intro">
        Tools I reach for
        <br />
        to ship real products.
      </h2>

      <div className="skills__grid">
        {SKILL_GROUPS.map((group) => (
          <div key={group.title} className="skills__group">
            <h3>{group.title}</h3>
            <div className="skills__tags">
              {group.items.map((item) => (
                <span key={item} className="skills__tag">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Skills
