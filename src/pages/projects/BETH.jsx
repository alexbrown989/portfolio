// src/pages/projects/BETH.jsx
//
// Softened framework page. Detail on formulations, exact material property
// numbers, and application-specific specs has been pulled — this is
// early-stage in-progress research and the page now teaches the CONCEPT
// only. Anyone who wants the full technical depth is pointed at email.

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Sun, Snowflake, FlaskConical, Mail } from 'lucide-react'
import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, CornerBrackets,
  ProjectPager, ProjectCTA, STARSection, AARSection,
} from '../../shared/ui'
import { projects } from '../../content/projects'
import { usePageMeta } from '../../shared/usePageMeta'

const project = projects.find(p => p.id === 'beth') || {}

/* ------------------------------------------------------------------- */
/* Simple entropy toggle                                                */
/* ------------------------------------------------------------------- */
//
// Two-state cartoon: relaxed vs stretched. No slider. No jargon in the
// primary readout. Just: order → disorder → heat direction. Auto-cycles;
// the button lets you hold either state.

function EntropyToggle() {
  const [state, setState] = useState('relaxed') // relaxed | stretched
  const [manual, setManual] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || manual) return
    const id = setInterval(() => setState(s => s === 'relaxed' ? 'stretched' : 'relaxed'), 3600)
    return () => clearInterval(id)
  }, [reduce, manual])

  const stretched = state === 'stretched'
  // Both paths use the same command structure (M + 2×Q) so framer-motion
  // interpolates cleanly between coiled and flat.
  const chainD = stretched
    ? 'M 60 100 Q 130 100 200 100 Q 270 100 340 100'
    : 'M 60 100 Q 130 55  200 100 Q 270 145 340 100'

  return (
    <div className="rounded-xl bg-surface-3/60 border border-line overflow-hidden">
      <svg viewBox="0 0 400 200" className="w-full h-56">
        <defs>
          <linearGradient id="beth-chain" x1="0" x2="1">
            <stop offset="0%"   stopColor="#22bfe0" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <radialGradient id="beth-heat-in" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="beth-heat-out" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#22bfe0" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#22bfe0" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Heat halo */}
        <motion.ellipse
          cx="200" cy="100" rx="120" ry="60"
          fill={stretched ? 'url(#beth-heat-in)' : 'url(#beth-heat-out)'}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        />

        {/* Ordered vs disordered water dots */}
        {Array.from({ length: 22 }, (_, i) => {
          const angle = (i / 22) * Math.PI * 2
          const orderedR   = 42
          const disorderedR = 78 + (i % 4) * 5
          const r = stretched ? disorderedR : orderedR
          const cx = 200 + Math.cos(angle) * r
          const cy = 100 + Math.sin(angle) * r * 0.55
          return (
            <motion.circle
              key={i}
              animate={{ cx, cy, r: stretched ? 1.6 : 2.4, opacity: stretched ? 0.55 : 0.85 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              fill="#93c5fd"
            />
          )
        })}

        {/* Chain */}
        <motion.path
          animate={{ d: chainD }}
          transition={{ duration: 0.7 }}
          stroke="url(#beth-chain)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="60"  cy="100" r="5" fill="#0f172a" stroke="#22bfe0" strokeWidth="1.5" />
        <circle cx="340" cy="100" r="5" fill="#0f172a" stroke="#22bfe0" strokeWidth="1.5" />
      </svg>

      <div className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 items-center">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">State</div>
            <div className={`text-sm font-semibold ${stretched ? 'text-amber-300' : 'text-brand-200'}`}>
              {stretched ? 'Stretched' : 'Relaxed'}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Heat</div>
            <div className={`text-sm font-semibold ${stretched ? 'text-amber-300' : 'text-brand-200'}`}>
              {stretched ? 'Absorbed ↓' : 'Released ↑'}
            </div>
          </div>
        </div>
        <div className="inline-flex rounded-lg border border-line overflow-hidden">
          <button
            onClick={() => { setManual(true); setState('relaxed') }}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${state === 'relaxed' ? 'bg-brand-500/15 text-brand-200' : 'text-gray-400 hover:text-white'}`}
          >
            Relaxed
          </button>
          <button
            onClick={() => { setManual(true); setState('stretched') }}
            className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-line ${state === 'stretched' ? 'bg-amber-500/15 text-amber-200' : 'text-gray-400 hover:text-white'}`}
          >
            Stretched
          </button>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- */
/* Simplified thermal cycle                                             */
/* ------------------------------------------------------------------- */
//
// Three stages, each showing what the framework does at that step, with
// arrow-direction only. No exact material specs. Full technical detail
// available on request via the CTA below.

function ThermalCycleSimple() {
  const [stage, setStage] = useState(0)
  const stages = [
    { key: 'absorb',  label: 'Absorb',  Icon: Sun,          color: '#f59e0b',
      body: 'Incoming heat enters the composite through the absorbing outer layer.' },
    { key: 'store',   label: 'Store',   Icon: FlaskConical, color: '#22bfe0',
      body: 'A phase-change layer buffers the energy without raising temperature.' },
    { key: 'release', label: 'Release', Icon: Snowflake,    color: '#6366f1',
      body: 'When the ambient cools, the stored energy leaves through the substrate.' },
  ]
  const s = stages[stage]

  useEffect(() => {
    const id = setInterval(() => setStage(v => (v + 1) % stages.length), 3800)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {stages.map((s2, i) => (
          <button
            key={s2.key}
            onClick={() => setStage(i)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              stage === i
                ? 'bg-brand-500/15 text-brand-200 border border-brand-500/40'
                : 'bg-white/[0.03] text-gray-400 border border-line hover:border-line-strong hover:text-white'
            }`}
          >
            <s2.Icon className="w-3.5 h-3.5" />
            {s2.label}
          </button>
        ))}
      </div>

      <div className="relative rounded-xl bg-surface-3/60 border border-line overflow-hidden p-4">
        <svg viewBox="0 0 320 180" className="w-full h-52">
          {/* Layered stack — abstract, no material labels */}
          <rect x="20" y="30"  width="280" height="20" fill="#111827" opacity="0.85" />
          <rect x="20" y="55"  width="280" height="18" fill="#1f2937" opacity="0.85" />
          <rect x="20" y="78"  width="280" height="40" fill="#0e7490" opacity="0.85" />
          <rect x="20" y="122" width="280" height="26" fill="#a16207" opacity="0.85" />
          <rect x="20" y="30"  width="280" height="118" fill="none" stroke="rgba(148,163,184,0.28)" />

          <AnimatePresence mode="wait">
            {s.key === 'absorb' && (
              <motion.g key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {[0,1,2,3,4,5,6].map(i => (
                  <motion.line
                    key={i}
                    x1={60 + i * 32} y1={-2}
                    x2={60 + i * 32} y2={29}
                    stroke={s.color} strokeWidth="2" strokeLinecap="round"
                    animate={{ opacity: [0.15, 1, 0.15] }}
                    transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </motion.g>
            )}
            {s.key === 'store' && (
              <motion.g key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {/* Heat enters from the top and penetrates DOWN into the PCM layer.
                    Rectangle stays anchored to y=78 (top of PCM) and grows in
                    height so the fill front visibly moves top → bottom. */}
                <motion.rect
                  x="20" width="280" fill="#f97316" opacity="0.55"
                  initial={{ y: 78, height: 0 }}
                  animate={{ y: 78, height: 40 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
                {/* Bright leading edge follows the melt front. */}
                <motion.line
                  x1="20" x2="300"
                  stroke="#fbbf24" strokeWidth="1.5"
                  initial={{ y1: 78, y2: 78, opacity: 0 }}
                  animate={{ y1: 118, y2: 118, opacity: [0, 1, 0.7] }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                />
              </motion.g>
            )}
            {s.key === 'release' && (
              <motion.g key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                {[0,1,2,3,4,5,6].map(i => (
                  <motion.line
                    key={i}
                    x1={60 + i * 32} y1={150}
                    x2={60 + i * 32} y2={175}
                    stroke={s.color} strokeWidth="2" strokeLinecap="round"
                    animate={{ opacity: [0.15, 1, 0.15], y2: [172, 178, 172] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.12 }}
                  />
                ))}
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        <AnimatePresence mode="wait">
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.22 }}
            className="mt-2 flex items-start gap-2"
          >
            <s.Icon className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: s.color }} />
            <div>
              <div className="text-white font-semibold text-sm">{s.label}</div>
              <div className="text-sm text-gray-300 leading-relaxed">{s.body}</div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- */
/* Page                                                                  */
/* ------------------------------------------------------------------- */

export default function BETH() {
  usePageMeta({
    title: 'BET-H · Biological Elastin Thermoregulation · Alex Brown',
    description: 'Speculative framework: passive thermal regulation inspired by elastin\'s entropy-driven behavior in nature. Concept-level here; technical depth on request.',
    path: '/projects/beth',
    image: '/projects/beth.png',
  })
  return (
    <ProjectLayout>
      <PageHero
        kicker="Speculative framework · Passive thermal systems"
        title="BET-H · Biological Elastin Thermoregulation"
        subtitle="A speculative framework inspired by elastin's entropy-driven behavior in nature. The concept lives here in outline form; the technical detail (materials, formulations, sizing) is intentionally held back while the work is still in progress."
        chips={project.tech || []}
        status={{ label: 'R&D · early', tone: 'brand', pulse: true }}
      />

      <STARSection star={project.star} title="Overview" />

      {/* The idea */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="The idea"
            code="I/01"
            title="Order and disorder do the thermodynamic work"
            subtitle="Elastin manages energy through reversible structural transitions in its hydration shell. Stretch it and disorder increases, absorbing heat. Release it and order returns, releasing heat. No power required."
          />
          <div className="grid md:grid-cols-2 gap-5">
            <EntropyToggle />
            <Glass>
              <div className="text-white font-semibold">What BET-H proposes</div>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                The behavior above isn't unique to elastin. It's a design principle:
                arrange a small stack of common engineering materials so that
                thermodynamic function lives in the structure itself. The system
                responds to its environment through geometry and physics alone.
              </p>
              <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                No sensors. No control loop. No moving parts.
              </p>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Cycle */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Behavior"
            code="B/02"
            title="Absorb, store, release"
            subtitle="Three passive stages. What each stage does; not what materials or numbers back it. Ask for the deeper write-up if it's relevant to your team."
          />
          <ThermalCycleSimple />
        </Container>
      </section>

      {/* Deliberately reserved */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Deliberately reserved"
            code="D/03"
            title="Held back while the work is in progress"
          />
          <CornerBrackets className="rounded-2xl border border-line bg-surface-2/60 backdrop-blur-sm p-6">
            <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center">
              <div>
                <p className="text-[15px] text-gray-200 leading-relaxed">
                  Specific formulations, layer stacks, application-specific sizing,
                  and validation-run data are not published on the site yet.
                  I'll walk through the technical depth in a live conversation
                  once we have context on what your team is trying to do.
                </p>
                <ul className="mt-3 space-y-1.5 text-sm text-gray-300 leading-relaxed list-disc pl-5">
                  <li>Material stack details and reasoning</li>
                  <li>Ballpark thermal capacity and time constants</li>
                  <li>Application matrix (transport, structures, thermal storage)</li>
                  <li>Next-step validation plan and instrumentation</li>
                </ul>
              </div>
              <a
                href="mailto:alexbrow@uw.edu?subject=BET-H%20framework"
                className="glow-btn inline-flex items-center gap-2 px-4 py-3 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors whitespace-nowrap"
              >
                <Mail className="w-4 h-4" />
                Reach out for depth
              </a>
            </div>
          </CornerBrackets>
        </Container>
      </section>

      <AARSection aar={project.aar} />

      <ProjectCTA
        title="Rethinking thermal systems"
        body="This framework replaces mechanical complexity with material intelligence. If that overlaps with your team's work, I'm happy to talk through the depth in a private conversation."
        primary={{ label: 'Discuss research', to: '/#contact' }}
      />

      <ProjectPager currentId="beth" />
    </ProjectLayout>
  )
}
