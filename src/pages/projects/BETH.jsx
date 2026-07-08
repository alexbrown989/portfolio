// src/pages/projects/BETH.jsx
//
// Framework page for BET-H (Biological Elastin Thermoregulation).
// Emphasis on serious, defensible content with rich interactive graphics:
//   - Interactive stretched-vs-relaxed elastin model (entropy loop)
//   - Layered material stack diagram (PCM · graphite · carbon black · copper)
//   - Thermal cycle explorer (absorb / store / release / re-absorb)
//   - Material property table + framework principles
//   - Conceptual applications matrix

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Sun, Snowflake, Battery, Home, Cpu, FlaskConical } from 'lucide-react'
import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox, CornerBrackets,
  ProjectPager, ProjectCTA, STARSection, AARSection,
} from '../../shared/ui'
import { projects } from '../../content/projects'

const project = projects.find(p => p.id === 'beth') || {}

/* ------------------------------------------------------------------- */
/* Elastin entropy visualization                                        */
/* ------------------------------------------------------------------- */

function InteractiveElastin() {
  const [stretched, setStretched] = useState(false)
  const reduce = useReducedMotion()

  // Auto-cycle the state so the diagram breathes even before interaction.
  useEffect(() => {
    if (reduce) return
    const id = setInterval(() => setStretched(v => !v), 3400)
    return () => clearInterval(id)
  }, [reduce])

  return (
    <div className="relative h-72 rounded-xl bg-surface-3/60 border border-line overflow-hidden group">
      <div className="absolute top-3 left-3 text-[10.5px] font-mono uppercase tracking-[0.2em] text-gray-400">
        Interactive · Click to toggle
      </div>
      <button
        onClick={() => setStretched(v => !v)}
        aria-label="Toggle stretched state"
        className="absolute inset-0 cursor-pointer"
      >
        <svg viewBox="0 0 400 200" className="w-full h-full">
          <defs>
            <linearGradient id="el-gr" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22bfe0" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
            <radialGradient id="water-gr">
              <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Elastin chains */}
          {Array.from({ length: 12 }, (_, i) => (
            <motion.path
              key={i}
              stroke="url(#el-gr)"
              strokeWidth="2"
              fill="none"
              animate={{
                d: stretched
                  ? `M ${50 + i * 30} 10 Q ${60 + i * 30} 100 ${50 + i * 30} 190`
                  : `M ${50 + i * 30} 30 Q ${60 + i * 30} 100 ${50 + i * 30} 170`,
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          ))}

          {/* Water molecules — visualize hydration shell reorientation */}
          {Array.from({ length: 24 }, (_, i) => {
            const x = 60 + (i % 8) * 40 + (i % 3) * 4
            const y = 40 + Math.floor(i / 8) * 60 + (i % 2) * 5
            return (
              <motion.circle
                key={i}
                cx={x}
                cy={y}
                r={stretched ? 3 : 5}
                fill="url(#water-gr)"
                animate={{
                  scale:  stretched ? [1, 1.2, 1] : [1, 0.85, 1],
                  cx:     stretched ? x + (i % 2 ? 8 : -8) : x,
                  cy:     stretched ? y + (i % 3 ? 6 : -6) : y,
                  opacity: stretched ? 0.85 : 0.5,
                }}
                transition={{ duration: 1.2, repeat: Infinity, delay: (i % 6) * 0.12 }}
              />
            )
          })}
        </svg>
      </button>

      <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
        <div className="text-left">
          <div className={`text-sm font-mono tracking-tight ${stretched ? 'text-amber-300' : 'text-brand-300'}`}>
            {stretched ? 'STATE · STRETCHED' : 'STATE · RELAXED'}
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {stretched ? 'High entropy · water disordered · heat absorbed' : 'Low entropy · water ordered · heat released'}
          </div>
        </div>
        <div className="text-right text-[11px] font-mono text-gray-500">
          {stretched ? 'ΔS > 0' : 'ΔS < 0'}
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- */
/* Layered material stack diagram                                       */
/* ------------------------------------------------------------------- */

function MaterialStack() {
  const layers = [
    { name: 'Carbon black skin',   color: '#111827', role: '~98% solar absorption. Structural reinforcement.', kv: '~98%',   kk: 'α' },
    { name: 'Graphite spreader',   color: '#1f2937', role: '~4300 W/m·K in-plane. Lateral heat spreading.',   kv: '~4300',  kk: 'W/m·K' },
    { name: 'PCM matrix',          color: '#0e7490', role: 'n-eicosane · ~247 kJ/kg latent buffer.',           kv: '~247',   kk: 'kJ/kg' },
    { name: 'Copper substrate',    color: '#b45309', role: '~400 W/m·K isotropic. Sink and structure.',        kv: '~400',   kk: 'W/m·K' },
  ]
  return (
    <div className="rounded-xl border border-line bg-surface-3/40 p-4">
      <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/90 mb-3">
        Layered stack · Conceptual
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-3 items-center">
        <div className="space-y-1.5">
          {layers.map((L, i) => (
            <motion.div
              key={L.name}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-md border border-line px-3 py-2 flex items-center gap-3"
              style={{ background: `linear-gradient(90deg, ${L.color}, transparent 90%)` }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: L.color, boxShadow: `0 0 12px ${L.color}` }} />
              <div>
                <div className="text-sm text-white font-semibold">{L.name}</div>
                <div className="text-[11px] text-gray-400">{L.role}</div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-brand-200 font-mono text-sm tabular-nums">{L.kv}</div>
                <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500">{L.kk}</div>
              </div>
            </motion.div>
          ))}
        </div>
        {/* Heat-flow arrows */}
        <div className="flex flex-col items-center gap-1 h-full">
          <div className="text-[10px] font-mono uppercase tracking-widest text-amber-300/80">Sun</div>
          <motion.div
            className="w-1 flex-1 bg-gradient-to-b from-amber-400 via-brand-400 to-brand-500 rounded-full"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
          <div className="text-[10px] font-mono uppercase tracking-widest text-brand-300/80">Sink</div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- */
/* Thermal cycle explorer                                               */
/* ------------------------------------------------------------------- */

function ThermalCycle() {
  const [stage, setStage] = useState(0)
  const stages = [
    {
      key: 'absorb',
      label: 'Absorption',
      Icon: Sun,
      color: '#f59e0b',
      title: 'Solar absorption',
      body: 'Carbon-black surface absorbs incident radiation at ~98% efficiency. Graphite immediately spreads it laterally so no local hot spot forms.',
      metric: '~98%',
      metricLabel: 'α solar',
    },
    {
      key: 'store',
      label: 'Storage',
      Icon: FlaskConical,
      color: '#22bfe0',
      title: 'Phase-change storage',
      body: 'Once the PCM (n-eicosane) hits its transition, further heat goes into the melt rather than into temperature. Latent heat acts as a buffer.',
      metric: '~247',
      metricLabel: 'kJ/kg latent',
    },
    {
      key: 'release',
      label: 'Release',
      Icon: Snowflake,
      color: '#6366f1',
      title: 'Controlled release',
      body: 'When ambient drops, the PCM freezes and releases stored latent heat. Copper substrate conducts it out to the sink.',
      metric: '~400',
      metricLabel: 'W/m·K sink',
    },
  ]
  const s = stages[stage]

  // Auto-advance so the diagram breathes.
  useEffect(() => {
    const id = setInterval(() => setStage(v => (v + 1) % stages.length), 4200)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="flex gap-2 mb-3">
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
      <div className="relative h-72 rounded-xl bg-surface-3/60 border border-line overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={s.key}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 p-5 flex flex-col justify-between"
          >
            <div className="flex items-start gap-3">
              <s.Icon className="w-6 h-6 flex-shrink-0" style={{ color: s.color }} />
              <div>
                <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500">
                  Stage {String(stage + 1).padStart(2, '0')} · {s.label}
                </div>
                <div className="text-white font-semibold text-lg leading-tight">{s.title}</div>
                <div className="text-sm text-gray-300 leading-relaxed mt-2 max-w-md">{s.body}</div>
              </div>
            </div>

            {/* Flow lines */}
            <div className="relative h-24">
              {Array.from({ length: 8 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 w-0.5 h-24 rounded-full"
                  style={{
                    left: `${8 + i * 12}%`,
                    background: `linear-gradient(to ${s.key === 'release' ? 'top' : 'bottom'}, ${s.color}, transparent)`,
                  }}
                  animate={{
                    y: s.key === 'release' ? [0, -96, -96] : [0, 96, 96],
                    opacity: [0, 1, 0],
                  }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
              <div className="absolute inset-0 flex items-end justify-between">
                <div />
                <div className="text-right">
                  <div className="text-2xl md:text-3xl font-bold text-white tabular-nums leading-none">{s.metric}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-gray-400 mt-1">{s.metricLabel}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- */
/* Applications matrix                                                   */
/* ------------------------------------------------------------------- */

const APPS = [
  { Icon: Battery, title: 'EV battery thermal buffer', status: 'Theoretical',
    body: 'Layered PCM architecture buffers fast-charge heat before the pack has to react.' },
  { Icon: Home,    title: 'Solar roofing system',      status: 'Conceptual',
    body: 'Capture midday heat, release it into the building over the evening tail.' },
  { Icon: Cpu,     title: 'Stirling dissipator',       status: 'Design phase',
    body: 'Cold-side heat rejection using conductive networks plus latent buffering.' },
  { Icon: FlaskConical, title: 'MDT framework',        status: 'Research',
    body: 'Design principles and methodology so future studies inherit a shared vocabulary.' },
]

function ApplicationsGrid() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
      {APPS.map((a, i) => (
        <motion.div
          key={a.title}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: i * 0.06 }}
          className="group rounded-xl border border-line bg-surface-3/40 p-4 hover:border-brand-500/40 transition-colors"
        >
          <a.Icon className="w-5 h-5 text-brand-300 group-hover:text-brand-200 transition-colors" />
          <div className="text-white font-semibold text-sm mt-2">{a.title}</div>
          <p className="text-[12px] text-gray-400 mt-1.5 leading-relaxed">{a.body}</p>
          <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.18em] text-amber-300/80">{a.status}</div>
        </motion.div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------- */
/* Page                                                                  */
/* ------------------------------------------------------------------- */

export default function BETH() {
  return (
    <ProjectLayout>
      <PageHero
        kicker="Theoretical framework · Passive thermal systems"
        code="P/06"
        title="BET-H · Biological Elastin Thermoregulation"
        subtitle="A framework that abstracts elastin's entropy-driven behavior into a design pattern for passive thermal systems: PCM, graphite, carbon black, and copper arranged so that thermodynamic function lives in the material, not in a control loop."
        chips={project.tech || []}
        status={{ label: 'R&D', tone: 'brand', pulse: true }}
      />

      {/* STAR overview */}
      <STARSection star={project.star} title="Overview" />

      {/* Hypothesis + biological spark */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Biological spark"
            code="H/01"
            title="Why elastin?"
            subtitle="Elastin manages energy through entropy changes in its hydration shell. Stretch it and molecular disorder increases, absorbing heat. Release it and order returns, expelling heat. No active metabolism required."
          />
          <div className="grid md:grid-cols-[1fr_1.1fr] gap-5">
            <Glass>
              <div className="text-white font-semibold">The 4.5× signal</div>
              <p className="text-sm text-gray-300 mt-2 leading-relaxed">
                At 37&nbsp;°C, elastin releases &minus;159.5&nbsp;±&nbsp;5&nbsp;mJ/g internally
                while the mechanical work put in is only 35.5&nbsp;±&nbsp;0.3&nbsp;mJ/g. The
                4.5× difference comes from water reorientation in the hydration
                shell, not polymer deformation.
              </p>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <MetricBox value="4.5×" label="Thermal vs mechanical" sub="Water dominates" />
                <MetricBox value="ΔS"   label="Entropy driver"        sub="Hydration reorientation" />
                <MetricBox value="0 W"  label="External power"        sub="Passive by design" />
              </div>
              <p className="text-sm text-gray-300 mt-4 leading-relaxed">
                <span className="text-accent-400 font-semibold">BET-H proposes:</span> this
                isn't unique to elastin. It is a design principle. Materials can regulate
                thermal energy through reversible structural transitions alone.
              </p>
            </Glass>
            <Glass>
              <InteractiveElastin />
              <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                Simplified visualization. Chains splay under stretch; water molecules
                reorient. Diagram auto-cycles so state is always visible; click to hold.
              </p>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Material stack */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Material-driven thermoregulation"
            code="M/02"
            title="The stack"
            subtitle="Four abundant, cheap materials arranged so heat can enter easily, be spread laterally, buffered in a phase transition, and rejected cleanly. No moving parts, no sensors, no control loop."
          />
          <div className="grid md:grid-cols-[1.1fr_1fr] gap-5">
            <MaterialStack />
            <Glass>
              <div className="text-white font-semibold mb-2">How each layer earns its place</div>
              <ul className="space-y-3 text-sm text-gray-300 leading-relaxed">
                <li className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" /><span><b className="text-white">Carbon black</b> for near-perfect solar absorption and mechanical reinforcement. Cheap, durable, globally available.</span></li>
                <li className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" /><span><b className="text-white">Graphite sheets</b> for anisotropic conductivity. Fast lateral spread, limited through-plane leak.</span></li>
                <li className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" /><span><b className="text-white">PCM (n-eicosane)</b> for latent buffering. Absorbs energy at the phase point without raising temperature.</span></li>
                <li className="flex gap-2"><span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" /><span><b className="text-white">Copper substrate</b> for isotropic sinking. Structural backbone and heat highway to the environment.</span></li>
              </ul>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Thermal cycle */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Thermal cycle"
            code="T/03"
            title="Absorb · Store · Release"
            subtitle="System intelligence emerges from the sequence, not from a controller. Each stage is passive; sequence is enforced by geometry and phase-transition temperatures."
          />
          <Glass>
            <ThermalCycle />
          </Glass>
        </Container>
      </section>

      {/* Properties + principles */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Properties"
            code="P/04"
            title="Framework principles + numbers"
          />
          <div className="grid md:grid-cols-2 gap-5">
            <Glass>
              <div className="grid grid-cols-2 gap-3">
                <MetricBox value="~247"  label="Latent heat"              sub="kJ/kg · n-eicosane" />
                <MetricBox value="~4300" label="In-plane conductivity"    sub="W/m·K · graphite" />
                <MetricBox value="~98%"  label="Solar absorption"         sub="α · carbon black" />
                <MetricBox value="~400"  label="Copper conductivity"      sub="W/m·K · isotropic" />
              </div>
            </Glass>
            <Glass>
              <div className="text-white font-semibold mb-3">Framework principles</div>
              <ul className="space-y-2.5 text-sm text-gray-300 leading-relaxed">
                <li className="flex gap-2"><span className="text-brand-300 mt-0.5">→</span><span><b className="text-white">Abstraction, not imitation.</b> Extract the thermodynamic function from biology; leave the biochemistry.</span></li>
                <li className="flex gap-2"><span className="text-brand-300 mt-0.5">→</span><span><b className="text-white">Passive by design.</b> System intelligence lives in material properties and geometry, not in a controller.</span></li>
                <li className="flex gap-2"><span className="text-brand-300 mt-0.5">→</span><span><b className="text-white">Scalable materials.</b> PCM, graphite, carbon black, and copper are abundant, cheap, and manufacturable.</span></li>
                <li className="flex gap-2"><span className="text-brand-300 mt-0.5">→</span><span><b className="text-white">Research status.</b> Conceptual applications require experimental validation and durability testing before any product claim.</span></li>
              </ul>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Applications */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Conceptual applications"
            code="A/05"
            title="Where the framework lands"
          />
          <ApplicationsGrid />
          <CornerBrackets className="mt-5 rounded-lg border border-amber-400/25 bg-amber-500/[0.05] p-4">
            <p className="text-sm text-amber-200/90 leading-relaxed">
              These applications are theoretical. They require experimental validation,
              durability testing, and performance characterization under real-world
              conditions before any product-level claim can be made.
            </p>
          </CornerBrackets>
        </Container>
      </section>

      {/* AAR */}
      <AARSection aar={project.aar} />

      <ProjectCTA
        title="Rethinking thermal systems"
        body="This framework replaces mechanical complexity with material intelligence: embed thermodynamic function into the structure so systems respond to their environment through physics alone."
        primary={{ label: 'Discuss research', to: '/#contact' }}
      />

      <ProjectPager currentId="beth" />
    </ProjectLayout>
  )
}
