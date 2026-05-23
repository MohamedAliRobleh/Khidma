// src/components/workers/WorkerProfileHeader.jsx
import StarRating from '../ui/StarRating'
import AvailableBadge from '../ui/AvailableBadge'
import VerifiedBadge from '../ui/VerifiedBadge'

function avgRating(reviews) {
  if (!reviews?.length) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}

export default function WorkerProfileHeader({ worker }) {
  const avg = avgRating(worker.reviews)

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
          <AvailableBadge available={worker.available} />
        </div>

        <div className="d-flex flex-wrap gap-3 mb-3 small" style={{ color: 'var(--text-secondary)' }}>
          <span>📍 {worker.neighborhood || worker.city}</span>
          {worker.experience && <span>💼 {worker.experience} ans d'expérience</span>}
          <span>🌐 {worker.languages?.join(', ')}</span>
        </div>

        {avg > 0 && (
          <div className="d-flex align-items-center gap-2 mb-3">
            <StarRating rating={avg} size={20} showText />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              ({worker.reviews.length} avis)
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
