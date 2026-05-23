// src/components/workers/WorkerCard.test.jsx
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import WorkerCard from './WorkerCard'

const mockWorker = {
  id: 'w1',
  fullName: 'Fadumo Abdi Hassan',
  neighborhood: 'Plateau du Serpent',
  available: true,
  verified: true,
  experience: 8,
  tasks: ['menage', 'cuisine'],
  priceFdj: 35000,
  photoUrl: null,
  age: 32,
  reviews: [
    { rating: 5 }, { rating: 4 }, { rating: 5 },
  ],
}

describe('WorkerCard', () => {
  it('shows worker name', () => {
    render(<MemoryRouter><WorkerCard worker={mockWorker} /></MemoryRouter>)
    expect(screen.getByText('Fadumo Abdi Hassan')).toBeInTheDocument()
  })
  it('shows neighborhood', () => {
    render(<MemoryRouter><WorkerCard worker={mockWorker} /></MemoryRouter>)
    expect(screen.getByText(/Plateau du Serpent/)).toBeInTheDocument()
  })
  it('links to worker profile', () => {
    render(<MemoryRouter><WorkerCard worker={mockWorker} /></MemoryRouter>)
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/bonnes/w1')
  })
})
