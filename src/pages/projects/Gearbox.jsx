// src/pages/projects/Gearbox.jsx
//
// Three-stage reduction gearbox case study. The interactive is driven by
// the actual AGMA worksheet numbers from the build: 4000 → 800 → 200 → 50
// RPM, six gears across three stages, tangential loads and factor-of-safety
// values per gear.

import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA, STARSection, AARSection, Downloads,
} from '../../shared/ui'
import { SafeImage } from '../../shared/Media'
import { projects } from '../../content/projects'
import { usePageMeta } from '../../shared/usePageMeta'

const STLViewer = lazy(() => import('../../shared/STLViewer.jsx'))

const project = projects.find(p => p.id === 'gearbox') || {}

/* ------------------------------------------------------------------- */
/* Three-stage train — from the AGMA 2001-D04 analysis worksheet        */
/* ------------------------------------------------------------------- */
//
// Actual per-gear specs, materials, tangential loads, and factors of
// safety from the build. G1 → G2 → G3 → G4 → G5 → G6 across three stages.

const STAGES = [
  {
    stage: 1, ratio: 5.0,
    input:  { rpm: 4000, torque: 2.11 },
    output: { rpm: 800,  torque: 10.56 },
    driver: {
      id: 'G1', role: 'Input pinion',      teeth: 20,  Pd: 32, d: 0.625,
      material: '4140 Steel',   Sa: 41000, Wt: 6.75,   Y: 0.1585, F: 0.500,
      stress:   2725.55, fos:  15.04,
    },
    driven: {
      id: 'G2', role: 'Driven gear',       teeth: 100, Pd: 32, d: 3.125,
      material: '6061-T6 Al',   Sa: 14000, Wt: 6.75,   Y: 0.4134, F: 0.500,
      stress:   1044.99, fos:  13.39,
    },
    Ko: 1.25, Kv: 1.32, Ks: 1.00, Km: 1.15,
  },
  {
    stage: 2, ratio: 4.0,
    input:  { rpm: 800, torque: 10.56 },
    output: { rpm: 200, torque: 42.26 },
    driver: {
      id: 'G3', role: 'Intermediate pinion', teeth: 24, Pd: 24, d: 1.000,
      material: '4140 Steel',   Sa: 41000, Wt: 21.12,  Y: 0.1702, F: 0.625,
      stress:   4765.03, fos:  8.60,
    },
    driven: {
      id: 'G4', role: 'Driven gear',         teeth: 96, Pd: 24, d: 4.000,
      material: '6061-T6 Al',   Sa: 14000, Wt: 21.12,  Y: 0.4111, F: 0.625,
      stress:   1972.78, fos:  7.10,
    },
    Ko: 1.25, Kv: 1.15, Ks: 1.00, Km: 1.18,
  },
  {
    stage: 3, ratio: 4.0,
    input:  { rpm: 200, torque: 42.26 },
    output: { rpm: 50,  torque: 169.04 },
    driver: {
      id: 'G5', role: 'Final-stage pinion', teeth: 24, Pd: 20, d: 1.200,
      material: '4140 Steel',   Sa: 41000, Wt: 70.43,  Y: 0.1693, F: 0.750,
      stress:  11093.52, fos:  3.70,
    },
    driven: {
      id: 'G6', role: 'Terminal output',    teeth: 96, Pd: 20, d: 4.800,
      material: '4140 Steel',   Sa: 30000, Wt: 70.43,  Y: 0.1441, F: 0.750,
      stress:  13033.54, fos:  2.30,
    },
    Ko: 1.25, Kv: 1.05, Ks: 1.00, Km: 1.22,
  },
]

// Draw a stylized spur gear as a rosette path.
function gearPath({ cx, cy, r, teeth, toothH = 5 }) {
  const step = (Math.PI * 2) / (teeth * 2)
  let d = ''
  for (let i = 0; i <= teeth * 2; i++) {
    const a = i * step
    const rad = i % 2 === 0 ? r : r - toothH
    const x = cx + Math.cos(a) * rad
    const y = cy + Math.sin(a) * rad
    d += `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)} `
  }
  return d + 'Z'
}

// Color a gear by material — steel (cyan/blue) vs aluminum (silver).
function materialFill(material) {
  return material.includes('Steel')
    ? { fill: 'url(#gb-steel)', stroke: 'rgba(34,191,224,0.9)', label: 'text-brand-200' }
    : { fill: 'url(#gb-alum)',  stroke: 'rgba(203,213,225,0.9)', label: 'text-gray-200' }
}

function fosTone(fos) {
  if (fos < 2)  return { class: 'text-red-300',    bar: '#ef4444' }
  if (fos < 5)  return { class: 'text-amber-300',  bar: '#f59e0b' }
  return         { class: 'text-emerald-300', bar: '#22c55e' }
}

function GearTrainSim() {
  const [inputRpm, setInputRpm] = useState(4000)
  const [phase, setPhase] = useState(0) // radians on the input shaft
  const raf = useRef(0)
  const t0 = useRef(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const step = (now) => {
      if (!t0.current) t0.current = now
      const dt = (now - t0.current) / 1000
      t0.current = now
      // Drive at input RPM, scaled way down so the visual reads at any speed.
      setPhase(p => p + (inputRpm / 60) * Math.PI * 2 * dt * 0.02)
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [inputRpm, reduce])

  // Global reduction is the product of the stage ratios.
  const totalRatio = STAGES.reduce((a, s) => a * s.ratio, 1) // = 80
  const outputRpm  = inputRpm / totalRatio
  // Output torque scales with the ratio × input torque. Use input torque at
  // stage 1 (2.11 lb-in at 4000 rpm) as the reference; scale linearly with
  // input rpm to show a live number.
  const scale = inputRpm / 4000
  const outputTorque = 169.04 * scale

  // Geometry — six gears meshed left to right, then centered in the SVG.
  // 1) Compute natural radii proportional to pitch diameter with a floor
  //    so the smallest pinions still read as gears (min ~ 22 px).
  // 2) Lay them out tangent (center-to-center = rA + rB).
  // 3) Measure the total footprint and translate the whole group so the
  //    train sits centered in the SVG viewbox.

  const svgW = 900, svgH = 280
  const gearR = (d) => Math.max(22, d * 15)  // px per inch of pitch diameter

  const layout = []
  const cy = svgH / 2
  let x = 0
  for (let i = 0; i < STAGES.length; i++) {
    const stage = STAGES[i]
    const rDr = gearR(stage.driver.d)
    const rDn = gearR(stage.driven.d)
    if (i === 0) {
      layout.push({ role: 'driver', gear: stage.driver, cx: x + rDr, cy, r: rDr, sign: 1 })
      const drivenCx = x + rDr + rDr + rDn
      layout.push({ role: 'driven', gear: stage.driven, cx: drivenCx, cy, r: rDn, sign: -1 })
      x = drivenCx + rDn
    } else {
      // Stage i's driver shares its centerline with the previous stage's
      // driven (single shaft), so we DON'T advance x before it.
      const prev = layout[layout.length - 1]
      layout.push({ role: 'driver', gear: stage.driver, cx: prev.cx, cy, r: rDr, sign: prev.sign, shared: true })
      const drivenCx = prev.cx + rDr + rDn
      layout.push({ role: 'driven', gear: stage.driven, cx: drivenCx, cy, r: rDn, sign: -prev.sign })
      x = drivenCx + rDn
    }
  }

  // Center the whole train horizontally in the SVG. Track outermost edges
  // (leftmost gear center minus its radius, rightmost center plus its radius).
  const leftEdge  = layout[0].cx - layout[0].r
  const rightEdge = layout[layout.length - 1].cx + layout[layout.length - 1].r
  const trainW    = rightEdge - leftEdge
  const xOffset   = (svgW - trainW) / 2 - leftEdge
  for (const g of layout) g.cx += xOffset

  // Per-gear rotation angle. Rotation flips through each mesh, and the
  // relative speed = ratio of the driving to driven gear teeth.
  // We track running angle in radians using per-gear teeth ratios so
  // consecutive gears mesh correctly.
  const angles = []
  let cumulative = phase
  layout.forEach((g, i) => {
    if (i === 0) angles.push(cumulative)
    else {
      const prev = layout[i - 1]
      // Meshed gears rotate opposite; speed ratio = prev.teeth / this.teeth
      const ratio = prev.gear.teeth / g.gear.teeth
      cumulative = -cumulative * ratio
      // For a shared shaft (same shaft as previous), take the same angle.
      if (g.shared) cumulative = angles[i - 1]
      angles.push(cumulative)
    }
  })

  return (
    <div className="rounded-xl border border-line bg-surface-3/60 overflow-hidden">
      <div className="p-4">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-72 bg-black/40 rounded-lg border border-line">
          <defs>
            <radialGradient id="gb-steel">
              <stop offset="0%" stopColor="#22bfe0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0e6a82" />
            </radialGradient>
            <radialGradient id="gb-alum">
              <stop offset="0%" stopColor="#e2e8f0" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#475569" />
            </radialGradient>
          </defs>

          {/* Baseline shaft line */}
          <line x1="20" y1={cy} x2={svgW - 20} y2={cy} stroke="rgba(148,163,184,0.18)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Gears */}
          {layout.map((g, i) => {
            const mat = materialFill(g.gear.material)
            return (
              <g key={g.gear.id} transform={`translate(${g.cx}, ${g.cy}) rotate(${angles[i] * 180 / Math.PI})`}>
                <path
                  d={gearPath({ cx: 0, cy: 0, r: g.r, teeth: g.gear.teeth, toothH: 6 })}
                  fill={mat.fill}
                  stroke={mat.stroke}
                  strokeWidth="1"
                />
                <circle cx="0" cy="0" r="8" fill="#0f172a" stroke={mat.stroke} strokeWidth="1.5" />
                <line x1="0" y1="0" x2={g.r - 10} y2="0" stroke={mat.stroke} strokeWidth="2" />
              </g>
            )
          })}

          {/* Gear labels (bottom of each gear) */}
          {layout.map((g, i) => (
            <text
              key={`lbl-${g.gear.id}-${i}`}
              x={g.cx} y={g.cy + g.r + 16}
              textAnchor="middle"
              fontFamily="ui-monospace, JetBrains Mono, monospace"
              fontSize="10"
              fill={g.gear.material.includes('Steel') ? 'rgba(125,211,252,0.85)' : 'rgba(203,213,225,0.85)'}
              style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}
            >
              {g.gear.id} · {g.gear.teeth}T
            </text>
          ))}

          {/* Stage brackets along the top */}
          {STAGES.map((s, i) => {
            const startIdx = i === 0 ? 0 : 2 * i
            const endIdx   = startIdx + 1
            const startX = layout[startIdx].cx
            const endX   = layout[endIdx].cx
            return (
              <g key={`stage-${s.stage}`}>
                <line x1={startX} x2={endX} y1={20} y2={20} stroke="rgba(34,191,224,0.4)" strokeWidth="1" />
                <line x1={startX} x2={startX} y1={16} y2={24} stroke="rgba(34,191,224,0.4)" strokeWidth="1" />
                <line x1={endX}   x2={endX}   y1={16} y2={24} stroke="rgba(34,191,224,0.4)" strokeWidth="1" />
                <text x={(startX + endX) / 2} y={12} textAnchor="middle"
                  fontFamily="ui-monospace, JetBrains Mono, monospace"
                  fontSize="10" fill="rgba(148,163,184,0.85)"
                  style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                  Stage {s.stage} · {s.ratio.toFixed(1)}:1
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Controls */}
      <div className="grid md:grid-cols-[1fr_auto] gap-4 p-4 pt-0 border-t border-line">
        <div className="pt-4">
          <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 mb-1">
            Input RPM · <span className="text-white">{inputRpm}</span>
          </div>
          <input
            type="range"
            min="500" max="4000" step="100"
            value={inputRpm}
            onChange={(e) => setInputRpm(Number(e.target.value))}
            aria-label="Input RPM"
            className="w-full accent-brand-500"
          />
          <div className="text-[11px] text-gray-500 mt-1">
            Design point: 4000 RPM · 2.11 lb-in input, geared down to 50 RPM · 169.04 lb-in output.
          </div>
        </div>
        <div className="pt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Total ratio</div>
            <div className="text-sm font-semibold text-brand-200 tabular-nums">{totalRatio.toFixed(0)} : 1</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Output RPM</div>
            <div className="text-sm font-semibold text-white tabular-nums">{outputRpm.toFixed(1)}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Output torque</div>
            <div className="text-sm font-semibold text-white tabular-nums">{outputTorque.toFixed(1)} lb-in</div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------- */
/* AGMA analysis table                                                  */
/* ------------------------------------------------------------------- */

function AGMATable() {
  const rows = STAGES.flatMap(s => [
    { stage: s.stage, ...s.driver },
    { stage: s.stage, ...s.driven },
  ])

  return (
    <Glass pad={false}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-3/60 text-left">
            <tr className="text-[10.5px] font-mono uppercase tracking-[0.18em] text-gray-400">
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Gear</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Material</th>
              <th className="px-4 py-3">N teeth</th>
              <th className="px-4 py-3">Wt (lb)</th>
              <th className="px-4 py-3">σ (psi)</th>
              <th className="px-4 py-3">FoS</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const tone = fosTone(r.fos)
              return (
                <tr key={r.id} className={i % 2 ? 'bg-surface-2/40' : ''}>
                  <td className="px-4 py-2 text-gray-400 font-mono">{r.stage}</td>
                  <td className="px-4 py-2 text-white font-semibold">{r.id}</td>
                  <td className="px-4 py-2 text-gray-300">{r.role}</td>
                  <td className="px-4 py-2 text-gray-300">{r.material}</td>
                  <td className="px-4 py-2 text-gray-300 tabular-nums">{r.teeth}</td>
                  <td className="px-4 py-2 text-gray-300 tabular-nums">{r.Wt.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-300 tabular-nums">{r.stress.toLocaleString()}</td>
                  <td className={`px-4 py-2 tabular-nums font-semibold ${tone.class}`}>{r.fos.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="px-4 py-3 border-t border-line text-[11px] text-gray-500 leading-relaxed">
        AGMA 2001-D04 bending-stress analysis. Overload K<sub>o</sub> = 1.25, size K<sub>s</sub> = 1.00. Dynamic
        K<sub>v</sub> and load-distribution K<sub>m</sub> vary by stage. Green: FoS ≥ 5, amber 2–5, red &lt; 2.
      </div>
    </Glass>
  )
}

/* ------------------------------------------------------------------- */
/* Page                                                                  */
/* ------------------------------------------------------------------- */

export default function Gearbox() {
  usePageMeta({
    title: 'Three-Stage Reduction Gearbox · AGMA Analysis · Alex Brown',
    description: 'Quarter-long small-team design of a three-stage spur-gear reduction for a 1-DOF robotic elbow. 4000 → 50 RPM, 80:1, full AGMA 2001-D04 bending-stress analysis, mixed steel + aluminum stack.',
    path: '/projects/gearbox',
    image: '/projects/gearbox-render.jpg',
  })
  return (
    <ProjectLayout>
      <PageHero
        kicker="Mechanical Systems Design"
        title="Three-Stage Reduction Gearbox · Robotic Elbow"
        subtitle="Quarter-long small-team design of a three-stage spur-gear reduction for a 1-DOF robotic elbow. 4000 → 50 RPM · 2.11 → 169 lb-in. Full AGMA 2001-D04 analysis, mixed 4140-steel / 6061-T6-aluminum stack, design-review-approved assembly."
        chips={project.tech || []}
        status={{ label: 'Completed', tone: 'idle' }}
      >
        <div className="mt-2 text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
          Mar – Apr 2026 · small-team collaboration
        </div>
      </PageHero>

      <STARSection star={project.star} title="Overview" />

      {/* Signature interactive */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Interactive"
            code="I/01"
            title="Live 3-stage train · 4000 → 50 RPM"
            subtitle="Every gear rotates at its correct relative speed. Steel pinions in brand color, aluminum driven gears in silver. Total reduction 80:1."
          />
          <GearTrainSim />
        </Container>
      </section>

      {/* STL viewer — user will drop the assembly */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Assembly"
            code="A/02"
            title="Interactive CAD model"
            subtitle="Explore the assembled gearbox. Uses the same STL viewer as the other case studies — drop the file into /public/models/ to activate."
          />
          <Glass pad={false}>
            <Suspense fallback={
              <div className="h-[520px] flex items-center justify-center text-brand-300 text-sm font-mono">
                Loading 3D model…
              </div>
            }>
              <STLViewer
                src={project.stl || '/models/gearbox.stl'}
                layFlat
                height={520}
                cameraPosition={[900, 900, 900]}
                controlsTarget={[0, 0, 0]}
                zoom={2.2}
              />
            </Suspense>
            <div className="px-5 py-3 border-t border-line text-xs text-gray-400 font-mono">
              Drag to rotate · Scroll to zoom · Double-click to reset
            </div>
          </Glass>
        </Container>
      </section>

      {/* AGMA table — real numbers */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="AGMA 2001-D04"
            code="M/03"
            title="Stage-by-stage bending-stress analysis"
            subtitle="Actual numbers from the build. Tangential loads, Lewis form factors, calculated stress, and factor of safety per gear. Every gear passes with margin; G6 is the closest to the limit at FoS 2.30."
          />
          <AGMATable />
        </Container>
      </section>

      {/* CAD render media */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="CAD"
            code="C/04"
            title="Design snapshots"
          />
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { src: project.image || '/projects/gearbox-render.jpg', label: 'Final render' },
              { src: '/projects/gearbox-cad-1.jpg',                    label: 'CAD assembly · view 1' },
              { src: '/projects/gearbox-cad-2.jpg',                    label: 'CAD assembly · view 2' },
            ].map((m) => (
              <Glass pad={false} key={m.label}>
                <div className="p-4">
                  <SafeImage
                    src={m.src}
                    alt={m.label}
                    label={m.label}
                    aspect="aspect-[4/3]"
                    fit="contain"
                  />
                </div>
                <div className="px-5 py-3 border-t border-line text-sm text-gray-300">
                  {m.label}
                </div>
              </Glass>
            ))}
          </div>
        </Container>
      </section>

      {/* Key outcomes */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Key outcomes"
            code="R/05"
            title="Design point + margins"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricBox value="80 : 1"    label="Total reduction"        sub="3 stages · 5.0 × 4.0 × 4.0" />
            <MetricBox value="169 lb-in" label="Output torque"          sub="from 2.11 lb-in input" />
            <MetricBox value="FoS 2.30"  label="Weakest gear · G6"      sub="Terminal output · 4140 steel" />
            <MetricBox value="FoS 15.0"  label="Strongest gear · G1"    sub="Input pinion · 4140 steel" />
          </div>
        </Container>
      </section>

      <AARSection aar={project.aar} />
      <Downloads items={project.downloads} />

      <ProjectCTA
        title="Mechanical design roles"
        body="This project is a clean fit for full-time mechanical design and integration roles: CAD-heavy, calculation-defensible, and reviewed by real engineers. Happy to walk through the stack-up or torque math in depth."
        primary={{ label: 'Get in touch', to: '/#contact' }}
      />

      <ProjectPager currentId="gearbox" />
    </ProjectLayout>
  )
}
