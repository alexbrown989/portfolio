// src/components/Hero.jsx
// Aerospace-first hero. Anduril-inspired restraint: dark plate, HUD-style
// status ticker leading, a single decisive gradient on the title, corner
// brackets on the stat panel. No competing accent lights, no rainbow.

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Circle } from 'lucide-react'
import { site } from '../content/siteConfig'
import { CornerBrackets } from '../shared/ui'

const container = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 8 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Hero() {
  return (
    <div className="relative w-full">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-6 max-w-6xl"
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
        <motion.p
          variants={item}
          className="mt-6 text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl"
        >
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
            href="#internship"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('internship')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="glow-btn inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors"
          >
            View internship <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#projects"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
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

        {/* Stats panel with corner brackets */}
        {Array.isArray(site.hero.stats) && site.hero.stats.length > 0 && (
          <motion.div variants={item} className="mt-14 max-w-3xl">
            <CornerBrackets className="p-4 rounded-xl border border-line/70 bg-surface-2/40 backdrop-blur-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {site.hero.stats.slice(0, 4).map((s, i) => (
                  <div key={s.label} className="px-3 py-2">
                    <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-gray-500">
                      {String(i + 1).padStart(2, '0')} · Metric
                    </div>
                    <div className="mt-1 text-2xl md:text-3xl font-bold text-white tabular-nums leading-none">
                      {s.value}
                      <span className="text-brand-300/80 text-xl">{s.suffix || ''}</span>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.14em] text-gray-400 mt-2 leading-tight">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </CornerBrackets>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
