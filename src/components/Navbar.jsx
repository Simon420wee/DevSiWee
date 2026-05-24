import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { translations } from '../i18n'

function DiamondMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="diamond-grad" x1="0" y1="0" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38bdf8"/>
          <stop offset="50%" stopColor="#a78bfa"/>
          <stop offset="100%" stopColor="#34d399"/>
        </linearGradient>
      </defs>
      <rect x="11" y="1.5" width="13" height="13" rx="2" transform="rotate(45 11 1.5)"
        fill="url(#diamond-grad)"
        style={{filter:'drop-shadow(0 0 6px rgba(56,189,248,0.9)) drop-shadow(0 0 16px rgba(167,139,250,0.5))'}}
      />
    </svg>
  )
}

export default function Navbar({ lang, setLang }) {
  const t = translations[lang].nav
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { key: 'home',     label: t.home,     href: '#home' },
    { key: 'services', label: t.services,  href: '#services' },
    { key: 'pricing',  label: lang === 'en' ? 'Pricing' : 'Cenovnik', href: '#pricing' },
    { key: 'tools',    label: t.tools,    href: '#tools' },
    { key: 'contact',  label: t.contact,  href: '#contact' },
  ]

  return (
    <motion.header
      className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <a href="#home" className="navbar__logo" onClick={() => setActive('home')}>
        <DiamondMark />
        <span className="navbar__logo-text">
          DevSi<span className="navbar__logo-accent">Wee</span>
        </span>
      </a>

      {/* Center links */}
      <nav className="navbar__links">
        {links.map(({ key, label, href }) => (
          <a
            key={key}
            href={href}
            className={`navbar__link${active === key ? ' navbar__link--active' : ''}`}
            onClick={() => setActive(key)}
          >
            {label}
            <span className="navbar__link-glow" aria-hidden="true" />
          </a>
        ))}
      </nav>

      {/* Right side */}
      <div className="navbar__right">
        <div className="lang-switch">
          <button
            className={lang === 'en' ? 'lang-switch__btn active' : 'lang-switch__btn'}
            onClick={() => setLang('en')}
          >EN</button>
          <span className="lang-switch__divider" />
          <button
            className={lang === 'srb' ? 'lang-switch__btn active' : 'lang-switch__btn'}
            onClick={() => setLang('srb')}
          >SRB</button>
        </div>

        <motion.a
          href="#contact"
          className="navbar__cta"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {lang === 'en' ? 'Start a Project' : 'Pokreni Projekat'}
          <span className="navbar__cta-arrow">→</span>
        </motion.a>
      </div>
    </motion.header>
  )
}
