import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword } from '../../lib/employerAuth.js'

describe('employerAuth', () => {
  it('hashPassword returns salt:hash format', () => {
    const h = hashPassword('secret123')
    expect(h).toMatch(/^[a-f0-9]{32}:[a-f0-9]+$/)
  })

  it('verifyPassword accepts correct password', () => {
    const h = hashPassword('mypass')
    expect(verifyPassword('mypass', h)).toBe(true)
  })

  it('verifyPassword rejects wrong password', () => {
    const h = hashPassword('mypass')
    expect(verifyPassword('wrong', h)).toBe(false)
  })
})
