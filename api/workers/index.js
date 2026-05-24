// api/workers/index.js
import { cors } from '../../lib/cors.js'
import { requireAdmin, verifyToken } from '../../lib/auth.js'
import { prisma } from '../../lib/prisma.js'
import { hashPin } from '../../lib/workerAuth.js'

const WORKER_FIELDS = [
  'fullName', 'phone', 'age', 'photoUrl', 'cloudinaryId', 'bio',
  'city', 'neighborhood', 'available', 'availableFrom', 'verified',
  'verifiedSkills', 'featured', 'status', 'experience', 'languageLevels',
  'tasks', 'priceFdj', 'workType', 'schedule', 'employerProvides',
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
      task, neighborhood, workType, available, featured,
      language, minRating, sort, page = '1', limit = '12', status,
    } = req.query

    const adminToken = req.headers['authorization']?.replace('Bearer ', '') || ''
    const isAdmin = await verifyToken(adminToken)

    const where = {}
    if (!isAdmin) {
      where.status = 'ACTIVE'
    } else if (status) {
      where.status = status
    }

    if (task)         where.tasks        = { has: task }
    if (neighborhood) where.neighborhood = neighborhood
    if (workType)     where.workType     = { has: workType }
    if (featured !== undefined) where.featured = featured === 'true'
    if (available !== undefined) where.available = available === 'true'

    try {
      let workers = await prisma.worker.findMany({
        where,
        include: { reviews: { where: { approved: true } } },
      })

      if (language) {
        const langs = Array.isArray(language) ? language : [language]
        workers = workers.filter(w => {
          const levels = Array.isArray(w.languageLevels) ? w.languageLevels : []
          return langs.some(lang => levels.some(l => l.language === lang))
        })
      }

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
      } else if (sort === 'recent') {
        workers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      } else {
        workers.sort((a, b) => a.fullName.localeCompare(b.fullName, 'fr'))
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
      const data = pickWorkerFields(req.body)
      if (req.body.pin && /^\d{4}$/.test(req.body.pin)) {
        data.pinHash = await hashPin(req.body.pin)
      }
      const worker = await prisma.worker.create({ data })
      return res.status(201).json(worker)
    } catch (err) {
      console.error('Workers POST error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
