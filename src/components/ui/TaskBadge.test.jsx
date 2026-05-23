// src/components/ui/TaskBadge.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import TaskBadge from './TaskBadge'

describe('TaskBadge', () => {
  it('renders task label', () => {
    render(<TaskBadge slug="menage" />)
    expect(screen.getByText('Ménage général')).toBeInTheDocument()
  })
  it('renders task icon', () => {
    render(<TaskBadge slug="enfants" />)
    expect(screen.getByText(/👶/)).toBeInTheDocument()
  })
  it('renders unknown slug gracefully', () => {
    const { container } = render(<TaskBadge slug="unknown" />)
    expect(container.firstChild).toBeNull()
  })
})
