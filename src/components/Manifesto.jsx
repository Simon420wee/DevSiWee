import { translations } from '../i18n'

export default function Manifesto({ lang }) {
  const text = translations[lang].manifesto
  const words = text.trim().split(/\s+/)

  return (
    <section className="manifesto" data-screen-label="Manifesto">
      <p className="manifesto-text">
        {words.map((w, i) => (
          <span className="w" key={i}>
            {w}{i < words.length - 1 ? ' ' : ''}
          </span>
        ))}
      </p>
    </section>
  )
}
