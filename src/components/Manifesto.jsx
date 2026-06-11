import { Fragment } from 'react'
import { translations } from '../i18n'

export default function Manifesto({ lang }) {
  const text = translations[lang].manifesto
  const words = text.trim().split(/\s+/)

  return (
    <section className="manifesto" data-screen-label="Manifesto" aria-label={lang === 'en' ? 'Our approach' : 'Naš pristup'}>
      <p className="manifesto-text">
        {words.map((w, i) => (
          <Fragment key={i}>
            <span className="w">{w}</span>
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </p>
    </section>
  )
}
