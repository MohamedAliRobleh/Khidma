// src/hooks/useAdmin.js
import { useState, useCallback } from 'react'

function getToken() {
  return localStorage.getItem('khidma_admin_token')
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  }
}

export function useAdmin() {
  const [workers, setWorkers] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(false)
  const [pendingWorkers, setPendingWorkers] = useState([])

  const fetchWorkers = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/workers?limit=100', { headers: authHeaders() })
    const data = await res.json()
    setWorkers(data.workers)
    setLoading(false)
  }, [])

  const fetchPending = useCallback(async () => {
    const res = await fetch('/api/workers?status=PENDING', { headers: authHeaders() })
    if (!res.ok) return
    const data = await res.json()
    setPendingWorkers(data.workers)
  }, [])

  const approveWorker = useCallback(async id => {
    await fetch(`/api/workers/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status: 'ACTIVE', verified: true }),
    })
    await Promise.all([fetchWorkers(), fetchPending()])
  }, [fetchWorkers, fetchPending])

  const rejectWorker = useCallback(async id => {
    if (!confirm('Rejeter ce profil ?')) return
    await fetch(`/api/workers/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status: 'REJECTED' }),
    })
    await fetchPending()
  }, [fetchPending])

  const fetchReviews = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/workers?limit=100')
    const data = await res.json()
    const allReviews = data.workers.flatMap(w =>
      (w.reviews || []).map(r => ({ ...r, workerName: w.fullName }))
    )
    setReviews(allReviews)
    setLoading(false)
  }, [])

  const createWorker = async workerData => {
    const res = await fetch('/api/workers', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(workerData),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Erreur de création')
    }
    await fetchWorkers()
  }

  const updateWorker = async (id, workerData) => {
    const res = await fetch(`/api/workers/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(workerData),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error || 'Erreur de mise à jour')
    }
    await fetchWorkers()
  }

  const deleteWorker = async id => {
    if (!confirm('Supprimer cette travailleuse définitivement ?')) return
    const res = await fetch(`/api/workers/${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    })
    if (!res.ok) throw new Error('Erreur de suppression')
    await fetchWorkers()
  }

  const deleteReview = async () => {
    await fetchReviews()
  }

  const toggleField = async (id, field, value) => {
    await fetch(`/api/workers/${id}`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ [field]: value }),
    })
    setWorkers(ws => ws.map(w => w.id === id ? { ...w, [field]: value } : w))
  }

  return {
    workers, reviews, loading, pendingWorkers,
    fetchWorkers, fetchReviews, fetchPending,
    createWorker, updateWorker, deleteWorker, deleteReview, toggleField,
    approveWorker, rejectWorker,
  }
}
