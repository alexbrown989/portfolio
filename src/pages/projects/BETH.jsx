import { useState, useRef } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import ProjectLayout from '../ProjectLayout'
import { Link } from 'react-router-dom'

function Glass({ children, className = '', hover = true, glow = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { scale: 1.01, y: -2 } : {}}
      transition={{ duration: 0.3 }}
      className={`
        relative rounded-2xl border border-white/12 bg-white/7 backdrop-blur-sm overflow-hidden p-6
        ${glow ? 'shadow-[0_0_40px_rgba(6,182,212,0.15)]' : ''}
        ${className}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

function HeroSection() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="pt-24 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-xs font-mono uppercase tracking-[0.3em] text-cyan-400 mb-4"
        >
          // Theoretical Framework for Passive Thermal Systems
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6"
        >
          BET-H: <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
            Biological Elastin Thermoregulation
          </span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 max-w-3xl leading-relaxed"
        >
          A speculative framework exploring passive thermal control inspired by elastin's entropy-driven behavior.
          Translates biological principles into engineered materials that regulate heat without external power.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-6 mt-8"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Theoretical Research</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Conceptual Framework</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
            <span className="text-sm text-gray-300">Material Science</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function InteractiveElastin() {
  const [stretched, setStretched] = useState(false)

  return (
    <div className="relative h-64 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 overflow-hidden group">
      <div className="absolute top-4 left-4 text-xs text-gray-400 z-10">
        Click to stretch/release
      </div>
      
      <motion.div
        className="absolute inset-0 cursor-pointer"
        onClick={() => setStretched(!stretched)}
        whileHover={{ scale: 1.01 }}
      >
        <svg viewBox="0 0 400 200" className="w-full h-full">
          <defs>
            <linearGradient id="elastinGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
          </defs>

          {[...Array(12)].map((_, i) => (
            <motion.path
              key={i}
              d={`M ${50 + i * 30} 30 Q ${60 + i * 30} 100 ${50 + i * 30} 170`}
              stroke="url(#elastinGrad)"
              strokeWidth="2"
              fill="none"
              animate={{
                d: stretched
                  ? `M ${50 + i * 30} 10 Q ${60 + i * 30} 100 ${50 + i * 30} 190`
                  : `M ${50 + i * 30} 30 Q ${60 + i * 30} 100 ${50 + i * 30} 170`,
              }}
              transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            />
          ))}

          {[...Array(8)].map((_, i) => (
            <motion.line
              key={`cross-${i}`}
              x1={40}
              x2={360}
              y1={40 + i * 20}
              y2={40 + i * 20}
              stroke="url(#elastinGrad)"
              strokeWidth="1"
              opacity={0.6}
              animate={{
                y1: stretched ? 35 + i * 22 : 40 + i * 20,
                y2: stretched ? 35 + i * 22 : 40 + i * 20,
                opacity: stretched ? 0.3 : 0.6,
              }}
              transition={{ duration: 0.6 }}
            />
          ))}
        </svg>
      </motion.div>

      <div className="absolute bottom-4 right-4 z-10">
        <motion.div
          animate={{
            scale: stretched ? 1.05 : 1,
          }}
          className={`text-sm font-mono ${stretched ? 'text-yellow-400' : 'text-cyan-400'}`}
        >
          {stretched ? 'HIGH ENTROPY' : 'LOW ENTROPY'}
        </motion.div>
        <div className="text-xs text-gray-400 text-right mt-1">
          {stretched ? 'Heat absorbed' : 'Heat released'}
        </div>
      </div>
    </div>
  )
}

function ThermalFlowDiagram() {
  const [stage, setStage] = useState(0)
  const stages = ['Absorption', 'Storage', 'Release']

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {stages.map((s, i) => (
          <button
            key={s}
            onClick={() => setStage(i)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              stage === i
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-lg shadow-cyan-500/10'
                : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="relative h-64 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 overflow-hidden">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div
              key="absorption"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-0 w-2 h-20 bg-gradient-to-b from-yellow-400 to-transparent rounded-full"
                  style={{ left: `${20 + i * 15}%` }}
                  animate={{ y: [0, 200], opacity: [1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
              <div className="text-center z-10">
                <div className="text-4xl mb-3">☀️</div>
                <div className="text-white font-semibold text-lg">Solar Absorption</div>
                <div className="text-sm text-gray-400 mt-1">Carbon black: ~98% efficiency</div>
              </div>
            </motion.div>
          )}

          {stage === 1 && (
            <motion.div
              key="storage"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                <motion.div
                  className="w-32 h-32 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-2xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-white font-semibold text-lg">Phase Change Storage</div>
                    <div className="text-3xl font-bold text-cyan-400 mt-2">~247 kJ/kg</div>
                    <div className="text-sm text-gray-400 mt-1">Latent heat (n-eicosane)</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {stage === 2 && (
            <motion.div
              key="release"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-0 w-2 h-20 bg-gradient-to-t from-blue-400 to-transparent rounded-full"
                  style={{ left: `${20 + i * 15}%` }}
                  animate={{ y: [0, -200], opacity: [1, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
              <div className="text-center z-10">
                <div className="text-4xl mb-3">❄️</div>
                <div className="text-white font-semibold text-lg">Controlled Release</div>
                <div className="text-sm text-gray-400 mt-1">Time-shifted thermal regulation</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function PerformanceMetrics() {
  const metrics = [
    { 
      label: 'Latent Heat', 
      value: '~247', 
      unit: 'kJ/kg', 
      color: 'from-cyan-400 to-blue-500',
      note: 'n-eicosane PCM'
    },
    { 
      label: 'Thermal Conductivity', 
      value: '~4300', 
      unit: 'W/m·K', 
      color: 'from-purple-400 to-pink-500',
      note: 'Graphite (in-plane)'
    },
    { 
      label: 'Solar Absorption', 
      value: '~98', 
      unit: '%', 
      color: 'from-green-400 to-emerald-500',
      note: 'Carbon black'
    },
    { 
      label: 'Copper Thermal', 
      value: '~400', 
      unit: 'W/m·K', 
      color: 'from-yellow-400 to-orange-500',
      note: 'Isotropic'
    },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.label}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="relative group"
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${m.color} opacity-20 group-hover:opacity-30 transition-opacity rounded-xl blur-xl`} />
          <div className="relative bg-black/40 backdrop-blur rounded-xl border border-white/10 p-4 text-center hover:border-white/20 transition-colors">
            <div className="text-2xl md:text-3xl font-bold text-white">{m.value}</div>
            <div className="text-sm text-gray-400 mt-0.5">{m.unit}</div>
            <div className="text-xs text-gray-500 mt-2">{m.label}</div>
            <div className="text-[10px] text-gray-600 mt-1">{m.note}</div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function ApplicationsGrid() {
  const applications = [
    {
      icon: '🔋',
      title: 'EV Battery Concept',
      description: 'Passive thermal buffering during fast-charging with layered PCM architecture',
      status: 'Theoretical',
    },
    {
      icon: '🏠',
      title: 'Solar Roofing System',
      description: 'Multi-layer heat capture and time-shifted energy release platform',
      status: 'Conceptual',
    },
    {
      icon: '⚙️',
      title: 'Stirling Dissipator',
      description: 'Cold-side heat rejection using conductive networks and phase change buffering',
      status: 'Design Phase',
    },
    {
      icon: '🌡️',
      title: 'MDT Framework',
      description: 'Material-driven thermoregulation design principles and methodology',
      status: 'Research',
    },
  ]

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
      {applications.map((app, i) => (
        <motion.div
          key={app.title}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ scale: 1.03, y: -4 }}
          className="bg-white/5 backdrop-blur rounded-xl border border-white/10 p-5 hover:border-cyan-400/30 transition-all cursor-default"
        >
          <div className="text-3xl mb-3">{app.icon}</div>
          <h3 className="font-semibold text-white mb-2">{app.title}</h3>
          <p className="text-sm text-gray-400 mb-3 leading-relaxed">{app.description}</p>
          <div className="text-xs text-yellow-400/80 font-mono">{app.status}</div>
        </motion.div>
      ))}
    </div>
  )
}

export default function BETH() {
  const [activeTab, setActiveTab] = useState('concept')

  const tabs = [
    { id: 'concept', label: 'Hypothesis', icon: '💡' },
    { id: 'mechanism', label: 'Materials', icon: '⚙️' },
    { id: 'performance', label: 'Properties', icon: '📊' },
    { id: 'applications', label: 'Applications', icon: '🌍' },
  ]

  return (
    <ProjectLayout>
      <HeroSection />

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['Zero External Power', 'No Moving Parts', 'Passive Response', 'Bio-Inspired'].map((stat, i) => (
              <motion.div
                key={stat}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="text-center py-2"
              >
                <div className="text-xs text-cyan-400 font-mono">{stat}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-white border border-cyan-400/50 shadow-lg'
                    : 'bg-white/5 text-gray-400 border border-white/10 hover:text-white hover:border-white/20'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'concept' && (
              <motion.div
                key="concept"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Glass glow>
                  <h2 className="text-2xl font-bold text-white mb-6">The Biological Spark</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <p className="text-gray-300 leading-relaxed">
                        Elastin manages energy through entropy changes in its hydration shell. When stretched, 
                        molecular disorder increases and heat is absorbed. When released, order returns and heat 
                        is expelled—all without active metabolic input.
                      </p>
                      <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
                        <div className="text-sm text-cyan-300 font-semibold mb-2">Experimental Evidence</div>
                        <p className="text-sm text-gray-300">
                          At 37°C, elastin releases −159.5 ± 5 mJ/g internally while mechanical work is only 
                          35.5 ± 0.3 mJ/g. The 4.5× difference comes from water reorientation, not polymer deformation.
                        </p>
                      </div>
                      <p className="text-gray-300 leading-relaxed">
                        <span className="text-purple-400 font-semibold">BET-H proposes:</span> This isn't unique to elastin 
                        but represents a design principle—materials can regulate thermal energy through reversible 
                        structural transitions alone.
                      </p>
                    </div>
                    <InteractiveElastin />
                  </div>
                </Glass>
              </motion.div>
            )}

            {activeTab === 'mechanism' && (
              <motion.div
                key="mechanism"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Glass glow>
                  <h2 className="text-2xl font-bold text-white mb-6">Material-Driven Thermoregulation (MDT)</h2>
                  <ThermalFlowDiagram />
                  <div className="mt-8 grid md:grid-cols-3 gap-4">
                    <div className="bg-black/30 rounded-lg p-5 border border-white/10 hover:border-cyan-400/30 transition-colors">
                      <div className="text-cyan-400 font-semibold mb-3 text-sm">Phase Change Materials</div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Store latent heat during phase transitions (~247 kJ/kg for n-eicosane). 
                        Provide thermal buffering without temperature rise.
                      </p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-5 border border-white/10 hover:border-purple-400/30 transition-colors">
                      <div className="text-purple-400 font-semibold mb-3 text-sm">Graphite Sheets</div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Ultrahigh in-plane conductivity (~4300 W/m·K in thin films) enables rapid lateral 
                        heat spreading while limiting through-plane loss.
                      </p>
                    </div>
                    <div className="bg-black/30 rounded-lg p-5 border border-white/10 hover:border-green-400/30 transition-colors">
                      <div className="text-green-400 font-semibold mb-3 text-sm">Carbon Black</div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        Near-perfect solar absorption (~98%) plus mechanical reinforcement. 
                        Durable, low-cost, globally available.
                      </p>
                    </div>
                  </div>
                </Glass>
              </motion.div>
            )}

            {activeTab === 'performance' && (
              <motion.div
                key="performance"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Glass glow>
                  <h2 className="text-2xl font-bold text-white mb-6">Material Properties</h2>
                  <PerformanceMetrics />
                  <div className="mt-8 bg-black/30 rounded-xl p-6 border border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-4">Framework Principles</h3>
                    <ul className="space-y-3 text-gray-300 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-0.5 flex-shrink-0">→</span>
                        <span><strong className="text-white">Abstraction, not imitation:</strong> Extract thermodynamic function from biology rather than biochemical structure</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-0.5 flex-shrink-0">→</span>
                        <span><strong className="text-white">Passive by design:</strong> System intelligence emerges from material properties and spatial arrangement</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-0.5 flex-shrink-0">→</span>
                        <span><strong className="text-white">Scalable materials:</strong> Carbon black, graphite, PCMs, copper are abundant and cost-effective</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-cyan-400 mt-0.5 flex-shrink-0">→</span>
                        <span><strong className="text-white">Research status:</strong> Conceptual applications require experimental validation and long-term durability testing</span>
                      </li>
                    </ul>
                  </div>
                </Glass>
              </motion.div>
            )}

            {activeTab === 'applications' && (
              <motion.div
                key="applications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Glass glow>
                  <h2 className="text-2xl font-bold text-white mb-6">Conceptual Applications</h2>
                  <ApplicationsGrid />
                  <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <p className="text-sm text-yellow-200/90 leading-relaxed">
                      <strong>Note:</strong> These applications are theoretical frameworks requiring experimental validation, 
                      material durability testing, and performance characterization under real-world conditions.
                    </p>
                  </div>
                </Glass>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <section className="pb-16">
        <div className="container mx-auto px-6">
          <Glass className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Rethinking Thermal Systems
            </h2>
            <p className="text-gray-300 max-w-2xl mx-auto mb-8 leading-relaxed">
              This framework represents a fundamental shift: replacing mechanical complexity with material intelligence. 
              By embedding thermodynamic function into structure, we create systems that respond to their environment 
              through physics alone—no sensors, no control loops, no external power.
            </p>
            <Link 
              to="/#contact"
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
            >
              Discuss Research
            </Link>
          </Glass>

          <div className="mt-8 text-center">
            <Link 
              to="/#projects" 
              className="inline-flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              <span>←</span> Back to Projects
            </Link>
          </div>
        </div>
      </section>
    </ProjectLayout>
  )
}
