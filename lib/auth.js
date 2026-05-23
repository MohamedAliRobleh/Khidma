// lib/auth.js
import { SignJWT, jwtVerify } from 'jose'

function getSecret() {
  return new TextEncoder().encode(process.env.JWT_SECRET)
}

export async function createToken() {
  return new SignJWT({})
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getSecret())
}

export async function verifyToken(token) {
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

export async function requireAdmin(req, res) {
  const auth = req.headers['authorization']
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Non autorisé' })
    return false
  }
  const valid = await verifyToken(auth.slice(7))
  if (!valid) {
    res.status(401).json({ error: 'Token invalide ou expiré' })
    return false
  }
  return true
}
