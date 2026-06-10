import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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

const EASE = [0.22, 1, 0.36, 1]

export default function Hero({ lang, setLang }) {
  const t = translations[lang].hero
  const heroRef = useRef(null)

  /* Content drifts up and fades as you scroll past */
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opContent = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section className="hero" id="home" ref={heroRef}>

      {/* ── Animated gradient mesh background ── */}
      <div className="hero__mesh" aria-hidden="true">
        <span className="hero__blob hero__blob--cyan" />
        <span className="hero__blob hero__blob--violet" />
        <span className="hero__blob hero__blob--emerald" />
        <span className="hero__blob hero__blob--rose" />
      </div>
      <div className="hero__noise" aria-hidden="true" />

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

      {/* ── Minimal centered content ── */}
      <motion.div
        className="hero__minimal"
        style={{ y: yContent, opacity: opContent }}
      >
        <motion.span
          className="hero__eyebrow-min"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: EASE }}
        >
          {t.eyebrow}
        </motion.span>

        <h1 className="hero__title">
          <span className="hero__title-mask">
            <motion.span
              className="hero__title-line"
              initial={{ y: '108%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.45, ease: EASE }}
            >
              {t.title1}
            </motion.span>
          </span>
          <span className="hero__title-mask">
            <motion.span
              className="hero__title-line hero__title-line--accent"
              initial={{ y: '108%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1, delay: 0.6, ease: EASE }}
            >
              {t.title2}
            </motion.span>
          </span>
        </h1>

        <motion.p
          className="hero__subtitle"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.0, ease: EASE }}
        >
          {t.subtitle}
        </motion.p>

        <motion.div
          className="hero__ctas"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.15, ease: EASE }}
        >
          <motion.a
            href="#contact"
            className="btn btn--primary btn--lg"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            {t.cta1}
          </motion.a>
          <a href="#services" className="hero__link">
            {t.cta2} <span className="hero__link-arrow">→</span>
          </a>
        </motion.div>
      </motion.div>

      {/* ── Bottom bar ── */}
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
