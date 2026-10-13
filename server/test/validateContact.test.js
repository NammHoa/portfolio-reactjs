import { describe, it, expect } from 'vitest'
import { validateContact, CONTACT_LIMITS } from '../src/utils/validateContact.js'

const valid = { name: 'Nam', email: 'nam@example.com', message: 'Hello' }

describe('validateContact', () => {
  it('accepts a normal message and returns trimmed values', () => {
    const result = validateContact({
      name: '  Nam ',
      email: ' nam@example.com ',
      message: '\nHello\n',
    })

    expect(result.error).toBeUndefined()
    expect(result.values).toEqual(valid)
  })

  it.each([undefined, null, 'text', 42])('rejects a body that is %s', (body) => {
    expect(validateContact(body).error).toMatch(/required/i)
  })

  it.each(['name', 'email', 'message'])('requires %s', (field) => {
    expect(validateContact({ ...valid, [field]: '' }).error).toMatch(/required/i)
    expect(validateContact({ ...valid, [field]: '   ' }).error).toMatch(/required/i)
  })

  it.each([
    ['a number', 42],
    ['an object', { $gt: '' }],
    ['an array', ['nam@example.com']],
  ])('rejects an email that is %s', (_label, email) => {
    expect(validateContact({ ...valid, email }).error).toMatch(/must be text/i)
  })

  it.each(['abc', 'a@b', 'a@b.c', 'nam @example.com', '@example.com', 'nam@@example.com'])(
    'rejects the email "%s"',
    (email) => {
      expect(validateContact({ ...valid, email }).error).toMatch(/valid email/i)
    }
  )

  it.each(Object.keys(CONTACT_LIMITS))('allows a %s exactly at its limit and rejects one over', (field) => {
    const limit = CONTACT_LIMITS[field]
    const fill = (length) =>
      field === 'email' ? `${'a'.repeat(length - '@x.com'.length)}@x.com` : 'a'.repeat(length)

    expect(validateContact({ ...valid, [field]: fill(limit) }).error).toBeUndefined()
    expect(validateContact({ ...valid, [field]: fill(limit + 1) }).error).toMatch(/too long/i)
  })

  it('refuses line breaks in the name, which would end up in email headers', () => {
    const result = validateContact({ ...valid, name: 'Nam\r\nBcc: someone@example.com' })
    expect(result.error).toMatch(/line breaks/i)
  })

  it('keeps line breaks inside the message', () => {
    const result = validateContact({ ...valid, message: 'Line one\nLine two' })
    expect(result.values.message).toBe('Line one\nLine two')
  })
})
