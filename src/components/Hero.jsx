import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { translations } from '../i18n'

/* ─── Deterministic star field ────────────────────────────── */
const BG_PARTICLES = Array.from({ length: 72 }, (_, i) => ({
  id: i,
  size: (i % 7 === 0) ? 2 : 1,
  left: ((i * 41.3 + 7)  % 97),
  top:  ((i * 27.1 + 13) % 94),
  delay:    (i * 0.19) % 9,
  duration: 2.8 + (i % 9) * 1.1,
}))

const MENU_HREFS = ['#services', '#services', '#tools', '#contact']

const MORPHING_WORDS = {
  en:  ['WEBSITES', 'EXPERIENCES', 'LANDING PAGES', 'DIGITAL FUTURES'],
  srb: ['SAJTOVE', 'ISKUSTVA', 'LANDING STRANE', 'DIGITALNE BUDUĆNOSTI'],
}

function VerticalMenu({ lang, setLang, menuLabels }) {
  return (
    <nav className="hero-vmenu" aria-label="Scene navigation">
      {menuLabels.map((label, i) => (
        <a key={i} href={MENU_HREFS[i]} className="hero-vmenu__item">
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

export default function Hero({ lang, setLang }) {
  const t = translations[lang].hero
  const words = MORPHING_WORDS[lang]
  const [wordIndex, setWordIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 400)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % words.length)
    }, 2200)
    return () => clearInterval(interval)
  }, [words.length])

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

      {/* Left cinematic vertical menu */}
      <VerticalMenu lang={lang} setLang={setLang} menuLabels={t.menu} />

      {/* Core content */}
      <div className="hero__center">
        <div className="hero__text-block">

          {/* Line 1 — split reveal */}
          <div className="hero__headline-wrap" aria-label={`We build ${words[wordIndex]}`}>
            <motion.span
              className="hero__line hero__line--static"
              initial={{ y: 80, opacity: 0 }}
              animate={revealed ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.85, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {lang === 'en' ? 'WE BUILD' : 'PRAVIMO'}
            </motion.span>

            {/* Line 2 — morphing word */}
            <div className="hero__morph-wrap" aria-live="polite">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="hero__line hero__line--morph"
                  initial={{ y: 70, opacity: 0, filter: 'blur(8px)' }}
                  animate={{ y: 0,  opacity: 1, filter: 'blur(0px)' }}
                  exit={{    y: -50, opacity: 0, filter: 'blur(6px)' }}
                  transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  {words[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>

          {/* Subtitle */}
          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            {t.subtitle}
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="hero__ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.a
              href="#contact"
              className="btn btn--primary btn--lg"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {t.cta1}
            </motion.a>
            <motion.a
              href="#services"
              className="btn btn--ghost btn--lg"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {t.cta2}
            </motion.a>
          </motion.div>

        </div>
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
        <a href="#contact" className="hero__bottom-label hero__bottom-label--chat">
          CHAT WITH US
        </a>
      </motion.div>
    </section>
  )
}
