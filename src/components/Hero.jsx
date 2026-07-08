// src/components/Hero.jsx
// Aerospace-first hero with real motion.
//
// - Mouse-parallax on the accent lights
// - Staggered fade+lift on the copy
// - One-shot ticker sweep on the status line
// - Corner-bracketed system readout replaces the vanity metric grid

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Circle } from 'lucide-react'
import { site } from '../content/siteConfig'
import { CornerBrackets } from '../shared/ui'

const container = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

// Read the mouse position relative to the hero container and expose a small
// normalized offset. Used to gently parallax the accent lights and the
// system readout. Respects prefers-reduced-motion.
function useMouseParallax(ref, strength = 12) {
  const [xy, setXy] = useState({ x: 0, y: 0 })
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const el = ref.current
    if (!el) return
    let raf = 0
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const nx = (e.clientX - r.left) / r.width - 0.5
      const ny = (e.clientY - r.top)  / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => setXy({ x: nx * strength, y: ny * strength }))
    }
    const onLeave = () => setXy({ x: 0, y: 0 })
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [ref, strength, reduce])

  return xy
}

function ReadoutRow({ row, index, xy }) {
  const toneMap = {
    brand: 'text-brand-300',
    ok:    'text-emerald-300',
    warn:  'text-amber-300',
    idle:  'text-gray-300',
  }
  return (
    <motion.div
      variants={item}
      className="grid grid-cols-[110px_1fr] gap-4 py-2.5 border-b border-line last:border-b-0"
      style={{ transform: `translate3d(${xy.x * 0.15}px, ${xy.y * 0.1}px, 0)` }}
    >
      <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 pt-0.5">
        <span className="text-brand-300/70 mr-1.5">{String(index).padStart(2, '0')}</span>
        {row.label}
      </div>
      <div>
        <div className={`text-[15px] font-semibold ${toneMap[row.tone] || 'text-white'}`}>
          {row.primary}
        </div>
        {row.secondary && (
          <div className="text-[12px] text-gray-400 mt-1 leading-relaxed">
            {row.secondary}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function Hero() {
  const hostRef = useRef(null)
  const xy = useMouseParallax(hostRef, 16)

  return (
    <div ref={hostRef} className="relative w-full">
      {/* Mouse-parallax accent lights sit under the hero content */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 w-[520px] h-[520px] rounded-full blur-3xl opacity-[0.18]"
        style={{
          background: 'radial-gradient(circle, rgba(10,165,199,0.45), transparent 60%)',
          x: xy.x * -1.5, y: xy.y * -1.5,
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-[0.16]"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.5), transparent 60%)',
          x: xy.x * 1.5, y: xy.y * 1.5,
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-6 max-w-6xl relative"
      >
        {/* HUD status ticker */}
        <motion.div variants={item} className="space-y-2">
          <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-brand-500/30 bg-brand-500/[0.06] backdrop-blur-sm text-brand-200 text-[11px] font-mono uppercase tracking-[0.22em]">
            <Circle className="w-2 h-2 fill-emerald-400 stroke-none crosshair-blink" />
            <span>{site.hero.status.primary}</span>
          </div>
          <div className="h-px w-40 bg-gradient-to-r from-brand-500/60 to-transparent ticker-sweep" />
          <div className="text-[10.5px] font-mono uppercase tracking-[0.24em] text-gray-500">
            {site.hero.status.secondary}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={item}
          className="mt-8 text-5xl md:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.02]"
        >
          <span className="text-white">{site.hero.titleTop}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-200 to-accent-400 font-semibold text-2xl md:text-3xl xl:text-4xl mt-3 tracking-[0.02em]">
            {site.hero.titleBottom}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p variants={item} className="mt-6 text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl">
          {site.hero.subtitle}
        </motion.p>

        {/* Capability bullets */}
        <motion.div variants={item} className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
          {site.hero.bullets.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-brand-400" />
              <span>{b}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
          <a
            href="/#internship"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault()
                document.getElementById('internship')?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="glow-btn inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors"
          >
            View internship <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="/#projects"
            onClick={(e) => {
              if (window.location.pathname === '/') {
                e.preventDefault()
                document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line-strong text-gray-100 hover:border-brand-400/60 hover:text-white transition-colors"
          >
            Explore projects
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line text-gray-300 hover:text-white hover:border-brand-400/60 transition-colors"
          >
            Resume <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* System readout — categorical anchors, not vanity metrics */}
        {Array.isArray(site.hero.readout) && site.hero.readout.length > 0 && (
          <motion.div variants={item} className="mt-14 max-w-3xl">
            <CornerBrackets className="rounded-xl border border-line/70 bg-surface-2/40 backdrop-blur-sm px-5 py-4">
              <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.24em] text-brand-300/90 mb-2">
                <span className="inline-block w-6 h-px bg-brand-400/60" />
                <span>System readout</span>
                <span className="ml-auto text-gray-500">v.2027.01</span>
              </div>
              <div>
                {site.hero.readout.map((r, i) => (
                  <ReadoutRow key={r.label} row={r} index={i + 1} xy={xy} />
                ))}
              </div>
            </CornerBrackets>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
