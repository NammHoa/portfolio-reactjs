import ContactMessage from '../models/ContactMessage.js'
import { sendContactNotification } from '../config/mailer.js'
import { validateContact } from '../utils/validateContact.js'

// Remember in the database whether the owner was told, so a message whose email failed
// can still be found later. This must never break the visitor's request.
async function recordNotifyResult(id, update) {
  try {
    await ContactMessage.updateOne({ _id: id }, update)
  } catch (updateError) {
    console.error('Failed to record notification result:', updateError.message)
  }
}

export async function createContactMessage(req, res) {
  const { values, error } = validateContact(req.body)

  if (error) {
    return res.status(400).json({ message: error })
  }

  const { name, email, message } = values

  try {
    const contactMessage = await ContactMessage.create({ name, email, message })

    let notified = false
    try {
      await sendContactNotification({ name, email, message })
      notified = true
      await recordNotifyResult(contactMessage._id, { notified: true })
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError.message)
      await recordNotifyResult(contactMessage._id, {
        notified: false,
        notifyError: String(emailError.message).slice(0, 500),
      })
    }

    // The message is saved either way. `notified` tells the browser whether to
    // promise a quick reply or point the visitor at the direct email address.
    res.status(201).json({ id: contactMessage._id, notified })
  } catch (saveError) {
    // Anything the checks above let through but the model refuses is still the visitor's input.
    if (saveError.name === 'ValidationError') {
      return res.status(400).json({ message: 'Please check the form and try again.' })
    }
    res.status(500).json({ message: 'Failed to save message' })
  }
}
