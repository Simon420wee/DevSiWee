import { useState } from 'react'
import { motion } from 'framer-motion'
import { Monitor, Layers, Code2, Zap, ArrowRight, Check } from 'lucide-react'
import { translations } from '../i18n'

const ICONS = [Monitor, Layers, Code2, Zap]

const BACK_DATA = {
  en: [
    {
      color: '#38bdf8',
      grad: 'linear-gradient(135deg, rgba(56,189,248,0.18) 0%, rgba(14,165,233,0.08) 100%)',
      body: "We don't use templates. Every site is built from scratch, coded by hand, optimized for speed and search.",
      checks: ['Hand-coded, no page builders', 'Google PageSpeed optimized', 'SEO-ready from day one'],
    },
    {
      color: '#a78bfa',
      grad: 'linear-gradient(135deg, rgba(167,139,250,0.18) 0%, rgba(139,92,246,0.08) 100%)',
      body: "We study your audience before we design. Pages that don't just look good — they sell.",
      checks: ['Conversion-focused layout', 'A/B test ready structure', 'Mobile-first always'],
    },
    {
      color: '#34d399',
      grad: 'linear-gradient(135deg, rgba(52,211,153,0.18) 0%, rgba(16,185,129,0.08) 100%)',
      body: 'Clean architecture, scalable code, zero bloat. Built like we\'ll maintain it forever.',
      checks: ['React / Next.js stack', 'API integrations included', 'Deployed & production ready'],
    },
    {
      color: '#f472b6',
      grad: 'linear-gradient(135deg, rgba(244,114,182,0.18) 0%, rgba(236,72,153,0.08) 100%)',
      body: 'Cinema-quality motion, web-ready performance. Inspired by the world\'s top studios.',
      checks: ['Framer Motion & GSAP', '60fps guaranteed', 'Lightweight, no lag'],
    },
  ],
  srb: [
    {
      color: '#38bdf8',
      grad: 'linear-gradient(135deg, rgba(56,189,248,0.18) 0%, rgba(14,165,233,0.08) 100%)',
      body: 'Ne koristimo template-ove. Svaki sajt je rađen od nule, ručno kodiran i optimizovan.',
      checks: ['Ručno kodiran, bez page builder-a', 'Google PageSpeed optimizovan', 'SEO spreman od prvog dana'],
    },
    {
      color: '#a78bfa',
      grad: 'linear-gradient(135deg, rgba(167,139,250,0.18) 0%, rgba(139,92,246,0.08) 100%)',
      body: 'Proučavamo vašu publiku pre dizajna. Stranice koje ne izgledaju samo dobro — one prodaju.',
      checks: ['Dizajn fokusiran na konverziju', 'Struktura spremna za A/B test', 'Mobile-first uvek'],
    },
    {
      color: '#34d399',
      grad: 'linear-gradient(135deg, rgba(52,211,153,0.18) 0%, rgba(16,185,129,0.08) 100%)',
      body: 'Čista arhitektura, skalabilan kod, nula balasta. Gradimo kao da ćemo to večno održavati.',
      checks: ['React / Next.js stack', 'API integracije uključene', 'Deploy i produkcija spremni'],
    },
    {
      color: '#f472b6',
      grad: 'linear-gradient(135deg, rgba(244,114,182,0.18) 0%, rgba(236,72,153,0.08) 100%)',
      body: 'Filmski kvalitet animacije, performanse za web. Inspirirani najboljim studijima na svetu.',
      checks: ['Framer Motion & GSAP', '60fps garantovano', 'Lagano, bez zastajkivanja'],
    },
  ],
}

const sectionVariants = {
  hidden: { opacity: 0, y: 48 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

function FlipCard({ card, back, index }) {
  const [flipped, setFlipped] = useState(false)
  const Icon = ICONS[index]

  return (
    <motion.div
      className="flip-card"
      custom={index}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      onClick={() => setFlipped(f => !f)}
    >
      <div className={`flip-card__inner${flipped ? ' flip-card__inner--flipped' : ''}`}>

        {/* FRONT */}
        <div className="flip-card__face flip-card__face--front about-card">
          <div className="about-card__icon">
            <Icon size={20} strokeWidth={1.5} />
          </div>
          <h3 className="about-card__title">{card.title}</h3>
          <p className="about-card__body">{card.body}</p>
          <span className="flip-card__hint">tap to flip</span>
        </div>

        {/* BACK */}
        <div
          className="flip-card__face flip-card__face--back"
          style={{ background: back.grad, '--card-color': back.color }}
        >
          <p className="flip-card__back-body">{back.body}</p>

          <ul className="flip-card__checks">
            {back.checks.map((c) => (
              <li key={c} className="flip-card__check-item">
                <span className="flip-card__check-icon" style={{ color: back.color, borderColor: back.color }}>
                  <Check size={11} strokeWidth={2.5} />
                </span>
                {c}
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="flip-card__cta"
            style={{ color: back.color, borderColor: back.color }}
            onClick={e => e.stopPropagation()}
          >
            Start a Project
            <ArrowRight size={14} strokeWidth={2} />
          </a>
        </div>

      </div>
    </motion.div>
  )
}

export default function About({ lang }) {
  const t = translations[lang].about
  const backData = BACK_DATA[lang]

  return (
    <motion.section
      className="section about"
      id="services"
      variants={sectionVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
    >
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">{t.title}</h2>
          <p className="section__body">{t.body}</p>
        </div>

        <div className="about__cards">
          {t.cards.map((card, i) => (
            <FlipCard
              key={card.title}
              card={card}
              back={backData[i]}
              index={i}
            />
          ))}
        </div>
      </div>
    </motion.section>
  )
}
