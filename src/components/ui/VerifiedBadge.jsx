// src/components/ui/VerifiedBadge.jsx
export default function VerifiedBadge() {
  return (
    <span
      className="badge"
      style={{
        background: 'var(--accent)',
        color: '#1A1A1A',
        fontFamily: 'var(--font-body)',
        fontWeight: 700,
        fontSize: '0.8rem',
        borderRadius: 8,
        padding: '0.3em 0.7em',
      }}
    >
      ★ Vérifiée
    </span>
  )
}
