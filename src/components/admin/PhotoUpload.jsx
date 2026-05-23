// src/components/admin/PhotoUpload.jsx
import { useState, useRef } from 'react'

export default function PhotoUpload({ currentUrl, onUpload }) {
  const [status, setStatus] = useState(null) // null | 'uploading' | 'done' | 'error'
  const inputRef = useRef()

  const handleFile = async e => {
    const file = e.target.files[0]
    if (!file) return

    setStatus('uploading')
    const reader = new FileReader()
    reader.onloadend = async () => {
      try {
        const token = localStorage.getItem('khidma_admin_token')
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ data: reader.result }),
        })
        if (!res.ok) throw new Error()
        const { url, publicId } = await res.json()
        onUpload({ url, publicId })
        setStatus('done')
      } catch {
        setStatus('error')
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div>
      <div
        className="rounded-3 overflow-hidden mb-2"
        style={{ width: 120, height: 120, background: 'var(--bg-secondary)', cursor: 'pointer' }}
        onClick={() => inputRef.current?.click()}
      >
        {currentUrl ? (
          <img src={currentUrl} alt="Photo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div className="d-flex align-items-center justify-content-center h-100"
            style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center', padding: '0.5rem' }}>
            Cliquer pour<br/>ajouter une photo
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="d-none"
        onChange={handleFile}
      />
      {status === 'uploading' && <small className="text-muted">Upload en cours...</small>}
      {status === 'done'      && <small className="text-success">✓ Photo uploadée</small>}
      {status === 'error'     && <small className="text-danger">Erreur lors de l'upload</small>}
    </div>
  )
}
