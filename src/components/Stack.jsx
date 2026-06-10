import { translations } from '../i18n'

/* Builds a row's inner content: items repeated twice, each followed by a ✦ separator. */
function RowInner({ items }) {
  const doubled = [...items, ...items]
  return (
    <span className="row-inner">
      {doubled.map((item, i) => (
        <span key={i}>
          {item}<span className="sep">✦</span>
        </span>
      ))}
    </span>
  )
}

export default function Stack({ lang }) {
  const t = translations[lang].stack

  return (
    <section className="stack" id="stack" data-screen-label="Stack">
      <div className="stack-head">
        <p className="mono">{t.eyebrow}</p>
        <h2>{t.title}</h2>
      </div>
      <div className="marquee-band">
        {t.rows.map((row, i) => (
          <div className={`marquee${i === 1 ? ' solid' : ''}`} key={i} aria-hidden="true">
            <RowInner items={row} />
          </div>
        ))}
      </div>
    </section>
  )
}
