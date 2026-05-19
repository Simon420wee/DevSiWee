import { useEffect, useState } from 'react'
import Lenis from 'lenis'
import Hero from './components/Hero'
import About from './components/About'
import Technologies from './components/Technologies'
import Contact from './components/Contact'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'

export default function App() {
  const [lang, setLang]       = useState('en')
  const [loaded, setLoaded]   = useState(false)

  useEffect(() => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
    return () => lenis.destroy()
  }, [])

  return (
    <>
      {!loaded && <LoadingScreen onDone={() => setLoaded(true)} />}

      <main>
        <Hero lang={lang} setLang={setLang} />
        <About lang={lang} />
        <Technologies lang={lang} />
        <Contact lang={lang} />
      </main>
      <Footer lang={lang} />
    </>
  )
}
