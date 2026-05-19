import { motion } from 'framer-motion'
import { translations } from '../i18n'

const TOOLS = [
  { name: 'HTML',              color: '#fb923c' },
  { name: 'CSS',               color: '#38bdf8' },
  { name: 'JavaScript',        color: '#facc15' },
  { name: 'React',             color: '#61dafb' },
  { name: 'Tailwind CSS',      color: '#06b6d4' },
  { name: 'Framer Motion',     color: '#a78bfa' },
  { name: 'Vite',              color: '#c084fc' },
  { name: 'Figma',             color: '#f472b6' },
  { name: 'GitHub',            color: '#e2e8f0' },
  { name: 'WordPress',         color: '#60a5fa' },
  { name: 'SEO',               color: '#34d399' },
  { name: 'Responsive Design', color: '#38bdf8' },
]

export default function Technologies({ lang }) {
  const t = translations[lang].tools

  return (
    <motion.section
      className="section tools"
      id="tools"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section__inner">
        <div className="section__header">
          <h2 className="section__title">{t.title}</h2>
        </div>

        <div className="tools__grid">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.name}
              className="tool-pill"
              style={{ '--pill-color': tool.color }}
              animate={{ y: [0, -(6 + (i % 3) * 3), 0] }}
              transition={{
                duration: 2.8 + (i % 5) * 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: (i * 0.22) % 2.5,
              }}
              whileHover={{ scale: 1.1, y: -10, transition: { duration: 0.2 } }}
            >
              <span className="tool-pill__dot" />
              {tool.name}
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
