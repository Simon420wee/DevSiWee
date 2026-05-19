import { translations } from '../i18n'

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <span className="brand-mark__inner" />
    </span>
  )
}

export default function Footer({ lang }) {
  const t = translations[lang].footer

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <a href="#home" className="footer__logo">
            <BrandMark />
            <span>DevSiWee</span>
          </a>
          <p className="footer__tagline">{t.tagline}</p>
        </div>

        <nav className="footer__nav">
          {t.nav.map(({ label, href }) => (
            <a key={label} href={href}>{label}</a>
          ))}
        </nav>

        <p className="footer__copy">{t.copy}</p>
      </div>
    </footer>
  )
}
