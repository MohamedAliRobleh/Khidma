export function formatPrice(amount) {
  if (amount == null) return null
  return `${amount.toLocaleString('fr-FR')} FDJ`
}
