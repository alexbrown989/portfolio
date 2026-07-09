// src/components/OrbitWidget.jsx
//
// Header entry-point for the orbital-determinism widget. The nav button
// is a tiny 2D SVG glyph; clicking it lazy-loads a full Three.js panel
// with real Kepler-propagated satellites orbiting a textured Earth.

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

const Orbit3DPanel = lazy(() => import('./Orbit3DPanel'))

/* ---------------- Small orbit indicator (nav button) ---------------- */

function MiniGlyph() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState(0)
  const raf = useRef(0)
  const t0 = useRef(0)

  useEffect(() => {
    if (reduce) return
    const step = (now) => {
      if (!t0.current) t0.current = now
      setPhase((now - t0.current) / 1000)
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [reduce])

  const s1 = { cx: 10 + Math.cos(phase * 2.4) * 7, cy: 10 + Math.sin(phase * 2.4) * 5 }
  const s2 = { cx: 10 + Math.cos(phase * 0.9 + 1) * 9, cy: 10 + Math.sin(phase * 0.9 + 1) * 6 }
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4">
      <ellipse cx="10" cy="10" rx="7" ry="5" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="0.5" />
      <ellipse cx="10" cy="10" rx="9" ry="6" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="0.5" />
      <circle cx="10" cy="10" r="2.4" fill="#22bfe0" opacity="0.85" />
      <circle cx={s1.cx} cy={s1.cy} r="1" fill="#22bfe0" />
      <circle cx={s2.cx} cy={s2.cy} r="1" fill="#a78bfa" />
    </svg>
  )
}

/* ---------------- Fallback while the 3D panel loads ---------------- */

function PanelFallback() {
  return (
    <motion.aside
      role="dialog"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="fixed z-50 top-16 right-3 md:right-6 w-[min(96vw,480px)] rounded-2xl border border-line bg-surface-1/95 backdrop-blur-xl p-6 text-center"
    >
      <div className="w-8 h-8 border-2 border-brand-500/25 border-t-brand-400 rounded-full animate-spin mx-auto mb-3" />
      <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-400">
        Loading orbital view…
      </div>
    </motion.aside>
  )
}

/* ---------------- Public component ---------------- */

export default function OrbitWidget() {
  const [open, setOpen] = useState(false)

  // Body scroll-lock while the panel is open. Prevents the mobile
  // 3D canvas from dragging the whole page instead of the scene.
  useEffect(() => {
    if (open) document.body.classList.add('orbit-open')
    else      document.body.classList.remove('orbit-open')
    return () => document.body.classList.remove('orbit-open')
  }, [open])

  // Esc closes.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close orbital widget' : 'Open orbital widget'}
        title="Orbital determinism"
        className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors ${
          open
            ? 'border-brand-500/40 bg-brand-500/[0.08]'
            : 'border-line hover:border-brand-500/40 hover:bg-white/[0.03]'
        }`}
      >
        <MiniGlyph />
      </button>

      <AnimatePresence>
        {open && (
          <Suspense fallback={<PanelFallback />}>
            <Orbit3DPanel onClose={() => setOpen(false)} />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  )
}
