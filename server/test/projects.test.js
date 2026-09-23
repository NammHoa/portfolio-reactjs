import { describe, it, expect, vi, beforeEach } from 'vitest'
import request from 'supertest'
import app from '../src/app.js'
import Project from '../src/models/Project.js'

vi.mock('../src/models/Project.js', () => ({
  default: { find: vi.fn() },
}))

describe('GET /api/projects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns projects sorted by order', async () => {
    const sortMock = vi.fn().mockResolvedValue([{ name: 'Grade 10', order: 1 }])
    Project.find.mockReturnValue({ sort: sortMock })

    const res = await request(app).get('/api/projects')

    expect(res.status).toBe(200)
    expect(res.body).toEqual([{ name: 'Grade 10', order: 1 }])
    expect(sortMock).toHaveBeenCalledWith({ order: 1 })
  })

  it('returns 500 when the database query fails', async () => {
    Project.find.mockReturnValue({ sort: vi.fn().mockRejectedValue(new Error('fail')) })

    const res = await request(app).get('/api/projects')

    expect(res.status).toBe(500)
  })
})
