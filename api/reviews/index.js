// api/reviews/index.js
import { cors } from '../../lib/cors.js'
import { prisma } from '../../lib/prisma.js'

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { workerId, clientName, rating, comment } = req.body

  if (!workerId || !clientName || rating == null) {
    return res.status(400).json({ error: 'workerId, clientName et rating sont requis' })
  }
  const r = Number(rating)
  if (!Number.isInteger(r) || r < 1 || r > 5) {
    return res.status(400).json({ error: 'La note doit être entre 1 et 5' })
  }

  try {
    const review = await prisma.review.create({
      data: { workerId, clientName, rating: r, comment: comment || null },
    })
    res.status(201).json(review)
  } catch (err) {
    console.error('Review create error:', err)
    res.status(500).json({ error: 'Erreur serveur' })
  }
}
