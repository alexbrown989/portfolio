// src/pages/projects/BETH.jsx
import { motion } from 'framer-motion'
import ProjectLayout from '../ProjectLayout'
import { Link } from 'react-router-dom'

/* ---------------------------- Small Utilities ---------------------------- */

function Kicker({ children }) {
  return (
    <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200">
      {children}
    </div>
  )
}

function H2({ children }) {
  return (
    <div className="mb-4">
      <h2 className="text-xl md:text-2xl font-bold text-white">{children}</h2>
      <div className="mt-2 h-px w-24 bg-gradient-to-r from-cyan-400/80 to-transparent rounded-full" />
    </div>
  )
}

/** Local glass wrapper (no cross-file deps). Pass `group` to enable hover overlay. */
function Glass({ className = '', children, hover = true, pad = true }) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.015, y: -2 } : {}}
      transition={{ duration: 0.25 }}
      className={`group relative rounded-2xl border border-white/12 bg-white/7 backdrop-blur-sm overflow-hidden ${pad ? 'p-5' : ''} ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

/* ---------------------- 1) Elastin: function, not form -------------------- */
/** Animated fiber network that stretches (disorder) then recoils (order). */
function ElastinSketch() {
  // Stretches down, then recoils
  const stretch = {
    initial: { scaleY: 1, y: 0 },
    cycle: {
      scaleY: [1, 1.25, 1],
      y: ['0%', '10%', '0%'],
      transition: { duration: 3.2, ease: 'easeInOut', repeat: Infinity }
    }
  }

  return (
    <div className="w-full h-44 grid place-items-center">
      <motion.svg
        viewBox="0 0 200 140"
        className="w-full h-full"
        variants={stretch}
        initial="initial"
        animate="cycle"
      >
        <defs>
          <linearGradient id="elastinGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>

        {/* Longitudinal fibers */}
        {[30, 60, 100, 140, 170].map((x, i) => (
          <path
            key={i}
            d={`M ${x} 18 Q ${x + (i % 2 ? 10 : -10)} 70 ${x} 122`}
            stroke="url(#elastinGrad)"
            strokeWidth="3"
            fill="none"
            opacity="0.85"
          />
        ))}

        {/* Cross links (entropy-sensitive) */}
        {[...Array(8)].map((_, i) => {
          const y = 24 + i * 12
          return (
            <motion.line
              key={i}
              x1={25}
              x2={175}
              y1={y}
              y2={y + (i % 2 ? 3 : -3)}
              stroke="url(#elastinGrad)"
              strokeWidth="1.5"
              initial={{ opacity: 0.7 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.2 + i * 0.05, repeat: Infinity, ease: 'easeInOut' }}
            />
          )
        })}
      </motion.svg>
      <div className="mt-2 text-xs text-gray-400">Stretch ↔ Recoil (entropy-driven network)</div>
    </div>
  )
}

/* ---------------- 2) BET-H: unified, sequenced mechanism sketch ------------ */
/** Heat → Disorder ↑ → Hydration clamp ↓ → Heat out (release) */
function BETHMechanism() {
  // Timeline control using staggered containers
  const seq = {
    init: { opacity: 0 },
    enter: { opacity: 1, transition: { when: 'beforeChildren', staggerChildren: 0.12 } }
  }

  const heatWave = {
    init: { pathLength: 0, opacity: 0.0 },
    enter: {
      pathLength: [0, 1],
      opacity: [0.0, 1, 0.0],
      transition: { duration: 1.6, repeat: Infinity, repeatDelay: 1.2, ease: 'easeInOut' }
    }
  }

  const core = {
    init: { scale: 1, rotate: 0, filter: 'saturate(90%)' },
    // heat-in → disorder (expand + slight rotate)
    heat: {
      scale: 1.06,
      rotate: 2,
      filter: 'saturate(120%)',
      transition: { duration: 0.8, ease: 'easeOut' }
    },
    // hydrated → entropy buffered (clamp back)
    hydrated: {
      scale: 1.0,
      rotate: 0,
      filter: 'saturate(100%)',
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  }

  return (
    <div className="relative grid sm:grid-cols-[140px_1fr_140px] gap-4 items-center">
      {/* Heat in (left) */}
      <motion.svg variants={seq} initial="init" animate="enter" className="w-full h-28">
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M 10 ${20 + i * 18} C 50 ${10 + i * 18}, 90 ${30 + i * 18}, 130 ${20 + i * 18}`}
            stroke="#fbbf24"
            strokeWidth="3"
            fill="none"
            variants={heatWave}
          />
        ))}
      </motion.svg>

      {/* Core material */}
      <div className="relative h-32 rounded-xl border border-white/15 bg-white/5 overflow-hidden">
        {/* core slab */}
        <motion.div
          className="absolute inset-2 rounded-lg"
          style={{ background: 'linear-gradient(180deg, rgba(34,211,238,.12), rgba(167,139,250,.12))' }}
          variants={core}
          initial="init"
          animate={['heat', 'hydrated']}
          transition={{ repeat: Infinity, repeatDelay: 1.0 }}
        />

        {/* water molecules appear during "hydrated" stage */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-cyan-300/80"
            style={{ top: `${12 + (i % 4) * 18}px`, left: `${12 + (i * 11) % 80}%` }}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: [0, 1, 0], y: [-6, 0, -6] }}
            transition={{ duration: 2.6, delay: 0.6 + i * 0.08, repeat: Infinity }}
          />
        ))}
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-[11px] text-gray-300">Hydration clamps entropy → stores/release heat</div>
        </div>
      </div>

      {/* Heat out (right, cooler) */}
      <motion.svg variants={seq} initial="init" animate="enter" className="w-full h-28">
        {[0, 1, 2].map((i) => (
          <motion.path
            key={i}
            d={`M 10 ${20 + i * 18} C 50 ${10 + i * 18}, 90 ${30 + i * 18}, 130 ${20 + i * 18}`}
            stroke="#60a5fa"
            strokeWidth="3"
            fill="none"
            variants={heatWave}
            transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.2 }}
          />
        ))}
      </motion.svg>
    </div>
  )
}

/* ------------------- 3) Animated system/architecture cards ----------------- */

function SolarRoofDiagram() {
  return (
    <div className="h-48 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden">
      {/* Sun rays */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 left-0 h-1 w-24 bg-amber-300/70"
          style={{ transformOrigin: 'left center', rotate: 15 + i * 4, top: 10 + i * 6 }}
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: [ -40, 110, 130 ], opacity: [0, 1, 0] }}
          transition={{ duration: 2.2, delay: i * 0.15, repeat: Infinity }}
        />
      ))}

      {/* Layer stack */}
      <div className="absolute inset-2 grid grid-rows-3 rounded-lg overflow-hidden">
        <div className="row-span-1 bg-zinc-900/70 grid place-items-center text-xs text-gray-300">
          Carbon Black (absorption)
        </div>
        <div className="row-span-1 bg-slate-800/70 relative">
          {/* heat carriers flowing downward */}
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-rose-300/80"
              style={{ left: `${5 + (i * 6) % 90}%`, top: 6 }}
              animate={{ y: [0, 20], opacity: [0.8, 0.6] }}
              transition={{ duration: 1.8 + (i % 3) * 0.2, repeat: Infinity, delay: i * 0.05 }}
            />
          ))}
          <div className="absolute inset-0 grid place-items-center text-xs text-gray-300">Graphite Sheet (transfer)</div>
        </div>
        <div className="row-span-1 bg-slate-700/70 relative">
          {/* PCM “fill level” */}
          <motion.div
            className="absolute left-0 bottom-0 w-full bg-cyan-400/20"
            initial={{ height: '10%' }}
            animate={{ height: ['10%', '85%', '12%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute inset-0 grid place-items-center text-xs text-gray-300">PCM Core (storage)</div>
        </div>
      </div>
    </div>
  )
}

function StirlingDiagram() {
  return (
    <div className="h-48 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden grid place-items-center">
      {/* Piston */}
      <motion.div
        className="w-40 h-3 rounded bg-cyan-400/60"
        animate={{ x: [-10, 10, -10] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* “Flywheel” */}
      <motion.div
        className="absolute right-4 top-4 w-10 h-10 rounded-full border border-white/20"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute bottom-2 left-2 text-[11px] text-gray-400">
        Thermal expansion → mechanical work → dissipation
      </div>
    </div>
  )
}

/* --------------------------------- Page ----------------------------------- */

export default function BETH() {
  return (
    <ProjectLayout>
      {/* Header */}
      <section className="pt-24 pb-6">
        <div className="container mx-auto px-6">
          <Kicker>// A New Framework for Zero-Energy Thermal Control</Kicker>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2">
            The BET-H Framework: Passive Thermodynamics Inspired by Biology
          </h1>
          <p className="text-gray-300 mt-3 max-w-3xl">
            A multidisciplinary hypothesis for passive thermal regulation inspired by elastin’s entropy buffering.
            In preparation for peer-reviewed publication, BET-H proposes a pathway to infrastructure-free thermal systems.
          </p>
        </div>
      </section>

      {/* Conceptual Leap */}
      <section className="pb-10">
        <div className="container mx-auto px-6">
          <H2>The Conceptual Leap: From Biology to Engineering</H2>
          <div className="grid md:grid-cols-2 gap-6">
            <Glass>
              <div className="text-sm text-gray-400 mb-2">The Biological Model: Elastin</div>
              <ElastinSketch />
              <p className="text-sm text-gray-300 mt-3">
                Elastin’s network stretches under load and recoils as entropy returns—an insight into thermal
                buffering without moving parts.
              </p>
            </Glass>

            <Glass>
              <div className="text-sm text-gray-400 mb-2">The Engineering Hypothesis: BET-H</div>
              <div className="h-16" />
              <p className="text-sm text-gray-300">
                The Biological Elastin Thermoregulation Hypothesis reframes hydration as a controllable clamp on entropy:
                capture heat, stabilize via hydration, and release when conditions change.
              </p>
            </Glass>
          </div>
        </div>
      </section>

      {/* Core Framework */}
      <section className="pb-10">
        <div className="container mx-auto px-6">
          <H2>The BET-H Framework: A New Design Paradigm</H2>
          <Glass>
            <BETHMechanism />
            <p className="text-sm text-gray-300 mt-4">
              Heat raises disorder in a material. Controlled hydration “clamps” the entropy state, passively storing
              energy that later releases as hydration changes—uniting thermodynamics, materials science, and biomechanics.
            </p>
          </Glass>
        </div>
      </section>

      {/* Systems & Materials */}
      <section className="pb-8">
        <div className="container mx-auto px-6">
          <H2>Theoretical Systems & Material Performance</H2>
          <div className="grid md:grid-cols-2 gap-6">
            <Glass>
              <div className="text-sm font-semibold text-white mb-1">System 1: Solar Roofing</div>
              <div className="text-xs text-gray-400 mb-3">Carbon black → Graphite → PCM core</div>
              <SolarRoofDiagram />
              <p className="text-sm text-gray-300 mt-3">
                Broadband absorption with carbon black, lateral transfer through graphite, and phase-change storage in
                a PCM reservoir for time-shifted release.
              </p>
            </Glass>

            <Glass>
              <div className="text-sm font-semibold text-white mb-1">System 2: Stirling Engine Dissipator</div>
              <div className="text-xs text-gray-400 mb-3">Thermal expansion → Mechanical work → Heat sink</div>
              <StirlingDiagram />
              <p className="text-sm text-gray-300 mt-3">
                Waste-heat expansion provides the work to drive a simplified Stirling cycle for dissipation or
                low-grade power generation.
              </p>
            </Glass>
          </div>

          {/* Key materials metrics */}
          <div className="grid sm:grid-cols-3 gap-3 mt-6">
            <Glass hover={false}>
              <div className="text-2xl font-bold text-white">250 kJ/kg</div>
              <div className="text-xs text-gray-400 mt-1">Latent Heat Capacity (PCMs)</div>
            </Glass>
            <Glass hover={false}>
              <div className="text-2xl font-bold text-white">4300 W/m·K</div>
              <div className="text-xs text-gray-400 mt-1">Thermal Conductivity (Graphite)</div>
            </Glass>
            <Glass hover={false}>
              <div className="text-2xl font-bold text-white">~98%</div>
              <div className="text-xs text-gray-400 mt-1">Solar Absorption (Carbon Black)</div>
            </Glass>
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <H2>Vision & Future Impact</H2>
          <Glass>
            <div className="text-sm font-semibold text-white mb-2">Designing for a Post-Infrastructure World</div>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1">
              <li><span className="text-white">Off-Grid Energy:</span> scalable, infrastructure-free thermal control for low-resource and climate-vulnerable communities.</li>
              <li><span className="text-white">Biomedical Devices:</span> self-regulating thermal components for implants and wearables.</li>
              <li><span className="text-white">Climate-Resilient Architecture:</span> materials that passively buffer heat loads to reduce active HVAC demand.</li>
            </ul>
          </Glass>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <Glass pad>
            <div className="grid md:grid-cols-[1fr_auto_auto] gap-4 items-center">
              <div>
                <h3 className="text-2xl font-bold text-white">Why This Research Matters</h3>
                <p className="text-sm text-gray-300 mt-2">
                  BET-H synthesizes principles from thermodynamics, materials science, and biomechanics into a novel,
                  testable hypothesis—first-principles thinking aimed at foundational, global-impact tech.
                </p>
              </div>
              <a
                href="/#contact"
                className="px-5 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm text-center"
              >
                Get in Touch
              </a>
              <a
                href="/files/beth_draft.pdf"
                target="_blank"
                className="px-5 py-3 rounded-lg border border-white/15 text-gray-200 hover:border-cyan-400/50 hover:text-white text-sm text-center"
              >
                Read Draft (PDF)
              </a>
            </div>
          </Glass>

          <div className="mt-6">
            <Link className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors" to="/#projects">
              <span>←</span> Back to Projects
            </Link>
          </div>
        </div>
      </section>
    </ProjectLayout>
  )
}
