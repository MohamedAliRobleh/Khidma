import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import LanguageBadge from './LanguageBadge'

describe('LanguageBadge', () => {
  it('shows language name and level label', () => {
    render(<LanguageBadge language="Somali" level="natif" />)
    expect(screen.getByText('Somali')).toBeTruthy()
    expect(screen.getByText((content) => content.includes('Natif'))).toBeTruthy()
  })

  it('shows correct level label for intermediaire', () => {
    render(<LanguageBadge language="Français" level="intermediaire" />)
    expect(screen.getByText((content) => content.includes('Intermédiaire'))).toBeTruthy()
  })

  it('renders nothing for unknown level', () => {
    const { container } = render(<LanguageBadge language="Afar" level="unknown" />)
    expect(container.firstChild).toBeNull()
  })
})
