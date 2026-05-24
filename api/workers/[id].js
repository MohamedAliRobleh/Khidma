// api/workers/[id].js
import { cors } from '../../lib/cors.js'
import { requireAdmin } from '../../lib/auth.js'
import { hashPin, requireWorker } from '../../lib/workerAuth.js'
import { prisma } from '../../lib/prisma.js'

const WORKER_FIELDS = [
  'fullName', 'phone', 'age', 'photoUrl', 'cloudinaryId', 'bio',
  'city', 'neighborhood', 'available', 'availableFrom', 'verified',
  'verifiedSkills', 'featured', 'status', 'experience', 'languageLevels',
  'tasks', 'priceFdj', 'workType', 'schedule', 'employerProvides',
]

const SELF_EDITABLE = ['available', 'availableFrom', 'neighborhood', 'priceFdj', 'bio']

function pickWorkerFields(body) {
  return Object.fromEntries(
    WORKER_FIELDS.filter(k => k in body).map(k => [k, body[k]])
  )
}

async function triggerAvailabilityAlerts(workerId, workerName) {
  try {
    const alerts = await prisma.availabilityAlert.findMany({
      where: { workerId },
      include: { employer: true },
    })
    if (!alerts.length) return

    await Promise.all(alerts.map(alert =>
      fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'api-key': process.env.BREVO_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: { name: 'Khidma', email: process.env.ADMIN_EMAIL },
          to: [{ email: alert.employer.email, name: alert.employer.name }],
          subject: `${workerName} est à nouveau disponible`,
          htmlContent: `
            <h2>Bonne nouvelle !</h2>
            <p>Bonjour ${alert.employer.name},</p>
            <p><strong>${workerName}</strong> que vous suivez sur Khidma est maintenant disponible.</p>
            <p><a href="https://khidma.vercel.app/aides/${workerId}">Voir son profil</a></p>
          `,
        }),
      }).catch(e => console.error('Alert email error:', e))
    ))
  } catch (e) {
    console.error('triggerAvailabilityAlerts error:', e)
  }
}

export default async function handler(req, res) {
  if (cors(req, res)) return
  const { id } = req.query

  // Worker self-profile: GET/PUT /api/workers/me
  if (id === 'me') {
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

    return res.status(405).json({ error: 'Method not allowed' })
  }

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
      const prev = await prisma.worker.findUnique({ where: { id }, select: { available: true, fullName: true } })
      const data = pickWorkerFields(req.body)
      if (req.body.pin && /^\d{4}$/.test(req.body.pin)) {
        data.pinHash = await hashPin(req.body.pin)
      }
      const worker = await prisma.worker.update({ where: { id }, data })

      if (data.available === true && prev && !prev.available) {
        triggerAvailabilityAlerts(id, prev.fullName)
      }

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
    } catch (err) {
      console.error('Worker DELETE error:', err)
      return res.status(500).json({ error: 'Erreur serveur' })
    }
  }

  res.status(405).json({ error: 'Method not allowed' })
}
