import Mascot from './Mascot'
import './Hero.css'

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow">
            <span className="hero__dot"></span>
            ASPIRING FULLSTACK ENGINEER
          </span>

          <h1 className="hero__title">
            Ideas into
            <br />
            interfaces.
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
