import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, AtSign, Send, Check, AlertCircle } from 'lucide-react'
import { translations } from '../i18n'
import emailjs from '@emailjs/browser'

const SERVICE_ID  = 'service_r2ba0ku'
const TEMPLATE_ID = 'template_9k8pm8d'
const PUBLIC_KEY  = 'Wy2ebKJd-1myCHPZm'

export default function Contact({ lang }) {
  const t = translations[lang].contact
  const formRef = useRef(null)

  const [form, setForm] = useState({ from_name: '', from_email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const items = [
    { icon: Mail,   label: t.email,     href: `https://mail.google.com/mail/?view=cm&to=${t.email}` },
    { icon: AtSign, label: t.instagram, href: `https://mail.google.com/mail/?view=cm&to=${t.email}` },
  ]

  const handleChange = (e) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.from_name || !form.from_email || !form.message) return
    setStatus('sending')

    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        from_name:  form.from_name,
        from_email: form.from_email,
        message:    form.message,
      }, PUBLIC_KEY)

      setStatus('success')
      setForm({ from_name: '', from_email: '', message: '' })
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

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
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="contact-item">
              <span className="contact-item__icon">
                <Icon size={16} strokeWidth={1.5} />
              </span>
              <span>{label}</span>
            </a>
          ))}
        </div>

        {/* Contact Form */}
        <motion.form
          ref={formRef}
          className="contact-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="contact-form__row">
            <div className="contact-form__field">
              <input
                type="text"
                name="from_name"
                value={form.from_name}
                onChange={handleChange}
                placeholder={lang === 'en' ? 'Your name' : 'Vaše ime'}
                className="contact-form__input"
                required
              />
            </div>
            <div className="contact-form__field">
              <input
                type="email"
                name="from_email"
                value={form.from_email}
                onChange={handleChange}
                placeholder={lang === 'en' ? 'Your email' : 'Vaš email'}
                className="contact-form__input"
                required
              />
            </div>
          </div>

          <div className="contact-form__field">
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder={lang === 'en' ? 'Tell us about your project...' : 'Recite nam o vašem projektu...'}
              className="contact-form__input contact-form__textarea"
              rows={4}
              required
            />
          </div>

          <motion.button
            type="submit"
            className="contact-form__btn"
            disabled={status === 'sending'}
            whileHover={{ scale: status === 'idle' ? 1.03 : 1 }}
            whileTap={{ scale: 0.97 }}
          >
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.span key="idle" className="contact-form__btn-inner"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Send size={15} strokeWidth={1.5} />
                  {lang === 'en' ? 'Send Message' : 'Pošalji poruku'}
                </motion.span>
              )}
              {status === 'sending' && (
                <motion.span key="sending" className="contact-form__btn-inner"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <span className="contact-form__spinner" />
                  {lang === 'en' ? 'Sending...' : 'Slanje...'}
                </motion.span>
              )}
              {status === 'success' && (
                <motion.span key="success" className="contact-form__btn-inner contact-form__btn-inner--success"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <Check size={15} strokeWidth={2} />
                  {lang === 'en' ? 'Message sent!' : 'Poruka poslata!'}
                </motion.span>
              )}
              {status === 'error' && (
                <motion.span key="error" className="contact-form__btn-inner contact-form__btn-inner--error"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AlertCircle size={15} strokeWidth={1.5} />
                  {lang === 'en' ? 'Error, try again' : 'Greška, pokušaj ponovo'}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.form>

      </div>
    </motion.section>
  )
}
