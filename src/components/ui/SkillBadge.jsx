import { VERIFIED_SKILLS } from '../../utils/constants'

export default function SkillBadge({ slug }) {
  const skill = VERIFIED_SKILLS.find(s => s.slug === slug)
  if (!skill) return null

  return (
    <span
      className="d-inline-flex align-items-center gap-1 rounded-pill px-2 py-1 me-1 mb-1"
      style={{
        fontSize: '0.78rem',
        background: 'var(--primary)',
        color: '#fff',
        fontWeight: 600,
      }}
      title="Compétence vérifiée par Khidma"
    >
      {skill.icon} {skill.label} ✓
    </span>
  )
}
