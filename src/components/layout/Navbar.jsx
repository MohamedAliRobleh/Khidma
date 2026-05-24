// src/components/layout/Navbar.jsx
import { Link, NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-khidma sticky-top py-2">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2 text-decoration-none">
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)' }}>
            Khidma
          </span>
          <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', color: 'var(--secondary)', opacity: 0.7 }}>
            خدمة
          </span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
          aria-controls="navMenu"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav mx-auto gap-1">
            {[
              { to: '/', label: 'Accueil' },
              { to: '/bonnes', label: 'Trouver une aide' },
              { to: '/a-propos', label: 'À propos' },
            ].map(({ to, label }) => (
              <li key={to} className="nav-item">
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `nav-link px-3 fw-600 ${isActive ? 'text-primary-custom' : 'text-dark'}`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? 'var(--primary)' : 'var(--text-primary)',
                    fontFamily: 'var(--font-body)',
                    fontWeight: isActive ? 700 : 400,
                  })}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
          <NavLink to="/rejoindre" className="nav-link"
            style={({ isActive }) => ({ color: isActive ? 'var(--accent)' : 'var(--text-primary)' })}>
            Je m'inscris
          </NavLink>
          <NavLink to="/compte" className="nav-link"
            style={({ isActive }) => ({ color: isActive ? 'var(--accent)' : 'var(--text-primary)' })}>
            Espace employeur
          </NavLink>
          <Link
            to="/bonnes"
            className="btn btn-primary-custom ms-2"
            style={{ whiteSpace: 'nowrap' }}
          >
            Vous cherchez du travail ?
          </Link>
        </div>
      </div>
    </nav>
  )
}
