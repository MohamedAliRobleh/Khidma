// src/pages/About.jsx
import { motion } from 'framer-motion'

export default function About() {
  return (
    <div style={{ background: 'var(--bg-primary)' }}>
      {/* Hero */}
      <div className="py-5" style={{ background: 'var(--secondary)', color: '#fff' }}>
        <div className="container py-3">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem' }}>À propos de Khidma</h1>
            <p style={{ opacity: 0.8, maxWidth: 600, marginBottom: 0, fontSize: '1.1rem' }}>
              La mission : connecter les familles djiboutiennes avec des aides de confiance, rapidement et facilement.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row g-5 align-items-center">
          <div className="col-lg-6">
            <h2 style={{ fontFamily: 'var(--font-heading)' }} className="mb-4">Notre mission</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Khidma (خدمة) est née d'un constat simple : trouver une bonne de confiance à Djibouti relevait du bouche-à-oreille, long, incertain, et parfois décevant.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Notre plateforme centralise les profils vérifiés, les avis authentiques et les conditions de travail claires — pour que chaque famille puisse prendre une décision éclairée, et que chaque travailleuse puisse valoriser son savoir-faire.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Le contact reste direct : pas d'intermédiaire, pas de commission. Vous parlez directement à la personne.
            </p>
          </div>
          <div className="col-lg-6">
            <div className="row g-3">
              {[
                { icon: '✅', title: 'Profils vérifiés', desc: 'Chaque profil est contrôlé avant publication.' },
                { icon: '⭐', title: 'Avis authentiques', desc: 'Les avis viennent de vraies familles.' },
                { icon: '📞', title: 'Contact direct', desc: 'Appelez ou WhatsApp sans intermédiaire.' },
                { icon: '🔒', title: 'Gratuit', desc: 'Aucune commission, aucun frais caché.' },
              ].map(({ icon, title, desc }) => (
                <div key={title} className="col-6">
                  <div className="card-khidma p-3 h-100">
                    <div style={{ fontSize: '1.8rem', marginBottom: 8 }}>{icon}</div>
                    <h6 style={{ fontFamily: 'var(--font-heading)', marginBottom: 4 }}>{title}</h6>
                    <p className="mb-0 small" style={{ color: 'var(--text-secondary)' }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
