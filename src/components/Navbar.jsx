import { useState, useEffect } from 'react'
import { translations } from '../i18n'

export default function Navbar({ lang, setLang }) {
  const t = translations[lang].nav
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: t.services, href: '#services' },
    { label: lang === 'en' ? 'Stack' : 'Tehnologije', href: '#stack' },
    { label: lang === 'en' ? 'Pricing' : 'Cenovnik', href: '#pricing' },
    { label: t.contact, href: '#contact' },
  ]

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav" aria-label={lang === 'en' ? 'Main navigation' : 'Glavna navigacija'}>
      <a className="nav-logo" href="#home" aria-label="DevSiWee — početna">
        <img src="/logo.png" alt="DevSiWee logo" width="30" height="30" />
        <span>DevSi<span className="wee">Wee</span></span>
      </a>

      <ul className="nav-links">
        {links.map(({ label, href }) => (
          <li key={href}><a href={href}>{label}</a></li>
        ))}
      </ul>

      <div className="nav-right">
        <div className="lang-toggle">
          <button
            type="button"
            className={lang === 'en' ? 'active' : ''}
            onClick={() => setLang('en')}
          >EN</button>
          <button
            type="button"
            className={lang === 'srb' ? 'active' : ''}
            onClick={() => setLang('srb')}
          >SR</button>
        </div>
        <a className="btn btn-nav" href="#contact">
          <span>{lang === 'en' ? 'Start a project' : 'Započni projekat'}</span>
          <span className="arrow">→</span>
        </a>
      </div>
    </nav>
  )
}
