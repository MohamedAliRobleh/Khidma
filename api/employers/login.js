// api/employers/login.js
import { cors } from '../../lib/cors.js'
import { prisma } from '../../lib/prisma.js'
import { verifyPassword, createEmployerToken } from '../../lib/employerAuth.js'

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'email et password sont requis' })
  }

  try {
    const employer = await prisma.employer.findUnique({ where: { email } })
    if (!employer || !verifyPassword(password, employer.passwordHash)) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' })
    }

    const token = await createEmployerToken(employer.id)
    return res.json({
      token,
      employer: { id: employer.id, name: employer.name, email: employer.email },
    })
  } catch (err) {
    console.error('Employer login error:', err)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
