// src/components/Hero.jsx
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { site } from '../content/siteConfig'

export default function Hero() {
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      setMouse({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className="relative min-h-[88vh] grid place-items-center px-6">
      <div
        aria-hidden
        className="absolute -z-10 left-1/2 top-0 -translate-x-1/2 h-[55vh] w-[90vw] rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(0,255,231,.10), rgba(139,92,246,.06), transparent 60%)',
        }}
      />

      <motion.div
        animate={{ x: mouse.x, y: mouse.y }}
        transition={{ type: 'spring', damping: 30 }}
        className="pointer-events-none absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: -mouse.x, y: -mouse.y }}
        transition={{ type: 'spring', damping: 30 }}
        className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="inline-block mb-6">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur border border-cyan-500/20">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              Systems Online
            </span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold mb-3"
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
            {site.hero.titleTop}
          </span>
          <br />
          <span className="text-white">{site.hero.titleBottom}</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-lg md:text-2xl text-gray-300">
          {site.hero.subtitle}
        </motion.p>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400 mt-4">
          {site.hero.bullets.map((b, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full" />
              <span>{b}</span>
            </div>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-4 justify-center mt-8">
          {site.hero.ctas.map((c) => (
            <a
              key={c.label}
              href={c.href}
              className={
                c.intent === 'primary'
                  ? 'px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-cyan-500/25 transition-all'
                  : 'px-8 py-3.5 bg-white/5 backdrop-blur border border-cyan-500/30 text-cyan-400 font-semibold rounded-lg hover:bg-white/10 transition-all'
              }
              onClick={(e) => {
                if (c.href?.startsWith('#')) {
                  e.preventDefault()
                  document.querySelector(c.href)?.scrollIntoView({ behavior: 'smooth' })
                }
              }}
            >
              {c.label}
            </a>
          ))}
        </motion.div>

        {Array.isArray(site.hero.stats) && site.hero.stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12"
          >
            {site.hero.stats.map((s, i) => (
              <div key={i} className="relative bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <div className="text-4xl font-bold text-cyan-400">
                  {String(s.value)}<span className="text-2xl text-cyan-400/70">{s.suffix || ''}</span>
                </div>
                <p className="text-sm text-gray-400 mt-2">{s.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mt-10 text-xs text-gray-500">
          Scroll to explore
        </motion.div>
      </div>
    </div>
  )
}
