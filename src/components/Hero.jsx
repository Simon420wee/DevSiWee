import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { translations } from '../i18n'

const HeroCube3D = lazy(() => import('./HeroCube3D'))

/* ─── Deterministic star field ────────────────────────────── */
// More stars, mix of 1px and 2px, all white-blue for space realism
const BG_PARTICLES = Array.from({ length: 72 }, (_, i) => ({
  id: i,
  size: (i % 7 === 0) ? 2 : 1,
  left: ((i * 41.3 + 7)  % 97),
  top:  ((i * 27.1 + 13) % 94),
  delay:    (i * 0.19) % 9,
  duration: 2.8 + (i % 9) * 1.1,
}))

/* ─── Left vertical menu ──────────────────────────────────── */
const MENU_HREFS = ['#services', '#services', '#tools', '#contact']

function VerticalMenu({ lang, setLang, menuLabels }) {
  return (
    <nav className="hero-vmenu" aria-label="Scene navigation">
      {menuLabels.map((label, i) => (
        <a
          key={i}
          href={MENU_HREFS[i]}
          className="hero-vmenu__item"
        >
          <span className="hero-vmenu__indicator" aria-hidden="true" />
          <span className="hero-vmenu__label">{label}</span>
        </a>
      ))}

      <div className="hero-vmenu__lang">
        <button
          className={`hero-vmenu__lang-btn${lang === 'en' ? ' active' : ''}`}
          onClick={() => setLang('en')}
        >EN</button>
        <span className="hero-vmenu__lang-sep">/</span>
        <button
          className={`hero-vmenu__lang-btn${lang === 'srb' ? ' active' : ''}`}
          onClick={() => setLang('srb')}
        >SRB</button>
      </div>
    </nav>
  )
}

/* EnergyStreaks removed — space atmosphere is now handled by
   CSS nebula gradients + Three.js StarField / SpaceDebris / DistantPlanet */

/* ─── Hero ───────────────────────────────────────────────── */
export default function Hero({ lang, setLang }) {
  const t = translations[lang].hero

  return (
    <section className="hero" id="home">
      {/* Background star-field */}
      <div className="particles" aria-hidden="true">
        {BG_PARTICLES.map(p => (
          <span
            key={p.id}
            className="particle"
            style={{
              width:             p.size,
              height:            p.size,
              left:              `${p.left}%`,
              top:               `${p.top}%`,
              animationDelay:    `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Energy streaks removed — space elements live in the Three.js scene */}

      {/* Left cinematic vertical menu */}
      <VerticalMenu lang={lang} setLang={setLang} menuLabels={t.menu} />

      {/* Core content — cube only */}
      <div className="hero__center">
        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.72 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={null}>
            <HeroCube3D />
          </Suspense>
        </motion.div>
      </div>

      {/* Bottom cinematic labels */}
      <motion.div
        className="hero__bottom-bar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1.2 }}
      >
        <span className="hero__bottom-label hero__bottom-label--scroll">
          {t.scroll}
        </span>
        <span className="hero__bottom-label">CHAT WITH US</span>
      </motion.div>
    </section>
  )
}
