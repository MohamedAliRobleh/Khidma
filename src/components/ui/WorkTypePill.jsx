// src/components/ui/WorkTypePill.jsx
import { WORK_TYPES, SCHEDULE_OPTIONS } from '../../utils/constants'

export default function WorkTypePill({ slug }) {
  const item =
    WORK_TYPES.find(t => t.slug === slug) ||
    SCHEDULE_OPTIONS.find(t => t.slug === slug)
  if (!item) return null
  return (
    <span
      className="badge rounded-pill me-1"
      style={{
        background: 'var(--bg-secondary)',
        color: 'var(--secondary)',
        border: '1px solid var(--border)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: '0.8rem',
        padding: '0.35em 0.75em',
      }}
    >
      {item.label}
    </span>
  )
}
