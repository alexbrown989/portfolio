import { useEffect, useRef } from 'react'

export default function ParticlesImpact({ count = 120, obstacleSelector = '.particle-obstacle' }) {
  const ref = useRef(null)
  const obstaclesRef = useRef([])
  const particlesRef = useRef([])
  const meteorTimer = useRef(0)

  // helper
  const rects = () =>
    Array.from(document.querySelectorAll(obstacleSelector)).map(el => {
      const r = el.getBoundingClientRect()
      return { x: r.left, y: r.top, w: r.width, h: r.height }
    })

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const ctx = c.getContext('2d')
    let width = (c.width = window.innerWidth * devicePixelRatio)
    let height = (c.height = window.innerHeight * devicePixelRatio)
    c.style.width = '100%'; c.style.height = '100%'

    // spawn particles
    const P = particlesRef.current = Array.from({ length: count }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25 * devicePixelRatio * 2.2, // faster
      vy: (Math.random() - 0.5) * 0.25 * devicePixelRatio * 2.2,
      r: (0.7 + Math.random() * 1.8) * devicePixelRatio,
      life: 1
    }))

    const refreshObstacles = () => { obstaclesRef.current = rects().map(o => ({ ...o, x:o.x*devicePixelRatio, y:o.y*devicePixelRatio, w:o.w*devicePixelRatio, h:o.h*devicePixelRatio })) }
    refreshObstacles()

    let rafId, last = performance.now()
    const tick = (t) => {
      const dt = Math.min(33, t - last) * 0.06 // time scale
      last = t
      ctx.clearRect(0,0,width,height)

      // occasional "meteor" that streaks across
      if (t > meteorTimer.current) {
        meteorTimer.current = t + 3000 + Math.random()*2500
        P.push({
          x: -50 * devicePixelRatio,
          y: (height * 0.2) + Math.random()*height*0.6,
          vx: (2.5 + Math.random()*1.2) * devicePixelRatio,
          vy: (-0.4 + Math.random()*0.8) * devicePixelRatio,
          r: 2.5*devicePixelRatio,
          life: 1.2
        })
        if (P.length > count + 25) P.splice(0, P.length - (count + 25))
      }

      // draw
      ctx.save()
      ctx.globalCompositeOperation = 'lighter'

      for (let i=0; i<P.length; i++) {
        const p = P[i]
        p.x += p.vx * dt
        p.y += p.vy * dt

        // walls
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        // collisions with obstacles (simple AABB)
        const obs = obstaclesRef.current
        for (let k=0; k<obs.length; k++) {
          const o = obs[k]
          if (p.x > o.x && p.x < o.x + o.w && p.y > o.y && p.y < o.y + o.h) {
            // reflect roughly based on which side is nearest
            const dx = Math.min(p.x - o.x, (o.x+o.w) - p.x)
            const dy = Math.min(p.y - o.y, (o.y+o.h) - p.y)
            if (dx < dy) p.vx *= -1; else p.vy *= -1
            // little kick so it doesn't get stuck
            p.x += p.vx * 2; p.y += p.vy * 2
          }
        }

        // trail
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2)
        ctx.fillStyle = 'rgba(34,211,238,.65)'
        ctx.shadowBlur = 18 * devicePixelRatio
        ctx.shadowColor = 'rgba(34,211,238,.55)'
        ctx.fill()

        // small tail for meteors
        if (p.vx > 1.5*devicePixelRatio) {
          ctx.beginPath()
          ctx.moveTo(p.x - p.vx*4, p.y - p.vy*4)
          ctx.lineTo(p.x, p.y)
          ctx.strokeStyle = 'rgba(56,189,248,.35)'
          ctx.lineWidth = 1.2*devicePixelRatio
          ctx.stroke()
        }
      }
      ctx.restore()

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    const onResize = () => {
      width = (c.width = window.innerWidth * devicePixelRatio)
      height = (c.height = window.innerHeight * devicePixelRatio)
      c.style.width = '100%'; c.style.height = '100%'
      refreshObstacles()
    }
    const onScroll = () => refreshObstacles()

    window.addEventListener('resize', onResize)
    window.addEventListener('scroll', onScroll, { passive:true })
    const refreshTimer = setInterval(refreshObstacles, 1200)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      clearInterval(refreshTimer)
    }
  }, [count, obstacleSelector])

  return <canvas ref={ref} className="pointer-events-none absolute inset-0 -z-10" />
}
