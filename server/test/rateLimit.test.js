import { describe, it, expect, vi, afterEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

vi.mock('../src/models/ContactMessage.js', () => ({
  default: { create: vi.fn() },
}))

vi.mock('../src/config/mailer.js', () => ({
  sendContactNotification: vi.fn(),
}))

// Requests with an empty body are rejected with 400 before anything is saved or emailed,
// so they exercise the limiter without side effects.
const send = (forwardedFor) =>
  request(app).post('/api/contact').set('X-Forwarded-For', forwardedFor).send({})

describe('contact rate limit behind a proxy', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('gives each visitor their own allowance', async () => {
    vi.stubEnv('NODE_ENV', 'development') // the limiter is switched off in test mode

    for (let i = 0; i < 5; i += 1) {
      expect((await send('203.0.113.10')).status).toBe(400)
    }
    expect((await send('203.0.113.10')).status).toBe(429)

    // a different visitor is not affected by the first one's spam
    expect((await send('198.51.100.77')).status).toBe(400)
  })

  it('cannot be dodged by putting fake addresses in X-Forwarded-For', async () => {
    vi.stubEnv('NODE_ENV', 'development')

    // The proxy appends the real client address on the right; anything a client
    // writes on the left is untrusted and must not change which allowance is used.
    for (let i = 0; i < 5; i += 1) {
      expect((await send(`10.0.0.${i}, 192.0.2.55`)).status).toBe(400)
    }
    expect((await send('10.9.9.9, 192.0.2.55')).status).toBe(429)
  })
})
