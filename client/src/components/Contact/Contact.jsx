import { useState } from 'react'
import { IconMail, IconPhone, IconGithub } from './icons'
import { sendContactMessage } from '../../lib/api'
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

const EMPTY_FORM = { name: '', email: '', message: '' }

function Contact() {
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      await sendContactMessage(formData)
      setStatus('success')
      setFormData(EMPTY_FORM)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error.message)
    }
  }

  return (
    <section className="contact" id="contact">
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
            {CONTACT_LINKS.map((link) => (
              <li key={link.label}>
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
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="What are you working on?"
            />
          </div>

          <button
            type="submit"
            className="contact__submit"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Sending...' : 'Send message'}
          </button>

          {status === 'success' && (
            <p className="contact__status contact__status--success">
              Thanks! I'll get back to you soon.
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
