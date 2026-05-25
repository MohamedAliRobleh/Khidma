// src/pages/WorkerApply.jsx
import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TASKS, WORK_TYPES, SCHEDULE_OPTIONS, LANGUAGES, LANGUAGE_LEVELS } from '../utils/constants'

function PhotoUploadPublic({ photoUrl, onUpload }) {
  const [status, setStatus] = useState(null)
  const inputRef = useRef()

  const handleFile = async e => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setStatus('toobig'); return }
    setStatus('uploading')
    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: reader.result }),
        })
        if (!res.ok) throw new Error()
        const { url, publicId } = await res.json()
        onUpload({ url, publicId })
        setStatus('done')
      } catch {
        setStatus('error')
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="d-flex align-items-center gap-4">
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          width: 96, height: 96, borderRadius: '50%', cursor: 'pointer', flexShrink: 0,
          background: photoUrl ? 'transparent' : 'var(--bg-secondary)',
          border: `2px dashed ${photoUrl ? 'var(--primary)' : 'var(--border)'}`,
          overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {photoUrl ? (
          <img src={photoUrl} alt="Photo de profil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.78rem', padding: '0.5rem', lineHeight: 1.3 }}>
            📷<br/>Ajouter<br/>une photo
          </div>
        )}
      </div>
      <div>
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          style={{ borderRadius: 8 }}
          onClick={() => inputRef.current?.click()}
        >
          {photoUrl ? 'Changer la photo' : 'Choisir une photo'}
        </button>
        <div className="form-text small mt-1">JPG, PNG · max 5 Mo · recommandé</div>
        {status === 'uploading' && <div className="small text-muted mt-1">Upload en cours…</div>}
        {status === 'done'      && <div className="small text-success mt-1">✓ Photo ajoutée</div>}
        {status === 'error'     && <div className="small text-danger mt-1">Erreur — réessayez</div>}
        {status === 'toobig'    && <div className="small text-danger mt-1">Fichier trop grand (max 5 Mo)</div>}
      </div>
      <input ref={inputRef} type="file" accept="image/*" className="d-none" onChange={handleFile} />
    </div>
  )
}

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
    fullName: '', phone: '', neighborhood: '', bio: '', pin: '',
    photoUrl: '', cloudinaryId: '',
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

    if (!/^\d{4}$/.test(form.pin)) {
      setError('Le code PIN doit être exactement 4 chiffres.')
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
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800 }}>Candidature envoyée !</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
            Votre profil a bien été reçu par l'équipe Khidma.
          </p>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.92rem' }}>
            Il sera examiné et publié prochainement. Vous serez contacté(e) par téléphone.
          </p>
          <Link to="/" className="btn btn-primary-custom">Retour à l'accueil</Link>
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

              <div className="mb-4">
                <label className="form-label small fw-bold d-block mb-3">Photo de profil</label>
                <PhotoUploadPublic
                  photoUrl={form.photoUrl}
                  onUpload={({ url, publicId }) => { set('photoUrl', url); set('cloudinaryId', publicId) }}
                />
              </div>

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
              <div className="mb-3">
                <label className="form-label small fw-bold">Présentation (optionnel)</label>
                <textarea className="form-control" rows={3} style={{ borderRadius: 10 }}
                  value={form.bio} onChange={e => set('bio', e.target.value)} />
              </div>
              <div className="mb-0">
                <label className="form-label small fw-bold">Code PIN à 4 chiffres *</label>
                <input
                  className="form-control"
                  style={{ borderRadius: 10, maxWidth: 140, letterSpacing: '0.4em', fontSize: '1.2rem' }}
                  type="password"
                  inputMode="numeric"
                  maxLength={4}
                  pattern="\d{4}"
                  placeholder="••••"
                  value={form.pin}
                  onChange={e => set('pin', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  autoComplete="new-password"
                  required
                />
                <div className="form-text" style={{ fontSize: '0.8rem' }}>
                  Ce code vous permettra de vous connecter sur <strong>Mon Espace</strong> pour mettre à jour votre disponibilité.
                </div>
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
