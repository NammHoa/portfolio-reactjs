import './About.css'

const FOCUS_AREAS = [
  {
    title: 'Frontend',
    description: 'React.js and Flutter — building interfaces that feel fast.',
  },
  {
    title: 'Backend',
    description: 'Node.js, Express.js, ASP.NET Core, and RESTful APIs.',
  },
  {
    title: 'Data & Security',
    description: 'MongoDB, SQL Server, Firebase, and practical security hygiene.',
  },
]

function About() {
  return (
    <section className="about" id="about">
      <div className="about__meta">
        <span>01 / ABOUT</span>
        <span>WHO I AM</span>
      </div>

      <div className="about__grid">
        <h2 className="about__heading">
          A developer who cares about the small details.
        </h2>

        <div className="about__body">
          <p className="about__text">
            I'm Lam Huynh Hoa Nam, a recent Software Engineering graduate from
            HUFLIT (Ho Chi Minh City University of Foreign Languages —
            Information Technology). A quick learner with strong
            problem-solving skills, I've shipped full-stack systems — from a
            student enrollment platform handling 600+ users to a payment-
            integrated e-commerce app and a mobile lab-management tool.
            Aspiring to grow into a Fullstack Engineer over the next 3 years.
          </p>

          <div className="about__focus">
            {FOCUS_AREAS.map((area) => (
              <div key={area.title} className="focus-item">
                <h3>{area.title}</h3>
                <p>{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
