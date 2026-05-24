// src/pages/EmployerDashboard.jsx
import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useEmployer } from '../hooks/useEmployer'
import StarRating from '../components/ui/StarRating'
import AvailableBadge from '../components/ui/AvailableBadge'
import { formatDate } from '../utils/formatDate'

function WorkerHistoryCard({ entry, onMarkPast, onToggleAlert, hasAlert }) {
  const w = entry.worker
  const avg = w.reviews?.length
    ? w.reviews.reduce((s, r) => s + r.rating, 0) / w.reviews.length
    : 0

  return (
    <div className="card-khidma p-3 mb-3">
      <div className="d-flex gap-3 align-items-start">
        <div className="rounded-3 overflow-hidden flex-shrink-0"
          style={{ width: 64, height: 64, background: 'var(--bg-secondary)' }}>
          {w.photoUrl
            ? <img src={w.photoUrl} alt={w.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <div className="d-flex align-items-center justify-content-center h-100" style={{ fontSize: 28 }}>👤</div>
          }
        </div>

        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
            <div>
              <Link to={`/bonnes/${w.id}`} className="fw-bold text-decoration-none"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>
                {w.fullName}
              </Link>
              <div className="mt-1">
                <AvailableBadge available={w.available} />
              </div>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <span className="badge rounded-pill"
                style={{
                  background: entry.status === 'ACTIVE' ? '#22c55e22' : '#94a3b822',
                  color: entry.status === 'ACTIVE' ? '#22c55e' : '#94a3b8',
                  border: `1px solid ${entry.status === 'ACTIVE' ? '#22c55e' : '#94a3b8'}`,
                  fontSize: '0.78rem',
                }}>
                {entry.status === 'ACTIVE' ? '● Actuelle' : '○ Passée'}
              </span>
            </div>
          </div>

          {avg > 0 && (
            <div className="mt-1">
              <StarRating rating={avg} size={12} showText />
            </div>
          )}

          <div className="mt-2 d-flex gap-2 flex-wrap">
            {entry.status === 'ACTIVE' && (
              <button
                className="btn btn-sm btn-outline-secondary"
                style={{ borderRadius: 8, fontSize: '0.8rem' }}
                onClick={() => onMarkPast(w.id)}
              >
                Marquer comme terminée
              </button>
            )}
            {!w.available && (
              <button
                className="btn btn-sm"
                style={{
                  borderRadius: 8, fontSize: '0.8rem',
                  background: hasAlert ? '#ef444422' : 'var(--bg-secondary)',
                  color: hasAlert ? '#ef4444' : 'var(--text-secondary)',
                  border: `1px solid ${hasAlert ? '#ef4444' : 'var(--border)'}`,
                }}
                onClick={() => onToggleAlert(w.id, hasAlert)}
              >
                {hasAlert ? '🔔 Alerte active' : '🔕 M\'alerter si dispo'}
              </button>
            )}
          </div>
          <div className="mt-1" style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
            Depuis le {formatDate(entry.startDate)}
            {entry.endDate && ` → ${formatDate(entry.endDate)}`}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EmployerDashboard() {
  const navigate = useNavigate()
  const { employer, logout, fetchHistory, fetchAlerts, markPast, toggleAlert } = useEmployer()
  const [history, setHistory] = useState([])
  const [alerts, setAlerts] = useState([])
  const [tab, setTab] = useState('active')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!employer) { navigate('/compte'); return }
    Promise.all([fetchHistory(), fetchAlerts()])
      .then(([h, a]) => { setHistory(h); setAlerts(a) })
      .finally(() => setLoading(false))
  }, [employer])

  if (!employer) return null

  const alertWorkerIds = new Set(alerts.map(a => a.workerId))
  const active = history.filter(e => e.status === 'ACTIVE')
  const past   = history.filter(e => e.status !== 'ACTIVE')

  const handleMarkPast = async workerId => {
    await markPast(workerId)
    const h = await fetchHistory()
    setHistory(h)
  }

  const handleToggleAlert = async (workerId, has) => {
    await toggleAlert(workerId, has)
    const a = await fetchAlerts()
    setAlerts(a)
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Top bar */}
      <nav className="navbar sticky-top py-2" style={{ background: 'var(--secondary)' }}>
        <div className="container d-flex align-items-center justify-content-between">
          <Link to="/" style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#fff', textDecoration: 'none', fontSize: '1.2rem' }}>
            Khidma
          </Link>
          <div className="d-flex align-items-center gap-3">
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
              Bonjour, {employer.name}
            </span>
            <button className="btn btn-sm btn-outline-light" onClick={logout}>Déconnexion</button>
          </div>
        </div>
      </nav>

      <div className="container py-4" style={{ maxWidth: 720 }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, marginBottom: '1.5rem' }}>
            Mon tableau de bord
          </h2>

          {/* Stats row */}
          <div className="row g-3 mb-4">
            {[
              { label: 'Travailleuses actuelles', value: active.length, color: '#22c55e' },
              { label: 'Travailleuses passées',   value: past.length,   color: '#94a3b8' },
              { label: 'Alertes actives',         value: alerts.length, color: '#f59e0b' },
            ].map(s => (
              <div key={s.label} className="col-4">
                <div className="card-khidma p-3 text-center">
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', fontWeight: 800, color: s.color }}>
                    {s.value}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="d-flex gap-2 mb-4">
            {[['active', 'Actuelles'], ['past', 'Passées'], ['alerts', 'Alertes']].map(([key, label]) => (
              <button
                key={key}
                className="btn btn-sm"
                style={{
                  borderRadius: 20,
                  border: `2px solid ${tab === key ? 'var(--primary)' : 'var(--border)'}`,
                  background: tab === key ? 'var(--primary)' : 'transparent',
                  color: tab === key ? '#fff' : 'var(--text-secondary)',
                  fontWeight: tab === key ? 700 : 400,
                }}
                onClick={() => setTab(key)}
              >
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: 'var(--primary)' }} />
            </div>
          ) : (
            <>
              {tab === 'active' && (
                active.length === 0
                  ? (
                    <div className="text-center py-5" style={{ color: 'var(--text-secondary)' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
                      <p>Aucune travailleuse active. Parcourez les profils pour en ajouter une.</p>
                      <Link to="/bonnes" className="btn btn-primary-custom">Trouver une aide</Link>
                    </div>
                  )
                  : active.map(e => (
                    <WorkerHistoryCard
                      key={e.id} entry={e}
                      onMarkPast={handleMarkPast}
                      onToggleAlert={handleToggleAlert}
                      hasAlert={alertWorkerIds.has(e.workerId)}
                    />
                  ))
              )}

              {tab === 'past' && (
                past.length === 0
                  ? <p style={{ color: 'var(--text-secondary)' }}>Aucune travailleuse passée.</p>
                  : past.map(e => (
                    <WorkerHistoryCard
                      key={e.id} entry={e}
                      onMarkPast={handleMarkPast}
                      onToggleAlert={handleToggleAlert}
                      hasAlert={alertWorkerIds.has(e.workerId)}
                    />
                  ))
              )}

              {tab === 'alerts' && (
                alerts.length === 0
                  ? (
                    <div style={{ color: 'var(--text-secondary)' }}>
                      <p>Aucune alerte. Activez une alerte depuis le profil d'une travailleuse non disponible.</p>
                    </div>
                  )
                  : alerts.map(a => (
                    <div key={a.id} className="card-khidma p-3 mb-3 d-flex align-items-center justify-content-between">
                      <div>
                        <Link to={`/bonnes/${a.workerId}`} className="fw-bold text-decoration-none"
                          style={{ color: 'var(--text-primary)' }}>
                          {a.worker?.fullName}
                        </Link>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                          Alerte depuis le {formatDate(a.createdAt)}
                        </div>
                      </div>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        style={{ borderRadius: 8 }}
                        onClick={() => handleToggleAlert(a.workerId, true)}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
