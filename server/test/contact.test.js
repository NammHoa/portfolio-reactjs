import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import ContactMessage from '../src/models/ContactMessage.js'
import { sendContactNotification } from '../src/config/mailer.js'

vi.mock('../src/models/ContactMessage.js', () => ({
  default: { create: vi.fn(), updateOne: vi.fn() },
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

  it('still returns 201 when the notification email fails, and says it was not delivered', async () => {
    ContactMessage.create.mockResolvedValue({ _id: '1' })
    ContactMessage.updateOne.mockResolvedValue()
    sendContactNotification.mockRejectedValue(new Error('SMTP down'))

    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Nam', email: 'nam@example.com', message: 'Hello' })

    expect(res.status).toBe(201)
    expect(res.body).toEqual({ id: '1', notified: false })
    expect(ContactMessage.updateOne).toHaveBeenCalledWith(
      { _id: '1' },
      { notified: false, notifyError: 'SMTP down' }
    )
  })

  it('marks the saved message as notified when the email goes out', async () => {
    ContactMessage.create.mockResolvedValue({ _id: '1' })
    ContactMessage.updateOne.mockResolvedValue()
    sendContactNotification.mockResolvedValue()

    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Nam', email: 'nam@example.com', message: 'Hello' })

    expect(res.body).toEqual({ id: '1', notified: true })
    expect(ContactMessage.updateOne).toHaveBeenCalledWith({ _id: '1' }, { notified: true })
  })

  it('does not fail the request when recording the email result fails', async () => {
    ContactMessage.create.mockResolvedValue({ _id: '1' })
    ContactMessage.updateOne.mockRejectedValue(new Error('DB blip'))
    sendContactNotification.mockResolvedValue()

    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Nam', email: 'nam@example.com', message: 'Hello' })

    expect(res.status).toBe(201)
    expect(res.body.notified).toBe(true)
  })

  it('rejects an invalid email address with a clear message', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Nam', email: 'not-an-email', message: 'Hello' })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/valid email/i)
    expect(ContactMessage.create).not.toHaveBeenCalled()
    expect(sendContactNotification).not.toHaveBeenCalled()
  })

  it('rejects a message over the length limit', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Nam', email: 'nam@example.com', message: 'a'.repeat(5001) })

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/too long/i)
    expect(ContactMessage.create).not.toHaveBeenCalled()
  })

  it('rejects fields that are not text', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Nam', email: { $ne: '' }, message: 'Hello' })

    expect(res.status).toBe(400)
    expect(ContactMessage.create).not.toHaveBeenCalled()
  })

  it('saves and emails the trimmed text', async () => {
    ContactMessage.create.mockResolvedValue({ _id: '1' })
    sendContactNotification.mockResolvedValue()

    const res = await request(app)
      .post('/api/contact')
      .send({ name: '  Nam ', email: ' nam@example.com ', message: ' Hello \n' })

    expect(res.status).toBe(201)
    const trimmed = { name: 'Nam', email: 'nam@example.com', message: 'Hello' }
    expect(ContactMessage.create).toHaveBeenCalledWith(trimmed)
    expect(sendContactNotification).toHaveBeenCalledWith(trimmed)
  })

  it('answers an oversized request body with 413 JSON', async () => {
    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Nam', email: 'nam@example.com', message: 'a'.repeat(40 * 1024) })

    expect(res.status).toBe(413)
    expect(res.body.message).toMatch(/too large/i)
    expect(ContactMessage.create).not.toHaveBeenCalled()
  })

  it('answers a malformed JSON body with 400 JSON', async () => {
    const res = await request(app)
      .post('/api/contact')
      .set('Content-Type', 'application/json')
      .send('{"name": ')

    expect(res.status).toBe(400)
    expect(res.body.message).toMatch(/valid JSON/i)
  })

  it('returns 400 when the database refuses the data', async () => {
    const validationError = new Error('invalid')
    validationError.name = 'ValidationError'
    ContactMessage.create.mockRejectedValue(validationError)

    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Nam', email: 'nam@example.com', message: 'Hello' })

    expect(res.status).toBe(400)
  })

  it('returns 500 when saving fails', async () => {
    ContactMessage.create.mockRejectedValue(new Error('DB error'))

    const res = await request(app)
      .post('/api/contact')
      .send({ name: 'Nam', email: 'nam@example.com', message: 'Hello' })

    expect(res.status).toBe(500)
  })
})
