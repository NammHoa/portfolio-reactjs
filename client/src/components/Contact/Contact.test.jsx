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
      website: '',
    })
  })

  it('points the visitor at the direct email when the server could not notify the owner', async () => {
    sendContactMessage.mockResolvedValue({ id: '1', notified: false })
    render(<Contact />)

    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/message is saved/i)).toHaveTextContent('hoanam270304@gmail.com')
    })
  })

  it('promises a reply when the owner was notified', async () => {
    sendContactMessage.mockResolvedValue({ id: '1', notified: true })
    render(<Contact />)

    fillForm()
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => {
      expect(screen.getByText(/get back to you soon/i)).toBeInTheDocument()
    })
  })

  it('sends the text without leading or trailing spaces', async () => {
    sendContactMessage.mockResolvedValue({ _id: '1' })
    render(<Contact />)

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: '  Nam  ' } })
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: ' nam@example.com ' },
    })
    fireEvent.change(screen.getByLabelText(/message/i), {
      target: { value: '\n Hello there \n' },
    })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => expect(sendContactMessage).toHaveBeenCalled())
    expect(sendContactMessage).toHaveBeenCalledWith({
      name: 'Nam',
      email: 'nam@example.com',
      message: 'Hello there',
      website: '',
    })
  })

  it('has a hidden trap field that people cannot reach and that is sent along', async () => {
    sendContactMessage.mockResolvedValue({ id: null, notified: true })
    render(<Contact />)

    const trap = screen.getByLabelText(/website/i)
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull()
    expect(trap).toHaveAttribute('tabindex', '-1')
    expect(trap).toHaveAttribute('autocomplete', 'off')

    fillForm()
    fireEvent.change(trap, { target: { value: 'https://spam.example' } })
    fireEvent.click(screen.getByRole('button', { name: /send message/i }))

    await waitFor(() => expect(sendContactMessage).toHaveBeenCalled())
    expect(sendContactMessage.mock.calls[0][0].website).toBe('https://spam.example')
  })

  it('tells visitors what happens with their details', () => {
    render(<Contact />)

    expect(screen.getByText(/used only to reply to you/i)).toBeInTheDocument()
  })

  it('limits field length and helps browsers autofill', () => {
    render(<Contact />)

    const name = screen.getByLabelText(/name/i)
    const email = screen.getByLabelText(/email/i)
    expect(name).toHaveAttribute('maxlength', '100')
    expect(name).toHaveAttribute('autocomplete', 'name')
    expect(email).toHaveAttribute('maxlength', '254')
    expect(email).toHaveAttribute('autocomplete', 'email')
    expect(screen.getByLabelText(/message/i)).toHaveAttribute('maxlength', '5000')
  })

  it('email pattern rejects addresses without a domain suffix', () => {
    render(<Contact />)

    const pattern = new RegExp(`^${screen.getByLabelText(/email/i).getAttribute('pattern')}$`)
    expect(pattern.test('nam@example.com')).toBe(true)
    expect(pattern.test('a@b')).toBe(false)
    expect(pattern.test('abc')).toBe(false)
    expect(pattern.test('a b@example.com')).toBe(false)
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
