const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function getProjects() {
  const res = await fetch(`${API_URL}/api/projects`)

  if (!res.ok) {
    throw new Error('Failed to load projects')
  }

  return res.json()
}

export async function sendContactMessage({ name, email, message }) {
  const res = await fetch(`${API_URL}/api/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, message }),
  })

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    throw new Error(data.message || 'Failed to send message')
  }

  return data
}
