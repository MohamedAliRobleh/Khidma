// src/hooks/useWorker.js
import { useState, useEffect, useRef } from 'react'

export function useWorker(id) {
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]   = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`/api/workers/${encodeURIComponent(id)}`)
      .then(async r => {
        const contentType = r.headers.get('content-type') || ''
        if (!r.ok) {
          if (contentType.includes('application/json')) {
            const data = await r.json().catch(() => ({}))
            throw new Error(data.error || 'Travailleuse introuvable')
          }
          const text = await r.text().catch(() => '')
          throw new Error(text ? text.slice(0, 200) : 'Travailleuse introuvable')
        }
        if (!contentType.includes('application/json')) {
          const text = await r.text().catch(() => '')
          throw new Error(text ? 'Réponse API invalide' : 'Travailleuse introuvable')
        }
        return r.json()
      })
      .then(data => {
        if (!cancelled) { setWorker(data); setLoading(false) }
      })
      .catch(err => {
        if (!cancelled) { console.error('useWorker fetch error:', err); setError(err.message); setLoading(false) }
      })

    return () => { cancelled = true }
  }, [id])

  const mountedRef = useRef(true)
  useEffect(() => () => { mountedRef.current = false }, [])

  const refetch = () => {
    setLoading(true)
    fetch(`/api/workers/${id}`)
      .then(r => r.json())
      .then(data => { if (mountedRef.current) { setWorker(data); setLoading(false) } })
      .catch(err => { if (mountedRef.current) { setError(err.message); setLoading(false) } })
  }

  return { worker, loading, error, refetch }
}
