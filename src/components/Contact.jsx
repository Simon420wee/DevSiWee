import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Check, AlertCircle } from 'lucide-react'
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
    <section className="cta contact" id="contact" data-screen-label="CTA">
      <h2 className="cta-title">
        <span>{t.ctaA}</span>{' '}
        <span className="accent">{t.ctaAccent}</span>{' '}
        <span>{t.ctaB}</span>
      </h2>

      <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
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
      </form>

      <p className="cta-note mono">{t.note}</p>
    </section>
  )
}
