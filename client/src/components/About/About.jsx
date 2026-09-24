import avatar from '../../assets/avatar.jpg'
import { useReveal } from '../../hooks/useReveal'
import './About.css'

const EDUCATION = [
  { term: 'Degree', value: 'Bachelor of Software Engineering' },
  { term: 'University', value: 'HUFLIT, Ho Chi Minh City' },
  { term: 'Duration', value: '2022 — 2026' },
  { term: 'GPA', value: '3.03' },
]

function About() {
  const { ref, isVisible, direction } = useReveal()
  const classes = [
    'about',
    'reveal',
    isVisible ? 'reveal--visible' : `reveal--hidden-${direction}`,
  ].join(' ')

  return (
    <section ref={ref} className={classes} id="about">
      <div className="about__meta">
        <span>01 / ABOUT</span>
        <span>WHO I AM</span>
      </div>

      <div className="about__grid">
        <div className="about__intro">
          <h2 className="about__heading">
            A developer who cares about the small details.
          </h2>

          <p className="about__text">
            I'm Lam Huynh Hoa Nam, a recent Software Engineering graduate
            from HUFLIT (Ho Chi Minh City University of Foreign Languages —
            Information Technology). A quick learner with strong
            problem-solving skills capable of effectively handling technical
            challenges in real-world environments. Aspiring to grow into
            a Fullstack Engineer over the next 3 years.
          </p>
        </div>

        <div className="about__card">
          <div className="about__card-header">
            <img src={avatar} alt="Lam Huynh Hoa Nam" className="about__photo" />
            <div>
              <p className="about__card-name">Lam Huynh Hoa Nam</p>
              <p className="about__card-role">Software Engineering Graduate</p>
            </div>
          </div>

          <dl className="about__card-list">
            {EDUCATION.map((item) => (
              <div key={item.term} className="about__card-row">
                <dt>{item.term}</dt>
                <dd>{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}

export default About
