import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

const PROJECTS = [
  {
    id: 1,
    tag: 'Landing Page',
    title: 'NovaBrand Studio',
    desc: 'Animated landing page with GSAP scroll effects and custom 3D elements.',
    color: '#38bdf8',
    grad: 'linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(14,165,233,0.05) 100%)',
    year: '2026',
  },
  {
    id: 2,
    tag: 'E-commerce',
    title: 'LuxeStore',
    desc: 'Premium fashion e-commerce with smooth transitions and immersive product pages.',
    color: '#a78bfa',
    grad: 'linear-gradient(135deg, rgba(167,139,250,0.15) 0%, rgba(139,92,246,0.05) 100%)',
    year: '2025',
  },
  {
    id: 3,
    tag: 'Web App',
    title: 'FlowDash',
    desc: 'SaaS dashboard with real-time data visualization and dark UI design system.',
    color: '#34d399',
    grad: 'linear-gradient(135deg, rgba(52,211,153,0.15) 0%, rgba(16,185,129,0.05) 100%)',
    year: '2025',
  },
]

export default function Portfolio({ lang }) {
  const isEn = lang === 'en'

  return (
    <motion.section
      className="section portfolio"
      id="portfolio"
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="section__inner">
        <div className="section__header">
          <p className="portfolio__eyebrow">// {isEn ? 'selected work' : 'odabrani radovi'}</p>
          <h2 className="section__title">{isEn ? 'Our Work' : 'Naši Radovi'}</h2>
          <p className="section__body">
            {isEn
              ? 'A selection of projects we are proud of.'
              : 'Izbor projekata kojima smo ponosni.'}
          </p>
        </div>

        <div className="portfolio__grid">
          {PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              className="portfolio-card"
              style={{ '--card-color': project.color, background: project.grad }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8, transition: { duration: 0.25 } }}
            >
              {/* Mock browser window */}
              <div className="portfolio-card__preview">
                <div className="portfolio-card__browser-bar">
                  <span className="portfolio-card__dot" style={{ background: '#ff5f57' }} />
                  <span className="portfolio-card__dot" style={{ background: '#febc2e' }} />
                  <span className="portfolio-card__dot" style={{ background: '#28c840' }} />
                  <span className="portfolio-card__url">devsiwee.com/{project.title.toLowerCase().replace(' ', '-')}</span>
                </div>
                <div className="portfolio-card__screen">
                  <div className="portfolio-card__screen-glow" style={{ background: project.color }} />
                  <div className="portfolio-card__screen-lines">
                    {Array.from({ length: 6 }).map((_, j) => (
                      <div key={j} className="portfolio-card__screen-line"
                        style={{ width: `${60 + (j % 3) * 20}%`, opacity: 0.15 + (j % 2) * 0.1 }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Card info */}
              <div className="portfolio-card__info">
                <div className="portfolio-card__meta">
                  <span className="portfolio-card__tag" style={{ color: project.color, borderColor: project.color }}>
                    {project.tag}
                  </span>
                  <span className="portfolio-card__year">{project.year}</span>
                </div>
                <h3 className="portfolio-card__title">{project.title}</h3>
                <p className="portfolio-card__desc">{project.desc}</p>
                <div className="portfolio-card__arrow">
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
