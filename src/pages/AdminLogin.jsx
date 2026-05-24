// src/pages/AdminLogin.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erreur'); setLoading(false); return }
      localStorage.setItem('khidma_admin_token', data.token)
      navigate('/admin/workers')
    } catch {
      setError('Erreur réseau')
      setLoading(false)
    }
  }

  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: '100vh', background: 'var(--bg-secondary)' }}
    >
      <div className="card-khidma p-5" style={{ width: '100%', maxWidth: 420 }}>
        <div className="text-center mb-4">
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)', fontSize: '1.8rem' }}>Khidma</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Espace administration</p>
        </div>

        <form onSubmit={handleSubmit} autoComplete="on">
          <input type="text" name="username" autoComplete="username"
            value="admin" readOnly style={{ display: 'none' }} />
          <div className="mb-3">
            <label className="form-label small fw-bold">Mot de passe</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
              autoComplete="current-password"
              style={{ borderRadius: 10, padding: '0.7rem 1rem' }}
            />
          </div>
          {error && <div className="text-danger small mb-2">{error}</div>}
          <button
            type="submit"
            className="btn btn-primary-custom w-100 mt-1"
            disabled={loading}
          >
            {loading ? 'Connexion...' : 'Accéder'}
          </button>
        </form>
      </div>
    </div>
  )
}
