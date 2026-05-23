// src/hooks/useWorkers.js
import { useState, useEffect } from 'react'

export function useWorkers(filters = {}, page = 1) {
  const [workers, setWorkers]     = useState([])
  const [total, setTotal]         = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const params = new URLSearchParams({ page, limit: 12 })
    Object.entries(filters).forEach(([key, val]) => {
      if (val == null) return
      if (Array.isArray(val)) {
        val.forEach(v => params.append(key, v))
      } else {
        params.set(key, val)
      }
    })

    fetch(`/api/workers?${params}`)
      .then(r => r.json())
      .then(data => {
        if (cancelled) return
        setWorkers(data.workers)
        setTotal(data.total)
        setTotalPages(data.totalPages)
        setLoading(false)
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      })

    return () => { cancelled = true }
  }, [JSON.stringify(filters), page])

  return { workers, total, totalPages, loading, error }
}
