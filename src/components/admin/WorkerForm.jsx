// src/components/admin/WorkerForm.jsx
import { useState } from 'react'
import PhotoUpload from './PhotoUpload'
import { TASKS, NEIGHBORHOODS, WORK_TYPES, SCHEDULE_OPTIONS, EMPLOYER_PROVIDES, LANGUAGES } from '../../utils/constants'

const EMPTY = {
  fullName: '', phone: '', age: '', bio: '', neighborhood: '', experience: '',
  languages: ['Français', 'Somali'],
  tasks: [], workType: [], schedule: [], employerProvides: [],
  priceFdj: '', available: true, verified: false, featured: false,
  photoUrl: '', cloudinaryId: '',
}

function toggleArr(arr, val) {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val]
}

export default function WorkerForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      await onSave({
        ...form,
        age: form.age ? Number(form.age) : null,
        experience: form.experience ? Number(form.experience) : null,
        priceFdj: form.priceFdj ? Number(form.priceFdj) : null,
      })
    } catch (err) {
      setError(err.message || 'Erreur lors de la sauvegarde')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="modal d-block"
      style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', inset: 0, zIndex: 1050, overflowY: 'auto' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: 20, border: 'none' }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title" style={{ fontFamily: 'var(--font-heading)' }}>
              {initial?.id ? 'Modifier la fiche' : 'Ajouter une travailleuse'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                {/* Photo */}
                <div className="col-12">
                  <PhotoUpload
                    currentUrl={form.photoUrl}
                    onUpload={({ url, publicId }) => {
                      set('photoUrl', url)
                      set('cloudinaryId', publicId)
                    }}
                  />
                </div>

                {/* Name */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Nom complet *</label>
                  <input type="text" className="form-control" value={form.fullName}
                    onChange={e => set('fullName', e.target.value)} required style={{ borderRadius: 10 }} />
                </div>

                {/* Phone */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Téléphone</label>
                  <input type="tel" className="form-control" value={form.phone}
                    onChange={e => set('phone', e.target.value)} style={{ borderRadius: 10 }} />
                </div>

                {/* Age */}
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Âge</label>
                  <input type="number" className="form-control" min={18} max={70} value={form.age}
                    onChange={e => set('age', e.target.value)} style={{ borderRadius: 10 }} />
                </div>

                {/* Experience */}
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Années d'expérience</label>
                  <input type="number" className="form-control" min={0} max={50} value={form.experience}
                    onChange={e => set('experience', e.target.value)} style={{ borderRadius: 10 }} />
                </div>

                {/* Price */}
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Prix mensuel (FDJ)</label>
                  <input type="number" className="form-control" min={0} value={form.priceFdj}
                    onChange={e => set('priceFdj', e.target.value)} style={{ borderRadius: 10 }} />
                </div>

                {/* Neighborhood */}
                <div className="col-md-6">
                  <label className="form-label small fw-bold">Quartier</label>
                  <select className="form-select" value={form.neighborhood}
                    onChange={e => set('neighborhood', e.target.value)} style={{ borderRadius: 10 }}>
                    <option value="">Sélectionner...</option>
                    {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                {/* Bio */}
                <div className="col-12">
                  <label className="form-label small fw-bold">Bio</label>
                  <textarea className="form-control" rows={3} value={form.bio}
                    onChange={e => set('bio', e.target.value)} style={{ borderRadius: 10 }} />
                </div>

                {/* Tasks */}
                <div className="col-12">
                  <label className="form-label small fw-bold">Services proposés</label>
                  <div className="d-flex flex-wrap gap-2">
                    {TASKS.map(t => (
                      <div key={t.slug} className="form-check">
                        <input className="form-check-input" type="checkbox" id={`t-${t.slug}`}
                          checked={form.tasks.includes(t.slug)}
                          onChange={() => set('tasks', toggleArr(form.tasks, t.slug))} />
                        <label className="form-check-label small" htmlFor={`t-${t.slug}`}>{t.icon} {t.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Type */}
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Arrangement</label>
                  <div className="d-flex gap-3">
                    {WORK_TYPES.map(t => (
                      <div key={t.slug} className="form-check">
                        <input className="form-check-input" type="checkbox" id={`wt-${t.slug}`}
                          checked={form.workType.includes(t.slug)}
                          onChange={() => set('workType', toggleArr(form.workType, t.slug))} />
                        <label className="form-check-label small" htmlFor={`wt-${t.slug}`}>{t.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Schedule */}
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Horaires</label>
                  <div className="d-flex flex-wrap gap-2">
                    {SCHEDULE_OPTIONS.map(s => (
                      <div key={s.slug} className="form-check">
                        <input className="form-check-input" type="checkbox" id={`sc-${s.slug}`}
                          checked={form.schedule.includes(s.slug)}
                          onChange={() => set('schedule', toggleArr(form.schedule, s.slug))} />
                        <label className="form-check-label small" htmlFor={`sc-${s.slug}`}>{s.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Employer provides */}
                <div className="col-md-4">
                  <label className="form-label small fw-bold">Employeur fournit</label>
                  <div className="d-flex flex-wrap gap-2">
                    {EMPLOYER_PROVIDES.map(p => (
                      <div key={p.slug} className="form-check">
                        <input className="form-check-input" type="checkbox" id={`ep-${p.slug}`}
                          checked={form.employerProvides.includes(p.slug)}
                          onChange={() => set('employerProvides', toggleArr(form.employerProvides, p.slug))} />
                        <label className="form-check-label small" htmlFor={`ep-${p.slug}`}>{p.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="col-12">
                  <label className="form-label small fw-bold">Langues</label>
                  <div className="d-flex flex-wrap gap-2">
                    {LANGUAGES.map(lang => (
                      <div key={lang} className="form-check">
                        <input className="form-check-input" type="checkbox" id={`lang-${lang}`}
                          checked={form.languages.includes(lang)}
                          onChange={() => set('languages', toggleArr(form.languages, lang))} />
                        <label className="form-check-label small" htmlFor={`lang-${lang}`}>{lang}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Flags */}
                <div className="col-12 d-flex gap-4">
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="available-flag"
                      checked={form.available}
                      onChange={e => set('available', e.target.checked)} />
                    <label className="form-check-label small" htmlFor="available-flag">Disponible</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="verified-flag"
                      checked={form.verified}
                      onChange={e => set('verified', e.target.checked)} />
                    <label className="form-check-label small" htmlFor="verified-flag">Vérifiée</label>
                  </div>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" id="featured-flag"
                      checked={form.featured}
                      onChange={e => set('featured', e.target.checked)} />
                    <label className="form-check-label small" htmlFor="featured-flag">En vedette</label>
                  </div>
                </div>
              </div>

              {error && <div className="text-danger small mt-3">{error}</div>}

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary-custom" disabled={saving}>
                  {saving ? 'Sauvegarde...' : 'Sauvegarder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
