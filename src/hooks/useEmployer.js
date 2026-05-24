// src/hooks/useEmployer.js
import { useState, useEffect, useCallback } from 'react'

const TOKEN_KEY = 'khidma_employer_token'
const EMPLOYER_KEY = 'khidma_employer'
const SYNC_EVENT = 'khidma_employer_sync'

function readEmployer() {
  try { return JSON.parse(localStorage.getItem(EMPLOYER_KEY)) } catch { return null }
}

function broadcast() {
  window.dispatchEvent(new Event(SYNC_EVENT))
}

export function useEmployer() {
  const [employer, setEmployer] = useState(readEmployer)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const sync = () => setEmployer(readEmployer())
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
    localStorage.setItem(EMPLOYER_KEY, JSON.stringify(data.employer))
    setEmployer(data.employer)
    broadcast()
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMPLOYER_KEY)
    setEmployer(null)
    broadcast()
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
    try {
      const res = await fetch(`/api/employers/${employer.id}/history`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ workerId }),
      })
      return res.ok
    } catch {
      return false
    }
  }, [employer])

  const markPast = useCallback(async (workerId) => {
    if (!employer) return false
    try {
      const res = await fetch(`/api/employers/${employer.id}/history`, {
        method: 'PATCH',
        headers: authHeaders(),
        body: JSON.stringify({ workerId, status: 'PAST' }),
      })
      return res.ok
    } catch {
      return false
    }
  }, [employer])

  const toggleAlert = useCallback(async (workerId, hasAlert) => {
    if (!employer) return false
    try {
      const res = await fetch(`/api/employers/${employer.id}/alerts`, {
        method: hasAlert ? 'DELETE' : 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ workerId }),
      })
      return res.ok
    } catch {
      return false
    }
  }, [employer])

  const fetchHistory = useCallback(async () => {
    if (!employer) return []
    try {
      const res = await fetch(`/api/employers/${employer.id}/history`, {
        headers: authHeaders(),
      })
      if (!res.ok) return []
      return res.json()
    } catch {
      return []
    }
  }, [employer])

  const fetchAlerts = useCallback(async () => {
    if (!employer) return []
    try {
      const res = await fetch(`/api/employers/${employer.id}/alerts`, {
        headers: authHeaders(),
      })
      if (!res.ok) return []
      return res.json()
    } catch {
      return []
    }
  }, [employer])

  return {
    employer, loading, error,
    register, login, logout,
    addToHistory, markPast, toggleAlert,
    fetchHistory, fetchAlerts,
  }
}
