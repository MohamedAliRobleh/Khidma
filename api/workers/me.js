// api/workers/me.js
import { cors } from '../../lib/cors.js'
import { requireWorker } from '../../lib/workerAuth.js'
import { prisma } from '../../lib/prisma.js'

const SELF_EDITABLE = ['available', 'availableFrom', 'neighborhood', 'priceFdj', 'bio']

export default async function handler(req, res) {
  if (cors(req, res)) return

  const workerId = await requireWorker(req, res)
  if (!workerId) return

  if (req.method === 'GET') {
    try {
      const worker = await prisma.worker.findUnique({
        where: { id: workerId },
        select: {
          id: true, fullName: true, phone: true, available: true,
          availableFrom: true, neighborhood: true, priceFdj: true, bio: true,
          photoUrl: true, tasks: true, workType: true, status: true,
        },
      })
      if (!worker) return res.status(404).json({ error: 'Profil introuvable' })
      return res.json(worker)
    } catch (err) {
      console.error('Worker ME GET error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  if (req.method === 'PUT') {
    try {
      const data = Object.fromEntries(
        SELF_EDITABLE.filter(k => k in req.body).map(k => [k, req.body[k]])
      )
      const worker = await prisma.worker.update({ where: { id: workerId }, data })
      return res.json(worker)
    } catch (err) {
      console.error('Worker ME PUT error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
