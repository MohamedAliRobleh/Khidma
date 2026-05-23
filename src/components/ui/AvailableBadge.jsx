// src/components/ui/AvailableBadge.jsx
export default function AvailableBadge({ available }) {
  return (
    <span className="d-inline-flex align-items-center gap-2">
      <span
        className="available-pulse"
        style={{ background: available ? 'var(--success)' : '#aaa' }}
      />
      <span style={{ fontSize: '0.85rem', color: available ? 'var(--success)' : 'var(--text-secondary)', fontWeight: 600 }}>
        {available ? 'Disponible' : 'Non disponible'}
      </span>
    </span>
  )
}
