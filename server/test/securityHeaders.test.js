import { describe, it, expect, vi } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'

vi.mock('../src/models/ContactMessage.js', () => ({
  default: { create: vi.fn(), updateOne: vi.fn() },
}))

vi.mock('../src/config/mailer.js', () => ({
  sendContactNotification: vi.fn(),
}))

describe('security headers', () => {
  it('sets the standard protective headers', async () => {
    const res = await request(app).get('/api/health')

    expect(res.headers['x-content-type-options']).toBe('nosniff')
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN')
    expect(res.headers['strict-transport-security']).toMatch(/max-age=\d+/)
    expect(res.headers['referrer-policy']).toBe('no-referrer')
    expect(res.headers['content-security-policy']).toMatch(/default-src 'self'/)
    expect(res.headers['content-security-policy']).toMatch(/frame-ancestors 'self'/)
  })

  it('does not advertise that the server runs Express', async () => {
    const res = await request(app).get('/api/health')

    expect(res.headers['x-powered-by']).toBeUndefined()
  })

  it('still lets the website read the API from its own origin through CORS', async () => {
    const origin = process.env.CLIENT_URL || 'http://localhost:5173'
    const res = await request(app).get('/api/health').set('Origin', origin)

    expect(res.headers['access-control-allow-origin']).toBe(origin)
    // helmet's same-origin default would make browsers refuse cross-origin reads
    expect(res.headers['cross-origin-resource-policy']).toBe('cross-origin')
  })

  it('answers a CORS preflight for the contact form', async () => {
    const origin = process.env.CLIENT_URL || 'http://localhost:5173'
    const res = await request(app)
      .options('/api/contact')
      .set('Origin', origin)
      .set('Access-Control-Request-Method', 'POST')
      .set('Access-Control-Request-Headers', 'content-type')

    expect(res.status).toBe(204)
    expect(res.headers['access-control-allow-origin']).toBe(origin)
  })

  it('adds the headers to error answers too', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('Content-Type', 'application/json')
      .send('{"name": ')

    expect(res.status).toBe(400)
    expect(res.headers['x-content-type-options']).toBe('nosniff')
  })
})
