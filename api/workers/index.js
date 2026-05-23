// api/workers/index.js
import { cors } from '../../lib/cors.js'
import { requireAdmin } from '../../lib/auth.js'
import { prisma } from '../../lib/prisma.js'

const WORKER_FIELDS = [
  'fullName', 'phone', 'age', 'photoUrl', 'cloudinaryId', 'bio',
  'city', 'neighborhood', 'available', 'verified', 'featured',
  'experience', 'languages', 'tasks', 'priceFdj', 'workType',
  'schedule', 'employerProvides',
]

function pickWorkerFields(body) {
  return Object.fromEntries(
    WORKER_FIELDS.filter(k => k in body).map(k => [k, body[k]])
  )
}

export default async function handler(req, res) {
  if (cors(req, res)) return

  if (req.method === 'GET') {
    const {
      task, neighborhood, workType, available,
      minRating, sort, page = '1', limit = '12',
    } = req.query

    const where = {}
    if (task)         where.tasks        = { has: task }
    if (neighborhood) where.neighborhood = neighborhood
    if (workType)     where.workType     = { has: workType }
    if (available !== undefined) where.available = available === 'true'

    try {
      let workers = await prisma.worker.findMany({
        where,
        include: { reviews: { where: { approved: true } } },
      })

      if (minRating) {
        const min = parseFloat(minRating)
        workers = workers.filter(w => {
          if (!w.reviews.length) return false
          const avg = w.reviews.reduce((s, r) => s + r.rating, 0) / w.reviews.length
          return avg >= min
        })
      }

      const avgOf = w => w.reviews.length
        ? w.reviews.reduce((s, r) => s + r.rating, 0) / w.reviews.length
        : 0

      if (sort === 'rating') {
        workers.sort((a, b) => avgOf(b) - avgOf(a))
      } else if (sort === 'price') {
        workers.sort((a, b) => (a.priceFdj ?? Infinity) - (b.priceFdj ?? Infinity))
      } else {
        workers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      }

      const total   = workers.length
      const pageNum = parseInt(page)
      const lim     = parseInt(limit)
      const data    = workers.slice((pageNum - 1) * lim, pageNum * lim)

      return res.json({ workers: data, total, page: pageNum, totalPages: Math.ceil(total / lim) })
    } catch (err) {
      console.error('Workers GET error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  if (req.method === 'POST') {
    if (!(await requireAdmin(req, res))) return
    try {
      const worker = await prisma.worker.create({ data: pickWorkerFields(req.body) })
      return res.status(201).json(worker)
    } catch (err) {
      console.error('Workers POST error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
