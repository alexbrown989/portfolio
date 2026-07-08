// src/components/Timeline.jsx
//
// Mission-log style timeline. Scroll-linked progress rail that fills as the
// user reads, phase pills, HUD-style card headers, richer icon nodes.

import { useRef, useState } from 'react'
import {
  motion, useInView, AnimatePresence, useScroll, useSpring, useTransform,
} from 'framer-motion'
import {
  Anchor, Briefcase, GraduationCap, Building2, Users, Award,
  ChevronDown, HandHeart, Trophy, ShieldCheck,
} from 'lucide-react'
import { timeline, volunteering } from '../content/timeline'
import { SectionTitle } from '../shared/ui'

const ICONS = {
  anchor: Anchor, navy: Anchor,
  amazon: Building2, medical: Building2,
  briefcase: Briefcase, intern: Briefcase,
  degree: GraduationCap, school: GraduationCap,
  president: Users, leadership: ShieldCheck,
  award: Award, default: Briefcase,
}

function iconFor(entry) {
  const raw = (entry.icon || entry.title || '').toString().toLowerCase()
  const key = Object.keys(ICONS).find(k => raw.includes(k))
  return ICONS[key] || ICONS.default
}

function volunteerIcon(label = '') {
  const s = label.toLowerCase()
  if (s.includes('same') || s.includes('leadership')) return ShieldCheck
  if (s.includes('coach') || s.includes('soccer'))    return Trophy
  return HandHeart
}

/* ---------- Individual timeline node ---------- */

function TimelineEntry({ item, idx, expanded, setExpanded }) {
  const Icon = iconFor(item)
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { once: true, margin: '-80px' })
  const isOpen = expanded === idx
  const hasMore = (item.highlights?.length || 0) > 3

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative pl-14 md:pl-20"
      ref={cardRef}
    >
      {/* Icon node — sits over the rail, no label beside it */}
      <div className="absolute left-0 top-0">
        <div className="relative">
          <div className="w-10 h-10 md:w-11 md:h-11 rounded-lg bg-surface-2 border border-brand-500/40 grid place-items-center shadow-card">
            <Icon className="w-4 h-4 md:w-5 md:h-5 text-brand-300" />
          </div>
          {item.current && (
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400 ring-2 ring-surface-0" />
            </span>
          )}
        </div>
      </div>

      {/* Card */}
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        className={`rounded-2xl border ${
          isOpen ? 'border-brand-500/40' : 'border-line hover:border-line-strong'
        } bg-surface-2/60 backdrop-blur-sm p-5 md:p-6 transition-colors`}
      >
        {/* Header strip — node code + period + active pill */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
          <span className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500">
            Node · {String(idx + 1).padStart(2, '0')}
          </span>
          <span className="hidden md:inline text-[10.5px] font-mono text-gray-700">|</span>
          <span className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/90">
            {item.period}
          </span>
          {item.current && (
            <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-300 border border-emerald-400/40 bg-emerald-500/10 rounded-full px-2 py-0.5">
              Active
            </span>
          )}
        </div>

        <h3 className="text-lg md:text-xl font-bold text-white mt-1.5 tracking-tight">
          {item.title}
        </h3>
        <div className="text-sm text-brand-200/80">{item.org}</div>
        {item.location && (
          <div className="text-xs text-gray-500 mt-0.5">{item.location}</div>
        )}
        {item.summary && (
          <p className="text-sm text-gray-300 mt-3 leading-relaxed">{item.summary}</p>
        )}

        {/* First-3 highlights */}
        {(item.highlights?.length || 0) > 0 && (
          <ul className="mt-4 space-y-2">
            {item.highlights.slice(0, 3).map((h, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.05 * i }}
                className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed"
              >
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                <span>{h}</span>
              </motion.li>
            ))}
          </ul>
        )}

        {/* Expanded */}
        <AnimatePresence initial={false}>
          {isOpen && hasMore && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <ul className="mt-2 space-y-2">
                {item.highlights.slice(3).map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>

              {item.expandedInfo && (
                <div className="mt-4 pt-4 border-t border-line">
                  {item.expandedInfo.metrics && (
                    <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90 mb-3">
                      Key metrics: <span className="text-gray-300 normal-case tracking-normal">{item.expandedInfo.metrics}</span>
                    </div>
                  )}
                  {Array.isArray(item.expandedInfo.technologies) && item.expandedInfo.technologies.length > 0 && (
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-400 mb-2">
                        Competencies
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.expandedInfo.technologies.map((tech, i) => (
                          <span key={i} className="text-[11px] px-2 py-0.5 rounded border border-line text-gray-300">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {hasMore && (
          <button
            onClick={() => setExpanded(isOpen ? null : idx)}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-brand-300 hover:text-brand-200 transition-colors"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            {isOpen ? 'Show less' : `Show ${item.highlights.length - 3} more`}
          </button>
        )}
      </motion.div>
    </motion.div>
  )
}

/* ---------- Section root ---------- */

export default function Timeline() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [openVolunteer, setOpenVolunteer] = useState(false)
  const [expanded, setExpanded] = useState(null)

  // Scroll-linked fill of the vertical rail.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const railFill = useSpring(useTransform(scrollYProgress, [0.05, 0.9], [0, 1]), {
    stiffness: 90, damping: 22, mass: 0.4,
  })

  const items = Array.isArray(timeline) ? timeline : []

  return (
    <div className="container mx-auto px-6 max-w-5xl" ref={ref}>
      <SectionTitle
        code="SEC 003"
        kicker="Professional journey"
        title="Experience Timeline"
        subtitle="Mission log from Navy corpsman to aerospace intern. Operational excellence carried forward into R&D."
      />

      <div className="relative mt-12">
        {/* Rail — track */}
        <div className="absolute left-5 md:left-5 top-2 bottom-2 w-px bg-line" />
        {/* Rail — filled portion, tracks scroll progress */}
        <motion.div
          style={{ scaleY: railFill, transformOrigin: 'top' }}
          className="absolute left-5 md:left-5 top-2 bottom-2 w-px bg-gradient-to-b from-brand-400 via-brand-500 to-accent-500"
        />
        {/* Sweeping highlight bar at the current scroll position */}
        <motion.div
          style={{ top: useTransform(railFill, [0, 1], ['0%', '100%']) }}
          className="absolute left-5 md:left-5 w-px h-16 -translate-y-1/2 bg-gradient-to-b from-transparent via-brand-200 to-transparent"
        />

        <div className="space-y-10">
          {items.map((item, idx) => (
            <TimelineEntry
              key={`${item.title}-${idx}`}
              item={item}
              idx={idx}
              expanded={expanded}
              setExpanded={setExpanded}
            />
          ))}
        </div>
      </div>

      {/* Volunteering (collapsed by default) */}
      <div className="mt-14">
        <button
          onClick={() => setOpenVolunteer(v => !v)}
          className="w-full flex items-center justify-between rounded-xl border border-line bg-surface-2/60 backdrop-blur-sm px-5 py-4 hover:border-brand-500/40 transition-colors"
          aria-expanded={openVolunteer}
        >
          <div className="text-left">
            <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90 mb-0.5">
              Community impact
            </div>
            <div className="text-white font-semibold">Volunteering & Service</div>
            <div className="text-xs text-gray-400 mt-0.5">Leadership beyond the lab</div>
          </div>
          <ChevronDown className={`w-4 h-4 text-brand-300 transition-transform ${openVolunteer ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence initial={false}>
          {openVolunteer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-4 grid gap-3">
                {(Array.isArray(volunteering) ? volunteering : []).map((v, i) => {
                  const VIcon = volunteerIcon(v.label)
                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-line bg-surface-2/60 backdrop-blur-sm p-5"
                    >
                      <div className="flex items-center gap-2 text-white font-semibold mb-3">
                        <VIcon className="w-4 h-4 text-brand-300" />
                        {v.label}
                      </div>
                      <ul className="space-y-2">
                        {Array.isArray(v.details) && v.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Recognition */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.4 }}
        className="mt-8 flex justify-center"
      >
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-brand-500/25 bg-brand-500/[0.06]">
          <Award className="w-4 h-4 text-brand-300" />
          <span className="text-sm text-brand-200">Armed Forces Service Medal recipient</span>
        </div>
      </motion.div>
    </div>
  )
}
