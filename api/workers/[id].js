// api/workers/[id].js
import { cors } from '../../lib/cors.js'
import { requireAdmin } from '../../lib/auth.js'
import { prisma } from '../../lib/prisma.js'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const worker = await prisma.worker.findUnique({
        where: { id },
        include: {
          reviews: {
            where: { approved: true },
            orderBy: { createdAt: 'desc' },
          },
        },
      })
      if (!worker) return res.status(404).json({ error: 'Travailleuse introuvable' })
      return res.json(worker)
    } catch (err) {
      console.error('Worker GET error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  if (req.method === 'PUT') {
    if (!(await requireAdmin(req, res))) return
    try {
      const worker = await prisma.worker.update({ where: { id }, data: pickWorkerFields(req.body) })
      return res.json(worker)
    } catch (err) {
      console.error('Worker PUT error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  if (req.method === 'DELETE') {
    if (!(await requireAdmin(req, res))) return
    try {
      const worker = await prisma.worker.findUnique({ where: { id } })
      if (worker?.cloudinaryId) {
        await cloudinary.uploader.destroy(worker.cloudinaryId)
      }
      await prisma.worker.delete({ where: { id } })
      return res.json({ success: true })
    } catch (err) {
      console.error('Worker DELETE error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
