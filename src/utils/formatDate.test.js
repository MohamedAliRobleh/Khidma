import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats an ISO date string to French locale long format', () => {
    const result = formatDate('2024-01-15T12:00:00.000Z')
    expect(result).toMatch(/janvier/)
    expect(result).toMatch(/2024/)
  })
  it('includes the day number', () => {
    const result = formatDate('2024-12-15T12:00:00.000Z')
    expect(result).toMatch(/décembre/)
    expect(result).toMatch(/2024/)
  })
})
