import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { ProjectModalProvider, useProjectModal } from './ProjectModalContext'
import { getProjects } from '../lib/api'
import fallbackProjects from '../data/projects.fallback.json'

vi.mock('../lib/api', () => ({
  getProjects: vi.fn(),
}))

const CACHE_KEY = 'portfolio:projects:v2'

function Probe() {
  const { experienceProjects, portfolioProjects } = useProjectModal()
  return (
    <ul>
      {[...experienceProjects, ...portfolioProjects].map((p) => (
        <li key={p._id}>{p.name}</li>
      ))}
    </ul>
  )
}

const renderProvider = () =>
  render(
    <ProjectModalProvider>
      <Probe />
    </ProjectModalProvider>
  )

describe('project data', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('shows the baked-in projects immediately, without waiting for the API', () => {
    getProjects.mockReturnValue(new Promise(() => {})) // a sleeping server: never answers

    renderProvider()

    for (const project of fallbackProjects) {
      expect(screen.getByText(project.name)).toBeInTheDocument()
    }
  })

  it('keeps showing them when the API fails', async () => {
    getProjects.mockRejectedValue(new Error('Failed to load projects'))

    renderProvider()
    await waitFor(() => expect(getProjects).toHaveBeenCalled())

    expect(screen.getByText(fallbackProjects[0].name)).toBeInTheDocument()
    expect(screen.queryByText(/couldn't load/i)).not.toBeInTheDocument()
  })

  it('swaps in the live data when the API answers, and remembers it', async () => {
    const live = [{ ...fallbackProjects[0], _id: 'live-1', name: 'Live project' }]
    getProjects.mockResolvedValue(live)

    renderProvider()

    expect(await screen.findByText('Live project')).toBeInTheDocument()
    expect(screen.queryByText(fallbackProjects[0].name)).not.toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(CACHE_KEY))).toEqual(live)
  })

  it('ignores an empty answer instead of blanking the page', async () => {
    getProjects.mockResolvedValue([])

    renderProvider()
    await waitFor(() => expect(getProjects).toHaveBeenCalled())

    expect(screen.getByText(fallbackProjects[0].name)).toBeInTheDocument()
  })

  it('starts from what this browser saw last time, ahead of the baked-in copy', () => {
    const remembered = [{ ...fallbackProjects[0], _id: 'cached-1', name: 'Remembered project' }]
    localStorage.setItem(CACHE_KEY, JSON.stringify(remembered))
    getProjects.mockReturnValue(new Promise(() => {}))

    renderProvider()

    expect(screen.getByText('Remembered project')).toBeInTheDocument()
  })
})
