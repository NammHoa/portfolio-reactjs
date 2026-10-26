import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const sendMail = vi.fn()

vi.mock('nodemailer', () => ({
  default: { createTransport: vi.fn(() => ({ sendMail })) },
}))

const { default: nodemailer } = await import('nodemailer')
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

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})

describe('sendContactNotification over Gmail', () => {
  beforeEach(() => {
    vi.stubEnv('RESEND_API_KEY', '') // a key in a developer's .env must not hijack these tests
    sendMail.mockReset()
    sendMail.mockResolvedValue()
  })

  it('gives up on an unreachable mail server within seconds, not minutes', async () => {
    await sendContactNotification({ name: 'Nam', email: 'nam@example.com', message: 'Hi' })

    const options = nodemailer.createTransport.mock.calls[0][0]
    expect(options.connectionTimeout).toBeLessThanOrEqual(10000)
    expect(options.greetingTimeout).toBeLessThanOrEqual(10000)
    expect(options.socketTimeout).toBeLessThanOrEqual(15000)
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

describe('sendContactNotification over Resend (HTTPS)', () => {
  const visitor = { name: 'Lan', email: 'lan@example.com', message: 'Hi <b>there</b>' }

  beforeEach(() => {
    vi.stubEnv('RESEND_API_KEY', 're_test_key')
    vi.stubEnv('GMAIL_USER', 'owner@example.com')
    vi.stubEnv('MAIL_FROM', '')
    sendMail.mockClear()
  })

  it('posts the mail to Resend instead of using SMTP', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await sendContactNotification(visitor)

    expect(sendMail).not.toHaveBeenCalled()
    const [url, options] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.resend.com/emails')
    expect(options.headers.Authorization).toBe('Bearer re_test_key')

    const body = JSON.parse(options.body)
    expect(body.to).toEqual(['owner@example.com'])
    expect(body.reply_to).toBe('lan@example.com')
    expect(body.subject).toBe('New message from Lan')
    expect(body.from).toContain('onboarding@resend.dev')
    expect(body.html).toContain('&lt;b&gt;there&lt;/b&gt;')
    expect(body.html).not.toContain('<b>there</b>')
  })

  it('uses MAIL_FROM when it is set', async () => {
    vi.stubEnv('MAIL_FROM', 'Portfolio <contact@example.com>')
    const fetchMock = vi.fn().mockResolvedValue({ ok: true })
    vi.stubGlobal('fetch', fetchMock)

    await sendContactNotification(visitor)

    expect(JSON.parse(fetchMock.mock.calls[0][1].body).from).toBe('Portfolio <contact@example.com>')
  })

  it('throws a readable error when Resend refuses the mail', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ message: 'You can only send testing emails to your own address' }),
      })
    )

    await expect(sendContactNotification(visitor)).rejects.toThrow(/Resend 403: You can only send testing/)
  })

  it('never puts the API key in the error it throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))

    const error = await sendContactNotification(visitor).catch((e) => e)

    expect(error.message).not.toContain('re_test_key')
  })
})
