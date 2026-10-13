// Limits for the contact form. The form in the browser uses the same numbers
// (client/src/components/Contact/Contact.jsx), so keep the two in sync.
export const CONTACT_LIMITS = { name: 100, email: 254, message: 5000 }

// Pragmatic email check: something@domain.tld with no spaces. It rejects obvious junk
// like "abc" or "a@b" without trying to implement the full email specification.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const LINE_BREAK = /[\r\n]/

/**
 * Checks the contact form body.
 * Returns { values: { name, email, message } } with trimmed text when it is acceptable,
 * or { error: '<message for the visitor>' } when it is not.
 */
export function validateContact(body) {
  const { name, email, message } = body ?? {}

  for (const value of [name, email, message]) {
    if (value !== undefined && typeof value !== 'string') {
      return { error: 'name, email and message must be text' }
    }
  }

  const values = {
    name: (name ?? '').trim(),
    email: (email ?? '').trim(),
    message: (message ?? '').trim(),
  }

  if (!values.name || !values.email || !values.message) {
    return { error: 'name, email and message are required' }
  }

  if (values.name.length > CONTACT_LIMITS.name) {
    return { error: `Name is too long (${CONTACT_LIMITS.name} characters at most).` }
  }
  if (values.email.length > CONTACT_LIMITS.email) {
    return { error: `Email is too long (${CONTACT_LIMITS.email} characters at most).` }
  }
  if (values.message.length > CONTACT_LIMITS.message) {
    return { error: `Message is too long (${CONTACT_LIMITS.message} characters at most).` }
  }

  // Name and email end up in email headers, so they must stay on one line.
  if (LINE_BREAK.test(values.name) || LINE_BREAK.test(values.email)) {
    return { error: 'Name and email cannot contain line breaks.' }
  }

  if (!EMAIL_PATTERN.test(values.email)) {
    return { error: 'Please enter a valid email address.' }
  }

  return { values }
}
