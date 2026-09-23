import ContactMessage from '../models/ContactMessage.js'

export async function createContactMessage(req, res) {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'name, email and message are required' })
  }

  try {
    const contactMessage = await ContactMessage.create({ name, email, message })
    res.status(201).json(contactMessage)
  } catch (error) {
    res.status(500).json({ message: 'Failed to save message' })
  }
}
