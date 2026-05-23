import { formatPrice } from './formatPrice'

describe('formatPrice', () => {
  it('formats a number with French locale and FDJ suffix', () => {
    expect(formatPrice(20000)).toBe('20 000 FDJ')
  })
  it('formats 35000 correctly', () => {
    expect(formatPrice(35000)).toBe('35 000 FDJ')
  })
  it('returns null for null input', () => {
    expect(formatPrice(null)).toBeNull()
  })
  it('returns null for undefined input', () => {
    expect(formatPrice(undefined)).toBeNull()
  })
})
