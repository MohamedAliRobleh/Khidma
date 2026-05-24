// src/hooks/useWorker.js
import { useState, useEffect, useRef } from 'react'

const parseApiResponse = async (response) => {
  const text = await response.text().catch(() => '')
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[')

  if (isJson) {
    try {
      return JSON.parse(text)
    } catch {
      throw new Error('Réponse API invalide: JSON non interprétable')
    }
  }

  if (text) {
    if (text.trim().startsWith('<')) {
      throw new Error(
        'Réponse API invalide: le serveur a renvoyé du HTML. Assurez-vous d’exécuter l’API locale avec `vercel dev` ou que la route `/api/workers/:id` existe.'
      )
    }
    throw new Error(text.slice(0, 200))
  }

  throw new Error('Réponse API invalide')
}

export function useWorker(id) {
  const [worker, setWorker] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    const endpoint = `/api/workers/${encodeURIComponent(id)}`

    setLoading(true)
    setError(null)

    fetch(endpoint)
      .then(async r => {
        const data = await parseApiResponse(r)
        if (!r.ok) {
          throw new Error(data?.error || 'Travailleuse introuvable')
        }
        return data
      })
      .then(data => {
        if (!cancelled) {
          setWorker(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (!cancelled) {
          console.error('useWorker fetch error:', err)
          setError(err.message)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const mountedRef = useRef(true)
  useEffect(() => () => {
    mountedRef.current = false
  }, [])

  const refetch = () => {
    setLoading(true)
    setError(null)
    fetch(`/api/workers/${encodeURIComponent(id)}`)
      .then(async r => {
        const data = await parseApiResponse(r)
        if (!r.ok) {
          throw new Error(data?.error || 'Travailleuse introuvable')
        }
        return data
      })
      .then(data => {
        if (mountedRef.current) {
          setWorker(data)
          setLoading(false)
        }
      })
      .catch(err => {
        if (mountedRef.current) {
          console.error('useWorker refetch error:', err)
          setError(err.message)
          setLoading(false)
        }
      })
  }

  return { worker, loading, error, refetch }
}
