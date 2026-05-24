// api/workers/auth/login.js
import { cors } from '../../../lib/cors.js'
import { prisma } from '../../../lib/prisma.js'
import { verifyPin, createWorkerToken } from '../../../lib/workerAuth.js'

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

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
