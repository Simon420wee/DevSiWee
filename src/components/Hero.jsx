import { useState, useEffect, useRef } from 'react'
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

const MORPHING_WORDS = {
  en:  ['WEBSITES', 'EXPERIENCES', 'LANDING PAGES', 'DIGITAL FUTURES'],
  srb: ['SAJTOVE', 'ISKUSTVA', 'LANDING STRANE', 'DIGITALNE BUDUĆNOSTI'],
}

const EASE = [0.22, 1, 0.36, 1]

/* Per-letter animated word */
function Chars({ word, className = '', baseDelay = 0, stagger = 0.035, from }) {
  return word.split('').map((ch, i) => (
    <motion.span
      key={`${word}-${i}`}
      className={`hero__char ${className}`}
      style={{ '--char-i': i }}
      initial={from}
      animate={{ y: 0, opacity: 1, rotate: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.7, delay: baseDelay + i * stagger, ease: EASE }}
      aria-hidden="true"
    >
      {ch === ' ' ? ' ' : ch}
    </motion.span>
  ))
}

export default function Hero({ lang, setLang }) {
  const t = translations[lang].hero
  const words = MORPHING_WORDS[lang]
  const [wordIndex, setWordIndex] = useState(0)
  const sceneRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % words.length)
    }, 2600)
    return () => clearInterval(interval)
  }, [words.length])

  /* Mouse parallax — drives --mx / --my consumed by CSS layers */
  useEffect(() => {
    if (window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return
    let tx = 0, ty = 0, cx = 0, cy = 0, raf

    const onMove = (e) => {
      tx = e.clientX / window.innerWidth  - 0.5
      ty = e.clientY / window.innerHeight - 0.5
    }
    const tick = () => {
      cx += (tx - cx) * 0.06
      cy += (ty - cy) * 0.06
      const el = sceneRef.current
      if (el) {
        el.style.setProperty('--mx', cx.toFixed(4))
        el.style.setProperty('--my', cy.toFixed(4))
      }
      raf = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  const staticLine = lang === 'en' ? 'WE BUILD' : 'PRAVIMO'

  return (
    <section className="hero" id="home" ref={sceneRef}>

      {/* ── Atmosphere layers ── */}
      <div className="hero__parallax hero__parallax--far" aria-hidden="true">
        <span className="hero__aurora hero__aurora--1" />
        <span className="hero__aurora hero__aurora--2" />
        <span className="hero__aurora hero__aurora--3" />
      </div>

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

      <span className="hero__comet hero__comet--1" aria-hidden="true" />
      <span className="hero__comet hero__comet--2" aria-hidden="true" />
      <span className="hero__comet hero__comet--3" aria-hidden="true" />

      <div className="hero__grid-floor" aria-hidden="true" />
      <div className="hero__horizon" aria-hidden="true" />
      <div className="hero__spotlight" aria-hidden="true" />
      <div className="hero__halo" aria-hidden="true" />

      {/* ── Core content ── */}
      <div className="hero__center hero__parallax--near">
        <div className="hero__text-block">

          <motion.span
            className="hero__eyebrow"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            {t.eyebrow}
          </motion.span>

          <h1 className="hero__headline-wrap" aria-label={`${staticLine} ${words[wordIndex]}`}>
            <span className="hero__line hero__line--static">
              <Chars
                word={staticLine}
                baseDelay={0.4}
                stagger={0.05}
                from={{ y: '105%', opacity: 0, rotate: 5 }}
              />
            </span>

            <span className="hero__morph-wrap" aria-live="polite" style={{ overflow: 'visible' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="hero__line hero__line--morph"
                  exit={{ y: -44, opacity: 0, filter: 'blur(8px)' }}
                  transition={{ duration: 0.38, ease: EASE }}
                >
                  <Chars
                    word={words[wordIndex]}
                    className="hero__char--grad"
                    baseDelay={0.05}
                    stagger={0.03}
                    from={{ y: 56, opacity: 0, filter: 'blur(8px)' }}
                  />
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>

          <motion.p
            className="hero__subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0, ease: EASE }}
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            className="hero__ctas"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: EASE }}
          >
            <motion.a
              href="#contact"
              className="btn btn--primary btn--lg hero__cta-shine"
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

          <motion.ul
            className="hero__stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          >
            {t.stats.map(s => <li key={s}>{s}</li>)}
          </motion.ul>

        </div>
      </div>

      {/* ── Bottom cinematic bar ── */}
      <motion.div
        className="hero__bottom-bar"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1.2 }}
      >
        <span className="hero__bottom-label hero__bottom-label--scroll">
          {t.scroll}
        </span>
        <span className="hero__scroll-line" aria-hidden="true" />
        <a href="#contact" className="hero__bottom-label hero__bottom-label--chat">
          CHAT WITH US
        </a>
      </motion.div>
    </section>
  )
}
