import { translations } from '../i18n'

export default function Services({ lang }) {
  const t = translations[lang].services

  return (
    <section className="services" id="services" data-screen-label="Services">
      <div className="services-viewport">
        <div className="services-track">
          <div className="service-intro">
            <p className="mono eyebrow">{t.eyebrow}</p>
            <h2>
              <span>{t.titleA}</span>
              <br />
              <span className="accent">{t.titleB}</span>
            </h2>
            <p className="drag-hint mono">{t.hint}</p>
          </div>

          {t.cards.map((card) => (
            <article className="service-card" key={card.num}>
              <span className="num">{card.num}</span>
              <p className="mono s-label">{card.label}</p>
              <h3>{card.title}</h3>
              <p>{card.body}</p>
              <div className="tags">
                {card.tags.map((tag) => <span key={tag}>{tag}</span>)}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
