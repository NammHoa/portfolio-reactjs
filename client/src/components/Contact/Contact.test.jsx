import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Contact from './Contact'
import { sendContactMessage } from '../../lib/api'

vi.mock('../../lib/api', () => ({
  sendContactMessage: vi.fn(),
}))

function fillForm() {
  fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'Nam' } })
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'nam@example.com' },
  })
  fireEvent.change(screen.getByLabelText(/message/i), {
    target: { value: 'Hello there' },
  })
}

describe('Contact form', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('submits the form and shows a success message', async () => {
    sendContactMessage.mockResolvedValue({ _id: '1' })
    render(<Contact />)

    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/thanks/i)).toBeInTheDocument()
    })

    expect(sendContactMessage).toHaveBeenCalledWith({
      name: 'Nam',
      email: 'nam@example.com',
      message: 'Hello there',
    })
  })

  it('shows an error message when submission fails', async () => {
    sendContactMessage.mockRejectedValue(new Error('Failed to send message'))
    render(<Contact />)

    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument()
    })
  })
})
