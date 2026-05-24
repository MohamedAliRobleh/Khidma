// src/pages/EmployerAuth.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEmployer } from '../hooks/useEmployer'

export default function EmployerAuth() {
  const navigate = useNavigate()
  const { login, register, loading, error } = useEmployer()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', name: '', phone: '' })
  const [displayError, setDisplayError] = useState('')

  useEffect(() => { setDisplayError(error) }, [error])

  const switchTab = (t) => {
    setTab(t)
    setForm({ email: '', password: '', name: '', phone: '' })
    setDisplayError('')
  }

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    let ok
    if (tab === 'login') {
      ok = await login(form.email, form.password)
    } else {
      ok = await register(form.email, form.password, form.name, form.phone)
    }
    if (ok) navigate('/compte/tableau-de-bord')
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <div className="container py-5" style={{ maxWidth: 420 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-4">
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: 800 }}>
              Espace Employeur
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.4rem' }}>
              Gérez vos aides à domicile
            </p>
          </div>

          {/* Tab toggle */}
          <div className="d-flex rounded-3 overflow-hidden mb-4" style={{ border: '1px solid var(--border)' }}>
            {['login', 'register'].map(t => (
              <button
                key={t}
                type="button"
                className="flex-fill btn border-0 py-2"
                style={{
                  borderRadius: 0,
                  background: tab === t ? 'var(--primary)' : 'transparent',
                  color: tab === t ? '#fff' : 'var(--text-secondary)',
                  fontWeight: tab === t ? 700 : 400,
                }}
                onClick={() => switchTab(t)}
              >
                {t === 'login' ? 'Connexion' : 'Créer un compte'}
              </button>
            ))}
          </div>

          <div className="card-khidma p-4">
            <form onSubmit={handleSubmit}>
              {tab === 'register' && (
                <>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Nom complet *</label>
                    <input className="form-control" style={{ borderRadius: 10 }}
                      value={form.name} onChange={set('name')} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Téléphone</label>
                    <input className="form-control" style={{ borderRadius: 10 }}
                      value={form.phone} onChange={set('phone')} />
                  </div>
                </>
              )}
              <div className="mb-3">
                <label className="form-label small fw-bold">Email *</label>
                <input className="form-control" type="email" style={{ borderRadius: 10 }}
                  value={form.email} onChange={set('email')} required />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold">Mot de passe *</label>
                <input className="form-control" type="password" style={{ borderRadius: 10 }}
                  value={form.password} onChange={set('password')} required minLength={6} />
              </div>

              {displayError && (
                <div className="alert alert-danger py-2" style={{ borderRadius: 10, fontSize: '0.9rem' }}>
                  {displayError}
                </div>
              )}

              <button className="btn btn-primary-custom w-100" type="submit" disabled={loading}>
                {loading ? 'Chargement…' : tab === 'login' ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>
          </div>

          <div className="text-center mt-3">
            <Link to="/" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              ← Retour à l'accueil
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
