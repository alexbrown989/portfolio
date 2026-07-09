// src/components/Hero.jsx
//
// Center-aligned aerospace-first hero. Mouse-parallax on the accent
// lights, staggered fade-in, HUD system readout replacing the vanity
// metric grid.

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Circle } from 'lucide-react'
import { site } from '../content/siteConfig'
import { CornerBrackets } from '../shared/ui'
import ResumeLink from './ResumeLink'

const container = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

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
    idle:  'text-gray-100',
  }
  return (
    <motion.div
      variants={item}
      className="grid grid-cols-[92px_1fr] md:grid-cols-[120px_1fr] gap-3 md:gap-5 py-3 text-left border-b border-line last:border-b-0"
      style={{ transform: `translate3d(${xy.x * 0.12}px, ${xy.y * 0.08}px, 0)` }}
    >
      <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 pt-0.5">
        <span className="text-brand-300/70 mr-1.5">{String(index).padStart(2, '0')}</span>
        {row.label}
      </div>
      <div>
        <div className={`text-[14px] md:text-[15px] font-semibold ${toneMap[row.tone] || 'text-white'}`}>
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
  const xy = useMouseParallax(hostRef, 14)

  return (
    <div ref={hostRef} className="relative w-full">
      {/* Mouse-parallax accent lights */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl opacity-[0.14]"
        style={{
          background: 'radial-gradient(circle, rgba(10,165,199,0.45), transparent 60%)',
          x: xy.x * -1.5, y: xy.y * -1.5,
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -right-24 w-[440px] h-[440px] rounded-full blur-3xl opacity-[0.10]"
        style={{
          background: 'radial-gradient(circle, rgba(148,163,184,0.5), transparent 60%)',
          x: xy.x * 1.5, y: xy.y * 1.5,
        }}
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-6 max-w-4xl relative flex flex-col items-center text-center"
      >
        {/* HUD status pill — sits well below the sticky nav */}
        <motion.div variants={item} className="flex flex-col items-center gap-2 mt-8 md:mt-0">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-brand-500/40 bg-surface-2/80 backdrop-blur-md text-brand-100 text-[11px] font-mono uppercase tracking-[0.22em] shadow-[0_8px_30px_rgba(10,165,199,0.15)]">
            <Circle className="w-2 h-2 fill-emerald-400 stroke-none crosshair-blink" />
            <span>{site.hero.status.primary}</span>
          </div>
          <div className="h-px w-40 bg-gradient-to-r from-transparent via-brand-500/60 to-transparent ticker-sweep" />
          <div className="text-[10.5px] font-mono uppercase tracking-[0.24em] text-gray-500">
            {site.hero.status.secondary}
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={item}
          className="mt-7 text-5xl md:text-7xl xl:text-8xl font-extrabold tracking-tight leading-[1.02]"
        >
          <span className="text-white">{site.hero.titleTop}</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-200 to-accent-400 font-semibold text-2xl md:text-3xl xl:text-4xl mt-3 tracking-[0.02em]">
            {site.hero.titleBottom}
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={item}
          className="mt-6 text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl"
        >
          {site.hero.subtitle}
        </motion.p>

        {/* Capability bullets */}
        <motion.div variants={item} className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-400">
          {site.hero.bullets.map((b) => (
            <div key={b} className="flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-brand-400" />
              <span>{b}</span>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div variants={item} className="mt-8 flex flex-wrap justify-center gap-3">
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
          <ResumeLink />
        </motion.div>

        {/* System readout */}
        {Array.isArray(site.hero.readout) && site.hero.readout.length > 0 && (
          <motion.div variants={item} className="mt-14 w-full">
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
