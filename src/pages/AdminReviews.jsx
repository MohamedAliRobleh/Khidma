// src/pages/AdminReviews.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'
import StarRating from '../components/ui/StarRating'
import { formatDate } from '../utils/formatDate'

function AdminNav({ active }) {
  const navigate = useNavigate()
  const logout = () => { localStorage.removeItem('khidma_admin_token'); navigate('/admin') }
  return (
    <nav className="navbar sticky-top py-2" style={{ background: 'var(--secondary)', color: '#fff' }}>
      <div className="container d-flex align-items-center justify-content-between">
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, color: '#fff', fontSize: '1.2rem' }}>
          Khidma Admin
        </span>
        <div className="d-flex gap-3 align-items-center">
          <button className="btn btn-sm" onClick={() => navigate('/admin/workers')}
            style={{ color: active === 'workers' ? 'var(--accent)' : 'rgba(255,255,255,0.7)' }}>
            Travailleuses
          </button>
          <button className="btn btn-sm" onClick={() => navigate('/admin/reviews')}
            style={{ color: active === 'reviews' ? 'var(--accent)' : 'rgba(255,255,255,0.7)', fontWeight: active === 'reviews' ? 700 : 400 }}>
            Avis
          </button>
          <button className="btn btn-sm btn-outline-light" onClick={logout}>Déconnexion</button>
        </div>
      </div>
    </nav>
  )
}

export default function AdminReviews() {
  const { reviews, loading, fetchReviews } = useAdmin()

  useEffect(() => { fetchReviews() }, [fetchReviews])

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <AdminNav active="reviews" />
      <div className="container py-4">
        <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mb-4">Gestion des avis</h2>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--primary)' }} />
          </div>
        ) : (
          <div className="card-khidma">
            <div className="table-responsive">
              <table className="table align-middle">
                <thead style={{ background: 'var(--bg-secondary)' }}>
                  <tr>
                    <th>Travailleuse</th>
                    <th>Client</th>
                    <th>Note</th>
                    <th>Commentaire</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>Aucun avis.</td></tr>
                  ) : (
                    reviews.map(r => (
                      <tr key={r.id}>
                        <td className="fw-bold" style={{ fontSize: '0.9rem' }}>{r.workerName}</td>
                        <td style={{ fontSize: '0.9rem' }}>{r.clientName}</td>
                        <td><StarRating rating={r.rating} size={14} /></td>
                        <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: 280 }}>
                          {r.comment || <em>—</em>}
                        </td>
                        <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{formatDate(r.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
