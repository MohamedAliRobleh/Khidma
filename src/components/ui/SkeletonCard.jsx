// src/components/ui/SkeletonCard.jsx
export default function SkeletonCard() {
  return (
    <div className="card-khidma p-3" style={{ minHeight: 320 }}>
      <div className="skeleton mb-3" style={{ height: 200, borderRadius: 'var(--radius-md)' }} />
      <div className="skeleton mb-2" style={{ height: 20, width: '70%' }} />
      <div className="skeleton mb-2" style={{ height: 16, width: '40%' }} />
      <div className="skeleton" style={{ height: 16, width: '55%' }} />
    </div>
  )
}
