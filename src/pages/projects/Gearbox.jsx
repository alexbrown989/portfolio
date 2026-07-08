// src/pages/projects/Gearbox.jsx
//
// Small-team mechanical design case study.
//
// TODO(alex): drop the following into /public/projects/ (paths already wired):
//   gearbox-render.jpg   — final CAD render / exploded view
//   gearbox-cad-1.jpg    — CAD assembly screenshot #1
//   gearbox-cad-2.jpg    — CAD assembly screenshot #2
//   gearbox-review.jpg   — (optional) design review artifact / annotated CAD

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA, STARSection, AARSection, Downloads,
} from '../../shared/ui'
import { SafeImage } from '../../shared/Media'
import { projects } from '../../content/projects'

const project = projects.find(p => p.id === 'gearbox') || {}

/* ------------------------------------------------------------------- */
/* Signature interactive: meshed gears + ratio                          */
/* ------------------------------------------------------------------- */

// Draw a spur gear as a rosette path (simple involute approximation is
// overkill for a visual — this is stylized).
function gearPath({ cx, cy, r, teeth, toothH = 6 }) {
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

function GearMeshSim() {
  const [driverTeeth, setDriverTeeth] = useState(12)
  const [drivenTeeth, setDrivenTeeth] = useState(48)
  const [rpmIn, setRpmIn] = useState(3000)
  const ratio = drivenTeeth / driverTeeth
  const rpmOut = rpmIn / ratio
  const torqueMultiplier = ratio.toFixed(2)

  const [phase, setPhase] = useState(0) // radians on driver
  const raf = useRef(0)
  const t0 = useRef(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    const step = (now) => {
      if (!t0.current) t0.current = now
      const dt = (now - t0.current) / 1000
      t0.current = now
      // Driver spins at rpmIn; scale down for visibility.
      setPhase(p => p + (rpmIn / 60) * Math.PI * 2 * dt * 0.06)
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [rpmIn, reduce])

  // Geometry — visual only; radii scale roughly with tooth count.
  const driverR = 34 + driverTeeth * 1.4
  const drivenR = 34 + drivenTeeth * 1.4
  const cxA = 130, cxB = 130 + driverR + drivenR - 4, cy = 200
  const driverAngle = phase * (180 / Math.PI)
  const drivenAngle = -phase * (driverTeeth / drivenTeeth) * (180 / Math.PI)

  return (
    <div className="rounded-xl border border-line bg-surface-3/60 overflow-hidden">
      <div className="grid md:grid-cols-[1fr_260px]">
        <div className="p-4">
          <svg viewBox="0 0 500 400" className="w-full h-72 bg-black/40 rounded-lg border border-line">
            <defs>
              <radialGradient id="gb-driver">
                <stop offset="0%" stopColor="#22bfe0" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#0e6a82" />
              </radialGradient>
              <radialGradient id="gb-driven">
                <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#334155" />
              </radialGradient>
            </defs>

            {/* Driver */}
            <g transform={`translate(${cxA}, ${cy}) rotate(${driverAngle})`}>
              <path
                d={gearPath({ cx: 0, cy: 0, r: driverR, teeth: driverTeeth, toothH: 7 })}
                fill="url(#gb-driver)" stroke="rgba(34,191,224,0.9)" strokeWidth="1"
              />
              <circle cx="0" cy="0" r="12" fill="#0f172a" stroke="rgba(34,191,224,0.9)" strokeWidth="1.5" />
              <line x1="0" y1="0" x2={driverR - 14} y2="0" stroke="rgba(34,191,224,0.95)" strokeWidth="2" />
            </g>

            {/* Driven */}
            <g transform={`translate(${cxB}, ${cy}) rotate(${drivenAngle})`}>
              <path
                d={gearPath({ cx: 0, cy: 0, r: drivenR, teeth: drivenTeeth, toothH: 7 })}
                fill="url(#gb-driven)" stroke="rgba(148,163,184,0.9)" strokeWidth="1"
              />
              <circle cx="0" cy="0" r="14" fill="#0f172a" stroke="rgba(148,163,184,0.9)" strokeWidth="1.5" />
              <line x1="0" y1="0" x2={drivenR - 16} y2="0" stroke="rgba(226,232,240,0.9)" strokeWidth="2" />
            </g>

            {/* Labels */}
            <text x={cxA} y={cy + driverR + 22} textAnchor="middle" fontFamily="ui-monospace, JetBrains Mono, monospace"
              fontSize="10" fill="rgba(34,191,224,0.85)" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Driver · {driverTeeth}T
            </text>
            <text x={cxB} y={cy + drivenR + 22} textAnchor="middle" fontFamily="ui-monospace, JetBrains Mono, monospace"
              fontSize="10" fill="rgba(148,163,184,0.85)" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Driven · {drivenTeeth}T
            </text>
          </svg>
        </div>

        <div className="p-4 md:border-l border-line space-y-4">
          <div>
            <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 mb-1">
              Driver teeth · {driverTeeth}
            </div>
            <input
              type="range" min="8" max="24" value={driverTeeth}
              onChange={(e) => setDriverTeeth(Number(e.target.value))}
              className="w-full accent-brand-500"
              aria-label="Driver gear tooth count"
            />
          </div>
          <div>
            <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 mb-1">
              Driven teeth · {drivenTeeth}
            </div>
            <input
              type="range" min="24" max="72" value={drivenTeeth}
              onChange={(e) => setDrivenTeeth(Number(e.target.value))}
              className="w-full accent-brand-500"
              aria-label="Driven gear tooth count"
            />
          </div>
          <div>
            <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 mb-1">
              Input RPM · {rpmIn}
            </div>
            <input
              type="range" min="500" max="6000" step="100" value={rpmIn}
              onChange={(e) => setRpmIn(Number(e.target.value))}
              className="w-full accent-brand-500"
              aria-label="Input RPM"
            />
          </div>

          <div className="pt-3 border-t border-line grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Reduction ratio</div>
              <div className="text-lg font-bold text-brand-200 tabular-nums">{ratio.toFixed(2)} : 1</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Output RPM</div>
              <div className="text-lg font-bold text-white tabular-nums">{Math.round(rpmOut)}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Torque × in</div>
              <div className="text-lg font-bold text-white tabular-nums">{torqueMultiplier}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Mesh sanity</div>
              <div className={`text-sm font-semibold ${drivenTeeth / driverTeeth < 1.5 ? 'text-amber-300' : 'text-emerald-300'}`}>
                {drivenTeeth / driverTeeth < 1.5 ? 'Low ratio' : 'OK'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const calcs = [
  { name: 'Gear ratio selection',         detail: 'Chose reduction ratio from the joint torque + speed spec; balanced size against efficiency.' },
  { name: 'Torque transmission',          detail: 'Verified transmitted torque through each stage against gear ratings and safety factor.' },
  { name: 'Shaft sizing',                 detail: 'Sized shafts for combined bending + torsion loading with an appropriate factor of safety.' },
  { name: 'Bearing selection',            detail: 'Bearing type + rating chosen for expected radial / axial loads and service life.' },
  { name: 'Keyway / retention',           detail: 'Chose keying and retention features that transmit torque without oversizing the shaft.' },
  { name: 'Tolerance stack-up',           detail: 'Ran a stack-up across the gear-mesh path to control backlash and prevent binding.' },
  { name: 'Clearance / interference fit', detail: 'Specified fits per the ANSI table for bearing seats, gear bores, and press-fit features.' },
]

export default function Gearbox() {
  return (
    <ProjectLayout>
      <PageHero
        kicker="Mechanical Systems Design"
        title="Reduction Gearbox for a 1-DOF Robotic Elbow"
        subtitle="Small-team, quarter-long design project: gear-ratio selection, shaft + bearing sizing, tolerance stack-up, and live CAD assembly management up to design review. Delivered a manufacturable, assemblable gearbox for a 1-DOF robotic elbow joint."
        chips={project.tech || []}
        status={{ label: 'Completed', tone: 'idle' }}
      >
        <div className="mt-2 text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
          Mar – Apr 2026 · small-team collaboration
        </div>
      </PageHero>

      {/* STAR — recruiter-facing overview */}
      <STARSection star={project.star} title="Overview" />

      {/* Signature interactive */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Interactive"
            code="I/01"
            title="Gear-mesh · reduction & torque"
            subtitle="Drag the tooth counts. Watch the ratio, output RPM, and torque multiplier update live. The driver spins at the input RPM you set; the driven gear rotates opposite, at the correct reduction."
          />
          <GearMeshSim />
        </Container>
      </section>

      {/* CAD media */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="CAD"
            code="C/02"
            title="Live assembly & design snapshots"
            subtitle="The CAD assembly was maintained live across the whole quarter. Shaft alignment, gear placement, bearing fitment, and fastener access were all validated in one file before final submission."
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

      {/* Design calculations */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Calculations"
            code="M/03"
            title="Mechanical design work behind the CAD"
            subtitle="CAD is the artifact; the calculations are what make it defensible in a design review."
          />
          <Glass pad={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-3/60 text-left">
                  <tr className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-400">
                    <th className="px-5 py-3 w-64">Calculation</th>
                    <th className="px-5 py-3">Design intent</th>
                  </tr>
                </thead>
                <tbody>
                  {calcs.map((c, i) => (
                    <tr key={c.name} className={i % 2 ? 'bg-surface-2/40' : ''}>
                      <td className="px-5 py-2.5 text-white font-semibold">{c.name}</td>
                      <td className="px-5 py-2.5 text-gray-300 leading-relaxed">{c.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Glass>

          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricBox value="1 DOF"       label="Joint driven"           sub="Robotic elbow" />
            <MetricBox value="Quarter"     label="Total design cycle"     sub="Fixed deadline" />
            <MetricBox value="Team"        label="Delivery mode"          sub="Coordinated small-team CAD" />
            <MetricBox value="Approved"    label="Design review status"   sub="Review-gated milestones" />
          </div>
        </Container>
      </section>

      {/* Design-for-manufacturing */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="DFM"
            code="D/04"
            title="Design-for-manufacturing & assembly"
            subtitle="Every design choice was pressure-tested against ‘could this actually be fabricated, assembled, and inspected?’"
          />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: 'Tolerance stack-up',   body: 'Stack-up analysis run across the gear-mesh path to control backlash and prevent binding before locking geometry.' },
              { title: 'Fits & GD&T',          body: 'Clearance and interference fits specified from ANSI tables; GD&T applied to control functional features.' },
              { title: 'Assembly serviceability', body: 'Fastener access, bearing installation, and inspection reach all verified in the live CAD assembly.' },
            ].map((c) => (
              <Glass key={c.title}>
                <div className="text-white font-semibold">{c.title}</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">{c.body}</p>
              </Glass>
            ))}
          </div>
        </Container>
      </section>

      {/* AAR reflection */}
      <AARSection aar={project.aar} />

      {/* Optional downloadable artifacts — populated when project.downloads
          is set in src/content/projects.js. */}
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
