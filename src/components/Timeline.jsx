// src/components/Timeline.jsx
// Cleaner timeline. Real iconography (lucide-react) instead of emoji, one
// palette, tighter spacing, and per-item metadata pulled from timeline.js.

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Anchor, Briefcase, GraduationCap, Building2, Users, Award,
  ChevronDown, HandHeart, Trophy, ShieldCheck,
} from 'lucide-react'
import { timeline, volunteering } from '../content/timeline'
import { SectionTitle } from '../shared/ui'

/**
 * Map from a keyword in the timeline entry's icon field OR its title to a
 * real icon component. This lets us keep icon selection declarative in the
 * content file (icon: 'anchor', 'campus', etc.) without shipping emoji.
 */
const ICONS = {
  anchor:      Anchor,
  navy:        Anchor,
  amazon:      Building2,
  medical:     Building2,
  briefcase:   Briefcase,
  intern:      Briefcase,
  degree:      GraduationCap,
  school:      GraduationCap,
  president:   Users,
  leadership:  ShieldCheck,
  award:       Award,
  default:     Briefcase,
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

export default function Timeline() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [openVolunteer, setOpenVolunteer] = useState(false)
  const [expanded, setExpanded] = useState(null)

  const items = Array.isArray(timeline) ? timeline : []

  return (
    <div className="container mx-auto px-6 max-w-5xl" ref={ref}>
      <SectionTitle
        kicker="// Professional Journey"
        title="Experience Timeline"
        subtitle="From Navy corpsman to mechanical engineering student — operational excellence carried forward into R&D."
      />

      <div className="relative mt-10">
        {/* Vertical rail */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={inView ? { scaleY: 1 } : {}}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{ transformOrigin: 'top' }}
          className="absolute left-4 md:left-5 top-2 bottom-2 w-px bg-gradient-to-b from-brand-500/40 via-brand-500/25 to-transparent"
        />

        <div className="space-y-6">
          {items.map((item, idx) => {
            const Icon = iconFor(item)
            const hasMore = (item.highlights?.length || 0) > 3
            const isOpen = expanded === idx
            return (
              <motion.div
                key={`${item.title}-${idx}`}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: idx * 0.08, duration: 0.4 }}
                className="relative pl-14 md:pl-16"
              >
                {/* Icon node */}
                <div className="absolute left-0 top-0">
                  <div className="w-9 h-9 rounded-lg bg-surface-2 border border-brand-500/40 grid place-items-center shadow-card">
                    <Icon className="w-4 h-4 text-brand-300" />
                  </div>
                  {item.current && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
                    </span>
                  )}
                </div>

                {/* Card */}
                <div
                  className={`rounded-2xl border border-line bg-surface-2/60 backdrop-blur-sm p-5 md:p-6 transition-colors ${
                    isOpen ? 'border-brand-500/40' : 'hover:border-line-strong'
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90">
                      {item.period}
                    </span>
                    {item.current && (
                      <span className="text-[10px] font-mono uppercase tracking-[0.18em] text-emerald-300 border border-emerald-400/40 bg-emerald-500/10 rounded-full px-2 py-0.5">
                        Active
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg md:text-xl font-bold text-white mt-1 tracking-tight">
                    {item.title}
                  </h3>
                  <div className="text-sm text-brand-200/80">{item.org}</div>
                  {item.location && (
                    <div className="text-xs text-gray-500 mt-0.5">{item.location}</div>
                  )}
                  {item.summary && (
                    <p className="text-sm text-gray-300 mt-3 leading-relaxed">{item.summary}</p>
                  )}

                  {/* Highlights */}
                  {(item.highlights?.length || 0) > 0 && (
                    <ul className="mt-4 space-y-2">
                      {item.highlights.slice(0, 3).map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

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
                </div>
              </motion.div>
            )
          })}
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
              // Community Impact
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
      <div className="mt-8 flex justify-center">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-brand-500/25 bg-brand-500/[0.06]">
          <Award className="w-4 h-4 text-brand-300" />
          <span className="text-sm text-brand-200">Armed Forces Service Medal recipient</span>
        </div>
      </div>
    </div>
  )
}
