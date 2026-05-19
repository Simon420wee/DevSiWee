import { motion } from 'framer-motion'
import { Mail, AtSign } from 'lucide-react'
import { translations } from '../i18n'

export default function Contact({ lang }) {
  const t = translations[lang].contact

  const items = [
    { icon: Mail,   label: t.email,     href: `mailto:${t.email}` },
    { icon: AtSign, label: t.instagram, href: 'https://instagram.com/devsiwee' },
  ]

  return (
    <motion.section
      className="section contact"
      id="contact"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section__inner contact__inner">
        <h2 className="section__title">{t.title}</h2>
        <p className="section__body">{t.body}</p>

        <div className="contact__items">
          {items.map(({ icon: Icon, label, href }) => (
            <a key={label} href={href} className="contact-item">
              <span className="contact-item__icon">
                <Icon size={16} strokeWidth={1.5} />
              </span>
              <span>{label}</span>
            </a>
          ))}
        </div>

        <motion.a
          href={`https://mail.google.com/mail/?view=cm&to=${t.email}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--primary btn--lg"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {t.cta}
        </motion.a>
      </div>
    </motion.section>
  )
}
