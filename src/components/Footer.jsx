import { translations } from '../i18n'

export default function Footer({ lang }) {
  const t = translations[lang].footer

  return (
    <footer className="site-footer">
      <a className="nav-logo" href="#home" aria-label="DevSiWee — početna">
        <img src="/logo.png" alt="DevSiWee logo" width="24" height="24" />
        <span>DevSi<span className="wee">Wee</span></span>
      </a>

      <nav className="foot-links-wrap" aria-label={lang === 'en' ? 'Footer navigation' : 'Navigacija u podnožju'}>
        <ul className="foot-links">
          {t.nav.map(({ label, href }) => (
            <li key={href}><a href={href}>{label}</a></li>
          ))}
        </ul>
      </nav>

      <p className="foot-copy">{t.copy}</p>
    </footer>
  )
}
