import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getProjects, sendContactMessage } from './api'

describe('api helpers', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('getProjects returns parsed json on success', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ name: 'Test Project' }],
    })

    const data = await getProjects()

    expect(data).toEqual([{ name: 'Test Project' }])
  })

  it('getProjects throws when the request fails', async () => {
    global.fetch.mockResolvedValue({ ok: false })

    await expect(getProjects()).rejects.toThrow('Failed to load projects')
  })

  it('sendContactMessage posts the payload and returns the response', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ _id: '1' }),
    })

    const result = await sendContactMessage({
      name: 'Nam',
      email: 'nam@example.com',
      message: 'Hello',
    })

    expect(result).toEqual({ _id: '1' })
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/contact'),
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('sendContactMessage throws the server error message on failure', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Bad request' }),
    })

    await expect(
      sendContactMessage({ name: '', email: '', message: '' })
    ).rejects.toThrow('Bad request')
  })
})
