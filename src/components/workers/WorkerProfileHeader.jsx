// src/components/workers/WorkerProfileHeader.jsx
import StarRating from '../ui/StarRating'
import AvailableBadge from '../ui/AvailableBadge'
import VerifiedBadge from '../ui/VerifiedBadge'
import LanguageBadge from '../ui/LanguageBadge'
import SkillBadge from '../ui/SkillBadge'
import { formatDate } from '../../utils/formatDate'

function avgRating(reviews) {
  if (!reviews?.length) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}

function AvailabilityStatus({ available, availableFrom }) {
  if (availableFrom) {
    const date = new Date(availableFrom)
    if (date > new Date()) {
      return (
        <span className="badge rounded-pill"
          style={{ background: '#f59e0b22', color: '#f59e0b', border: '1px solid #f59e0b', fontSize: '0.85rem' }}>
          📅 Disponible le {formatDate(availableFrom)}
        </span>
      )
    }
  }
  return <AvailableBadge available={available} />
}

export default function WorkerProfileHeader({ worker }) {
  const avg = avgRating(worker.reviews)
  const languageLevels = Array.isArray(worker.languageLevels) ? worker.languageLevels : []
  const verifiedSkills = worker.verifiedSkills || []

  return (
    <div className="row g-4 mb-4">
      <div className="col-md-3 text-center">
        <div
          className="rounded-4 overflow-hidden mx-auto"
          style={{ width: 180, height: 180, background: 'var(--bg-secondary)' }}
        >
          {worker.photoUrl ? (
            <img
              src={worker.photoUrl}
              alt={worker.fullName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100"
              style={{ fontSize: 72, color: 'var(--border)' }}>
              👤
            </div>
          )}
        </div>
      </div>

      <div className="col-md-9">
        <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
          <h1 className="mb-0" style={{ fontFamily: 'var(--font-heading)', fontSize: '1.8rem' }}>
            {worker.fullName}
          </h1>
          {worker.age && (
            <span className="badge rounded-pill"
              style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {worker.age} ans
            </span>
          )}
          {worker.verified && <VerifiedBadge />}
        </div>

        <div className="mb-3">
          <AvailabilityStatus available={worker.available} availableFrom={worker.availableFrom} />
        </div>

        <div className="d-flex flex-wrap gap-3 mb-3 small" style={{ color: 'var(--text-secondary)' }}>
          {(worker.neighborhood || worker.city) && (
            <span>📍 {worker.neighborhood || worker.city}</span>
          )}
          {worker.experience && <span>💼 {worker.experience} ans d'expérience</span>}
        </div>

        {/* Languages */}
        {languageLevels.length > 0 && (
          <div className="mb-3">
            <p className="small fw-bold mb-1" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              Langues parlées
            </p>
            <div className="d-flex flex-wrap">
              {languageLevels.map((ll, i) => (
                <LanguageBadge key={i} language={ll.language} level={ll.level} />
              ))}
            </div>
          </div>
        )}

        {/* Verified skills */}
        {verifiedSkills.length > 0 && (
          <div className="mb-3">
            <p className="small fw-bold mb-1" style={{ color: 'var(--text-secondary)', textTransform: 'uppercase', fontSize: '0.72rem', letterSpacing: '0.05em' }}>
              Compétences vérifiées ✓
            </p>
            <div className="d-flex flex-wrap">
              {verifiedSkills.map(slug => <SkillBadge key={slug} slug={slug} />)}
            </div>
          </div>
        )}

        {avg > 0 && (
          <div className="d-flex align-items-center gap-2 mb-3">
            <StarRating rating={avg} size={20} showText />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              ({worker.reviews?.length} avis)
            </span>
          </div>
        )}

        {worker.bio && (
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{worker.bio}</p>
        )}
      </div>
    </div>
  )
}
