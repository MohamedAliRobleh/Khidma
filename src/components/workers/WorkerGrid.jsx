// src/components/workers/WorkerGrid.jsx
import WorkerCard from './WorkerCard'
import SkeletonCard from '../ui/SkeletonCard'

export default function WorkerGrid({ workers, loading }) {
  if (loading) {
    return (
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="col"><SkeletonCard /></div>
        ))}
      </div>
    )
  }

  if (!workers?.length) {
    return (
      <div className="text-center py-5">
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          Aucune travailleuse ne correspond à vos critères.
        </p>
      </div>
    )
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
      {workers.map((worker, i) => (
        <div key={worker.id} className="col">
          <WorkerCard worker={worker} index={i} />
        </div>
      ))}
    </div>
  )
}
