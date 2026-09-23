import ContactMessage from '../models/ContactMessage.js'
import { sendContactNotification } from '../config/mailer.js'

export async function createContactMessage(req, res) {
  const { name, email, message } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'name, email and message are required' })
  }

  try {
    const contactMessage = await ContactMessage.create({ name, email, message })

    try {
      await sendContactNotification({ name, email, message })
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError.message)
    }

    res.status(201).json(contactMessage)
  } catch (error) {
    res.status(500).json({ message: 'Failed to save message' })
  }
}
