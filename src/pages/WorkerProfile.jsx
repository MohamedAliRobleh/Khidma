// src/pages/WorkerProfile.jsx
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useEmployer } from '../hooks/useEmployer'
import { useWorker } from '../hooks/useWorker'
import { useWorkers } from '../hooks/useWorkers'
import WorkerProfileHeader from '../components/workers/WorkerProfileHeader'
import ReviewModal from '../components/modals/ReviewModal'
import WorkerCard from '../components/workers/WorkerCard'
import StarRating from '../components/ui/StarRating'
import TaskBadge from '../components/ui/TaskBadge'
import WorkTypePill from '../components/ui/WorkTypePill'
import { formatPrice } from '../utils/formatPrice'
import { formatDate } from '../utils/formatDate'
import { EMPLOYER_PROVIDES } from '../utils/constants'

function ReviewsSection({ worker, onNewReview }) {
  const reviews = worker.reviews || []
  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0

  const dist = [5, 4, 3, 2, 1].map(n => ({
    n,
    count: reviews.filter(r => r.rating === n).length,
  }))

  return (
    <div className="mt-4">
      <h4 style={{ fontFamily: 'var(--font-heading)' }} className="mb-3">Avis clients</h4>

      {reviews.length > 0 ? (
        <>
          <div className="d-flex align-items-center gap-4 mb-4">
            <div className="text-center">
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', fontWeight: 800, color: 'var(--accent)' }}>
                {avg.toFixed(1)}
              </div>
              <StarRating rating={avg} size={20} />
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }} className="mt-1">
                {reviews.length} avis
              </div>
            </div>
            <div className="flex-grow-1">
              {dist.map(({ n, count }) => (
                <div key={n} className="d-flex align-items-center gap-2 mb-1">
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', width: 16 }}>{n}</span>
                  <span style={{ color: 'var(--accent)', fontSize: '0.85rem' }}>★</span>
                  <div className="flex-grow-1 rounded-pill" style={{ height: 8, background: 'var(--bg-secondary)', overflow: 'hidden' }}>
                    <div
                      className="h-100 rounded-pill"
                      style={{
                        width: reviews.length ? `${(count / reviews.length) * 100}%` : '0%',
                        background: 'var(--accent)',
                      }}
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', width: 20 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {reviews.map(r => (
            <div key={r.id} className="mb-3 pb-3" style={{ borderBottom: '1px solid var(--border)' }}>
              <div className="d-flex justify-content-between align-items-start mb-1">
                <span className="fw-bold">{r.clientName}</span>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>{formatDate(r.createdAt)}</span>
              </div>
              <StarRating rating={r.rating} size={14} />
              {r.comment && <p className="mt-1 mb-0 small" style={{ color: 'var(--text-secondary)' }}>{r.comment}</p>}
            </div>
          ))}
        </>
      ) : (
        <p style={{ color: 'var(--text-secondary)' }}>Aucun avis pour le moment. Soyez le premier !</p>
      )}

      <button className="btn btn-outline-secondary mt-2" onClick={onNewReview} style={{ borderRadius: 10 }}>
        ✍️ Laisser un avis
      </button>
    </div>
  )
}

export default function WorkerProfile() {
  const { id } = useParams()
  const { worker, loading, error, refetch } = useWorker(id)
  const [showModal, setShowModal] = useState(false)

  const { employer, addToHistory, toggleAlert, fetchAlerts, fetchHistory } = useEmployer()
  const [alerts, setAlerts] = useState([])
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (!employer || !worker) return
    Promise.all([fetchAlerts(), fetchHistory()])
      .then(([a, h]) => {
        setAlerts(a)
        setHistory(h)
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employer, worker, fetchAlerts, fetchHistory])

  const hasAlert = alerts.some(a => a.workerId === id)
  const inHistory = history.some(entry => entry.workerId === id)

  const handleAddToHistory = async () => {
    const ok = await addToHistory(id)
    if (ok) {
      const h = await fetchHistory()
      setHistory(h)
    }
  }
  const handleToggleAlert = async () => {
    await toggleAlert(id, hasAlert)
    const a = await fetchAlerts()
    setAlerts(a)
  }

  const firstTask = worker?.tasks?.[0]
  const { workers: similar } = useWorkers(
    firstTask ? { task: firstTask } : {},
    1
  )

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: 'var(--primary)' }} />
      </div>
    )
  }

  if (error || !worker) {
    return (
      <div className="container py-5 text-center">
        <p style={{ color: 'var(--text-secondary)' }}>Travailleuse introuvable.</p>
        <Link to="/bonnes" className="btn btn-primary-custom mt-2">Retour à la liste</Link>
      </div>
    )
  }

  const waMsg = encodeURIComponent(
    `Bonjour ${worker.fullName.split(' ')[0]}, j'ai vu votre profil sur Khidma et je souhaite vous contacter.`
  )

  const provideLabel = slug => EMPLOYER_PROVIDES.find(p => p.slug === slug)?.label || slug

  return (
    <div style={{ background: 'var(--bg-primary)', paddingBottom: '4rem' }}>
      <div className="container" style={{ paddingTop: '2rem' }}>
        {/* Breadcrumb */}
        <nav className="mb-4">
          <Link to="/bonnes" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textDecoration: 'none' }}>
            ← Retour à la liste
          </Link>
        </nav>

        <div className="row g-4">
          {/* Main content */}
          <div className="col-lg-8">
            <div className="card-khidma p-4 mb-4">
              <WorkerProfileHeader worker={worker} />
            </div>

            {/* Work conditions */}
            <div className="card-khidma p-4 mb-4">
              <h4 style={{ fontFamily: 'var(--font-heading)' }} className="mb-4">Conditions de travail</h4>

              <div className="mb-3">
                <p className="small fw-bold mb-2" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tâches</p>
                <div className="d-flex flex-wrap gap-2">
                  {worker.tasks?.map(slug => <TaskBadge key={slug} slug={slug} />)}
                </div>
              </div>

              {worker.workType?.length > 0 && (
                <div className="mb-3">
                  <p className="small fw-bold mb-2" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Arrangement</p>
                  <div className="d-flex flex-wrap gap-2">
                    {worker.workType.map(s => <WorkTypePill key={s} slug={s} />)}
                    {worker.schedule?.map(s => <WorkTypePill key={s} slug={s} />)}
                  </div>
                </div>
              )}

              {worker.employerProvides?.length > 0 && (
                <div className="mb-3">
                  <p className="small fw-bold mb-2" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>L'employeur doit fournir</p>
                  <div className="d-flex flex-wrap gap-2">
                    {worker.employerProvides.map(s => (
                      <span key={s} className="badge rounded-pill"
                        style={{ background: 'var(--primary-light)', color: 'var(--primary-dark)', fontWeight: 600 }}>
                        {provideLabel(s)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {worker.priceFdj && (
                <div>
                  <p className="small fw-bold mb-1" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tarif de base</p>
                  <p className="mb-0">
                    <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', color: 'var(--secondary)' }}>
                      {formatPrice(worker.priceFdj)}
                    </span>
                    <span className="ms-1" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>/mois <em>(négociable)</em></span>
                  </p>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="card-khidma p-4">
              <ReviewsSection worker={worker} onNewReview={() => setShowModal(true)} />
            </div>
          </div>

          {/* Sticky contact box */}
          <div className="col-lg-4">
            <div
              className="card-khidma p-4"
              style={{ position: 'sticky', top: '80px' }}
            >
              <h5 style={{ fontFamily: 'var(--font-heading)', marginBottom: '0.5rem' }}>
                Contacter {worker.fullName.split(' ')[0]}
              </h5>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Répond généralement en moins d'1h
              </p>

              {worker.phone ? (
                <>
                  <a
                    href={`tel:${worker.phone}`}
                    className="btn btn-primary-custom w-100 mb-2"
                    style={{ textDecoration: 'none', display: 'block', textAlign: 'center' }}
                  >
                    📞 Appeler directement
                  </a>
                  <a
                    href={`https://wa.me/${worker.phone.replace(/\D/g, '')}?text=${waMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn w-100 mb-3"
                    style={{
                      background: '#25D366', color: '#fff', borderRadius: 50,
                      fontWeight: 700, textDecoration: 'none', display: 'block', textAlign: 'center',
                    }}
                  >
                    💬 WhatsApp
                  </a>
                  <p className="text-center small" style={{ color: 'var(--text-secondary)' }}>
                    {worker.phone}
                  </p>
                </>
              ) : (
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  Contact disponible après vérification.
                </p>
              )}

              <hr style={{ borderColor: 'var(--border)' }} />
              <div className="small" style={{ color: 'var(--text-secondary)' }}>
                {worker.verified && <div className="mb-1">★ Profil vérifié par Khidma</div>}
                <div className="mb-1">📍 {worker.neighborhood || worker.city}</div>
                {worker.experience && <div>💼 {worker.experience} ans d'expérience</div>}
              </div>

              {employer && (
                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  <button
                    className="btn w-100 mb-2"
                    style={{ borderRadius: 10, background: inHistory ? '#22c55e22' : 'var(--bg-secondary)', color: inHistory ? '#22c55e' : 'var(--text-primary)', border: `1px solid ${inHistory ? '#22c55e' : 'var(--border)'}` }}
                    onClick={handleAddToHistory}
                    disabled={inHistory}
                  >
                    {inHistory ? '✓ Dans mon historique' : '+ Ajouter à mon historique'}
                  </button>
                  {!worker.available && (
                    <button
                      className="btn w-100"
                      style={{ borderRadius: 10, background: hasAlert ? '#f59e0b22' : 'var(--bg-secondary)', color: hasAlert ? '#f59e0b' : 'var(--text-primary)', border: `1px solid ${hasAlert ? '#f59e0b' : 'var(--border)'}`, fontSize: '0.9rem' }}
                      onClick={handleToggleAlert}
                    >
                      {hasAlert ? '🔔 Alerte active — cliquer pour désactiver' : '🔕 M\'alerter si disponible'}
                    </button>
                  )}
                </div>
              )}
              {!employer && (
                <div className="mt-3 pt-3 text-center" style={{ borderTop: '1px solid var(--border)' }}>
                  <Link to="/compte" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                    Créer un compte employeur pour suivre cette travailleuse
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar workers */}
        {similar.filter(w => w.id !== id).length > 0 && (
          <div className="mt-5">
            <h4 style={{ fontFamily: 'var(--font-heading)' }} className="mb-4">Profils similaires</h4>
            <div className="row g-4">
              {similar.filter(w => w.id !== id).slice(0, 3).map((w, i) => (
                <div key={w.id} className="col-md-4">
                  <WorkerCard worker={w} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ReviewModal
          workerId={id}
          workerName={worker.fullName}
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); refetch() }}
        />
      )}
    </div>
  )
}
