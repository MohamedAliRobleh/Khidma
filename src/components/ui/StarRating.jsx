// src/components/ui/StarRating.jsx
export default function StarRating({ rating = 0, showText = false, size = 16, interactive = false, onRate }) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <span className="d-inline-flex align-items-center gap-1">
      {stars.map(n => {
        const filled = n <= Math.round(rating)
        return (
          <span
            key={n}
            data-star={filled ? 'filled' : 'empty'}
            onClick={interactive ? () => onRate?.(n) : undefined}
            style={{
              color: filled ? '#D4A853' : '#D5C5B0',
              fontSize: size,
              cursor: interactive ? 'pointer' : 'default',
            }}
          >
            ★
          </span>
        )
      })}
      {showText && (
        <span style={{ fontSize: size - 2, color: 'var(--text-secondary)', marginLeft: 2 }}>
          {typeof rating === 'number' ? rating.toFixed(1) : rating}
        </span>
      )}
    </span>
  )
}
