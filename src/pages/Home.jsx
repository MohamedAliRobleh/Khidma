// src/pages/Home.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useWorkers } from '../hooks/useWorkers'
import WorkerCard from '../components/workers/WorkerCard'
import SkeletonCard from '../components/ui/SkeletonCard'
import { TASKS } from '../utils/constants'

const HERO_BG = 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1600&q=80'

const STATS = [
  { value: '120+', label: 'Bonnes inscrites' },
  { value: '4.8★', label: 'Note moyenne' },
  { value: '500+', label: 'Familles satisfaites' },
  { value: '6',    label: 'Services proposés' },
]

const HOW_STEPS = [
  { icon: '🔍', title: 'Parcourez', desc: 'Consultez les profils vérifiés avec photos, avis et conditions.' },
  { icon: '📞', title: 'Contactez', desc: 'Appelez ou envoyez un WhatsApp directement à la personne.' },
  { icon: '🏠', title: 'Accueillez', desc: 'Convenez des modalités et accueillez votre nouvelle aide.' },
]

const TESTIMONIALS = [
  { name: 'Nour Ahmed', text: "J'ai trouvé Amina en 2 jours. Elle cuisine divinement et est d'une propreté irréprochable. Khidma m'a sauvé !", rating: 5 },
  { name: 'Pierre Martin', text: 'Hodan est parfaite avec nos enfants. Simple, rapide, fiable. Je recommande sans hésiter.', rating: 5 },
  { name: 'Marie Dupont', text: 'Enfin une plateforme sérieuse à Djibouti. Les profils sont vérifiés et les avis authentiques.', rating: 5 },
]

export default function Home() {
  const navigate = useNavigate()
  const [task, setTask] = useState('')
  const [role, setRole] = useState(() => sessionStorage.getItem('khidma_role'))
  const { workers: featured, loading } = useWorkers({ featured: true }, 1)

  const handleSearch = e => {
    e.preventDefault()
    navigate(task ? `/bonnes?task=${task}` : '/bonnes')
  }

  const chooseRole = r => {
    sessionStorage.setItem('khidma_role', r)
    setRole(r)
    if (r === 'worker') navigate('/rejoindre')
  }

  return (
    <>
      {/* Role chooser overlay */}
      {!role && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'var(--bg-primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <div className="container text-center" style={{ maxWidth: 600 }}>
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem,4vw,2.8rem)', fontWeight: 800, marginBottom: '0.5rem' }}>
              Bienvenue sur Khidma
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
              Vous êtes…
            </p>
            <div className="row g-4">
              <div className="col-6">
                <button
                  className="w-100 p-4 rounded-4 border-0 text-start"
                  style={{ background: 'var(--primary)', color: '#fff', cursor: 'pointer', transition: 'transform 0.15s' }}
                  onClick={() => chooseRole('employer')}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🏠</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700 }}>
                    Employeur
                  </div>
                  <div style={{ opacity: 0.85, fontSize: '0.9rem', marginTop: '0.4rem' }}>
                    Je cherche une aide à domicile
                  </div>
                </button>
              </div>
              <div className="col-6">
                <button
                  className="w-100 p-4 rounded-4 border-0 text-start"
                  style={{ background: 'var(--secondary)', color: '#fff', cursor: 'pointer', transition: 'transform 0.15s' }}
                  onClick={() => chooseRole('worker')}
                >
                  <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>💼</div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700 }}>
                    Travailleuse
                  </div>
                  <div style={{ opacity: 0.85, fontSize: '0.9rem', marginTop: '0.4rem' }}>
                    Je propose mes services
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Hero */}
      <section
        style={{
          position: 'relative', minHeight: '85vh',
          backgroundImage: `url(${HERO_BG})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          display: 'flex', alignItems: 'center',
        }}
      >
        <div className="hero-overlay" style={{ position: 'absolute', inset: 0 }} />
        <div className="container position-relative z-1 text-white py-5">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
              Trouvez une aide de confiance,<br />rapidement.
            </h1>
            <p style={{ fontSize: '1.2rem', opacity: 0.9, maxWidth: 560, marginBottom: '2rem' }}>
              La première plateforme djiboutienne pour trouver des bonnes à domicile vérifiées. Ménage, cuisine, garde d'enfants et plus.
            </p>

            <form onSubmit={handleSearch} className="d-flex gap-2 flex-wrap">
              <select
                className="form-select"
                value={task}
                onChange={e => setTask(e.target.value)}
                style={{ borderRadius: 12, maxWidth: 260, border: 'none', fontFamily: 'var(--font-body)' }}
              >
                <option value="">Tous les services</option>
                {TASKS.map(t => <option key={t.slug} value={t.slug}>{t.icon} {t.label}</option>)}
              </select>
              <button type="submit" className="btn btn-primary-custom px-4">
                🔍 Rechercher
              </button>
            </form>

            <div className="d-flex flex-wrap gap-3 mt-4">
              {['✅ Profils vérifiés', '⭐ Avis authentiques', '📞 Contact direct'].map(b => (
                <span key={b} className="badge rounded-pill"
                  style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '0.5em 1em', fontSize: '0.9rem' }}>
                  {b}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-5" style={{ background: 'var(--secondary)' }}>
        <div className="container">
          <div className="row text-center text-white g-4">
            {STATS.map(s => (
              <div key={s.label} className="col-6 col-md-3">
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)' }}>{s.value}</div>
                <div style={{ opacity: 0.8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-5 section-alt">
        <div className="container">
          <h2 className="text-center mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Nos services</h2>
          <p className="text-center mb-5" style={{ color: 'var(--text-secondary)' }}>Des aides spécialisées pour chaque besoin</p>
          <div className="row g-3 justify-content-center">
            {TASKS.map((t, i) => (
              <div key={t.slug} className="col-6 col-md-4 col-lg-2">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <div
                    className="card-khidma p-3 text-center"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/bonnes?task=${t.slug}`)}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{t.icon}</div>
                    <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text-primary)' }}>{t.label}</div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured workers */}
      <section className="py-5">
        <div className="container">
          <h2 className="mb-2" style={{ fontFamily: 'var(--font-heading)' }}>Nos bonnes en vedette</h2>
          <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>Sélectionnées pour leur sérieux et leurs excellents avis</p>
          <div className="row g-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => <div key={i} className="col-md-3"><SkeletonCard /></div>)
              : featured.slice(0, 4).map((w, i) => (
                  <div key={w.id} className="col-md-3"><WorkerCard worker={w} index={i} /></div>
                ))
            }
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-primary-custom px-5" onClick={() => navigate('/bonnes')}>
              Voir toutes les bonnes
            </button>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-5 section-alt">
        <div className="container">
          <h2 className="text-center mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Comment ça marche ?</h2>
          <div className="row g-4 justify-content-center">
            {HOW_STEPS.map((s, i) => (
              <div key={s.title} className="col-md-4 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-khidma p-4"
                >
                  <div style={{ fontSize: '3rem', marginBottom: 12 }}>{s.icon}</div>
                  <h5 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>{s.title}</h5>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 0, fontSize: '0.93rem' }}>{s.desc}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5" style={{ fontFamily: 'var(--font-heading)' }}>Ce que disent nos clients</h2>
          <div className="row g-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="col-md-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="card-khidma p-4 h-100"
                >
                  <div style={{ color: 'var(--accent)', fontSize: '1.5rem', marginBottom: 12 }}>{'★'.repeat(t.rating)}</div>
                  <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: 16 }}>"{t.text}"</p>
                  <p className="fw-bold mb-0" style={{ color: 'var(--text-primary)' }}>— {t.name}</p>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-5" style={{ background: 'var(--secondary)' }}>
        <div className="container text-center text-white">
          <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>Vous cherchez du travail ?</h2>
          <p style={{ opacity: 0.8, marginBottom: '2rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            Rejoignez Khidma et trouvez des familles qui ont besoin de vous. Inscription gratuite.
          </p>
          <a href="#footer-form" className="btn btn-primary-custom px-5 py-2">
            Contactez-nous
          </a>
        </div>
      </section>
    </>
  )
}
