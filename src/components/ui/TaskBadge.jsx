// src/components/ui/TaskBadge.jsx
import { TASKS } from '../../utils/constants'

export default function TaskBadge({ slug }) {
  const task = TASKS.find(t => t.slug === slug)
  if (!task) return null
  return (
    <span
      className="badge rounded-pill"
      style={{
        background: 'var(--primary-light)',
        color: 'var(--primary-dark)',
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
        fontSize: '0.82rem',
        padding: '0.4em 0.8em',
      }}
    >
      <span>{task.icon}</span>{' '}
      <span>{task.label}</span>
    </span>
  )
}
