// src/pages/projects/Gearbox.jsx
//
// Three-stage reduction gearbox case study: the assembled hardware, the
// interactive CAD assembly, and the AGMA 2001-D04 analysis table built from
// the actual worksheet numbers (4000 → 800 → 200 → 50 RPM across six gears,
// with tangential loads and factor-of-safety values per gear).

import { lazy, Suspense } from 'react'
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

function fosTone(fos) {
  if (fos < 2)  return { class: 'text-red-300',    bar: '#ef4444' }
  if (fos < 5)  return { class: 'text-amber-300',  bar: '#f59e0b' }
  return         { class: 'text-emerald-300', bar: '#22c55e' }
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

      {/* Assembled unit — a photograph, not a render */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Hardware"
            code="H/01"
            title="The assembled gearbox"
            subtitle="The three-stage reduction fully assembled: all six gears, shafts, and bearings seated in the housing after the final design review."
          />
          <Glass pad={false}>
            <div className="p-4 md:p-6 bg-surface-3/40">
              <SafeImage
                src={project.image || '/projects/gearbox-render.jpg'}
                alt="The fully assembled three-stage reduction gearbox"
                label="Assembled gearbox"
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

      {/* STL viewer — only when the assembly file is present */}
      {project.stl && (
        <section className="pb-10">
          <Container>
            <SectionTitle
              kicker="Assembly"
              code="A/02"
              title="Interactive CAD model"
              subtitle="Orbit the full CAD assembly. Drag to rotate, scroll to zoom, and reset the framing with the button, a double-click, or the R key."
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
