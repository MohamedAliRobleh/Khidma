// src/pages/WorkerLogin.jsx
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWorkerAuth } from '../hooks/useWorkerAuth'
import { NEIGHBORHOODS } from '../utils/constants'

function PinInput({ value, onChange }) {
  const chars = value.padEnd(4, '').split('')

  const handleChange = (i, raw) => {
    const digit = raw.replace(/\D/g, '').slice(-1)
    const next = chars.slice()
    next[i] = digit
    onChange(next.join('').trimEnd())
    if (digit && i < 3) {
      document.getElementById(`pin-${i + 1}`)?.focus()
    }
  }

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !chars[i] && i > 0) {
      document.getElementById(`pin-${i - 1}`)?.focus()
    }
  }

  return (
    <div className="d-flex gap-3 justify-content-center">
      {[0, 1, 2, 3].map(i => (
        <input
          key={i}
          id={`pin-${i}`}
          type="password"
          inputMode="numeric"
          maxLength={1}
          className="form-control text-center fw-bold"
          style={{ width: 56, height: 56, fontSize: '1.6rem', borderRadius: 12, border: '2px solid var(--border)' }}
          value={chars[i] === ' ' ? '' : chars[i]}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKeyDown(i, e)}
          autoFocus={i === 0}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
        />
      ))}
    </div>
  )
}

export default function WorkerLogin() {
  const { worker, login, logout, fetchMe, updateMe, loading, error } = useWorkerAuth()
  const [view, setView] = useState('landing') // 'landing' | 'login'
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [profile, setProfile] = useState(null)
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (worker) {
      fetchMe().then(data => { if (data) setProfile(data) })
    }
  }, [worker])

  const handleLogin = async e => {
    e.preventDefault()
    await login(phone, pin)
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    setSaved(false)
    setSaveError('')
    const result = await updateMe({
      available: profile.available,
      availableFrom: profile.available ? null : (profile.availableFrom || null),
      neighborhood: profile.neighborhood || null,
      priceFdj: profile.priceFdj ? Number(profile.priceFdj) : null,
      bio: profile.bio || null,
    })
    setSaving(false)
    if (result) {
      setSaved(true)
      setProfile(result)
      setTimeout(() => setSaved(false), 3000)
    } else {
      setSaveError(error || 'Erreur lors de la sauvegarde')
    }
  }

  // Landing: choose between login or register
  if (!worker && view === 'landing') {
    return (
      <div style={{ background: 'var(--bg-secondary)', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
        <div className="container py-5" style={{ maxWidth: 680 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}>
            <div className="text-center mb-5">
              <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>👩‍💼</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                Mon Espace
              </h2>
              <p style={{ color: 'var(--text-secondary)' }}>
                Gérez votre profil et votre disponibilité sur Khidma
              </p>
            </div>

            <div className="row g-4">
              {/* Login card */}
              <div className="col-md-6">
                <button
                  onClick={() => setView('login')}
                  className="card-khidma w-100 text-start p-4"
                  style={{
                    border: '2px solid var(--border)', borderRadius: 20, cursor: 'pointer',
                    background: '#fff', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>🔑</div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '0.5rem' }}>
                    Je me connecte
                  </h4>
                  <p className="small mb-3" style={{ color: 'var(--text-secondary)' }}>
                    J'ai déjà un profil Khidma. Je veux mettre à jour ma disponibilité.
                  </p>
                  <span style={{
                    display: 'inline-block', background: 'var(--primary)', color: '#fff',
                    borderRadius: 50, padding: '0.45rem 1.2rem', fontWeight: 700, fontSize: '0.88rem',
                  }}>
                    Connexion →
                  </span>
                </button>
              </div>

              {/* Register card */}
              <div className="col-md-6">
                <Link
                  to="/rejoindre"
                  className="card-khidma d-block text-decoration-none p-4"
                  style={{
                    border: '2px solid var(--border)', borderRadius: 20,
                    background: '#fff', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--secondary)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                  <div style={{ fontSize: '2.2rem', marginBottom: '0.75rem' }}>✨</div>
                  <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    Je crée mon profil
                  </h4>
                  <p className="small mb-3" style={{ color: 'var(--text-secondary)' }}>
                    Je suis nouvelle sur Khidma. Je veux créer mon profil et trouver du travail.
                  </p>
                  <span style={{
                    display: 'inline-block', background: 'var(--secondary)', color: '#fff',
                    borderRadius: 50, padding: '0.45rem 1.2rem', fontWeight: 700, fontSize: '0.88rem',
                  }}>
                    Créer mon profil →
                  </span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Login form
  if (!worker && view === 'login') {
    return (
      <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container py-5" style={{ maxWidth: 420 }}>
          <motion.div
            className="card-khidma p-5"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => { setView('landing'); setPin(''); setPhone('') }}
              className="btn btn-sm btn-outline-secondary mb-4"
              style={{ borderRadius: 8 }}
            >
              ← Retour
            </button>

            <div className="text-center mb-4">
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔑</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                Connexion
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Entrez votre téléphone et votre code PIN
              </p>
            </div>

            <form onSubmit={handleLogin} autoComplete="on">
              <input type="text" name="username" autoComplete="username"
                value={phone} readOnly style={{ display: 'none' }} />

              <div className="mb-4">
                <label className="form-label small fw-bold">Numéro de téléphone</label>
                <input
                  type="tel"
                  className="form-control"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+253 77 XX XX XX"
                  required
                  style={{ borderRadius: 10, padding: '0.75rem 1rem' }}
                  autoComplete="tel"
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold d-block mb-3 text-center">
                  Code PIN (4 chiffres)
                </label>
                <PinInput value={pin} onChange={setPin} />
              </div>

              {error && (
                <div className="alert alert-danger small py-2 mb-3" style={{ borderRadius: 10 }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary-custom w-100 mt-1"
                disabled={loading || pin.length < 4}
                style={{ padding: '0.75rem', borderRadius: 50, fontWeight: 700 }}
              >
                {loading ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-secondary)', minHeight: '100vh' }}>
      <div className="container py-5" style={{ maxWidth: 580 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-3">
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: '1.4rem', flexShrink: 0,
              }}>
                {worker.fullName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem' }}>
                  {worker.fullName}
                </div>
                <div className="small" style={{ color: 'var(--text-secondary)' }}>
                  {worker.phone}
                </div>
              </div>
            </div>
            <button
              onClick={logout}
              className="btn btn-sm btn-outline-secondary"
              style={{ borderRadius: 50 }}
            >
              Déconnexion
            </button>
          </div>

          {/* Availability toggle */}
          <div className="card-khidma p-4 mb-4">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, margin: 0, marginBottom: '0.25rem' }}>
                  Ma disponibilité
                </h5>
                <p className="small mb-0" style={{ color: 'var(--text-secondary)' }}>
                  {profile?.available
                    ? 'Votre profil apparaît dans les recherches.'
                    : 'Votre profil est masqué des recherches.'}
                </p>
              </div>
              {profile && (
                <button
                  onClick={() => setProfile(p => ({ ...p, available: !p.available }))}
                  style={{
                    border: 'none', borderRadius: 50, padding: '0.55rem 1.4rem',
                    fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
                    background: profile.available ? 'var(--primary)' : '#e9ecef',
                    color: profile.available ? '#fff' : '#6c757d',
                    fontSize: '0.88rem', whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                >
                  {profile.available ? '✓ Disponible' : '✗ Indisponible'}
                </button>
              )}
            </div>
          </div>

          {/* Profile fields */}
          {profile && (
            <div className="card-khidma p-4 mb-4">
              <h5 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, marginBottom: '1.5rem' }}>
                Mon profil
              </h5>

              {!profile.available && (
                <div className="mb-3">
                  <label className="form-label small fw-bold">Disponible à partir du</label>
                  <input
                    type="date"
                    className="form-control"
                    style={{ borderRadius: 10 }}
                    value={profile.availableFrom ? profile.availableFrom.slice(0, 10) : ''}
                    onChange={e => setProfile(p => ({ ...p, availableFrom: e.target.value || null }))}
                  />
                </div>
              )}

              <div className="mb-3">
                <label className="form-label small fw-bold">Quartier</label>
                <select
                  className="form-select"
                  style={{ borderRadius: 10 }}
                  value={profile.neighborhood || ''}
                  onChange={e => setProfile(p => ({ ...p, neighborhood: e.target.value }))}
                >
                  <option value="">Sélectionner un quartier…</option>
                  {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Salaire souhaité (FDJ / mois)</label>
                <input
                  type="number" min="0" step="1000"
                  className="form-control"
                  style={{ borderRadius: 10 }}
                  value={profile.priceFdj || ''}
                  onChange={e => setProfile(p => ({ ...p, priceFdj: e.target.value }))}
                  placeholder="Ex : 35 000"
                />
              </div>

              <div className="mb-0">
                <label className="form-label small fw-bold">Présentation</label>
                <textarea
                  className="form-control"
                  rows={4}
                  style={{ borderRadius: 10 }}
                  value={profile.bio || ''}
                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  placeholder="Décrivez votre expérience, vos qualités…"
                />
              </div>
            </div>
          )}

          {saveError && (
            <div className="alert alert-danger small py-2 mb-3" style={{ borderRadius: 10 }}>
              {saveError}
            </div>
          )}
          {saved && (
            <div className="alert alert-success small py-2 mb-3" style={{ borderRadius: 10 }}>
              ✓ Profil mis à jour avec succès
            </div>
          )}

          <button
            onClick={handleSave}
            className="btn btn-primary-custom w-100"
            disabled={saving || !profile}
            style={{ padding: '0.85rem', fontSize: '1rem', borderRadius: 50, fontWeight: 700 }}
          >
            {saving ? 'Sauvegarde…' : 'Enregistrer les modifications'}
          </button>
        </motion.div>
      </div>
    </div>
  )
}
