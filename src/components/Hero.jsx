import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { translations } from '../i18n'

/* ─── Deterministic star field ────────────────────────────── */
const BG_PARTICLES = Array.from({ length: 54 }, (_, i) => ({
  id: i,
  size: (i % 7 === 0) ? 2 : 1,
  left: ((i * 41.3 + 7)  % 97),
  top:  ((i * 27.1 + 13) % 94),
  delay:    (i * 0.19) % 9,
  duration: 2.8 + (i % 9) * 1.1,
}))

const MORPHING_WORDS = {
  en:  ['WEBSITES', 'EXPERIENCES', 'LANDING PAGES', 'DIGITAL FUTURES'],
  srb: ['SAJTOVE', 'ISKUSTVA', 'LANDING STRANE', 'BUDUĆNOSTI'],
}

const EASE = [0.22, 1, 0.36, 1]

export default function Hero({ lang, setLang }) {
  const t = translations[lang].hero
  const words = MORPHING_WORDS[lang]
  const [wordIndex, setWordIndex] = useState(0)
  const heroRef = useRef(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % words.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [words.length])

  /* Scroll-driven parallax — content drifts up and fades as you scroll past */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const yHeadline = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opHeadline = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const yMeta = useTransform(scrollYProgress, [0, 1], [0, 60])

  const staticLine = lang === 'en' ? 'WE BUILD' : 'PRAVIMO'

  return (
    <section className="hero" id="home" ref={heroRef}>

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

      <div className="hero__glow" aria-hidden="true" />

      <div className="hero__frame">

        {/* Meta row */}
        <motion.div
          className="hero__meta"
          style={{ y: yMeta }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        >
          <span className="hero__meta-item">{t.eyebrow}</span>
          <span className="hero__meta-item hero__meta-item--right">EST. 2024 — EN / SRB</span>
        </motion.div>

        {/* Massive left-anchored headline */}
        <motion.h1
          className="hero__headline-wrap"
          style={{ y: yHeadline, opacity: opHeadline }}
          aria-label={`${staticLine} ${words[wordIndex]}`}
        >
          <span className="hero__line-mask">
            <motion.span
              className="hero__line hero__line--static"
              initial={{ y: '110%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: EASE }}
            >
              {staticLine}
            </motion.span>
          </span>

          <span className="hero__line-mask hero__morph-wrap" aria-live="polite">
            <AnimatePresence mode="wait">
              <motion.span
                key={wordIndex}
                className="hero__line hero__line--morph"
                initial={{ y: '110%' }}
                animate={{ y: 0 }}
                exit={{ y: '-110%' }}
                transition={{ duration: 0.6, ease: EASE }}
              >
                {words[wordIndex]}
              </motion.span>
            </AnimatePresence>
          </span>
        </motion.h1>

        {/* Supporting row — subtitle left, CTAs right */}
        <motion.div
          className="hero__support"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: EASE }}
        >
          <p className="hero__subtitle">{t.subtitle}</p>
          <div className="hero__ctas">
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
          </div>
        </motion.div>

      </div>

      {/* Infinite marquee strip */}
      <motion.div
        className="hero__marquee"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.5 }}
      >
        <div className="hero__marquee-track">
          {[0, 1].map(copy => (
            <div className="hero__marquee-group" key={copy}>
              {t.marquee.map(item => (
                <span className="hero__marquee-item" key={`${copy}-${item}`}>
                  {item}
                  <span className="hero__marquee-diamond" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Bottom bar */}
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
