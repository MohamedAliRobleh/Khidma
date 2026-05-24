// src/pages/WorkersList.jsx
import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useWorkers } from '../hooks/useWorkers'
import WorkerGrid from '../components/workers/WorkerGrid'
import FilterSidebar from '../components/workers/FilterSidebar'

export default function WorkersList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState(() => {
    const task = searchParams.get('task')
    return task ? { task: [task] } : {}
  })
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('')

  const { workers, total, totalPages, loading } = useWorkers({ ...filters, sort }, page)

  useEffect(() => { setPage(1) }, [JSON.stringify(filters), sort])

  const handleFiltersChange = newFilters => {
    setFilters(newFilters)
    const params = {}
    if (newFilters.task?.length === 1) params.task = newFilters.task[0]
    setSearchParams(params)
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '80vh' }}>
      <div className="py-4" style={{ background: 'var(--secondary)', color: '#fff' }}>
        <div className="container">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem' }}>Trouver une aide</h1>
          <p style={{ opacity: 0.8, marginBottom: 0 }}>Parcourez les profils vérifiés et contactez directement.</p>
        </div>
      </div>

      <div className="container py-4">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-lg-3">
            <FilterSidebar filters={filters} onChange={handleFiltersChange} />
          </div>

          {/* Listing */}
          <div className="col-lg-9">
            <div className="d-flex align-items-center justify-content-between mb-3 flex-wrap gap-2">
              <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                {loading ? 'Chargement...' : `${total} travailleuse${total !== 1 ? 's' : ''} trouvée${total !== 1 ? 's' : ''}`}
              </p>
              <select
                className="form-select form-select-sm"
                value={sort}
                onChange={e => setSort(e.target.value)}
                style={{ width: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}
              >
                <option value="">A → Z</option>
                <option value="rating">Mieux notées</option>
                <option value="price">Prix croissant</option>
                <option value="recent">Plus récentes</option>
              </select>
            </div>

            <WorkerGrid workers={workers} loading={loading} />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center gap-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                  <button
                    key={n}
                    className="btn btn-sm"
                    onClick={() => setPage(n)}
                    style={{
                      borderRadius: 8,
                      width: 36, height: 36,
                      background: n === page ? 'var(--primary)' : 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      color: n === page ? '#fff' : 'var(--text-primary)',
                      fontWeight: n === page ? 700 : 400,
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
