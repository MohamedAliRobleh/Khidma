// src/components/modals/ReviewModal.jsx
import { useState } from 'react'
import StarRating from '../ui/StarRating'

export default function ReviewModal({ workerId, workerName, onClose, onSuccess }) {
  const [form, setForm] = useState({ clientName: '', rating: 0, comment: '' })
  const [status, setStatus] = useState(null) // null | 'sending' | 'success' | 'error'
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.rating) { setError('Veuillez sélectionner une note.'); return }
    setStatus('sending')
    setError('')

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workerId, ...form }),
      })
      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Une erreur est survenue.')
        setStatus(null)
        return
      }
      setStatus('success')
      setTimeout(onSuccess, 1500)
    } catch {
      setError('Une erreur réseau est survenue.')
      setStatus(null)
    }
  }

  return (
    <div
      className="modal d-block"
      style={{ background: 'rgba(0,0,0,0.5)', position: 'fixed', inset: 0, zIndex: 1050, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="modal-dialog modal-dialog-centered" style={{ width: '100%', maxWidth: 480 }}>
        <div className="modal-content" style={{ borderRadius: 20, border: 'none' }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title" style={{ fontFamily: 'var(--font-heading)' }}>
              Laisser un avis — {workerName}
            </h5>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body">
            {status === 'success' ? (
              <div className="text-center py-4">
                <div style={{ fontSize: 48 }}>✅</div>
                <p className="mt-3 fw-bold">Merci pour votre avis !</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Votre nom</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Marie Dupont"
                    value={form.clientName}
                    onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                    required
                    style={{ borderRadius: 10 }}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Votre note</label>
                  <div>
                    <StarRating
                      rating={form.rating}
                      interactive
                      size={28}
                      onRate={n => setForm(f => ({ ...f, rating: n }))}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label small fw-bold">Commentaire (optionnel)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Partagez votre expérience..."
                    value={form.comment}
                    onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                    style={{ borderRadius: 10 }}
                  />
                </div>

                {error && <div className="text-danger small mb-2">{error}</div>}

                <button
                  type="submit"
                  className="btn btn-primary-custom w-100"
                  disabled={status === 'sending'}
                >
                  {status === 'sending' ? 'Envoi...' : 'Publier mon avis'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
