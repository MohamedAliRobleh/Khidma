// src/hooks/useWorker.js
import { useState, useEffect } from 'react'

export function useWorker(id) {
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)

    fetch(`/api/workers/${id}`)
      .then(r => {
        if (!r.ok) throw new Error('Travailleuse introuvable')
        return r.json()
      })
      .then(data => {
        if (!cancelled) { setWorker(data); setLoading(false) }
      })
      .catch(err => {
        if (!cancelled) { setError(err.message); setLoading(false) }
      })

    return () => { cancelled = true }
  }, [id])

  const refetch = () => {
    setLoading(true)
    fetch(`/api/workers/${id}`)
      .then(r => r.json())
      .then(data => { setWorker(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }

  return { worker, loading, error, refetch }
}
