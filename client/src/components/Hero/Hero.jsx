import Mascot from './Mascot'
import './Hero.css'

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow">
            <span className="hero__dot"></span>
            ASPIRING FRONTEND ENGINEER
          </span>

          {/* Each line sits in a mask and rises into view. It arrives as an outline (the
              idea) and fills in (the interface), like the blueprint ".HN" in the mascot scene. */}
          <h1 className="hero__title">
            <span className="hero__line">
              <span className="hero__line-text">Ideas into</span>
            </span>{' '}
            <span className="hero__line">
              <span className="hero__line-text">
                interfaces.
                <svg
                  className="hero__scribble"
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M3 9 C 55 3, 118 13, 178 6 S 272 4, 297 8" pathLength="1" />
                </svg>
              </span>
            </span>
          </h1>

          <p className="hero__subtitle">
            I'm Nam, a recent Software Engineering graduate who learns fast
            and enjoys turning ideas into working products — from a
            registration system for 600+ students to a payment-integrated
            e-commerce app.
          </p>

          <div className="hero__actions">
            <a href="#projects" className="hero__btn-primary">
              Explore my work
              <span aria-hidden="true">↗</span>
            </a>
            <a
              href="/Lam-Huynh-Hoa-Nam-CV.pdf"
              download
              className="hero__btn-secondary"
            >
              Download CV
            </a>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <Mascot />
        </div>
      </div>
    </section>
  )
}

export default Hero
