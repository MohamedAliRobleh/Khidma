// src/components/workers/FilterSidebar.jsx
import { TASKS, NEIGHBORHOODS, WORK_TYPES, SCHEDULE_OPTIONS } from '../../utils/constants'

export default function FilterSidebar({ filters, onChange }) {
  const toggle = (field, value) => {
    const current = filters[field] || []
    const next = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value]
    onChange({ ...filters, [field]: next.length ? next : undefined })
  }

  const set = (field, value) => onChange({ ...filters, [field]: value })

  return (
    <aside className="p-3 rounded-4" style={{ background: '#fff', border: '1px solid var(--border)' }}>
      <h6 className="mb-3 fw-bold" style={{ fontFamily: 'var(--font-heading)' }}>Filtres</h6>

      {/* Task filter */}
      <div className="mb-4">
        <p className="small fw-bold mb-2" style={{ color: 'var(--text-secondary)' }}>TYPE DE SERVICE</p>
        {TASKS.map(t => (
          <div key={t.slug} className="form-check mb-1">
            <input
              className="form-check-input"
              type="checkbox"
              id={`task-${t.slug}`}
              checked={(filters.task || []).includes(t.slug)}
              onChange={() => toggle('task', t.slug)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <label className="form-check-label small" htmlFor={`task-${t.slug}`}>
              {t.icon} {t.label}
            </label>
          </div>
        ))}
      </div>

      {/* Neighborhood filter */}
      <div className="mb-4">
        <p className="small fw-bold mb-2" style={{ color: 'var(--text-secondary)' }}>QUARTIER</p>
        <select
          className="form-select form-select-sm"
          value={filters.neighborhood || ''}
          onChange={e => set('neighborhood', e.target.value || undefined)}
          style={{ borderRadius: 8, border: '1px solid var(--border)' }}
        >
          <option value="">Tous les quartiers</option>
          {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      {/* WorkType filter */}
      <div className="mb-4">
        <p className="small fw-bold mb-2" style={{ color: 'var(--text-secondary)' }}>ARRANGEMENT</p>
        {WORK_TYPES.map(t => (
          <div key={t.slug} className="form-check mb-1">
            <input
              className="form-check-input"
              type="checkbox"
              id={`wt-${t.slug}`}
              checked={(filters.workType || []).includes(t.slug)}
              onChange={() => toggle('workType', t.slug)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <label className="form-check-label small" htmlFor={`wt-${t.slug}`}>{t.label}</label>
          </div>
        ))}
      </div>

      {/* Schedule filter */}
      <div className="mb-4">
        <p className="small fw-bold mb-2" style={{ color: 'var(--text-secondary)' }}>HORAIRES</p>
        {SCHEDULE_OPTIONS.map(s => (
          <div key={s.slug} className="form-check mb-1">
            <input
              className="form-check-input"
              type="checkbox"
              id={`sched-${s.slug}`}
              checked={(filters.schedule || []).includes(s.slug)}
              onChange={() => toggle('schedule', s.slug)}
              style={{ accentColor: 'var(--primary)' }}
            />
            <label className="form-check-label small" htmlFor={`sched-${s.slug}`}>{s.label}</label>
          </div>
        ))}
      </div>

      {/* Available toggle */}
      <div className="mb-4">
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id="available-toggle"
            checked={filters.available === 'true'}
            onChange={e => set('available', e.target.checked ? 'true' : undefined)}
            style={{ accentColor: 'var(--success)' }}
          />
          <label className="form-check-label small fw-bold" htmlFor="available-toggle">
            Disponibles uniquement
          </label>
        </div>
      </div>

      {/* Min rating */}
      <div className="mb-3">
        <p className="small fw-bold mb-2" style={{ color: 'var(--text-secondary)' }}>NOTE MINIMALE</p>
        <div className="d-flex gap-1">
          {[1, 2, 3, 4, 5].map(n => (
            <button
              key={n}
              type="button"
              className="btn btn-sm"
              onClick={() => set('minRating', filters.minRating == n ? undefined : String(n))}
              style={{
                borderRadius: 8,
                padding: '0.25rem 0.5rem',
                background: filters.minRating == n ? 'var(--accent)' : 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                color: filters.minRating == n ? '#1A1A1A' : 'var(--text-secondary)',
                fontWeight: 600,
              }}
            >
              {n}★
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      <button
        type="button"
        className="btn btn-sm w-100 mt-2"
        onClick={() => onChange({})}
        style={{ border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-secondary)' }}
      >
        Réinitialiser les filtres
      </button>
    </aside>
  )
}
