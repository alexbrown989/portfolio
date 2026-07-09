// src/components/ResumeLink.jsx
//
// Wraps any link/button that opens the PDF resume. On click, plays a
// short "decrypt" animation on top of the current page, then opens the
// PDF. Presence of the animation is theater — the resume is not
// actually encrypted — but it reads as classified-ops flavor and
// signals that the site cares about detail.

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FileDown, ArrowUpRight, Lock, Unlock } from 'lucide-react'

const RESUME_URL = '/resume.pdf'
const HTML_URL   = '/resume'

// Utility: generate a mock hex frame so the overlay looks like something.
function hexFrame(width) {
  const chars = '0123456789ABCDEF'
  let out = ''
  for (let i = 0; i < width; i++) out += chars[Math.floor(Math.random() * 16)]
  return out
}

function DecryptOverlay({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [frame, setFrame]       = useState(() => hexFrame(64))
  const reduce = useReducedMotion()
  const raf = useRef(0)
  const t0  = useRef(0)
  const DURATION = reduce ? 200 : 850

  // Advance the progress bar and refresh the mock hex frame quickly.
  useEffect(() => {
    let done = false
    const step = (now) => {
      if (done) return
      if (!t0.current) t0.current = now
      const p = Math.min(1, (now - t0.current) / DURATION)
      setProgress(p)
      setFrame(hexFrame(64))
      if (p < 1) {
        raf.current = requestAnimationFrame(step)
      } else {
        done = true
        onDone()
      }
    }
    raf.current = requestAnimationFrame(step)
    return () => { done = true; cancelAnimationFrame(raf.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.12 }}
      className="fixed inset-0 z-[70] grid place-items-center bg-surface-0/85 backdrop-blur-md"
    >
      <div className="w-[min(92vw,540px)] rounded-2xl border border-brand-500/40 bg-surface-1/95 p-6 shadow-[0_30px_80px_rgba(10,165,199,0.35)]">
        <div className="flex items-center gap-2 text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300">
          {progress < 1 ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5 text-emerald-300" />}
          <span>{progress < 1 ? 'Verifying credentials' : 'Cleared'}</span>
          <span className="ml-auto text-gray-500">alexbrow@uw.edu</span>
        </div>
        <div className="mt-3 text-white font-semibold text-lg leading-tight">
          {progress < 1 ? 'Decrypting resume…' : 'Resume ready.'}
        </div>
        <div className="mt-4 h-1 rounded-full bg-surface-3 overflow-hidden">
          <motion.div
            style={{ transformOrigin: 'left' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: progress }}
            transition={{ duration: 0 }}
            className="h-full bg-gradient-to-r from-brand-500 via-brand-400 to-accent-400"
          />
        </div>
        <div className="mt-3 h-16 rounded-md bg-black/60 border border-line p-2 overflow-hidden text-[10px] leading-[13px] font-mono text-brand-300/85 select-none">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>{hexFrame(56)}</div>
          ))}
          <div className="text-brand-200">{frame}</div>
        </div>
        <div className="mt-3 text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500">
          {Math.round(progress * 100)}% · Local · No credentials sent
        </div>
      </div>
    </motion.div>
  )
}

/**
 * Resume anchor. Pass `format="pdf"` (default) to open the PDF file, or
 * `format="html"` to route to the printable HTML resume view.
 * Any children override the default label.
 */
export default function ResumeLink({
  format = 'pdf',
  className = '',
  children,
  variant = 'default',
  showIcon = true,
  skipAnimation = false,
}) {
  const [decrypting, setDecrypting] = useState(false)

  const label = children || (format === 'pdf' ? 'Resume' : 'Print-friendly resume')
  const Icon = format === 'pdf' ? FileDown : ArrowUpRight

  const open = () => {
    if (format === 'pdf') window.open(RESUME_URL, '_blank', 'noopener')
    // html format is handled by react-router link below
  }

  const onClick = (e) => {
    if (skipAnimation || format !== 'pdf') return
    e.preventDefault()
    setDecrypting(true)
  }

  const buttonCls =
    variant === 'primary'
      ? `glow-btn inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-400 transition-colors ${className}`
      : variant === 'ghost'
      ? `inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-brand-500 hover:bg-brand-400 transition-colors ${className}`
      : `inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line text-gray-300 hover:text-white hover:border-brand-400/60 transition-colors ${className}`

  return (
    <>
      {format === 'html' ? (
        <Link to={HTML_URL} className={buttonCls}>
          {showIcon && <Icon className="w-4 h-4" />}
          {label}
        </Link>
      ) : (
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClick}
          className={buttonCls}
        >
          {showIcon && <Icon className="w-4 h-4" />}
          {label}
        </a>
      )}

      <AnimatePresence>
        {decrypting && (
          <DecryptOverlay onDone={() => {
            setDecrypting(false)
            setTimeout(open, 30)
          }} />
        )}
      </AnimatePresence>
    </>
  )
}
