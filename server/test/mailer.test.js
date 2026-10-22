import { describe, it, expect, vi, beforeEach } from 'vitest'

const sendMail = vi.fn()

vi.mock('nodemailer', () => ({
  default: { createTransport: vi.fn(() => ({ sendMail })) },
}))

const { escapeHtml, buildContactEmail } = await import('../src/utils/contactEmail.js')
const { sendContactNotification } = await import('../src/config/mailer.js')

describe('escapeHtml', () => {
  it('turns HTML-significant characters into entities', () => {
    expect(escapeHtml(`<a href="x" onclick='y'>&</a>`)).toBe(
      '&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;'
    )
  })

  it('leaves ordinary text alone', () => {
    expect(escapeHtml('Xin chào, Nam 123')).toBe('Xin chào, Nam 123')
  })
})

describe('buildContactEmail', () => {
  const attack = {
    name: '<img src=x onerror=alert(1)>',
    email: 'a"onmouseover="x@example.com',
    message: '<a href="https://evil.example">Click here</a>',
  }

  it('does not let visitor text become HTML markup', () => {
    const { html } = buildContactEmail(attack)

    expect(html).not.toContain('<img')
    expect(html).not.toContain('<a ')
    expect(html).toContain('&lt;a href=&quot;https://evil.example&quot;&gt;Click here&lt;/a&gt;')
  })

  it('keeps the plain-text version exactly as written', () => {
    const { text, subject } = buildContactEmail(attack)

    expect(text).toContain(attack.message)
    expect(subject).toBe(`New message from ${attack.name}`)
  })

  it('keeps the visitor line breaks in the HTML version', () => {
    const { html } = buildContactEmail({ name: 'Nam', email: 'nam@example.com', message: 'One\r\nTwo\nThree' })

    expect(html).toContain('<p>One<br>Two<br>Three</p>')
  })
})

describe('sendContactNotification', () => {
  beforeEach(() => {
    sendMail.mockReset()
    sendMail.mockResolvedValue()
  })

  it('sends the escaped mail to the site owner with the visitor as reply-to', async () => {
    await sendContactNotification({
      name: 'Nam',
      email: 'nam@example.com',
      message: '<script>alert(1)</script>',
    })

    const mail = sendMail.mock.calls[0][0]
    expect(mail.replyTo).toBe('nam@example.com')
    expect(mail.html).not.toContain('<script>')
    expect(mail.html).toContain('&lt;script&gt;')
    expect(mail.text).toContain('<script>alert(1)</script>')
  })
})
