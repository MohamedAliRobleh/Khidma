// lib/workerAuth.js
import { scrypt, randomBytes, timingSafeEqual } from 'crypto'
import { promisify } from 'util'
import { SignJWT, jwtVerify } from 'jose'

const scryptAsync = promisify(scrypt)

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET)
}

export async function hashPin(pin) {
  const salt = randomBytes(16).toString('hex')
  const derived = await scryptAsync(pin, salt, 32)
  return `${salt}:${derived.toString('hex')}`
}

export async function verifyPin(pin, stored) {
  const [salt, hash] = stored.split(':')
  const derived = await scryptAsync(pin, salt, 32)
  const storedBuf = Buffer.from(hash, 'hex')
  return timingSafeEqual(derived, storedBuf)
}

export async function createWorkerToken(workerId) {
  return new SignJWT({ sub: workerId, role: 'worker' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecret())
}

export async function requireWorker(req, res) {
  const auth = req.headers['authorization']
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Non autorisé' })
    return null
  }
  try {
    const { payload } = await jwtVerify(auth.slice(7), getSecret())
    if (payload.role !== 'worker') throw new Error()
    return payload.sub
  } catch {
    res.status(401).json({ error: 'Token invalide ou expiré' })
    return null
  }
}
