// src/hooks/useWorkerAuth.js
import { useState, useEffect, useCallback } from 'react'

const TOKEN_KEY = 'khidma_worker_token'
const WORKER_KEY = 'khidma_worker'
const SYNC_EVENT = 'khidma_worker_sync'

function readWorker() {
  try { return JSON.parse(localStorage.getItem(WORKER_KEY)) } catch { return null }
}

function broadcast() {
  window.dispatchEvent(new Event(SYNC_EVENT))
}

export function useWorkerAuth() {
  const [worker, setWorker] = useState(readWorker)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const sync = () => setWorker(readWorker())
    window.addEventListener(SYNC_EVENT, sync)
    return () => window.removeEventListener(SYNC_EVENT, sync)
  }, [])

  const token = () => localStorage.getItem(TOKEN_KEY)
  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token()}`,
  })

  const save = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(WORKER_KEY, JSON.stringify(data.worker))
    setWorker(data.worker)
    broadcast()
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(WORKER_KEY)
    setWorker(null)
    broadcast()
  }

  const login = useCallback(async (phone, pin) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/workers/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, pin }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur de connexion')
      save(data)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/api/workers/me', { headers: authHeaders() })
      if (!res.ok) return null
      return res.json()
    } catch {
      return null
    }
  }, [worker])

  const updateMe = useCallback(async (data) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/workers/me', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Erreur de mise à jour')
      return result
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }, [worker])

  return { worker, loading, error, login, logout, fetchMe, updateMe }
}
