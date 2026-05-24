// api/employers/[id]/history.js
import { cors } from '../../../lib/cors.js'
import { requireEmployer } from '../../../lib/employerAuth.js'
import { prisma } from '../../../lib/prisma.js'

export default async function handler(req, res) {
  if (cors(req, res)) return

  const employerId = await requireEmployer(req, res)
  if (!employerId) return

  if (req.query.id !== employerId) {
    return res.status(403).json({ error: 'Accès refusé' })
  }

  if (req.method === 'GET') {
    try {
      const history = await prisma.workerHistory.findMany({
        where: { employerId },
        include: { worker: { include: { reviews: { where: { approved: true } } } } },
        orderBy: { startDate: 'desc' },
      })
      return res.json(history)
    } catch (err) {
      console.error('History GET error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  if (req.method === 'POST') {
    const { workerId } = req.body
    if (!workerId) return res.status(400).json({ error: 'workerId requis' })
    try {
      const entry = await prisma.workerHistory.upsert({
        where: { employerId_workerId: { employerId, workerId } },
        update: { status: 'ACTIVE', endDate: null, startDate: new Date() },
        create: { employerId, workerId },
      })
      return res.status(201).json(entry)
    } catch (err) {
      console.error('History POST error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  if (req.method === 'PATCH') {
    const { workerId, status, endDate } = req.body
    if (!workerId) return res.status(400).json({ error: 'workerId requis' })
    try {
      const entry = await prisma.workerHistory.update({
        where: { employerId_workerId: { employerId, workerId } },
        data: {
          status: status || 'PAST',
          endDate: endDate ? new Date(endDate) : new Date(),
        },
      })
      return res.json(entry)
    } catch (err) {
      console.error('History PATCH error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
