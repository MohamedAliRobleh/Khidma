// api/upload/index.js
import { cors } from '../../lib/cors.js'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { data, folder: reqFolder } = req.body
  if (!data) return res.status(400).json({ error: 'Image data manquante' })

  // Admin uploads go to khidma/, public self-registration goes to khidma/applications/
  const auth = req.headers['authorization']
  const isAdmin = auth?.startsWith('Bearer ') && await (async () => {
    try { const { verifyToken } = await import('../../lib/auth.js'); return verifyToken(auth.slice(7)) } catch { return false }
  })()

  try {
    const uploadFolder = isAdmin ? 'khidma' : 'khidma/applications'
    const result = await cloudinary.uploader.upload(data, {
      folder: uploadFolder,
      transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
    })
    res.json({ url: result.secure_url, publicId: result.public_id })
  } catch (err) {
    console.error('Cloudinary upload error:', err)
    res.status(500).json({ error: "Erreur lors de l'upload de l'image" })
  }
}
