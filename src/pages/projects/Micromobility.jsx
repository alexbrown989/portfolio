// src/pages/projects/Micromobility.jsx
import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Link } from 'react-router-dom'
import ProjectLayout from '../ProjectLayout'
import { projects } from '../../content/projects'

// Reuse Coastal "Glass" but local here to keep page self-contained
function Glass({ children, className = '', hover = true, pad = true }) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.01, y: -2 } : {}}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl border border-white/12 bg-white/7 backdrop-blur-sm relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className={`relative ${pad ? 'p-5' : ''}`}>{children}</div>
    </motion.div>
  )
}

/* ---------- tiny count-up hook for animated metrics ---------- */
// plain-JS count-up (no TS types)
function useCountUp(target = 0, duration = 1200) {
  const [val, setVal] = useState(0)
  const start = useRef(null)

  useEffect(() => {
    let raf
    const step = (t) => {
      if (start.current === null) start.current = t
      const p = Math.min(1, (t - start.current) / duration)
      setVal(Number((target * p).toFixed(1)))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return val
}


/* ---------- Animated SVG: Documents → Dedoose → Bar chart ---------- */
function PipelineSVG() {
  return (
    <svg viewBox="0 0 620 200" className="w-full h-[180px]">
      {/* docs stack */}
      <g>
        <rect x="20" y="30" width="90" height="120" rx="10" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
        <rect x="32" y="48" width="66" height="10" fill="rgba(34,211,238,0.6)" />
        <rect x="32" y="66" width="52" height="10" fill="rgba(255,255,255,0.35)" />
        <rect x="32" y="84" width="58" height="10" fill="rgba(255,255,255,0.35)" />
        <rect x="32" y="102" width="45" height="10" fill="rgba(255,255,255,0.35)" />
      </g>

      {/* arrow */}
      <g>
        <rect x="130" y="88" width="120" height="4" fill="rgba(34,211,238,0.6)">
          <animate attributeName="width" values="0;120;0" dur="3s" repeatCount="indefinite" />
        </rect>
        <polygon points="260,90 245,82 245,98" fill="rgba(34,211,238,0.6)"/>
      </g>

      {/* processor */}
      <g>
        <rect x="280" y="45" width="120" height="110" rx="14" fill="rgba(99,102,241,0.15)" stroke="rgba(99,102,241,0.35)" />
        <text x="340" y="90" textAnchor="middle" fill="white" fontSize="12" style={{opacity:.9}}>
          Dedoose
        </text>
        <text x="340" y="110" textAnchor="middle" fill="rgba(255,255,255,.7)" fontSize="10">
          Code & Theme
        </text>
      </g>

      {/* arrow */}
      <g>
        <rect x="410" y="88" width="120" height="4" fill="rgba(34,211,238,0.6)">
          <animate attributeName="width" values="0;120;0" dur="3s" repeatCount="indefinite" begin="0.3s" />
        </rect>
        <polygon points="540,90 525,82 525,98" fill="rgba(34,211,238,0.6)"/>
      </g>

      {/* bar chart */}
      <g>
        <rect x="560" y="40" width="40" height="120" rx="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.25)" />
        <rect x="566" y="140" width="8" height="15" fill="rgba(34,211,238,0.8)">
          <animate attributeName="height" values="10;60;10" dur="2.6s" repeatCount="indefinite" />
          <animate attributeName="y" values="145;95;145" dur="2.6s" repeatCount="indefinite" />
        </rect>
        <rect x="578" y="120" width="8" height="35" fill="rgba(99,102,241,0.8)">
          <animate attributeName="height" values="30;90;30" dur="2.2s" repeatCount="indefinite" />
          <animate attributeName="y" values="130;70;130" dur="2.2s" repeatCount="indefinite" />
        </rect>
        <rect x="590" y="130" width="8" height="25" fill="rgba(16,185,129,0.9)">
          <animate attributeName="height" values="20;70;20" dur="2.8s" repeatCount="indefinite" />
          <animate attributeName="y" values="140;90;140" dur="2.8s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  )
}

/* ---------- Equity Card with animated count on in-view ---------- */
function EquityCard({ icon, title, percent, caption }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const value = useCountUp(inView ? percent : 0, 1100)

  return (
    <Glass>
      <div ref={ref} className="flex items-start gap-3">
        <div className="text-2xl md:text-3xl">{icon}</div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-2xl md:text-3xl font-extrabold text-cyan-300 mt-1">
            {value.toFixed(1)}%
          </div>
          <p className="text-[13px] text-gray-300 mt-1">{caption}</p>
        </div>
      </div>
    </Glass>
  )
}

export default function Micromobility() {
  const project = useMemo(() => projects.find(p => p.id === 'micromobility'), [])
  const tagline = '// From Human Needs to Hardware Requirements'

  return (
    <ProjectLayout>
      {/* SECTION 1: HEADER */}
      <section className="pt-20 md:pt-24 pb-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200">{tagline}</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2">
            Engineering for Equitable Urban Mobility
          </h1>
          <p className="text-gray-300 mt-3 max-w-3xl text-[15px]">
            Co-authored a peer-reviewed study translating qualitative equity policy from 250 plus U.S. programs into actionable engineering constraints for inclusive vehicle design.
          </p>
        </div>
      </section>

      {/* SECTION 2: CHALLENGE – animated pipeline + concept sketch */}
      <section className="pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
            The Challenge: From Policy to Pavement
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Left card: Animated pipeline with metric overlay */}
            <Glass>
              <div className="relative">
                <PipelineSVG />
                <div className="absolute -top-3 -right-3">
                  <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 text-[11px] font-mono">
                    4,000+ ANALYTICAL CODES
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-300 mt-3">
                Systematically decoded hundreds of municipal documents into machine-usable codes to surface barriers for underserved communities.
              </p>
            </Glass>

            {/* Right card: concept sketch (drop in your image) */}
            <Glass>
              <img
                src="/projects/dedoose.jpg"
                alt="Adaptive micromobility concept sketch"
                className="w-full h-[320px] md:h-[260px] object-cover rounded-xl"
              />
              <p className="text-sm text-gray-300 mt-3">
                High-level equity goals fail without concrete hardware requirements. This project closes that gap.
              </p>
            </Glass>
          </div>
        </div>
      </section>

      {/* SECTION 3: INTERACTIVE ANALYSIS – Equity Gap Explorer */}
      <section className="pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
            Interactive Analysis: Quantifying the National Equity Gap
          </h2>
          <p className="text-gray-300 text-[15px] max-w-3xl mb-5">
            My analysis of more than 250 programs revealed measurable gaps. Leading cities are making progress, but nationally there are clear targets for engineering and policy intervention. Explore the key findings below.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <EquityCard
              icon="♿"
              title="Physical Accessibility"
              percent={29.0}
              caption="of cities require or incentivize adaptive vehicles. Over 70 percent of systems are not designed for mobility-impaired users."
            />
            <EquityCard
              icon="💵"
              title="Financial Inclusion"
              percent={48.8}
              caption="offer unbanked payment options. Without non-card alternatives, systems exclude low-income riders."
            />
            <EquityCard
              icon="📵"
              title="Digital Access"
              percent={42.4}
              caption="provide smartphone-free access. When a phone is required, public transit becomes a walled garden."
            />
            <EquityCard
              icon="🚌🛴"
              title="System Integration"
              percent={42.4}
              caption="integrate with transit cards or apps. Fragmentation penalizes riders who rely on multiple modes."
            />
          </div>
        </div>
      </section>

      {/* SECTION 4: RESULT – Translate gaps into engineering constraints */}
      <section className="pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">
            Result: Translating Gaps into Engineering Constraints
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <Glass>
              <h3 className="text-white font-semibold mb-2">1. Constraint: Design for Physical Accessibility</h3>
              <ul className="list-disc pl-5 text-gray-200 text-[13px] space-y-1.5">
                <li>Seated/transfer-friendly frames; adjustable contact geometry</li>
                <li>Securement points for adaptive devices</li>
                <li>Low-force controls and haptic confirmations</li>
              </ul>
            </Glass>

            <Glass>
              <h3 className="text-white font-semibold mb-2">2. Constraint: Engineer for Broader Access & Uptime</h3>
              <ul className="list-disc pl-5 text-gray-200 text-[13px] space-y-1.5">
                <li>Cash and SMS unlock flows; offline failsafes</li>
                <li>Swappable batteries, field-serviceable modules</li>
                <li>Ingress lighting, weatherized connectors, vandal-hardening</li>
              </ul>
            </Glass>

            <Glass>
              <h3 className="text-white font-semibold mb-2">3. Constraint: Mandate Inclusive & Adaptive Fleet Composition</h3>
              <ul className="list-disc pl-5 text-gray-200 text-[13px] space-y-1.5">
                <li>Set minimum adaptive percentage by zone demand</li>
                <li>Dynamic redeploy to equity zones by time-of-day</li>
                <li>Public-transit card interoperability as a requirement</li>
              </ul>
            </Glass>
          </div>
        </div>
      </section>

      {/* SECTION 5: CTA */}
      <section className="pb-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl p-6 md:p-7 text-center text-white bg-gradient-to-r from-blue-600/80 to-cyan-600/80 border border-white/10 shadow-[0_0_28px_rgba(56,189,248,.28)]">
            <h2 className="text-xl md:text-2xl font-bold">Why This Matters</h2>
            <p className="text-white/90 mt-2 text-sm max-w-3xl mx-auto">
              This project shows how I convert human-centered policy into concrete, testable engineering requirements. That is how equitable products actually get built and adopted.
            </p>
          </div>

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
