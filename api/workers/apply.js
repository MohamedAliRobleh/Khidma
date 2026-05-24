// api/workers/apply.js  (handles both worker registration and worker login)
import { cors } from '../../lib/cors.js'
import { prisma } from '../../lib/prisma.js'
import { hashPin, verifyPin, createWorkerToken } from '../../lib/workerAuth.js'

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

  // Worker login: POST /api/workers/apply { action: 'login', phone, pin }
  if (req.body.action === 'login') {
    const { phone, pin } = req.body
    if (!phone?.trim() || !pin) return res.status(400).json({ error: 'Téléphone et PIN requis' })
    if (!/^\d{4}$/.test(pin)) return res.status(400).json({ error: 'Le PIN doit être 4 chiffres' })

    try {
      const worker = await prisma.worker.findFirst({
        where: { phone: phone.trim(), status: 'ACTIVE' },
      })
      if (!worker || !worker.pinHash) {
        return res.status(401).json({ error: 'Téléphone ou PIN incorrect' })
      }
      const valid = await verifyPin(pin, worker.pinHash)
      if (!valid) return res.status(401).json({ error: 'Téléphone ou PIN incorrect' })

      const token = await createWorkerToken(worker.id)
      return res.json({
        token,
        worker: { id: worker.id, fullName: worker.fullName, phone: worker.phone },
      })
    } catch (err) {
      console.error('Worker login error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  // Worker registration: POST /api/workers/apply { fullName, phone, pin, ... }
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
