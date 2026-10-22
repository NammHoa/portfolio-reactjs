import mongoose from 'mongoose'
import { CONTACT_LIMITS } from '../utils/validateContact.js'

// The controller checks the form first; these limits are a second line of defence so
// nothing oversized can reach the database through any other code path.
const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: CONTACT_LIMITS.name },
    email: { type: String, required: true, trim: true, maxlength: CONTACT_LIMITS.email },
    message: { type: String, required: true, trim: true, maxlength: CONTACT_LIMITS.message },
    // Whether the notification email reached the owner. false means the message is saved
    // but nobody was told, so find these with ContactMessage.find({ notified: false }).
    notified: { type: Boolean, default: false },
    notifyError: { type: String, maxlength: 500 },
  },
  { timestamps: true }
)

export default mongoose.model('ContactMessage', contactMessageSchema)
