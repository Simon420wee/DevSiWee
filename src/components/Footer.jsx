import { translations } from '../i18n'

export default function Footer({ lang }) {
  const t = translations[lang].footer

  return (
    <footer className="site-footer">
      <a className="nav-logo" href="#home">
        <img src="/logo.png" alt="DevSiWee logo" />
        <span>DevSi<span className="wee">Wee</span></span>
      </a>

      <ul className="foot-links">
        {t.nav.map(({ label, href }) => (
          <li key={href}><a href={href}>{label}</a></li>
        ))}
      </ul>

      <p className="foot-copy">{t.copy}</p>
    </footer>
  )
}
