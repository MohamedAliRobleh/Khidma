// lib/employerAuth.js
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'
import { SignJWT, jwtVerify } from 'jose'

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-32-chars-minimum-pls!')
}

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':')
  const verify = scryptSync(password, salt, 64)
  return timingSafeEqual(Buffer.from(hash, 'hex'), verify)
}

export async function createEmployerToken(employerId) {
  return new SignJWT({ sub: employerId, role: 'employer' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecret())
}

export async function requireEmployer(req, res) {
  const auth = req.headers['authorization']
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Non autorisé' })
    return null
  }
  try {
    const { payload } = await jwtVerify(auth.slice(7), getSecret())
    if (payload.role !== 'employer') {
      res.status(401).json({ error: 'Token invalide' })
      return null
    }
    return payload.sub
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' })
    return null
  }
}
