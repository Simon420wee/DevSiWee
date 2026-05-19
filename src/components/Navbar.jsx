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

  return (
    <header className="navbar">
      <a href="#home" className="navbar__logo">
        <BrandMark />
        <span className="navbar__logo-text">DevSiWee</span>
      </a>

      <nav className="navbar__links">
        <a href="#home">{t.home}</a>
        <a href="#services">{t.services}</a>
        <a href="#tools">{t.tools}</a>
        <a href="#contact">{t.contact}</a>
      </nav>

      <div className="lang-switch">
        <button
          className={lang === 'en' ? 'lang-switch__btn active' : 'lang-switch__btn'}
          onClick={() => setLang('en')}
        >
          EN
        </button>
        <span className="lang-switch__divider" />
        <button
          className={lang === 'srb' ? 'lang-switch__btn active' : 'lang-switch__btn'}
          onClick={() => setLang('srb')}
        >
          SRB
        </button>
      </div>
    </header>
  )
}
