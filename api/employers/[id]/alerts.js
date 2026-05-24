// api/employers/[id]/alerts.js
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
      const alerts = await prisma.availabilityAlert.findMany({
        where: { employerId },
        include: { worker: true },
        orderBy: { createdAt: 'desc' },
      })
      return res.json(alerts)
    } catch (err) {
      console.error('Alerts GET error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  if (req.method === 'POST') {
    const { workerId } = req.body
    if (!workerId) return res.status(400).json({ error: 'workerId requis' })
    try {
      const alert = await prisma.availabilityAlert.upsert({
        where: { employerId_workerId: { employerId, workerId } },
        update: {},
        create: { employerId, workerId },
      })
      return res.status(201).json(alert)
    } catch (err) {
      console.error('Alerts POST error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  if (req.method === 'DELETE') {
    const { workerId } = req.body
    if (!workerId) return res.status(400).json({ error: 'workerId requis' })
    try {
      await prisma.availabilityAlert.deleteMany({ where: { employerId, workerId } })
      return res.json({ success: true })
    } catch (err) {
      console.error('Alerts DELETE error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
