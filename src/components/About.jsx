import { motion } from 'framer-motion'
import { Monitor, Layers, Code2, Zap } from 'lucide-react'
import { translations } from '../i18n'

const ICONS = [Monitor, Layers, Code2, Zap]

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function About({ lang }) {
  const t = translations[lang].about

  return (
    <motion.section
      className="section about"
      id="services"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">{t.title}</h2>
          <p className="section__body">{t.body}</p>
        </div>

        <div className="about__cards">
          {t.cards.map((card, i) => {
            const Icon = ICONS[i]
            return (
              <motion.div
                key={card.title}
                className="about-card"
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                viewport={{ once: true, margin: '-40px' }}
              >
                <div className="about-card__icon">
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <h3 className="about-card__title">{card.title}</h3>
                <p className="about-card__body">{card.body}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
