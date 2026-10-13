import ContactMessage from '../models/ContactMessage.js'
import { sendContactNotification } from '../config/mailer.js'
import { validateContact } from '../utils/validateContact.js'

export async function createContactMessage(req, res) {
  const { values, error } = validateContact(req.body)

  if (error) {
    return res.status(400).json({ message: error })
  }

  const { name, email, message } = values

  try {
    const contactMessage = await ContactMessage.create({ name, email, message })

    try {
      await sendContactNotification({ name, email, message })
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError.message)
    }

    res.status(201).json(contactMessage)
  } catch (saveError) {
    // Anything the checks above let through but the model refuses is still the visitor's input.
    if (saveError.name === 'ValidationError') {
      return res.status(400).json({ message: 'Please check the form and try again.' })
    }
    res.status(500).json({ message: 'Failed to save message' })
  }
}
