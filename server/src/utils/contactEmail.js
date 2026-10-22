const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
}

// Visitor text goes into an HTML email, so characters that mean something in HTML
// must be turned into plain text first. Otherwise a message like
// <a href="https://evil.example">Click here</a> would arrive as a live link.
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char])
}

/** Builds the notification mail (subject, plain text and HTML) for one contact message. */
export function buildContactEmail({ name, email, message }) {
  const safeName = escapeHtml(name)
  const safeEmail = escapeHtml(email)
  // Keep the visitor's line breaks; escape first so the <br> tags are the only markup.
  const safeMessage = escapeHtml(message).replace(/\r?\n/g, '<br>')

  return {
    subject: `New message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
    html: `<p><strong>From:</strong> ${safeName} (${safeEmail})</p><p>${safeMessage}</p>`,
  }
}
