// api/workers/apply.js
import { cors } from '../../lib/cors.js'
import { prisma } from '../../lib/prisma.js'
import { hashPin } from '../../lib/workerAuth.js'

const APPLY_FIELDS = [
  'fullName', 'phone', 'neighborhood', 'bio',
  'languageLevels', 'tasks', 'workType', 'schedule', 'priceFdj',
]

function pickApplyFields(body) {
  return Object.fromEntries(
    APPLY_FIELDS.filter(k => k in body).map(k => [k, body[k]])
  )
}

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { fullName, phone, pin } = req.body
  if (!fullName?.trim() || !phone?.trim()) {
    return res.status(400).json({ error: 'fullName et phone sont requis' })
  }
  if (!pin || !/^\d{4}$/.test(pin)) {
    return res.status(400).json({ error: 'Le code PIN doit être 4 chiffres' })
  }

  try {
    const pinHash = await hashPin(pin)
    const worker = await prisma.worker.create({
      data: {
        ...pickApplyFields(req.body),
        pinHash,
        status: 'PENDING',
        selfRegistered: true,
        verified: false,
      },
    })
    return res.status(201).json({ id: worker.id })
  } catch (err) {
    console.error('Worker apply error:', err)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
