// api/upload/index.js
import { cors } from '../../lib/cors.js'
import { requireAdmin } from '../../lib/auth.js'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  if (!(await requireAdmin(req, res))) return

  const { data } = req.body
  if (!data) return res.status(400).json({ error: 'Image data manquante' })

  const result = await cloudinary.uploader.upload(data, {
    folder: 'khidma',
    transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
  })

  res.json({ url: result.secure_url, publicId: result.public_id })
}
