import { LANGUAGE_LEVELS } from '../../utils/constants'

export default function LanguageBadge({ language, level }) {
  const lvl = LANGUAGE_LEVELS.find(l => l.slug === level)
  if (!lvl) return null

  return (
    <span
      className="d-inline-flex align-items-center gap-1 rounded-pill px-2 py-1 me-1 mb-1"
      style={{
        fontSize: '0.78rem',
        border: `1.5px solid ${lvl.color}`,
        color: lvl.color,
        background: `${lvl.color}18`,
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{ fontWeight: 700 }}>{language}</span>
      <span style={{ opacity: 0.8 }}>· {lvl.label}</span>
    </span>
  )
}
