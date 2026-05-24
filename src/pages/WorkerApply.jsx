// src/pages/WorkerApply.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TASKS, WORK_TYPES, SCHEDULE_OPTIONS, LANGUAGES, LANGUAGE_LEVELS } from '../utils/constants'

function LanguageSelector({ value, onChange }) {
  const add = lang => {
    if (value.some(ll => ll.language === lang)) return
    onChange([...value, { language: lang, level: 'intermediaire' }])
  }
  const remove = lang => onChange(value.filter(ll => ll.language !== lang))
  const setLevel = (lang, level) =>
    onChange(value.map(ll => ll.language === lang ? { ...ll, level } : ll))

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 mb-2">
        {LANGUAGES.map(lang => {
          const selected = value.find(ll => ll.language === lang)
          return (
            <button
              key={lang}
              type="button"
              className="btn btn-sm"
              style={{
                borderRadius: 20,
                border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
                background: selected ? 'var(--primary)' : 'transparent',
                color: selected ? '#fff' : 'var(--text-primary)',
                fontWeight: selected ? 600 : 400,
              }}
              onClick={() => selected ? remove(lang) : add(lang)}
            >
              {lang} {selected ? '✓' : '+'}
            </button>
          )
        })}
      </div>
      {value.map(ll => (
        <div key={ll.language} className="d-flex align-items-center gap-2 mb-2">
          <span className="small fw-bold" style={{ minWidth: 80 }}>{ll.language}</span>
          <select
            className="form-select form-select-sm"
            style={{ maxWidth: 160, borderRadius: 8 }}
            value={ll.level}
            onChange={e => setLevel(ll.language, e.target.value)}
          >
            {LANGUAGE_LEVELS.map(l => (
              <option key={l.slug} value={l.slug}>{l.label}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}

export default function WorkerApply() {
  const [form, setForm] = useState({
    fullName: '', phone: '', neighborhood: '', bio: '',
    languageLevels: [], tasks: [], workType: [], schedule: [], priceFdj: '',
  })
  const [step, setStep] = useState('form')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const toggle = (field, slug) => {
    const cur = form[field]
    set(field, cur.includes(slug) ? cur.filter(s => s !== slug) : [...cur, slug])
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    if (!form.fullName.trim() || !form.phone.trim()) {
      setError('Nom et téléphone sont obligatoires.')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/workers/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, priceFdj: form.priceFdj ? Number(form.priceFdj) : undefined }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Erreur serveur')
      }
      setStep('success')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        <div className="container text-center py-5" style={{ maxWidth: 480 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>Profil créé !</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Votre profil est maintenant en ligne. L'équipe Khidma le vérifiera prochainement.
          </p>
          <Link to="/bonnes" className="btn btn-primary-custom">Voir les profils</Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="container py-5" style={{ maxWidth: 640 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/" className="btn btn-sm btn-outline-secondary mb-4" style={{ borderRadius: 8 }}>
            ← Retour
          </Link>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '0.5rem' }}>
            Créer mon profil
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Rejoignez Khidma et trouvez des familles à Djibouti.
          </p>

          <form onSubmit={handleSubmit}>
            {/* Identity */}
            <div className="card-khidma p-4 mb-4">
              <h6 className="fw-bold mb-3">Informations personnelles</h6>
              <div className="mb-3">
                <label className="form-label small fw-bold">Nom complet *</label>
                <input className="form-control" style={{ borderRadius: 10 }}
                  value={form.fullName} onChange={e => set('fullName', e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Téléphone / WhatsApp *</label>
                <input className="form-control" style={{ borderRadius: 10 }}
                  value={form.phone} onChange={e => set('phone', e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold">Quartier</label>
                <input className="form-control" style={{ borderRadius: 10 }}
                  value={form.neighborhood} onChange={e => set('neighborhood', e.target.value)} />
              </div>
              <div className="mb-0">
                <label className="form-label small fw-bold">Présentation (optionnel)</label>
                <textarea className="form-control" rows={3} style={{ borderRadius: 10 }}
                  value={form.bio} onChange={e => set('bio', e.target.value)} />
              </div>
            </div>

            {/* Languages */}
            <div className="card-khidma p-4 mb-4">
              <h6 className="fw-bold mb-3">Langues parlées</h6>
              <LanguageSelector
                value={form.languageLevels}
                onChange={v => set('languageLevels', v)}
              />
            </div>

            {/* Services */}
            <div className="card-khidma p-4 mb-4">
              <h6 className="fw-bold mb-3">Services proposés</h6>
              <div className="d-flex flex-wrap gap-2">
                {TASKS.map(t => (
                  <button
                    key={t.slug} type="button"
                    className="btn btn-sm"
                    style={{
                      borderRadius: 20,
                      border: `2px solid ${form.tasks.includes(t.slug) ? 'var(--primary)' : 'var(--border)'}`,
                      background: form.tasks.includes(t.slug) ? 'var(--primary)' : 'transparent',
                      color: form.tasks.includes(t.slug) ? '#fff' : 'var(--text-primary)',
                    }}
                    onClick={() => toggle('tasks', t.slug)}
                  >
                    {t.icon} {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Schedule + workType */}
            <div className="card-khidma p-4 mb-4">
              <h6 className="fw-bold mb-3">Disponibilité</h6>
              <div className="mb-3">
                <p className="small fw-bold mb-2">Type de travail</p>
                {WORK_TYPES.map(t => (
                  <div key={t.slug} className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id={`wt-${t.slug}`}
                      checked={form.workType.includes(t.slug)}
                      onChange={() => toggle('workType', t.slug)} />
                    <label className="form-check-label small" htmlFor={`wt-${t.slug}`}>{t.label}</label>
                  </div>
                ))}
              </div>
              <div className="mb-3">
                <p className="small fw-bold mb-2">Horaires</p>
                {SCHEDULE_OPTIONS.map(t => (
                  <div key={t.slug} className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id={`sc-${t.slug}`}
                      checked={form.schedule.includes(t.slug)}
                      onChange={() => toggle('schedule', t.slug)} />
                    <label className="form-check-label small" htmlFor={`sc-${t.slug}`}>{t.label}</label>
                  </div>
                ))}
              </div>
              <div>
                <label className="form-label small fw-bold">Salaire souhaité (FDJ/mois)</label>
                <input className="form-control" style={{ borderRadius: 10, maxWidth: 200 }}
                  type="number" min="0" step="1000"
                  value={form.priceFdj} onChange={e => set('priceFdj', e.target.value)} />
              </div>
            </div>

            {error && (
              <div className="alert alert-danger" style={{ borderRadius: 10 }}>{error}</div>
            )}

            <button className="btn btn-primary-custom w-100" type="submit" disabled={loading}
              style={{ padding: '0.85rem', fontSize: '1rem' }}>
              {loading ? 'Envoi en cours…' : 'Créer mon profil'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}
