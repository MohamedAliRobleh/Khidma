// api/admin/verify.test.js
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock the lib modules before importing handler
vi.mock('../../lib/auth.js', () => ({
  createToken: vi.fn(() => Promise.resolve('mock-jwt-token')),
}))
vi.mock('../../lib/cors.js', () => ({
  cors: vi.fn(() => false),
}))

function makeMocks(method = 'POST', body = {}) {
  let statusCode = 200
  const res = {
    _body: null,
    _status: 200,
    status(code) { statusCode = code; this._status = code; return this },
    json(body) { this._body = body; return this },
    end() { return this },
    setHeader() { return this },
  }
  const req = { method, body, headers: {} }
  return { req, res }
}

describe('POST /api/admin/verify', () => {
  const origEnv = process.env

  beforeEach(() => {
    process.env = { ...origEnv, ADMIN_PASSWORD: 'secret123' }
    vi.resetModules()
  })

  afterEach(() => {
    process.env = origEnv
  })

  it('returns token when password matches', async () => {
    const { default: handler } = await import('./verify.js')
    const { req, res } = makeMocks('POST', { password: 'secret123' })
    await handler(req, res)
    expect(res._body.token).toBe('mock-jwt-token')
  })

  it('returns 401 on wrong password', async () => {
    const { default: handler } = await import('./verify.js')
    const { req, res } = makeMocks('POST', { password: 'wrong' })
    await handler(req, res)
    expect(res._status).toBe(401)
    expect(res._body.error).toBeDefined()
  })

  it('returns 405 for non-POST method', async () => {
    const { default: handler } = await import('./verify.js')
    const { req, res } = makeMocks('GET', {})
    await handler(req, res)
    expect(res._status).toBe(405)
  })
})
