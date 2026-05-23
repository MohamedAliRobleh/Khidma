// src/components/ui/PriceTag.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import PriceTag from './PriceTag'

describe('PriceTag', () => {
  it('displays formatted price', () => {
    render(<PriceTag amount={35000} />)
    // Uses /35.000 FDJ/ because formatPrice uses U+202F narrow no-break space
    expect(screen.getByText(/35.000 FDJ/)).toBeInTheDocument()
  })
  it('renders nothing when amount is null', () => {
    const { container } = render(<PriceTag amount={null} />)
    expect(container.firstChild).toBeNull()
  })
})
