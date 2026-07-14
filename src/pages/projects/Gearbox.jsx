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

  // Geometry — four shafts, compound pairs stacked concentrically.
  // Real train: G1 | G2+G3 | G4+G5 | G6
  // Stage 1 meshes G1→G2, stage 2 meshes G3→G4, stage 3 meshes G5→G6.
  // Radii stay proportional to pitch diameter (no floor that warps ratios).

  const svgW = 900, svgH = 320
  const gearR = (d) => d * 22  // px per inch of pitch diameter
  const cy = svgH / 2 + 8
  const padX = 36

  const [s1, s2, s3] = STAGES
  const r = {
    G1: gearR(s1.driver.d),
    G2: gearR(s1.driven.d),
    G3: gearR(s2.driver.d),
    G4: gearR(s2.driven.d),
    G5: gearR(s3.driver.d),
    G6: gearR(s3.driven.d),
  }

  // Shaft centers from successive mesh distances (driver + driven radii).
  const shaft = [0, 0, 0, 0]
  shaft[0] = padX + r.G1
  shaft[1] = shaft[0] + r.G1 + r.G2
  shaft[2] = shaft[1] + r.G3 + r.G4
  shaft[3] = shaft[2] + r.G5 + r.G6

  // Center the four-shaft train in the viewBox.
  const leftEdge  = shaft[0] - r.G1
  const rightEdge = shaft[3] + r.G6
  const xOffset   = (svgW - (rightEdge - leftEdge)) / 2 - leftEdge
  for (let i = 0; i < shaft.length; i++) shaft[i] += xOffset

  // Draw order: large compound gears first, then pinions on top.
  const layout = [
    { id: 'G2', gear: s1.driven, cx: shaft[1], cy, r: r.G2, angle: -phase * (s1.driver.teeth / s1.driven.teeth), z: 1 },
    { id: 'G4', gear: s2.driven, cx: shaft[2], cy, r: r.G4, angle:  phase * (s1.driver.teeth / s1.driven.teeth) * (s2.driver.teeth / s2.driven.teeth), z: 1 },
    { id: 'G6', gear: s3.driven, cx: shaft[3], cy, r: r.G6, angle: -phase * (s1.driver.teeth / s1.driven.teeth) * (s2.driver.teeth / s2.driven.teeth) * (s3.driver.teeth / s3.driven.teeth), z: 1 },
    { id: 'G1', gear: s1.driver, cx: shaft[0], cy, r: r.G1, angle:  phase, z: 2 },
    { id: 'G3', gear: s2.driver, cx: shaft[1], cy, r: r.G3, angle: -phase * (s1.driver.teeth / s1.driven.teeth), z: 2 }, // same shaft as G2
    { id: 'G5', gear: s3.driver, cx: shaft[2], cy, r: r.G5, angle:  phase * (s1.driver.teeth / s1.driven.teeth) * (s2.driver.teeth / s2.driven.teeth), z: 2 }, // same shaft as G4
  ]

  const stageBands = [
    { stage: 1, ratio: s1.ratio, x1: shaft[0], x2: shaft[1], rpm: `${s1.input.rpm} → ${s1.output.rpm}` },
    { stage: 2, ratio: s2.ratio, x1: shaft[1], x2: shaft[2], rpm: `${s2.input.rpm} → ${s2.output.rpm}` },
    { stage: 3, ratio: s3.ratio, x1: shaft[2], x2: shaft[3], rpm: `${s3.input.rpm} → ${s3.output.rpm}` },
  ]

  return (
    <div className="rounded-xl border border-line bg-surface-3/60 overflow-hidden">
      <div className="p-4">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-80 bg-black/40 rounded-lg border border-line">
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

          {/* Shaft baseline */}
          <line x1="20" y1={cy} x2={svgW - 20} y2={cy} stroke="rgba(148,163,184,0.18)" strokeWidth="1" strokeDasharray="4 4" />

          {/* Stage brackets — span mesh pairs on consecutive shafts */}
          {stageBands.map((s) => (
            <g key={`stage-${s.stage}`}>
              <line x1={s.x1} x2={s.x2} y1={22} y2={22} stroke="rgba(34,191,224,0.45)" strokeWidth="1.25" />
              <line x1={s.x1} x2={s.x1} y1={18} y2={26} stroke="rgba(34,191,224,0.45)" strokeWidth="1.25" />
              <line x1={s.x2} x2={s.x2} y1={18} y2={26} stroke="rgba(34,191,224,0.45)" strokeWidth="1.25" />
              <text x={(s.x1 + s.x2) / 2} y={14} textAnchor="middle"
                fontFamily="ui-monospace, JetBrains Mono, monospace"
                fontSize="10" fill="rgba(148,163,184,0.9)"
                style={{ letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Stage {s.stage} · {s.ratio.toFixed(1)}:1 · {s.rpm} RPM
              </text>
            </g>
          ))}

          {/* Gears (large first, compound pinions on top) */}
          {layout.map((g) => {
            const mat = materialFill(g.gear.material)
            const toothH = Math.max(4, Math.min(8, g.r * 0.12))
            return (
              <g key={g.id} transform={`translate(${g.cx}, ${g.cy}) rotate(${g.angle * 180 / Math.PI})`}>
                <path
                  d={gearPath({ cx: 0, cy: 0, r: g.r, teeth: Math.min(g.gear.teeth, 48), toothH })}
                  fill={mat.fill}
                  stroke={mat.stroke}
                  strokeWidth="1"
                  opacity={g.z === 1 ? 0.92 : 1}
                />
                <circle cx="0" cy="0" r={Math.max(5, g.r * 0.12)} fill="#0f172a" stroke={mat.stroke} strokeWidth="1.5" />
                <line x1="0" y1="0" x2={g.r * 0.72} y2="0" stroke={mat.stroke} strokeWidth="2" />
              </g>
            )
          })}

          {/* Shaft ticks */}
          {shaft.map((sx, i) => (
            <circle key={`shaft-${i}`} cx={sx} cy={cy} r="3" fill="rgba(148,163,184,0.55)" />
          ))}

          {/* Labels under each shaft */}
          {[
            { cx: shaft[0], lines: ['G1 · 20T', 'input'] },
            { cx: shaft[1], lines: ['G2 · 100T', 'G3 · 24T'] },
            { cx: shaft[2], lines: ['G4 · 96T', 'G5 · 24T'] },
            { cx: shaft[3], lines: ['G6 · 96T', 'output'] },
          ].map((lbl) => (
            <g key={`lbl-${lbl.cx}`}>
              <text x={lbl.cx} y={cy + Math.max(r.G2, r.G4, r.G6) + 18} textAnchor="middle"
                fontFamily="ui-monospace, JetBrains Mono, monospace" fontSize="10"
                fill="rgba(203,213,225,0.9)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {lbl.lines[0]}
              </text>
              <text x={lbl.cx} y={cy + Math.max(r.G2, r.G4, r.G6) + 32} textAnchor="middle"
                fontFamily="ui-monospace, JetBrains Mono, monospace" fontSize="9"
                fill="rgba(148,163,184,0.7)" style={{ letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {lbl.lines[1]}
              </text>
            </g>
          ))}
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
        image={project.thumb || project.image || '/projects/thumbs/gearbox.jpg'}
        imageAlt="Three-stage reduction gearbox CAD render"
        imageFit="cover"
      >
        <div className="mt-2 text-[10.5px] font-mono uppercase tracking-[0.18em] text-gray-500">
          Mar – Apr 2026 · small-team collaboration
        </div>
      </PageHero>

      <STARSection star={project.star} title="Overview" />

      {/* Full CAD render */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="CAD"
            code="C/01"
            title="Design render"
            subtitle="Final SolidWorks render of the three-stage reduction for the 1-DOF robotic elbow. Interactive STL assembly viewer comes next once the model is uploaded."
          />
          <Glass pad={false}>
            <div className="p-4 md:p-6 bg-surface-3/40">
              <SafeImage
                src={project.image || '/projects/gearbox-render.jpg'}
                alt="Three-stage reduction gearbox CAD render"
                label="Gearbox render"
                aspect="aspect-[3/4] max-h-[72vh]"
                fit="contain"
              />
            </div>
            <div className="px-5 py-3 border-t border-line text-sm text-gray-300">
              Mixed 4140-steel / 6061-T6-aluminum stack · 80:1 total reduction · design-review-approved assembly
            </div>
          </Glass>
        </Container>
      </section>

      {/* Signature interactive */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Interactive"
            code="I/02"
            title="Live 3-stage train · 4000 → 50 RPM"
            subtitle="Every gear rotates at its correct relative speed. Steel pinions in brand color, aluminum driven gears in silver. Total reduction 80:1."
          />
          <GearTrainSim />
        </Container>
      </section>

      {/* STL viewer — only when the assembly file is present */}
      {project.stl && (
        <section className="pb-10">
          <Container>
            <SectionTitle
              kicker="Assembly"
              code="A/03"
              title="Interactive CAD model"
              subtitle="Explore the assembled gearbox."
            />
            <Glass pad={false}>
              <Suspense fallback={
                <div className="h-[520px] flex items-center justify-center text-brand-300 text-sm font-mono">
                  Loading 3D model…
                </div>
              }>
                <STLViewer
                  src={project.stl}
                  layFlat
                  height={520}
                  cameraPosition={[900, 900, 900]}
                  controlsTarget={[0, 0, 0]}
                  fitMargin={1.5}
                />
              </Suspense>
              <div className="px-5 py-3 border-t border-line text-xs text-gray-400 font-mono">
                Drag to rotate · Scroll to zoom · Double-click to reset
              </div>
            </Glass>
          </Container>
        </section>
      )}

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

      {/* Key outcomes */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Key outcomes"
            code="R/04"
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
