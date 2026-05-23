// src/components/ui/StarRating.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StarRating from './StarRating'

describe('StarRating', () => {
  it('renders 5 stars', () => {
    const { container } = render(<StarRating rating={3} />)
    const stars = container.querySelectorAll('[data-star]')
    expect(stars).toHaveLength(5)
  })

  it('shows correct number of filled stars', () => {
    const { container } = render(<StarRating rating={4} />)
    const filled = container.querySelectorAll('[data-star="filled"]')
    expect(filled).toHaveLength(4)
  })

  it('displays rating text', () => {
    render(<StarRating rating={4.5} showText />)
    expect(screen.getByText('4.5')).toBeInTheDocument()
  })
})
