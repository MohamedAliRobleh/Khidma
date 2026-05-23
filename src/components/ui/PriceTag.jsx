// src/components/ui/PriceTag.jsx
import { formatPrice } from '../../utils/formatPrice'

export default function PriceTag({ amount }) {
  if (amount == null) return null
  return (
    <span className="fw-bold" style={{ color: 'var(--secondary)' }}>
      À partir de {formatPrice(amount)}<span style={{ fontSize: '0.8em', color: 'var(--text-secondary)', fontWeight: 400 }}>/mois</span>
    </span>
  )
}
