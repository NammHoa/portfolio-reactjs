import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import ContactMessage from '../src/models/ContactMessage.js'
import { sendContactNotification } from '../src/config/mailer.js'

vi.mock('../src/models/ContactMessage.js', () => ({
  default: { create: vi.fn() },
}))

vi.mock('../src/config/mailer.js', () => ({
  sendContactNotification: vi.fn(),
}))

describe('POST /api/contact', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('rejects a request missing required fields', async () => {
    const res = await request(app).post('/api/contact').send({ name: 'Nam' })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/required/i)
    expect(ContactMessage.create).not.toHaveBeenCalled()
  })

  it('saves a valid message, sends a notification email, and returns 201', async () => {
    ContactMessage.create.mockResolvedValue({
      _id: '1',
      name: 'Nam',
      email: 'nam@example.com',
      message: 'Hello',
    })
    sendContactNotification.mockResolvedValue()

    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Nam', email: 'nam@example.com', message: 'Hello' })

    expect(res.status).toBe(201)
    expect(ContactMessage.create).toHaveBeenCalledWith({
      name: 'Nam',
      email: 'nam@example.com',
      message: 'Hello',
    })
    expect(sendContactNotification).toHaveBeenCalledWith({
      name: 'Nam',
      email: 'nam@example.com',
      message: 'Hello',
    })
  })

  it('still returns 201 when the notification email fails', async () => {
    ContactMessage.create.mockResolvedValue({ _id: '1' })
    sendContactNotification.mockRejectedValue(new Error('SMTP down'))

    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Nam', email: 'nam@example.com', message: 'Hello' })

    expect(res.status).toBe(201)
  })

  it('returns 500 when saving fails', async () => {
    ContactMessage.create.mockRejectedValue(new Error('DB error'))

    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Nam', email: 'nam@example.com', message: 'Hello' })

    expect(res.status).toBe(500)
  })
})
