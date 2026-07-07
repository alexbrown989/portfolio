// src/pages/projects/BETH.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA,
} from '../../shared/ui'
import { projects } from '../../content/projects'

const project = projects.find(p => p.id === 'beth') || {}

/* ---------- Interactive elastin visualization ---------- */
function InteractiveElastin() {
  const [stretched, setStretched] = useState(false)
  return (
    <div className="relative h-64 rounded-xl bg-surface-3/60 border border-line overflow-hidden group">
      <div className="absolute top-3 left-3 text-[11px] font-mono uppercase tracking-[0.18em] text-gray-400">
        Click to stretch / release
      </div>
      <motion.div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setStretched(v => !v)}
        whileHover={{ scale: 1.005 }}
      >
        <svg viewBox="0 0 400 200" className="w-full h-full">
          <defs>
            <linearGradient id="elastin-gr" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#22bfe0" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {Array.from({ length: 12 }, (_, i) => (
            <motion.path
              key={i}
              stroke="url(#elastin-gr)"
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
        </svg>
      </motion.div>
      <div className="absolute bottom-3 right-3 text-right">
        <div className={`text-sm font-mono tracking-tight ${stretched ? 'text-amber-300' : 'text-brand-300'}`}>
          {stretched ? 'HIGH ENTROPY' : 'LOW ENTROPY'}
        </div>
        <div className="text-[11px] text-gray-400 mt-0.5">
          {stretched ? 'Heat absorbed' : 'Heat released'}
        </div>
      </div>
    </div>
  )
}

/* ---------- Thermal flow diagram ---------- */
function ThermalFlow() {
  const [stage, setStage] = useState(0)
  const stages = ['Absorption', 'Storage', 'Release']
  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {stages.map((s, i) => (
          <button
            key={s}
            onClick={() => setStage(i)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              stage === i
                ? 'bg-brand-500/15 text-brand-200 border border-brand-500/40'
                : 'bg-white/[0.03] text-gray-400 border border-line hover:border-line-strong'
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <div className="relative h-64 rounded-xl bg-surface-3/60 border border-line overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div key="a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 w-1.5 h-20 rounded-full bg-gradient-to-b from-amber-400 to-transparent"
                  style={{ left: `${20 + i * 15}%` }}
                  animate={{ y: [0, 200], opacity: [1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
                />
              ))}
              <div className="text-center z-10">
                <div className="text-white font-semibold">Solar absorption</div>
                <div className="text-xs text-gray-400 mt-1">Carbon black · ~98% efficiency</div>
              </div>
            </motion.div>
          )}
          {stage === 1 && (
            <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-32 h-32 rounded-full bg-gradient-to-r from-brand-500/20 to-accent-500/20 blur-2xl"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <div className="absolute inset-0 flex items-center justify-center text-center">
                <div>
                  <div className="text-white font-semibold">Phase-change storage</div>
                  <div className="text-2xl font-bold text-brand-300 mt-1 tabular-nums">~247 kJ/kg</div>
                  <div className="text-xs text-gray-400 mt-1">Latent heat · n-eicosane</div>
                </div>
              </div>
            </motion.div>
          )}
          {stage === 2 && (
            <motion.div key="c" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center">
              {Array.from({ length: 5 }, (_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0 w-1.5 h-20 rounded-full bg-gradient-to-t from-brand-400 to-transparent"
                  style={{ left: `${20 + i * 15}%` }}
                  animate={{ y: [0, -200], opacity: [1, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.25 }}
                />
              ))}
              <div className="text-center z-10">
                <div className="text-white font-semibold">Controlled release</div>
                <div className="text-xs text-gray-400 mt-1">Time-shifted thermal regulation</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function BETH() {
  const [tab, setTab] = useState('concept')
  const tabs = [
    { id: 'concept',      label: 'Hypothesis' },
    { id: 'mechanism',    label: 'Materials' },
    { id: 'performance',  label: 'Properties' },
    { id: 'applications', label: 'Applications' },
  ]

  return (
    <ProjectLayout>
      <PageHero
        kicker="// Theoretical Framework · Passive Thermal Systems"
        title="BET-H: Biological Elastin Thermoregulation"
        subtitle="A framework exploring passive thermal control inspired by elastin's entropy-driven behavior — translating biological principles into engineered materials that regulate heat without external power."
        chips={project.tech || []}
        status={{ label: 'R&D', tone: 'brand', pulse: true }}
      />

      {/* Highlights */}
      <section className="pb-8">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Zero external power', 'No moving parts', 'Passive response', 'Bio-inspired'].map((k) => (
              <div key={k} className="rounded-xl border border-line bg-surface-2/60 backdrop-blur-sm py-3 px-4 text-center">
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90">{k}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Tabs */}
      <section className="pb-10">
        <Container>
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === t.id
                    ? 'bg-brand-500/15 text-brand-200 border border-brand-500/40'
                    : 'bg-white/[0.03] text-gray-400 border border-line hover:text-white hover:border-line-strong'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {tab === 'concept' && (
              <motion.div key="concept" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Glass>
                  <h2 className="text-xl font-bold text-white mb-4">The biological spark</h2>
                  <div className="grid md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">
                        Elastin manages energy through entropy changes in its hydration shell. Stretch it and molecular disorder increases, absorbing heat; release it and order returns, expelling heat — no active metabolism required.
                      </p>
                      <div className="rounded-lg border border-brand-500/25 bg-brand-500/[0.05] p-4">
                        <div className="text-sm text-brand-200 font-semibold mb-1">Experimental evidence</div>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          At 37°C, elastin releases −159.5 ± 5 mJ/g internally while mechanical work is only 35.5 ± 0.3 mJ/g. That 4.5× difference comes from water reorientation, not polymer deformation.
                        </p>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        <span className="text-accent-400 font-semibold">BET-H proposes:</span> this isn’t unique to elastin — it’s a design principle. Materials can regulate thermal energy through reversible structural transitions alone.
                      </p>
                    </div>
                    <InteractiveElastin />
                  </div>
                </Glass>
              </motion.div>
            )}

            {tab === 'mechanism' && (
              <motion.div key="mechanism" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Glass>
                  <h2 className="text-xl font-bold text-white mb-4">Material-driven thermoregulation</h2>
                  <ThermalFlow />
                  <div className="mt-6 grid md:grid-cols-3 gap-4">
                    {[
                      { title: 'Phase-change materials', body: 'Store latent heat during phase transitions (~247 kJ/kg for n-eicosane). Provide thermal buffering without a temperature rise.' },
                      { title: 'Graphite sheets',        body: 'Ultrahigh in-plane conductivity (~4300 W/m·K in thin films) spreads heat laterally while limiting through-plane loss.' },
                      { title: 'Carbon black',           body: 'Near-perfect solar absorption (~98%) plus mechanical reinforcement. Durable, low-cost, globally available.' },
                    ].map((c) => (
                      <div key={c.title} className="rounded-lg border border-line bg-surface-3/40 p-4">
                        <div className="text-brand-300 text-xs font-mono uppercase tracking-[0.18em] mb-2">{c.title}</div>
                        <p className="text-sm text-gray-300 leading-relaxed">{c.body}</p>
                      </div>
                    ))}
                  </div>
                </Glass>
              </motion.div>
            )}

            {tab === 'performance' && (
              <motion.div key="performance" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Glass>
                  <h2 className="text-xl font-bold text-white mb-4">Material properties</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <MetricBox value="~247"  label="Latent heat"       sub="kJ/kg (n-eicosane)" />
                    <MetricBox value="~4300" label="In-plane conductivity" sub="W/m·K (graphite)" />
                    <MetricBox value="~98%"  label="Solar absorption"  sub="Carbon black" />
                    <MetricBox value="~400"  label="Copper conductivity" sub="W/m·K (isotropic)" />
                  </div>
                  <div className="mt-6 rounded-lg border border-line bg-surface-3/40 p-5">
                    <div className="text-white font-semibold mb-3">Framework principles</div>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex gap-2"><span className="text-brand-300 mt-0.5">→</span><span><b className="text-white">Abstraction, not imitation:</b> extract thermodynamic function from biology, not biochemical structure.</span></li>
                      <li className="flex gap-2"><span className="text-brand-300 mt-0.5">→</span><span><b className="text-white">Passive by design:</b> system intelligence emerges from material properties and geometry.</span></li>
                      <li className="flex gap-2"><span className="text-brand-300 mt-0.5">→</span><span><b className="text-white">Scalable materials:</b> carbon black, graphite, PCMs, and copper are abundant and cheap.</span></li>
                      <li className="flex gap-2"><span className="text-brand-300 mt-0.5">→</span><span><b className="text-white">Research status:</b> conceptual applications require durability testing and validation.</span></li>
                    </ul>
                  </div>
                </Glass>
              </motion.div>
            )}

            {tab === 'applications' && (
              <motion.div key="applications" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                <Glass>
                  <h2 className="text-xl font-bold text-white mb-4">Conceptual applications</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { title: 'EV battery thermal buffer', body: 'Passive fast-charge buffering with layered PCM architecture.', status: 'Theoretical' },
                      { title: 'Solar roofing system',       body: 'Multi-layer heat capture and time-shifted energy release.',  status: 'Conceptual' },
                      { title: 'Stirling dissipator',        body: 'Cold-side heat rejection using conductive networks + PCM.', status: 'Design phase' },
                      { title: 'MDT framework',              body: 'Design principles and methodology for future studies.',      status: 'Research' },
                    ].map((a) => (
                      <div key={a.title} className="rounded-lg border border-line bg-surface-3/40 p-4">
                        <div className="text-white font-semibold text-sm">{a.title}</div>
                        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{a.body}</p>
                        <div className="mt-3 text-[10px] font-mono uppercase tracking-[0.18em] text-amber-300/80">{a.status}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-lg border border-amber-400/25 bg-amber-500/[0.05] p-4">
                    <p className="text-sm text-amber-200/90 leading-relaxed">
                      Note: these applications are theoretical. They require experimental validation, durability testing, and performance characterization under real-world conditions before any product claim.
                    </p>
                  </div>
                </Glass>
              </motion.div>
            )}
          </AnimatePresence>
        </Container>
      </section>

      <ProjectCTA
        title="Rethinking thermal systems"
        body="This framework replaces mechanical complexity with material intelligence — embedding thermodynamic function into structure so systems respond to their environment through physics alone."
        primary={{ label: 'Discuss research', to: '/#contact' }}
      />

      <ProjectPager currentId="beth" />
    </ProjectLayout>
  )
}
