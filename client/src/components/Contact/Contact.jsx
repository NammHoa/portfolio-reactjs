import { useState } from 'react'
import { IconMail, IconPhone, IconGithub } from '../Icons/icons'
import { sendContactMessage } from '../../lib/api'
import { useReveal } from '../../hooks/useReveal'
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

// `website` is a trap for bots: people never see it, so only a script that fills in every
// field it finds will put anything there. The server drops those messages silently.
const EMPTY_FORM = { name: '', email: '', message: '', website: '' }

// Same limits and email shape as the server (server/src/utils/validateContact.js).
// The browser stops most mistakes early; the server still checks everything again.
const LIMITS = { name: 100, email: 254, message: 5000 }
const EMAIL_PATTERN = '[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}'

function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [notified, setNotified] = useState(true)
  const { ref, isVisible, direction } = useReveal()
  const classes = [
    'contact',
    'reveal',
    isVisible ? 'reveal--visible' : `reveal--hidden-${direction}`,
  ].join(' ')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const result = await sendContactMessage({
        name: formData.name.trim(),
        email: formData.email.trim(),
        message: formData.message.trim(),
        website: formData.website,
      })
      // Only an explicit false from the server means the owner was not told.
      setNotified(result?.notified !== false)
      setStatus('success')
      setFormData(EMPTY_FORM)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error.message)
    }
  }

  return (
    <section ref={ref} className={classes} id="contact">
      <div className="contact__meta">
        <span>05 / CONTACT</span>
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

          <ul className="contact__quick-links">
            {CONTACT_LINKS.map((link, index) => (
              <li key={link.label} style={{ '--i': index }}>
                <a
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                >
                  <span className="contact__quick-link-icon">
                    <link.Icon />
                  </span>
                  {link.value}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <form className="contact__form" onSubmit={handleSubmit}>
          <div className="contact__field">
            <label htmlFor="contact-name">Name</label>
            <input
              id="contact-name"
              name="name"
              type="text"
              autoComplete="name"
              maxLength={LIMITS.name}
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
            />
          </div>

          <div className="contact__field">
            <label htmlFor="contact-email">Email</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              pattern={EMAIL_PATTERN}
              title="Enter an address like you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </div>

          <div className="contact__field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              name="message"
              rows="5"
              maxLength={LIMITS.message}
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="What are you working on?"
            />
          </div>

          {/* Honeypot: kept out of sight, out of the tab order and away from screen readers
              and autofill, so a real visitor never fills it in. */}
          <div className="contact__trap" aria-hidden="true">
            <label htmlFor="contact-website">Website</label>
            <input
              id="contact-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            className="contact__submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Send message'}
          </button>

          <p className="contact__privacy">
            Your name, email and message are used only to reply to you. They are
            never shared or sold.
          </p>

          {status === 'success' && (
            <p className="contact__status contact__status--success">
              {notified
                ? "Thanks! I'll get back to you soon."
                : `Thanks! Your message is saved, but I may not see it right away. For a faster reply, email ${CONTACT_LINKS[0].value}.`}
            </p>
          )}
          {status === 'error' && (
            <p className="contact__status contact__status--error">
              {errorMessage || 'Something went wrong. Please try again.'}
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default Contact
