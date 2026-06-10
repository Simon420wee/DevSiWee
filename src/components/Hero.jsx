import { translations } from '../i18n'

/* Splits a string into per-character spans for GSAP stagger reveals. */
function Chars({ text }) {
  return text.split('').map((ch, i) => (
    <span className="ch" key={i}>{ch === ' ' ? ' ' : ch}</span>
  ))
}

export default function Hero({ lang }) {
  const t = translations[lang].hero
  const lines = t.lines

  return (
    <header className="hero" id="home" data-screen-label="Hero">
      <h1 className="hero-title" aria-label={lines.join(' ')}>
        {lines.map((line, i) =>
          i === lines.length - 1 ? (
            <span className="line alive" key={i}>{line}</span>
          ) : (
            <span className="line" key={i} aria-hidden="true"><Chars text={line} /></span>
          )
        )}
      </h1>

      <p className="hero-sub">{t.subtitle}</p>

      <div className="hero-cta">
        <a className="btn" href="#contact">
          <span>{t.cta1}</span>
          <span className="arrow">→</span>
        </a>
        <a className="link-ghost" href="#services">{t.cta2}</a>
      </div>

      <p className="scroll-hint mono">{t.scrollHint}</p>
    </header>
  )
}
