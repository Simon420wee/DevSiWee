import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { translations } from '../i18n'

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Pricing({ lang }) {
  const t = translations[lang].pricing

  return (
    <motion.section
      className="section pricing"
      id="pricing"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section__inner">
        <div className="section__header">
          <p className="pricing__eyebrow">{t.eyebrow}</p>
          <h2 className="section__title">{t.title}</h2>
          <p className="section__body">{t.subtitle}</p>
        </div>

        <div className="pricing__grid">
          {t.plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              className={`pricing-card${plan.featured ? ' pricing-card--featured' : ''}`}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              viewport={{ once: true, margin: '-40px' }}
            >
              {plan.featured && (
                <div className="pricing-card__badge">{t.badge}</div>
              )}

              <div className="pricing-card__header">
                <span className="pricing-card__name">{plan.name}</span>
                <p className="pricing-card__tagline">{plan.tagline}</p>
              </div>

              <div className="pricing-card__price">
                <span className="pricing-card__currency">€</span>
                <span className="pricing-card__amount">{plan.price}</span>
                {plan.suffix && (
                  <span className="pricing-card__suffix">{plan.suffix}</span>
                )}
              </div>

              <ul className="pricing-card__features">
                {plan.features.map((f) => (
                  <li key={f} className="pricing-card__feature">
                    <span className="pricing-card__check">
                      <Check size={12} strokeWidth={2.5} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              <motion.a
                href="#contact"
                className={`btn btn--lg pricing-card__cta${plan.featured ? ' btn--primary' : ' btn--ghost'}`}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {t.cta}
              </motion.a>
            </motion.div>
          ))}
        </div>

        {/* Extra services row */}
        <div className="pricing__extras">
          {t.extras.map((extra, i) => (
            <motion.div
              key={extra.name}
              className="pricing-extra"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="pricing-extra__name">{extra.name}</span>
              <span className="pricing-extra__price">{extra.price}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
