import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [visible, setVisible]   = useState(true)

  useEffect(() => {
    /* Animate progress bar from 0 → 100 over ~1.8s */
    const start = performance.now()
    const duration = 1800

    const tick = (now) => {
      const elapsed = now - start
      const pct = Math.min(100, (elapsed / duration) * 100)
      setProgress(pct)

      if (pct < 100) {
        requestAnimationFrame(tick)
      } else {
        /* Short pause at 100%, then fade out */
        setTimeout(() => {
          setVisible(false)
          setTimeout(onDone, 600)
        }, 280)
      }
    }

    requestAnimationFrame(tick)
  }, [onDone])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeInOut' }}
        >
          {/* Corner brackets */}
          <span className="ls-bracket ls-bracket--tl" />
          <span className="ls-bracket ls-bracket--tr" />
          <span className="ls-bracket ls-bracket--bl" />
          <span className="ls-bracket ls-bracket--br" />

          <div className="ls-content">
            {/* Main wordmark */}
            <motion.h1
              className="ls-wordmark"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              DevSi<span className="ls-wordmark__accent">Wee</span>
            </motion.h1>

            {/* Progress bar */}
            <motion.div
              className="ls-bar-wrap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.4 }}
            >
              <div className="ls-bar">
                <div className="ls-bar__fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="ls-bar__pct">{Math.round(progress)}%</span>
            </motion.div>

            {/* Status text */}
            <motion.p
              className="ls-status"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.4 }}
            >
              {progress < 60 ? 'INITIALIZING' : progress < 95 ? 'LOADING ASSETS' : 'READY'}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
