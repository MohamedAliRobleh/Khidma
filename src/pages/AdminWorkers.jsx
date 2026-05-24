// src/pages/AdminWorkers.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'
import AdminTable from '../components/admin/AdminTable'
import WorkerForm from '../components/admin/WorkerForm'
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
            style={{ color: active === 'workers' ? 'var(--accent)' : 'rgba(255,255,255,0.7)', fontWeight: active === 'workers' ? 700 : 400 }}>
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

export default function AdminWorkers() {
  const { workers, loading, fetchWorkers, createWorker, updateWorker, deleteWorker, toggleField,
          pendingWorkers, fetchPending, approveWorker, rejectWorker } = useAdmin()
  const [showForm, setShowForm]   = useState(false)
  const [editing, setEditing]     = useState(null)
  const [search, setSearch]       = useState('')
  const [tab, setTab]             = useState('active')

  useEffect(() => { fetchWorkers(); fetchPending() }, [fetchWorkers, fetchPending])

  const filtered = workers.filter(w =>
    w.fullName.toLowerCase().includes(search.toLowerCase()) ||
    w.neighborhood?.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total:     workers.length,
    available: workers.filter(w => w.available).length,
    verified:  workers.filter(w => w.verified).length,
    featured:  workers.filter(w => w.featured).length,
  }

  const handleSave = async data => {
    if (editing?.id) {
      await updateWorker(editing.id, data)
    } else {
      await createWorker(data)
    }
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <AdminNav active="workers" />
      <div className="container py-4">
        {/* Stats */}
        <div className="row g-3 mb-4">
          {[
            { label: 'Total', value: stats.total },
            { label: 'Disponibles', value: stats.available },
            { label: 'Vérifiées', value: stats.verified },
            { label: 'En vedette', value: stats.featured },
          ].map(s => (
            <div key={s.label} className="col-6 col-md-3">
              <div className="card-khidma p-3 text-center">
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--primary)' }}>{s.value}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions bar */}
        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Rechercher par nom ou quartier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 320, borderRadius: 10 }}
          />
          <button
            className="btn btn-primary-custom"
            onClick={() => { setEditing(null); setShowForm(true) }}
          >
            + Ajouter une bonne
          </button>
        </div>

        {/* Tab switcher */}
        <div className="d-flex gap-2 mb-3">
          <button
            className="btn btn-sm"
            style={{ borderRadius: 20, border: `2px solid ${tab === 'active' ? 'var(--primary)' : 'var(--border)'}`, background: tab === 'active' ? 'var(--primary)' : 'transparent', color: tab === 'active' ? '#fff' : 'var(--text-secondary)', fontWeight: tab === 'active' ? 700 : 400 }}
            onClick={() => setTab('active')}
          >
            Actives ({workers.length})
          </button>
          <button
            className="btn btn-sm"
            style={{ borderRadius: 20, border: `2px solid ${tab === 'pending' ? '#f59e0b' : 'var(--border)'}`, background: tab === 'pending' ? '#f59e0b' : 'transparent', color: tab === 'pending' ? '#fff' : 'var(--text-secondary)', fontWeight: tab === 'pending' ? 700 : 400 }}
            onClick={() => setTab('pending')}
          >
            En attente ({pendingWorkers.length})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" style={{ color: 'var(--primary)' }} />
          </div>
        ) : tab === 'active' ? (
          <div className="card-khidma">
            <AdminTable
              workers={filtered}
              onEdit={w => { setEditing(w); setShowForm(true) }}
              onDelete={deleteWorker}
              onToggle={toggleField}
            />
          </div>
        ) : (
          <div className="card-khidma">
            {pendingWorkers.length === 0 ? (
              <div className="text-center py-4" style={{ color: 'var(--text-secondary)' }}>
                Aucun profil en attente
              </div>
            ) : (
              pendingWorkers.map(w => (
                <div key={w.id} className="d-flex align-items-center justify-content-between p-3"
                  style={{ borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <div className="fw-bold">{w.fullName}</div>
                    <div className="small" style={{ color: 'var(--text-secondary)' }}>
                      {w.phone} · {w.neighborhood} · Inscrit le {formatDate(w.createdAt)}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-success" style={{ borderRadius: 8 }}
                      onClick={() => approveWorker(w.id)}>
                      ✓ Approuver
                    </button>
                    <button className="btn btn-sm btn-outline-danger" style={{ borderRadius: 8 }}
                      onClick={() => rejectWorker(w.id)}>
                      Rejeter
                    </button>
                    <button className="btn btn-sm btn-outline-secondary" style={{ borderRadius: 8 }}
                      onClick={() => { setEditing(w); setShowForm(true) }}>
                      Éditer
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {showForm && (
        <WorkerForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null) }}
        />
      )}
    </div>
  )
}
