// src/pages/projects/Micromobility.jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass,
  ProjectPager, ProjectCTA, STARSection, AARSection,
} from '../../shared/ui'
import { projects } from '../../content/projects'
import { useInView } from 'framer-motion'
import { Accessibility, Wallet, SmartphoneNfc, TrainFront } from 'lucide-react'

const project = projects.find(p => p.id === 'micromobility') || {}

/* ------------------------------------------------------------------- */
/* Signature interactive: 100-rider equity simulator                    */
/* ------------------------------------------------------------------- */
//
// 100 rider icons in a grid. Each of the four equity gaps knocks out a
// slice of the population when the corresponding policy is OFF; toggling
// the policy ON lights those riders back up. Uses a deterministic seed
// so the same rider is always the "adaptive-need" rider on every render.
//
// Gap percentages come from the study:
//   Physical accessibility · 29.0% of programs incentivize adaptive vehicles
//   Financial inclusion    · 48.8% offer unbanked payment
//   Digital access         · 42.4% smartphone-free access
//   System integration     · 42.4% transit-card interoperable

const GAPS = [
  { key: 'access',      label: 'Physical accessibility', share: 0.15, color: '#22bfe0' },
  { key: 'financial',   label: 'Financial inclusion',    share: 0.20, color: '#22c55e' },
  { key: 'digital',     label: 'Digital access',         share: 0.18, color: '#a78bfa' },
  { key: 'integration', label: 'System integration',     share: 0.17, color: '#f59e0b' },
]

function EquitySimulator() {
  // Which gaps are being addressed (true = policy in place, riders can use it).
  const [on, setOn] = useState({ access: false, financial: false, digital: false, integration: false })

  // Deterministic rider composition: assign each of 100 riders to a
  // primary need bucket (or "unblocked" = no barrier) using a fixed
  // pseudo-random shuffle so the visual is stable.
  const riders = useMemo(() => {
    const out = []
    const seeds = [17, 41, 73, 109]
    let cursor = 0
    for (const [gi, gap] of GAPS.entries()) {
      const count = Math.round(gap.share * 100)
      for (let k = 0; k < count; k++) {
        // interleave the gap owners so they visually spread across the grid
        const idx = (cursor * 7 + seeds[gi]) % 100
        out[idx] = { gap: gap.key, color: gap.color }
        cursor++
      }
    }
    for (let i = 0; i < 100; i++) if (!out[i]) out[i] = { gap: null, color: null }
    return out
  }, [])

  const canRide = (r) => !r.gap || on[r.gap]
  const served = riders.filter(canRide).length

  const toggle = (k) => setOn(o => ({ ...o, [k]: !o[k] }))

  return (
    <div className="rounded-xl border border-line bg-surface-3/60 overflow-hidden">
      <div className="grid md:grid-cols-[1fr_260px]">
        <div className="p-4">
          <div className="grid grid-cols-10 gap-1.5 bg-black/40 border border-line rounded-lg p-3">
            {riders.map((r, i) => {
              const active = canRide(r)
              const fill = active ? (r.gap ? r.color : '#22bfe0') : 'rgba(148,163,184,0.18)'
              return (
                <fmotion.div
                  key={i}
                  className="aspect-square rounded-sm"
                  initial={false}
                  animate={{
                    backgroundColor: fill,
                    opacity: active ? 1 : 0.35,
                    scale: active ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.25, delay: (i % 10) * 0.005 }}
                />
              )
            })}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono uppercase tracking-[0.18em]">
            <span className="text-gray-500">100 potential riders · 1 dot each</span>
            <span className="text-white">Served: <span className="text-brand-200 tabular-nums">{served} / 100</span></span>
          </div>
        </div>

        <div className="p-4 md:border-l border-line space-y-2">
          <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 mb-1">
            Toggle equity policies
          </div>
          {GAPS.map(g => (
            <button
              key={g.key}
              onClick={() => toggle(g.key)}
              className={`w-full flex items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors ${
                on[g.key]
                  ? 'border-brand-500/40 bg-brand-500/[0.06] text-white'
                  : 'border-line text-gray-300 hover:border-line-strong hover:text-white'
              }`}
            >
              <div>
                <div className="text-sm font-semibold">{g.label}</div>
                <div className="text-[11px] text-gray-500">{Math.round(g.share * 100)}% of riders need this</div>
              </div>
              <span
                className="inline-flex w-8 h-4 rounded-full border relative transition-colors"
                style={{
                  borderColor: on[g.key] ? g.color : 'rgba(148,163,184,0.3)',
                  background: on[g.key] ? g.color + '55' : 'transparent',
                }}
              >
                <span
                  className="absolute top-0.5 rounded-full w-3 h-3 transition-all"
                  style={{
                    left: on[g.key] ? 'calc(100% - 14px)' : '2px',
                    background: on[g.key] ? g.color : 'rgba(148,163,184,0.5)',
                  }}
                />
              </span>
            </button>
          ))}
          <div className="pt-2 text-[11px] text-gray-500 leading-relaxed">
            Turn every policy on to unlock all 100 riders. That is the engineering constraint set the study produced.
          </div>
        </div>
      </div>
    </div>
  )
}

/* -------------------- Count-up hook -------------------- */
function useCountUp(target = 0, duration = 1100, active = true) {
  const [val, setVal] = useState(0)
  const startRef = useRef(null)
  useEffect(() => {
    if (!active) return
    let raf
    startRef.current = null
    const step = (t) => {
      if (startRef.current === null) startRef.current = t
      const p = Math.min(1, (t - startRef.current) / duration)
      setVal(Number((target * p).toFixed(1)))
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, active])
  return val
}

/* -------------------- Analytical pipeline SVG -------------------- */
function PipelineSVG() {
  return (
    <svg viewBox="0 0 620 200" className="w-full h-40">
      {/* docs */}
      <rect x="20" y="30" width="90" height="120" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
      <rect x="32" y="48" width="66" height="8" fill="rgba(34,191,224,0.55)" />
      <rect x="32" y="64" width="52" height="8" fill="rgba(255,255,255,0.28)" />
      <rect x="32" y="80" width="58" height="8" fill="rgba(255,255,255,0.28)" />
      <rect x="32" y="96" width="45" height="8" fill="rgba(255,255,255,0.28)" />

      <g>
        <rect x="130" y="88" width="120" height="3" fill="rgba(34,191,224,0.7)">
          <animate attributeName="width" values="0;120;0" dur="3s" repeatCount="indefinite" />
        </rect>
        <polygon points="260,90 245,82 245,98" fill="rgba(34,191,224,0.7)" />
      </g>

      <rect x="280" y="45" width="120" height="110" rx="12" fill="rgba(99,102,241,0.10)" stroke="rgba(99,102,241,0.32)" />
      <text x="340" y="90" textAnchor="middle" fill="#e5e7eb" fontSize="12" fontFamily="JetBrains Mono">Dedoose</text>
      <text x="340" y="108" textAnchor="middle" fill="rgba(255,255,255,.55)" fontSize="10" fontFamily="JetBrains Mono">Code & Theme</text>

      <g>
        <rect x="410" y="88" width="120" height="3" fill="rgba(34,191,224,0.7)">
          <animate attributeName="width" values="0;120;0" dur="3s" repeatCount="indefinite" begin="0.3s" />
        </rect>
        <polygon points="540,90 525,82 525,98" fill="rgba(34,191,224,0.7)" />
      </g>

      <rect x="560" y="40" width="40" height="120" rx="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.14)" />
      <rect x="566" y="140" width="8" height="15" fill="rgba(34,191,224,0.85)">
        <animate attributeName="height" values="10;60;10" dur="2.6s" repeatCount="indefinite" />
        <animate attributeName="y" values="145;95;145" dur="2.6s" repeatCount="indefinite" />
      </rect>
      <rect x="578" y="120" width="8" height="35" fill="rgba(99,102,241,0.85)">
        <animate attributeName="height" values="30;90;30" dur="2.2s" repeatCount="indefinite" />
        <animate attributeName="y" values="130;70;130" dur="2.2s" repeatCount="indefinite" />
      </rect>
      <rect x="590" y="130" width="8" height="25" fill="rgba(16,185,129,0.9)">
        <animate attributeName="height" values="20;70;20" dur="2.8s" repeatCount="indefinite" />
        <animate attributeName="y" values="140;90;140" dur="2.8s" repeatCount="indefinite" />
      </rect>
    </svg>
  )
}

function EquityCard({ Icon, title, percent, caption }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const value = useCountUp(percent, 1100, inView)
  return (
    <Glass>
      <div ref={ref} className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-md bg-surface-3/60 border border-line grid place-items-center flex-shrink-0">
          <Icon className="w-5 h-5 text-brand-300" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-white">{title}</div>
          <div className="text-2xl md:text-3xl font-extrabold text-brand-300 mt-0.5 tabular-nums">
            {value.toFixed(1)}%
          </div>
          <p className="text-[13px] text-gray-300 mt-1 leading-relaxed">{caption}</p>
        </div>
      </div>
    </Glass>
  )
}

export default function Micromobility() {
  return (
    <ProjectLayout>
      <PageHero
        kicker="// From Human Needs to Hardware Requirements"
        title="Engineering for Equitable Urban Mobility"
        subtitle="Co-authored peer-reviewed study translating qualitative equity policy from 250+ U.S. programs into actionable engineering constraints for inclusive vehicle design."
        chips={project.tech || []}
        status={{ label: 'Active', tone: 'brand', pulse: true }}
      />

      {/* Signature interactive */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Interactive"
            code="I/01"
            title="Rider simulator · 100 potential riders"
            subtitle="Each dot is a rider. Groups are shaded by the equity policy they need. Toggle policies on and off to see which slice of the population an operator serves at each level of inclusive design."
          />
          <EquitySimulator />
        </Container>
      </section>

      {/* Challenge */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// The Challenge"
            title="From policy to pavement"
            subtitle="Coding hundreds of municipal documents into machine-usable analytical constructs, then turning those constructs into requirements engineers can build against."
          />
          <div className="grid md:grid-cols-2 gap-5">
            <Glass pad={false}>
              <div className="p-5">
                <PipelineSVG />
              </div>
              <div className="px-5 py-4 border-t border-line flex items-center justify-between gap-3 flex-wrap">
                <p className="text-sm text-gray-300 max-w-md">
                  Systematically decoded hundreds of municipal documents into codes that surface barriers for underserved communities.
                </p>
                <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90 border border-brand-500/30 bg-brand-500/[0.06] rounded px-2 py-1">
                  4,000+ analytical codes
                </span>
              </div>
            </Glass>

            <Glass pad={false}>
              <img
                src="/projects/dedoose.jpg"
                alt="Adaptive micromobility concept sketch"
                className="w-full aspect-[16/10] object-cover rounded-t-2xl"
              />
              <div className="px-5 py-4 border-t border-line text-sm text-gray-300">
                High-level equity goals fail without concrete hardware requirements. This project closes that gap.
              </div>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Equity gap explorer */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Quantifying the Gap"
            title="Where U.S. programs fall short"
            subtitle="Analysis of 250+ programs shows measurable gaps. Leading cities are progressing, but nationally there are clear targets for engineering and policy intervention."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <EquityCard Icon={Accessibility}   title="Physical accessibility" percent={29.0}
              caption="of cities require or incentivize adaptive vehicles. 70%+ of systems aren’t designed for mobility-impaired users." />
            <EquityCard Icon={Wallet}          title="Financial inclusion"    percent={48.8}
              caption="offer unbanked payment options. Without non-card alternatives, systems exclude low-income riders." />
            <EquityCard Icon={SmartphoneNfc}   title="Digital access"         percent={42.4}
              caption="provide smartphone-free access. Phone-only access turns transit into a walled garden." />
            <EquityCard Icon={TrainFront}      title="System integration"     percent={42.4}
              caption="integrate with transit cards or apps. Fragmentation penalizes multimodal riders." />
          </div>
        </Container>
      </section>

      {/* Constraints */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Result"
            title="Translating gaps into engineering constraints"
          />
          <div className="grid md:grid-cols-3 gap-4">
            <Glass>
              <div className="text-brand-300/90 text-[11px] font-mono uppercase tracking-[0.18em]">01</div>
              <h3 className="text-white font-semibold mt-1">Design for physical accessibility</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-gray-300 list-disc pl-5 leading-relaxed">
                <li>Seated / transfer-friendly frames; adjustable contact geometry</li>
                <li>Securement points for adaptive devices</li>
                <li>Low-force controls and haptic confirmations</li>
              </ul>
            </Glass>
            <Glass>
              <div className="text-brand-300/90 text-[11px] font-mono uppercase tracking-[0.18em]">02</div>
              <h3 className="text-white font-semibold mt-1">Engineer for broader access & uptime</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-gray-300 list-disc pl-5 leading-relaxed">
                <li>Cash and SMS unlock flows; offline failsafes</li>
                <li>Swappable batteries, field-serviceable modules</li>
                <li>Ingress lighting, weatherized connectors, vandal hardening</li>
              </ul>
            </Glass>
            <Glass>
              <div className="text-brand-300/90 text-[11px] font-mono uppercase tracking-[0.18em]">03</div>
              <h3 className="text-white font-semibold mt-1">Mandate inclusive fleet composition</h3>
              <ul className="mt-3 space-y-1.5 text-sm text-gray-300 list-disc pl-5 leading-relaxed">
                <li>Minimum adaptive percentage by zone demand</li>
                <li>Dynamic redeploy to equity zones by time-of-day</li>
                <li>Transit-card interoperability as a requirement</li>
              </ul>
            </Glass>
          </div>
        </Container>
      </section>

      <STARSection star={project.star} />
      <AARSection aar={project.aar} />

      <ProjectCTA
        title="Why this matters"
        body="This project shows how I convert human-centered policy into concrete, testable engineering requirements. That discipline is what turns equitable products into ones people actually use."
        primary={{ label: 'Get in touch', to: '/#contact' }}
      />

      <ProjectPager currentId="micromobility" />
    </ProjectLayout>
  )
}
