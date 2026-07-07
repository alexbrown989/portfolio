// src/shared/ui.jsx
// Shared UI primitives used by Home, About, and every project page.
// Consolidating these keeps typography, spacing, and motion consistent so
// every page reads as one product instead of a stack of individually
// styled experiments.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { projects } from '../content/projects'

/* ------------------------------------------------------------------ */
/* Layout primitives                                                   */
/* ------------------------------------------------------------------ */

export function Container({ children, className = '', size = 'md' }) {
  const width =
    size === 'sm' ? 'max-w-4xl' :
    size === 'lg' ? 'max-w-7xl' :
    'max-w-6xl'
  return (
    <div className={`container mx-auto px-6 ${width} ${className}`}>{children}</div>
  )
}

export function Kicker({ children }) {
  return (
    <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-brand-300/90">
      {children}
    </div>
  )
}

export function SectionTitle({ kicker, title, subtitle, className = '' }) {
  return (
    <div className={`mb-6 ${className}`}>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2 className="text-2xl md:text-3xl font-bold text-white mt-1.5 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-300 mt-2 max-w-2xl text-[15px] leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="mt-3 h-px w-16 bg-gradient-to-r from-brand-400/70 to-transparent" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Surface                                                             */
/* ------------------------------------------------------------------ */

// Single opinionated glass surface. Tone is calibrated so images, plots, and
// text on top of it stay readable — no rainbow gradient washes.
export function Glass({
  children,
  className = '',
  hover = true,
  pad = true,
  as: Tag = 'div',
}) {
  const padCls = pad ? 'p-5 md:p-6' : ''
  return (
    <motion.div
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={`
        relative rounded-2xl border border-line bg-surface-2/70
        backdrop-blur-sm shadow-card
        ${hover ? 'hover:border-line-strong hover:shadow-card-hover' : ''}
        transition-[border-color,box-shadow,transform] duration-200
        ${padCls} ${className}
      `}
    >
      <Tag className="relative">{children}</Tag>
    </motion.div>
  )
}

export function Chip({ children, tone = 'default' }) {
  const tones = {
    default: 'border-line-strong text-gray-200 bg-white/[0.03]',
    brand:   'border-brand-500/40 text-brand-200 bg-brand-500/10',
    accent:  'border-accent-500/40 text-accent-400 bg-accent-500/10',
    warn:    'border-amber-400/40 text-amber-200 bg-amber-500/10',
    ok:      'border-emerald-400/40 text-emerald-200 bg-emerald-500/10',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] rounded-full border ${tones[tone] || tones.default}`}>
      {children}
    </span>
  )
}

export function StatusPill({ label, tone = 'brand', pulse = false }) {
  const tones = {
    brand:  'border-brand-500/40 text-brand-200 bg-brand-500/10',
    warn:   'border-amber-400/40 text-amber-200 bg-amber-500/10',
    ok:     'border-emerald-400/40 text-emerald-200 bg-emerald-500/10',
    idle:   'border-line-strong text-gray-300 bg-white/[0.03]',
  }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] font-mono rounded border ${tones[tone] || tones.brand}`}>
      {pulse && <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />}
      {label}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

export function MetricBox({ value, label, sub }) {
  return (
    <div className="rounded-xl border border-line bg-surface-3/60 p-4">
      <div className="text-2xl font-extrabold text-white leading-none tabular-nums">
        {value}
      </div>
      <div className="text-[13px] text-gray-200 mt-1.5">{label}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Page-level hero used by every project page                          */
/* ------------------------------------------------------------------ */

export function PageHero({
  kicker,
  title,
  subtitle,
  chips = [],
  status,
  align = 'left',
  children,
}) {
  const alignCls = align === 'center' ? 'text-center items-center' : 'text-left'
  return (
    <section className="pt-24 pb-8">
      <Container>
        <div className={`flex flex-col gap-3 ${alignCls}`}>
          {kicker && <Kicker>{kicker}</Kicker>}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-300 max-w-3xl text-[15px] md:text-base leading-relaxed">
              {subtitle}
            </p>
          )}
          {(chips.length > 0 || status) && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {status && <StatusPill label={status.label} tone={status.tone} pulse={status.pulse} />}
              {chips.map((c) => <Chip key={c}>{c}</Chip>)}
            </div>
          )}
          {children}
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Bottom-of-project navigation & CTA                                  */
/* ------------------------------------------------------------------ */

export function BackToProjects({ label = 'Back to Projects', className = '' }) {
  return (
    <Link
      to="/#projects"
      className={`inline-flex items-center gap-2 text-sm text-brand-300 hover:text-brand-200 transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  )
}

// Prev / Next navigation across the project catalog so users can flow through
// case studies without bouncing back to the grid every time.
export function ProjectPager({ currentId }) {
  const list = Array.isArray(projects) ? projects : []
  const idx = list.findIndex(p => p.id === currentId)
  if (idx === -1) return null
  const prev = list[(idx - 1 + list.length) % list.length]
  const next = list[(idx + 1) % list.length]

  const Card = ({ project, direction }) => {
    if (!project) return <div />
    const isNext = direction === 'next'
    return (
      <Link
        to={`/projects/${project.id}`}
        className="group flex-1 rounded-2xl border border-line bg-surface-2/60 hover:border-brand-500/40 hover:bg-surface-2 transition-all duration-200 p-5"
      >
        <div className={`text-[11px] font-mono uppercase tracking-[0.2em] text-brand-300/80 flex items-center gap-1 ${isNext ? 'justify-end' : ''}`}>
          {!isNext && <ArrowLeft className="w-3.5 h-3.5" />}
          {isNext ? 'Next Project' : 'Previous Project'}
          {isNext && <ArrowRight className="w-3.5 h-3.5" />}
        </div>
        <div className={`mt-1 text-white font-semibold ${isNext ? 'text-right' : ''}`}>
          {project.title}
        </div>
        {project.summary && (
          <div className={`mt-1 text-xs text-gray-400 line-clamp-2 ${isNext ? 'text-right' : ''}`}>
            {project.summary}
          </div>
        )}
      </Link>
    )
  }

  return (
    <section className="pb-14">
      <Container>
        <div className="grid md:grid-cols-2 gap-4">
          <Card project={prev} direction="prev" />
          <Card project={next} direction="next" />
        </div>
        <div className="mt-6">
          <BackToProjects />
        </div>
      </Container>
    </section>
  )
}

// Unified end-of-page CTA replacing the various colored gradient blocks.
export function ProjectCTA({
  title = 'Open to collaboration',
  body = 'If this problem space overlaps with your team’s work, I’d love to talk.',
  primary = { label: 'Get in touch', to: '/#contact' },
  secondary,
}) {
  return (
    <section className="pb-10">
      <Container>
        <div className="rounded-2xl border border-line bg-surface-2/60 p-6 md:p-8">
          <div className="grid md:grid-cols-[1fr_auto] gap-5 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">{title}</h3>
              <p className="text-gray-300 mt-2 text-[15px] leading-relaxed max-w-2xl">{body}</p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              {secondary && (
                <a
                  href={secondary.href}
                  target={secondary.href?.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-line-strong text-gray-100 hover:border-brand-400/60 hover:text-white transition-colors"
                >
                  {secondary.label}
                  {secondary.href?.startsWith('http') && <ArrowUpRight className="w-4 h-4" />}
                </a>
              )}
              {primary && (
                primary.href?.startsWith('http') ? (
                  <a
                    href={primary.href}
                    target="_blank"
                    rel="noreferrer"
                    className="glow-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors"
                  >
                    {primary.label}
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                ) : (
                  <Link
                    to={primary.to || primary.href}
                    className="glow-btn inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors"
                  >
                    {primary.label}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Small utilities                                                     */
/* ------------------------------------------------------------------ */

export function Accordion({ items }) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => <AccordionItem key={i} {...it} />)}
    </div>
  )
}

export function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-line bg-surface-2/60 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-4 py-3 flex items-center justify-between"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="text-gray-400">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-gray-200">
          {children}
        </div>
      )}
    </div>
  )
}
