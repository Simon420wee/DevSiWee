import { useEffect, useState, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from './components/Navbar'
import Starfield from './components/Starfield'
import Hero from './components/Hero'
import Manifesto from './components/Manifesto'
import Services from './components/Services'
import Stack from './components/Stack'
import Pricing from './components/Pricing'
import Contact from './components/Contact'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [lang, setLang]     = useState('en')
  const [loaded, setLoaded] = useState(false)
  const rootRef = useRef(null)
  const progressRef = useRef(null)

  /* ── Lenis smooth scroll, driven through GSAP ticker so ScrollTrigger stays in sync ── */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: !reduced })

    lenis.on('scroll', ScrollTrigger.update)
    const onTick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    /* In-page anchor links scroll through Lenis */
    const onAnchorClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')
      if (id.length < 2) return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: 0 })
    }
    document.addEventListener('click', onAnchorClick)

    /* Scroll progress bar */
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? window.scrollY / max : 0
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()

    return () => {
      document.removeEventListener('click', onAnchorClick)
      window.removeEventListener('scroll', onScroll)
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  /* ── Scroll choreography (rebuilds when language swaps split text nodes) ── */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const mobile = window.matchMedia('(max-width: 860px)').matches

    const ctx = gsap.context(() => {
      /* Hero entrance */
      gsap.from('.hero-title .ch', {
        yPercent: 110, opacity: 0, duration: 0.9, ease: 'power4.out',
        stagger: { each: 0.025, from: 'start' }, delay: 0.15,
      })
      gsap.from('.hero-title .alive', {
        yPercent: 60, opacity: 0, scale: 0.9, duration: 1, ease: 'power4.out', delay: 0.55,
      })
      gsap.from('.eyebrow, .hero-sub, .hero-cta, .scroll-hint', {
        opacity: 0, y: 24, duration: 0.8, ease: 'power2.out', stagger: 0.12, delay: 0.7,
      })

      /* Hero warp-out: fly through the word ALIVE */
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.hero', start: 'top top', end: '+=180%',
          scrub: 0.6, pin: true, anticipatePin: 1,
        },
      })
      heroTl
        .to('.eyebrow, .hero-sub, .hero-cta, .scroll-hint', { opacity: 0, y: -40, duration: 0.18 }, 0)
        .to('.hero-title .line:nth-child(1)', { xPercent: -34, opacity: 0, duration: 0.45 }, 0.04)
        .to('.hero-title .line:nth-child(2)', { xPercent: 26, opacity: 0, duration: 0.45 }, 0.1)
        .to('.hero-title .line:nth-child(3)', { xPercent: -22, opacity: 0, duration: 0.45 }, 0.16)
        .to('.hero-title .alive', { scale: 13, opacity: 0, transformOrigin: '50% 52%', ease: 'power2.in', duration: 0.7 }, 0.22)

      /* Manifesto: words ignite one by one */
      const words = document.querySelectorAll('.manifesto-text .w')
      if (words.length) {
        gsap.fromTo(words,
          { opacity: 0.1, filter: 'blur(3px)' },
          {
            opacity: 1, filter: 'blur(0px)', stagger: 0.35, ease: 'none',
            scrollTrigger: { trigger: '.manifesto', start: 'top 70%', end: 'bottom 85%', scrub: 0.4 },
          })
      }

      /* Services: vertical scroll drives horizontal track (desktop) */
      if (!mobile) {
        const track = document.querySelector('.services-track')
        if (track) {
          const getDist = () => track.scrollWidth - window.innerWidth
          gsap.to(track, {
            x: () => -getDist(), ease: 'none',
            scrollTrigger: {
              trigger: '.services', start: 'top top',
              end: () => '+=' + getDist(),
              scrub: 0.5, pin: true, anticipatePin: 1, invalidateOnRefresh: true,
            },
          })
          document.querySelectorAll('.service-card .num').forEach((num) => {
            gsap.fromTo(num, { x: 80 }, {
              x: -40, ease: 'none',
              scrollTrigger: {
                trigger: '.services', start: 'top top',
                end: () => '+=' + getDist(), scrub: 0.8,
              },
            })
          })
        }
      } else {
        gsap.utils.toArray('.service-card').forEach((card) => {
          gsap.from(card, {
            opacity: 0, y: 60, duration: 0.8, ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 85%' },
          })
        })
      }

      /* Stack marquees: opposite directions, scroll-scrubbed */
      gsap.utils.toArray('.marquee').forEach((row, i) => {
        const dir = i % 2 === 0 ? 1 : -1
        gsap.fromTo(row, { xPercent: dir * -6 }, {
          xPercent: dir * -26, ease: 'none',
          scrollTrigger: { trigger: '.stack', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        })
      })
      gsap.from('.stack-head', {
        opacity: 0, y: 40, duration: 0.8, ease: 'power2.out',
        scrollTrigger: { trigger: '.stack', start: 'top 70%' },
      })

      /* CTA / contact: rises and locks in */
      gsap.from('.cta-title', {
        scale: 0.72, opacity: 0, ease: 'power2.out',
        scrollTrigger: { trigger: '.contact', start: 'top 80%', end: 'top 25%', scrub: 0.5 },
      })
    }, rootRef)

    ScrollTrigger.refresh()
    return () => ctx.revert()
  }, [lang])

  /* ── Magnetic buttons (desktop, motion-allowed) ── */
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 860px)').matches
    if (reduced || mobile) return

    const btns = Array.from(document.querySelectorAll('.btn'))
    const cleanups = btns.map((btn) => {
      const move = (e) => {
        const r = btn.getBoundingClientRect()
        const dx = e.clientX - r.left - r.width / 2
        const dy = e.clientY - r.top - r.height / 2
        btn.style.transform = `translate(${dx * 0.25}px, ${dy * 0.35}px)`
      }
      const leave = () => {
        btn.style.transform = 'translate(0,0)'
        btn.style.transition = 'transform .45s cubic-bezier(.2,1,.3,1), box-shadow .3s'
        setTimeout(() => { btn.style.transition = 'box-shadow .3s' }, 460)
      }
      btn.addEventListener('mousemove', move)
      btn.addEventListener('mouseleave', leave)
      return () => {
        btn.removeEventListener('mousemove', move)
        btn.removeEventListener('mouseleave', leave)
      }
    })
    return () => cleanups.forEach((fn) => fn())
  }, [lang, loaded])

  return (
    <div ref={rootRef}>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <Starfield />
      <div className="grain" aria-hidden="true" />
      <div className="progress" id="progress" ref={progressRef} aria-hidden="true" />

      <Navbar lang={lang} setLang={setLang} />
      <main>
        <Hero lang={lang} />
        <Manifesto lang={lang} />
        <Services lang={lang} />
        <Stack lang={lang} />
        <Pricing lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </div>
  )
}
