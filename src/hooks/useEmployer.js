// src/hooks/useEmployer.js
import { useState, useCallback } from 'react'

const TOKEN_KEY = 'khidma_employer_token'
const EMPLOYER_KEY = 'khidma_employer'

export function useEmployer() {
  const [employer, setEmployer] = useState(() => {
    try { return JSON.parse(localStorage.getItem(EMPLOYER_KEY)) } catch { return null }
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const token = () => localStorage.getItem(TOKEN_KEY)

  const authHeaders = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token()}`,
  })

  const save = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(EMPLOYER_KEY, JSON.stringify(data.employer))
    setEmployer(data.employer)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMPLOYER_KEY)
    setEmployer(null)
  }

  const register = useCallback(async (email, password, name, phone) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/employers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur serveur')
      save(data)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/employers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur serveur')
      save(data)
      return true
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const addToHistory = useCallback(async (workerId) => {
    if (!employer) return false
    const res = await fetch(`/api/employers/${employer.id}/history`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ workerId }),
    })
    return res.ok
  }, [employer])

  const markPast = useCallback(async (workerId) => {
    if (!employer) return false
    const res = await fetch(`/api/employers/${employer.id}/history`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ workerId, status: 'PAST' }),
    })
    return res.ok
  }, [employer])

  const toggleAlert = useCallback(async (workerId, hasAlert) => {
    if (!employer) return false
    const res = await fetch(`/api/employers/${employer.id}/alerts`, {
      method: hasAlert ? 'DELETE' : 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ workerId }),
    })
    return res.ok
  }, [employer])

  const fetchHistory = useCallback(async () => {
    if (!employer) return []
    const res = await fetch(`/api/employers/${employer.id}/history`, {
      headers: authHeaders(),
    })
    if (!res.ok) return []
    return res.json()
  }, [employer])

  const fetchAlerts = useCallback(async () => {
    if (!employer) return []
    const res = await fetch(`/api/employers/${employer.id}/alerts`, {
      headers: authHeaders(),
    })
    if (!res.ok) return []
    return res.json()
  }, [employer])

  return {
    employer, loading, error,
    register, login, logout,
    addToHistory, markPast, toggleAlert,
    fetchHistory, fetchAlerts,
  }
}
