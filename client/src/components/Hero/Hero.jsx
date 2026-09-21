import './Hero.css'

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero__inner">
        <div className="hero__content">
          <span className="hero__eyebrow">
            <span className="hero__dot"></span>
            FRONTEND DEVELOPER
          </span>

          <h1 className="hero__title">
            Ideas into
            <br />
            interfaces.
          </h1>

          <p className="hero__subtitle">
            I'm Nam — I build clean, fast, and thoughtful web experiences,
            from the first line of code to the last pixel.
          </p>

          <div className="hero__actions">
            <a href="#projects" className="hero__btn-primary">
              Explore my work
              <span aria-hidden="true">↗</span>
            </a>
            <a href="#contact" className="hero__btn-link">
              Have a project in mind?
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

        <div className="hero__visual" aria-hidden="true">
          <div className="code-window">
            <div className="code-window__bar">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div className="code-window__body">
              <div className="code-line code-line--tag" style={{ width: '40%' }}></div>
              <div className="code-line" style={{ width: '70%' }}></div>
              <div className="code-line code-line--indent" style={{ width: '55%' }}></div>
              <div className="code-line code-line--indent code-line--accent" style={{ width: '35%' }}></div>
              <div className="code-line" style={{ width: '60%' }}></div>
              <div className="code-line code-line--tag" style={{ width: '30%' }}></div>
            </div>
          </div>
          <div className="hero__badge">
            <span>&lt;/&gt;</span>
          </div>
        </div>
      </div>

      <div className="hero__footer">
        <span>VIETNAM → REMOTE</span>
      </div>
    </section>
  )
}

export default Hero
