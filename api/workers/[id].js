// api/workers/[id].js
import { cors } from '../../lib/cors.js'
import { requireAdmin } from '../../lib/auth.js'
import { prisma } from '../../lib/prisma.js'

export default async function handler(req, res) {
  if (cors(req, res)) return
  const { id } = req.query

  if (req.method === 'GET') {
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
  }

  if (req.method === 'PUT') {
    if (!(await requireAdmin(req, res))) return
    const worker = await prisma.worker.update({ where: { id }, data: req.body })
    return res.json(worker)
  }

  if (req.method === 'DELETE') {
    if (!(await requireAdmin(req, res))) return
    const worker = await prisma.worker.findUnique({ where: { id } })
    if (worker?.cloudinaryId) {
      const { v2: cloudinary } = await import('cloudinary')
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key:    process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      })
      await cloudinary.uploader.destroy(worker.cloudinaryId)
    }
    await prisma.worker.delete({ where: { id } })
    return res.json({ success: true })
  }

  res.status(405).json({ error: 'Method not allowed' })
}
