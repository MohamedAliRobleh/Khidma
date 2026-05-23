// api/reviews/[workerId].js
import { cors } from '../../lib/cors.js'
import { prisma } from '../../lib/prisma.js'

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  const { workerId } = req.query
  try {
    const reviews = await prisma.review.findMany({
      where: { workerId, approved: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(reviews)
  } catch (err) {
    console.error('Reviews GET error:', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
