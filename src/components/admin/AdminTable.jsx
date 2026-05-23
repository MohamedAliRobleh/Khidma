// src/components/admin/AdminTable.jsx
import { formatDate } from '../../utils/formatDate'

export default function AdminTable({ workers, onEdit, onDelete }) {
  if (!workers?.length) {
    return <p className="text-muted">Aucune travailleuse enregistrée.</p>
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <th>Photo</th>
            <th>Nom</th>
            <th>Quartier</th>
            <th>Prix/mois</th>
            <th>Disponible</th>
            <th>Vérifiée</th>
            <th>Inscrite le</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {workers.map(w => (
            <tr key={w.id}>
              <td>
                {w.photoUrl ? (
                  <img src={w.photoUrl} alt={w.fullName}
                    style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'var(--bg-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                    👤
                  </div>
                )}
              </td>
              <td>
                <span className="fw-bold" style={{ fontFamily: 'var(--font-heading)' }}>{w.fullName}</span>
                {w.verified && <span className="badge ms-2" style={{ background: 'var(--accent)', color: '#1A1A1A', fontSize: '0.7rem' }}>✓</span>}
              </td>
              <td><span className="text-muted small">{w.neighborhood}</span></td>
              <td><span className="small">{w.priceFdj?.toLocaleString('fr-FR')} FDJ</span></td>
              <td>
                <span className={`badge rounded-pill ${w.available ? 'bg-success' : 'bg-secondary'}`}>
                  {w.available ? 'Oui' : 'Non'}
                </span>
              </td>
              <td>
                {w.verified
                  ? <span className="badge rounded-pill" style={{ background: 'var(--accent)', color: '#1A1A1A' }}>Vérifiée</span>
                  : <span className="badge rounded-pill bg-light text-muted">Non</span>}
              </td>
              <td><span className="text-muted small">{formatDate(w.createdAt)}</span></td>
              <td>
                <div className="d-flex gap-1">
                  <button className="btn btn-sm btn-outline-secondary" onClick={() => onEdit(w)}
                    style={{ borderRadius: 8, fontSize: '0.8rem' }}>
                    ✏️ Modifier
                  </button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(w.id)}
                    style={{ borderRadius: 8, fontSize: '0.8rem' }}>
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
