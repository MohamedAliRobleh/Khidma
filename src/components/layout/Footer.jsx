// src/components/layout/Footer.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <footer style={{ background: 'var(--bg-dark)', color: '#fff', paddingTop: '3rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="mb-3">
              <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)' }}>
                Khidma
              </span>
              {' '}
              <span style={{ color: 'rgba(255,255,255,0.5)' }}>خدمة</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.92rem' }}>
              Trouvez une aide de confiance, rapidement. La première plateforme de mise en relation avec des bonnes à Djibouti.
            </p>
            <div className="mt-3 d-flex flex-column gap-1" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>
              <Link to="/"        className="text-decoration-none" style={{ color: 'inherit' }}>Accueil</Link>
              <Link to="/bonnes"  className="text-decoration-none" style={{ color: 'inherit' }}>Trouver une aide</Link>
              <Link to="/a-propos" className="text-decoration-none" style={{ color: 'inherit' }}>À propos</Link>
            </div>
          </div>

          <div className="col-lg-5 ms-auto">
            <h5 className="mb-3" style={{ fontFamily: 'var(--font-heading)', color: '#fff' }}>
              Vous cherchez du travail ?
            </h5>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }} className="mb-3">
              Laissez vos coordonnées et nous vous contacterons rapidement.
            </p>

            {status === 'success' ? (
              <div className="alert" style={{ background: 'rgba(45,125,70,0.2)', color: '#7df5a5', border: '1px solid rgba(45,125,70,0.4)' }}>
                ✓ Message envoyé ! Nous vous contacterons bientôt.
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Votre nom complet *"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                    style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#fff' }}
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Votre téléphone *"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    required
                    style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#fff' }}
                  />
                </div>
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    placeholder="Message (optionnel)"
                    rows={3}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    style={{ borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)', color: '#fff' }}
                  />
                </div>
                {status === 'error' && (
                  <div className="text-danger mb-2 small">Une erreur s'est produite. Réessayez.</div>
                )}
                <button
                  type="submit"
                  className="btn btn-primary-custom w-100"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Envoi...' : 'Envoyer ma candidature'}
                </button>
              </form>
            )}
          </div>
        </div>

        <hr style={{ borderColor: 'rgba(255,255,255,0.1)', marginTop: '2rem' }} />
        <div className="text-center" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Khidma. Djibouti.
        </div>
      </div>
    </footer>
  )
}
