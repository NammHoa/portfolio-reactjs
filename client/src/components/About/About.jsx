import avatar from '../../assets/avatar.webp'
import { useReveal } from '../../hooks/useReveal'
import RevealHeading from '../RevealHeading/RevealHeading'
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
          <RevealHeading
            className="about__heading"
            lines={['A developer who cares', 'about the small details.']}
          />

          <p className="about__text">
            I'm Lam Huynh Hoa Nam, a recent Software Engineering graduate
            from HUFLIT. I learn quickly, solve technical problems
            methodically, and work comfortably in teams that follow either
            Waterfall or Agile. My goal is to grow into a Senior Frontend
            Developer over the next 3 years.
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
