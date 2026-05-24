import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { translations } from '../i18n'

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-mark__inner" />
    </span>
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
        <BrandMark />
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
