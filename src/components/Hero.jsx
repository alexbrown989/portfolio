// src/components/Hero.jsx
// Restrained hero. One subtle gradient, calm motion, and the same section
// title / metric surfaces used across the rest of the site.

import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Circle } from 'lucide-react'
import { site } from '../content/siteConfig'

const container = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const item = {
  hidden: { opacity: 0, y: 10 },
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
        {/* Status pill */}
        <motion.div variants={item} className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-500/30 bg-brand-500/5 backdrop-blur-sm text-brand-200 text-[11px] font-mono uppercase tracking-[0.22em]">
          <Circle className="w-2 h-2 fill-emerald-400 stroke-none" />
          <span>Available Summer 2026</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={item}
          className="mt-6 text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05]"
        >
          <span className="text-white">{site.hero.titleTop}</span>
          <span className="block text-gray-400 font-semibold text-3xl md:text-5xl mt-2 tracking-tight">
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

        {/* Bullets */}
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
          <Link
            to="/#projects"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="glow-btn inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors"
          >
            Explore projects <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line-strong text-gray-100 hover:border-brand-400/60 hover:text-white transition-colors"
          >
            About me
          </Link>
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line text-gray-300 hover:text-white hover:border-brand-400/60 transition-colors"
          >
            Resume <ArrowUpRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Stats — one card style, tight grid, tabular numerals */}
        {Array.isArray(site.hero.stats) && site.hero.stats.length > 0 && (
          <motion.div
            variants={item}
            className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl"
          >
            {site.hero.stats.slice(0, 4).map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-line bg-surface-2/60 backdrop-blur-sm px-4 py-3"
              >
                <div className="text-2xl md:text-3xl font-bold text-white tabular-nums leading-none">
                  {s.value}
                  <span className="text-brand-300/80 text-xl">{s.suffix || ''}</span>
                </div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-gray-400 mt-2">
                  {s.label}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
