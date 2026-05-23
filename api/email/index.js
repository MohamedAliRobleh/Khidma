// api/email/index.js
import { cors } from '../lib/cors.js'

export default async function handler(req, res) {
  if (cors(req, res)) return
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, phone, message } = req.body
  if (!name || !phone) {
    return res.status(400).json({ error: 'Le nom et le téléphone sont requis' })
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: 'Khidma', email: process.env.ADMIN_EMAIL },
      to: [{ email: process.env.ADMIN_EMAIL }],
      subject: `Nouvelle candidature — ${name}`,
      htmlContent: `
        <h2>Nouvelle demande d'inscription sur Khidma</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Téléphone :</strong> ${phone}</p>
        <p><strong>Message :</strong> ${message || 'Aucun message'}</p>
      `,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    console.error('Brevo error:', err)
    return res.status(500).json({ error: "Erreur lors de l'envoi de l'email" })
  }

  res.json({ success: true })
}
