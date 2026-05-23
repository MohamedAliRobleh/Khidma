// src/components/workers/WorkerCard.jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import StarRating from '../ui/StarRating'
import AvailableBadge from '../ui/AvailableBadge'
import VerifiedBadge from '../ui/VerifiedBadge'
import TaskBadge from '../ui/TaskBadge'
import { formatPrice } from '../../utils/formatPrice'

function avgRating(reviews) {
  if (!reviews?.length) return 0
  return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
}

export default function WorkerCard({ worker, index = 0 }) {
  const avg = avgRating(worker.reviews)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link to={`/bonnes/${worker.id}`} className="text-decoration-none">
        <div className="card-khidma overflow-hidden h-100">
          {/* Photo */}
          <div style={{ position: 'relative', height: 220, background: 'var(--bg-secondary)' }}>
            {worker.photoUrl ? (
              <img
                src={worker.photoUrl}
                alt={worker.fullName}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100"
                style={{ fontSize: 64, color: 'var(--border)' }}>
                👤
              </div>
            )}
            {/* Available badge overlay */}
            <div style={{ position: 'absolute', top: 12, left: 12 }}>
              <AvailableBadge available={worker.available} />
            </div>
            {worker.verified && (
              <div style={{ position: 'absolute', top: 12, right: 12 }}>
                <VerifiedBadge />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-3">
            <div className="d-flex align-items-start justify-content-between mb-1">
              <h5 className="mb-0" style={{ fontFamily: 'var(--font-heading)', color: 'var(--text-primary)', fontSize: '1rem' }}>
                {worker.fullName}
              </h5>
              {worker.age && (
                <span className="badge rounded-pill ms-2 flex-shrink-0"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                  {worker.age} ans
                </span>
              )}
            </div>

            <p className="mb-2 small" style={{ color: 'var(--text-secondary)' }}>
              📍 {worker.neighborhood || worker.city}
              {worker.experience && <> · {worker.experience} ans d'exp.</>}
            </p>

            {avg > 0 && (
              <div className="mb-2 d-flex align-items-center gap-2">
                <StarRating rating={avg} showText />
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  ({worker.reviews.length} avis)
                </span>
              </div>
            )}

            <div className="d-flex flex-wrap gap-1 mb-3">
              {worker.tasks.slice(0, 3).map(slug => (
                <TaskBadge key={slug} slug={slug} />
              ))}
              {worker.tasks.length > 3 && (
                <span className="badge rounded-pill"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', fontSize: '0.78rem' }}>
                  +{worker.tasks.length - 3}
                </span>
              )}
            </div>

            {worker.priceFdj && (
              <div className="pt-2" style={{ borderTop: '1px solid var(--border)', fontSize: '0.88rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>À partir de </span>
                <span className="fw-bold" style={{ color: 'var(--secondary)' }}>
                  {formatPrice(worker.priceFdj)}/mois
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
