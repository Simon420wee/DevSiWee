import { useEffect, useRef } from 'react'

/* Warp starfield — stars fly toward the viewer; scrolling adds hyperspace warp.
   Self-contained: owns its own rAF loop, resize, scroll and mouse listeners. */
export default function Starfield() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const mobile = window.matchMedia('(max-width: 860px)').matches

    let W, H, CX, CY
    let stars = []
    const density = mobile ? 180 : 320
    let warp = 0
    let mouseX = 0, mouseY = 0
    let raf

    const cssVar = (n) =>
      getComputedStyle(document.documentElement).getPropertyValue(n).trim()
    let tints = ['#ffffff', '#ffffff', '#ffffff', cssVar('--c1'), cssVar('--c2'), cssVar('--c3')]

    const resize = () => {
      W = canvas.width = window.innerWidth
      H = canvas.height = window.innerHeight
      CX = W / 2; CY = H / 2
    }

    const makeStar = (z) => ({
      x: (Math.random() - 0.5) * W * 2.4,
      y: (Math.random() - 0.5) * H * 2.4,
      z: z !== undefined ? z : Math.random() * 1000 + 1,
      pz: 0,
      tint: tints[(Math.random() * tints.length) | 0],
    })

    const tick = () => {
      ctx.clearRect(0, 0, W, H)
      const speed = reduced ? 0.4 : 1.6 + warp
      warp *= 0.93
      const ox = mouseX * 18, oy = mouseY * 18

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]
        s.pz = s.z
        s.z -= speed
        if (s.z <= 1) { stars[i] = makeStar(1000); continue }

        const k = 320 / s.z, pk = 320 / s.pz
        const x = CX + s.x * k + ox, y = CY + s.y * k + oy
        const px = CX + s.x * pk + ox, py = CY + s.y * pk + oy
        if (x < -50 || x > W + 50 || y < -50 || y > H + 50) { stars[i] = makeStar(1000); continue }

        const a = Math.min(1, (1000 - s.z) / 900) * 0.85
        const r = Math.max(0.3, 1.7 * (1 - s.z / 1000))

        if (speed > 6) {
          ctx.strokeStyle = s.tint
          ctx.globalAlpha = a * 0.8
          ctx.lineWidth = r
          ctx.beginPath()
          ctx.moveTo(px, py)
          ctx.lineTo(x, y)
          ctx.stroke()
        } else {
          ctx.fillStyle = s.tint
          ctx.globalAlpha = a
          ctx.beginPath()
          ctx.arc(x, y, r, 0, 6.2832)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(tick)
    }

    resize()
    for (let i = 0; i < density; i++) stars.push(makeStar())

    const onResize = () => resize()
    const onMouse = (e) => {
      mouseX = (e.clientX / W - 0.5) * 2
      mouseY = (e.clientY / H - 0.5) * 2
    }
    let lastY = window.scrollY
    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastY)
      lastY = window.scrollY
      if (!reduced) warp = Math.min(46, warp + dy * 0.16)
    }

    window.addEventListener('resize', onResize)
    if (!mobile) window.addEventListener('mousemove', onMouse)
    window.addEventListener('scroll', onScroll, { passive: true })
    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return <canvas id="stars" ref={canvasRef} aria-hidden="true" />
}
