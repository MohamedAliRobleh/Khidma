// api/admin/verify.js
import { cors } from '../../lib/cors.js'
import { createToken } from '../../lib/auth.js'

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { password } = req.body
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Mot de passe incorrect' })
  }

  const token = await createToken()
  res.json({ token })
}
