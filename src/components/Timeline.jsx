// src/components/Timeline.jsx
import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { timeline, volunteering } from '../content/timeline'

export default function Timeline() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })
  const [openVolunteer, setOpenVolunteer] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const [expandedIndex, setExpandedIndex] = useState(null)
  // Emoji that always match the volunteering card’s label
const getVolunteerIcon = (label = '') => {
  const s = label.toLowerCase()
  if (s.includes('same') || s.includes('leadership') || s.includes('service')) return '🛡️'
  if (s.includes('coach') || s.includes('soccer')) return '⚽'
  if (s.includes('veteran') || s.includes('mentorship') || s.includes('career')) return '🤝'
  return '⭐'
}


  const items = Array.isArray(timeline) ? timeline : []

  return (
    <section id="timeline" className="py-20">
      <div className="container mx-auto px-6 max-w-5xl" ref={ref}>
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            className="inline-block mb-4"
          >
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-[0.2em]">
              /// Professional Journey ///
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05 }}
            className="text-4xl md:text-5xl font-bold mb-3"
          >
            Experience{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
              Timeline
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            From military service to engineering leadership — building innovative solutions with operational excellence.
          </motion.p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line (left-aligned) */}
          <motion.div
            initial={{ height: 0 }}
            animate={inView ? { height: '100%' } : {}}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
            className="absolute left-6 md:left-8 top-0 w-0.5 bg-gradient-to-b from-cyan-400/20 via-cyan-400/50 to-cyan-400/20"
          />

          {/* Items */}
          <div className="space-y-8">
            {items.map((item, idx) => {
              const hasMore = (item.highlights?.length || 0) > 3
              return (
                <motion.div
                  key={`${item.title}-${idx}`}
                  initial={{ opacity: 0, x: -30 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: idx * 0.12 }}
                  className="relative"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Dot */}
                  <motion.div
                    className="absolute left-6 md:left-8 top-8 z-10"
                    animate={{ scale: hoveredIndex === idx ? 1.3 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div
                      className="w-4 h-4 -ml-2 rounded-full bg-[#0A0F1C] border-2 border-cyan-400 transition-colors duration-300 relative"
                      style={{
                        borderColor: hoveredIndex === idx ? '#a78bfa' : '#00bcd4',
                        boxShadow: hoveredIndex === idx ? '0 0 20px rgba(167, 139, 250, 0.5)' : 'none'
                      }}
                    >
                      {item.current && (
                        <div className="absolute inset-0 rounded-full bg-cyan-400/70 animate-ping" />
                      )}
                    </div>
                  </motion.div>

                  {/* Card */}
                  <motion.div
                    className="ml-14 md:ml-20"
                    animate={{
                      scale: hoveredIndex === idx ? 1.02 : 1,
                      y: hoveredIndex === idx ? -2 : 0
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className={`rounded-2xl border backdrop-blur-sm p-6 cursor-pointer transition-all duration-300 ${
                        hoveredIndex === idx
                          ? 'border-cyan-400/40 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 shadow-lg shadow-cyan-500/10'
                          : 'border-white/10 bg-white/5'
                      }`}
                      onClick={() => setExpandedIndex(expandedIndex === idx ? null : idx)}
                    >
                      {/* Icon */}
                      {item.icon && (
                        <motion.div
                          className="absolute -left-3 top-6 text-2xl bg-[#0A0F1C] rounded-lg p-2 border border-white/10"
                          animate={{ rotate: hoveredIndex === idx ? [0, -10, 10, -10, 0] : 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          {item.icon}
                        </motion.div>
                      )}

                      <div className={item.icon ? 'ml-10' : ''}>
                        {/* Header */}
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs font-mono text-cyan-400">{item.period}</span>
                            {item.current && (
                              <motion.span
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="px-2 py-0.5 text-[10px] bg-green-500/20 text-green-400 rounded-full border border-green-400/30 font-mono"
                              >
                                ACTIVE
                              </motion.span>
                            )}
                          </div>
                          <motion.div
                            animate={{ rotate: expandedIndex === idx ? 180 : 0 }}
                            className="text-cyan-400 text-sm"
                          >
                            ▾
                          </motion.div>
                        </div>

                        {/* Title & Org */}
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{item.title}</h3>
                        <div className="text-sm text-cyan-300/80 mb-1">{item.org}</div>
                        {item.location && (
                          <div className="text-xs text-gray-500 mb-2">{item.location}</div>
                        )}
                        <p className="text-sm text-gray-400 mb-4">{item.summary}</p>

                        {/* Highlights (first 3) */}
                        <div className="space-y-2">
                          {(item.highlights || [])
                            .slice(0,3)
                            .map((highlight, i) => (
                              <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 * i }}
                                className="flex items-start gap-2"
                              >
                                <span className="text-cyan-400 text-xs mt-1">▸</span>
                                <span className="text-sm text-gray-300">{highlight}</span>
                              </motion.div>
                            ))}
                        </div>

                        {/* Expanded content */}
                        <AnimatePresence>
                          {expandedIndex === idx && hasMore && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="space-y-2 mt-2">
                                {item.highlights.slice(3).map((highlight, i) => (
                                  <motion.div
                                    key={`expanded-${i}`}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * i }}
                                    className="flex items-start gap-2"
                                  >
                                    <span className="text-cyan-400 text-xs mt-1">▸</span>
                                    <span className="text-sm text-gray-300">{highlight}</span>
                                  </motion.div>
                                ))}
                              </div>

                              {item.expandedInfo && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                  <div className="text-xs text-cyan-400 mb-3 font-mono uppercase tracking-wider">
                                    Key Metrics: {item.expandedInfo.metrics}
                                  </div>

                                  <div className="mb-1">
                                    <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
                                      Core Competencies
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                      {(item.expandedInfo.technologies || []).map((tech, i) => (
                                        <motion.span
                                          key={i}
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: 0.02 * i }}
                                          className="text-xs px-2 py-1 bg-purple-500/10 rounded border border-purple-400/20 text-purple-300"
                                        >
                                          {tech}
                                        </motion.span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* “See more” hint */}
                        {expandedIndex !== idx && hasMore && (
                          <motion.div
                            animate={{ opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-xs text-cyan-400/60 mt-3"
                          >
                            Click to see {item.highlights.length - 3} more achievements →
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Volunteering */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16"
        >
          <button
            onClick={() => setOpenVolunteer((v) => !v)}
            className="w-full flex items-center justify-between bg-white/5 backdrop-blur rounded-xl border border-white/10 px-6 py-4 hover:border-cyan-400/30 transition-all duration-300 group"
            aria-expanded={openVolunteer}
          >
            <div className="text-left">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
                Community Impact
              </div>
              <div className="text-white font-semibold">Volunteering & Service</div>
              <div className="text-gray-400 text-sm">Leadership beyond the lab</div>
            </div>
            <motion.span
              animate={{ rotate: openVolunteer ? 180 : 0 }}
              className="text-cyan-400 text-xl group-hover:text-purple-400 transition-colors"
            >
              ▾
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {openVolunteer && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-4 grid gap-4">
                  {(Array.isArray(volunteering) ? volunteering : []).map((v, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-white/5 backdrop-blur rounded-xl p-5 border border-white/10 hover:border-cyan-400/20 transition-all duration-300"
                    >
                      <div className="text-white font-semibold mb-3 flex items-center gap-2">
                        <span className="text-lg" aria-hidden="true">{getVolunteerIcon(v.label)}</span>

                        {v.label}
                      </div>
                      <ul className="space-y-2 list-none">
                        {Array.isArray(v.details) &&
                          v.details.map((d, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-cyan-400 text-xs mt-1">▸</span>
                              <span>{String(d)}</span>
                            </li>
                          ))}
                      </ul>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Medal */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full border border-yellow-500/30">
            <span className="text-2xl">🏅</span>
            <span className="text-sm text-yellow-300">Armed Forces Service Medal Recipient</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
