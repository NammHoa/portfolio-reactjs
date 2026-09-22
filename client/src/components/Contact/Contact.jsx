import { IconMail, IconPhone, IconGithub } from './icons'
import './Contact.css'

const CONTACT_LINKS = [
  {
    label: 'Email',
    value: 'hoanam270304@gmail.com',
    href: 'mailto:hoanam270304@gmail.com',
    Icon: IconMail,
  },
  {
    label: 'Phone',
    value: '+84 988 494 911',
    href: 'tel:+84988494911',
    Icon: IconPhone,
  },
  {
    label: 'GitHub',
    value: 'github.com/NammHoa',
    href: 'https://github.com/NammHoa',
    Icon: IconGithub,
  },
]

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact__meta">
        <span>04 / CONTACT</span>
        <span>LET'S TALK</span>
      </div>

      <div className="contact__grid">
        <div className="contact__intro">
          <h2 className="contact__heading">
            Got an idea?
            <br />
            Let's build it together.
          </h2>
          <p className="contact__subtitle">
            I'm open to internships and fullstack roles. Reach out and I'll
            get back to you soon.
          </p>
          <a href="mailto:hoanam270304@gmail.com" className="contact__cta">
            Say hello
            <span aria-hidden="true">↗</span>
          </a>
        </div>

        <ul className="contact__card">
          {CONTACT_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
              >
                <span className="contact__link-icon">
                  <link.Icon />
                </span>
                <span className="contact__link-text">
                  <span className="contact__link-label">{link.label}</span>
                  <span className="contact__link-value">{link.value}</span>
                </span>
                <span className="contact__link-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default Contact
