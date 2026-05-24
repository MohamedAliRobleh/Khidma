// api/employers/register.js
import { cors } from '../../lib/cors.js'
import { prisma } from '../../lib/prisma.js'
import { hashPassword, createEmployerToken } from '../../lib/employerAuth.js'

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { email, password, name, phone } = req.body
  if (!email || !password || !name) {
    return res.status(400).json({ error: 'email, password et name sont requis' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Le mot de passe doit faire au moins 6 caractères' })
  }

  try {
    const existing = await prisma.employer.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ error: 'Email déjà utilisé' })

    const employer = await prisma.employer.create({
      data: { email, passwordHash: hashPassword(password), name, phone: phone || null },
    })

    const token = await createEmployerToken(employer.id)
    return res.status(201).json({
      token,
      employer: { id: employer.id, name: employer.name, email: employer.email },
    })
  } catch (err) {
    console.error('Employer register error:', err)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
