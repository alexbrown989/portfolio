// src/pages/projects/MultiToolFab.jsx
//
// Hands-on machining case study. Follows the standard shared-UI layout:
// PageHero → STAR → media → tolerance table → AAR → CTA → Pager.
//
// TODO(alex): drop the following into /public/projects/ (paths already wired):
//   multitool-final.jpg      — final assembled multi-tool photo
//   multitool-cnc-1.mp4      — CNC video #1
//   multitool-cnc-2.mp4      — CNC video #2
//   multitool-inspection.jpg — (optional) inspection setup / measurement sheet

import { useState } from 'react'
import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA, STARSection, AARSection, Downloads,
} from '../../shared/ui'
import { SafeImage, SafeVideo } from '../../shared/Media'
import { projects } from '../../content/projects'
import { usePageMeta } from '../../shared/usePageMeta'

const project = projects.find(p => p.id === 'multitool') || {}

/* ------------------------------------------------------------------- */
/* Signature interactive: GD&T inspection dial                          */
/* ------------------------------------------------------------------- */

const FEATURES = [
  { key: 'precision',   name: 'Precision dimension', nominal: 0.7500, tol: 0.0050, unit: 'in', gauge: 'Digital calipers' },
  { key: 'parallel',    name: 'Parallelism',         nominal: 0.0000, tol: 0.0030, unit: 'in', gauge: 'Dial indicator (granite)' },
  { key: 'flat',        name: 'Flatness',            nominal: 0.0000, tol: 0.0020, unit: 'in', gauge: 'Dial indicator sweep' },
  { key: 'general',     name: 'General dimension',   nominal: 1.0000, tol: 0.0100, unit: 'in', gauge: 'Digital calipers' },
]

function InspectionGauge() {
  const [featureIdx, setFeatureIdx] = useState(0)
  const feature = FEATURES[featureIdx]
  // Deviation is stored as a fraction of the tolerance band. -1 .. +1
  // maps to exactly ± tolerance. Beyond -1 / +1 the part is OUT.
  const [dev, setDev] = useState(0.35)

  const actual = feature.nominal + dev * feature.tol
  const deviation = actual - feature.nominal
  const absPct = Math.abs(dev)
  const inTol = absPct <= 1
  const warn  = absPct > 0.7 && inTol
  const status = !inTol ? 'REJECT' : warn ? 'CAUTION' : 'ACCEPT'
  const statusColor = !inTol ? '#ef4444' : warn ? '#f59e0b' : '#22c55e'

  // Bar geometry
  const barW = 320
  const cx   = 200
  const scale = 130 // px per tol-fraction (so ±1 = ±130 px = a 260-px accept band)
  const needleX = cx + dev * scale

  return (
    <div className="rounded-xl border border-line bg-surface-3/60 overflow-hidden">
      <div className="p-4 space-y-4">
        {/* Feature selector */}
        <div className="flex flex-wrap gap-1.5">
          {FEATURES.map((f, i) => (
            <button
              key={f.key}
              onClick={() => setFeatureIdx(i)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                featureIdx === i
                  ? 'bg-brand-500/15 text-brand-200 border border-brand-500/40'
                  : 'bg-white/[0.03] text-gray-400 border border-line hover:border-line-strong hover:text-white'
              }`}
            >
              {f.name}
            </button>
          ))}
        </div>

        {/* Bar gauge */}
        <div className="bg-black/40 rounded-lg border border-line p-4">
          <svg viewBox="0 0 400 130" className="w-full h-32">
            {/* Reject bands */}
            <rect x={cx - barW / 2} y="52" width={(barW - 260) / 2} height="26"
              fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.35)" />
            <rect x={cx + 130} y="52" width={(barW - 260) / 2} height="26"
              fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.35)" />

            {/* Caution bands */}
            <rect x={cx - 130} y="52" width="39" height="26"
              fill="rgba(245,158,11,0.14)" stroke="rgba(245,158,11,0.3)" />
            <rect x={cx + 91} y="52" width="39" height="26"
              fill="rgba(245,158,11,0.14)" stroke="rgba(245,158,11,0.3)" />

            {/* Accept band */}
            <rect x={cx - 91} y="52" width="182" height="26"
              fill="rgba(34,197,94,0.14)" stroke="rgba(34,197,94,0.35)" />

            {/* Center line */}
            <line x1={cx} y1="48" x2={cx} y2="82" stroke="rgba(226,232,240,0.5)" strokeDasharray="2 3" />

            {/* Tolerance labels */}
            <text x={cx - 130} y="46" textAnchor="middle" fontFamily="ui-monospace, JetBrains Mono, monospace"
              fontSize="9" fill="rgba(239,68,68,0.9)">−{feature.tol.toFixed(4)}</text>
            <text x={cx} y="46" textAnchor="middle" fontFamily="ui-monospace, JetBrains Mono, monospace"
              fontSize="9" fill="rgba(226,232,240,0.7)">NOMINAL</text>
            <text x={cx + 130} y="46" textAnchor="middle" fontFamily="ui-monospace, JetBrains Mono, monospace"
              fontSize="9" fill="rgba(239,68,68,0.9)">+{feature.tol.toFixed(4)}</text>

            {/* Needle */}
            <line x1={needleX} y1="30" x2={needleX} y2="100" stroke={statusColor} strokeWidth="2" />
            <polygon
              points={`${needleX - 6},30 ${needleX + 6},30 ${needleX},42`}
              fill={statusColor}
            />

            {/* Reading */}
            <text x={needleX} y="118" textAnchor="middle" fontFamily="ui-monospace, JetBrains Mono, monospace"
              fontSize="10" fill="white">
              {actual.toFixed(4)} {feature.unit}
            </text>
          </svg>
        </div>

        {/* Deviation slider */}
        <div>
          <div className="flex items-center justify-between text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 mb-1">
            <span>Set as-measured value</span>
            <span className="text-gray-400">Δ {deviation >= 0 ? '+' : ''}{deviation.toFixed(4)} {feature.unit}</span>
          </div>
          <input
            type="range" min="-150" max="150" step="1"
            value={Math.round(dev * 100)}
            onChange={(e) => setDev(Number(e.target.value) / 100)}
            className="w-full accent-brand-500"
            aria-label="As-measured deviation from nominal"
          />
        </div>

        {/* Readout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Nominal</div>
            <div className="text-sm font-semibold text-white tabular-nums">{feature.nominal.toFixed(4)} {feature.unit}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Tolerance</div>
            <div className="text-sm font-semibold text-white tabular-nums">±{feature.tol.toFixed(4)} {feature.unit}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Gauge</div>
            <div className="text-sm font-semibold text-white">{feature.gauge}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Verdict</div>
            <div className="text-sm font-semibold" style={{ color: statusColor }}>{status}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const toleranceTable = [
  { feature: 'General dimensions',   spec: '±0.010 in',  method: 'Digital calipers' },
  { feature: 'Precision dimensions', spec: '±0.005 in',  method: 'Digital calipers, verified with pin gauges' },
  { feature: 'Parallelism',          spec: '0.003 in',   method: 'Dial indicator on granite surface' },
  { feature: 'Flatness',             spec: '0.002 in',   method: 'Dial indicator sweep' },
  { feature: 'Hole size',            spec: 'per print',  method: 'Pin gauges, calipers' },
  { feature: 'Symmetry / position',  spec: 'per print',  method: 'Feature relative measurement, print callouts' },
]

export default function MultiToolFab() {
  usePageMeta({
    title: 'Multi-Tool Fabrication · GD&T + Machining · Alex Brown',
    description: 'Fabricated a functional folding multi-tool from raw aluminum on manual mill + CNC. Held ±0.005 in precision, 0.003 in parallelism, 0.002 in flatness against a full GD&T drawing package.',
    path: '/projects/multitool',
    image: '/projects/multitool-final.jpg',
  })
  return (
    <ProjectLayout>
      <PageHero
        kicker="Manufacturing · Machining & Metrology"
        title="Folding Multi-Tool: Machining, GD&T, and Inspection"
        subtitle="Fabricated a functional folding multi-tool assembly from raw aluminum stock using manual mill + CNC operations. Held ±0.005 in precision dimensions, 0.003 in parallelism, and 0.002 in flatness against a full GD&T drawing package, and inspected every feature back to the print."
        chips={project.tech || []}
        status={{ label: 'Completed', tone: 'idle' }}
      >
        <div className="mt-2 text-xs font-mono uppercase tracking-[0.18em] text-gray-500">
          Mar – Jun 2026
        </div>
      </PageHero>

      {/* STAR summary — the hiring-manager-facing pitch */}
      <STARSection star={project.star} title="Overview" />

      {/* Signature interactive */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Interactive"
            code="I/01"
            title="Inspection gauge · verify against the print"
            subtitle="Pick a feature, drag the needle. The accept band is per the drawing's tolerance callout. Cross into caution and reject bands to see how the same feature reads as pass or fail during a real over-check inspection."
          />
          <InspectionGauge />
        </Container>
      </section>

      {/* Final part / media strip */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Media"
            code="M/02"
            title="From raw stock to finished assembly"
            subtitle="Two CNC videos and the finished multi-tool. If any of the media below is missing, drop the corresponding file into /public/projects/. The layout already expects it."
          />
          <div className="grid lg:grid-cols-3 gap-5">
            <Glass pad={false}>
              <div className="p-4">
                <SafeVideo
                  src="/projects/multitool-cnc-1.mp4"
                  label="CNC operation · pass 1"
                  aspect="aspect-[4/3]"
                />
              </div>
              <div className="px-5 py-4 border-t border-line">
                <div className="text-white font-semibold">CNC operation · pass 1</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
                  Machining the arm / jaw feature set on the CNC. Fixturing and op order planned so critical faces are cut in a single setup.
                </p>
              </div>
            </Glass>

            <Glass pad={false}>
              <div className="p-4">
                <SafeVideo
                  src="/projects/multitool-cnc-2.mp4"
                  label="CNC operation · pass 2"
                  aspect="aspect-[4/3]"
                />
              </div>
              <div className="px-5 py-4 border-t border-line">
                <div className="text-white font-semibold">CNC operation · pass 2</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
                  Second setup, second face. Datum surfaces re-referenced so parallelism and flatness callouts stay achievable.
                </p>
              </div>
            </Glass>

            <Glass pad={false}>
              <div className="p-4">
                <SafeImage
                  src={project.image || '/projects/multitool-final.jpg'}
                  alt="Finished folding multi-tool assembly"
                  label="Finished assembly"
                  aspect="aspect-[4/3]"
                  fit="contain"
                />
              </div>
              <div className="px-5 py-4 border-t border-line">
                <div className="text-white font-semibold">Finished assembly</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
                  Pivots, bushings, spacers, and fasteners integrated into a functional articulated multi-tool. Alignment, fit, and motion verified before sign-off.
                </p>
              </div>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Tolerance & inspection table */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="GD&T"
            code="G/03"
            title="Tolerance envelope & inspection plan"
            subtitle="Every feature was inspected and recorded against the print. Below is the tolerance envelope and the metrology stack used to verify each callout."
          />

          <Glass pad={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-surface-3/60 text-left">
                  <tr className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-400">
                    <th className="px-5 py-3">Feature / control</th>
                    <th className="px-5 py-3">Spec</th>
                    <th className="px-5 py-3">Verification method</th>
                  </tr>
                </thead>
                <tbody>
                  {toleranceTable.map((row, i) => (
                    <tr key={row.feature} className={i % 2 ? 'bg-surface-2/40' : ''}>
                      <td className="px-5 py-2.5 text-gray-200">{row.feature}</td>
                      <td className="px-5 py-2.5 text-brand-200 font-mono tabular-nums">{row.spec}</td>
                      <td className="px-5 py-2.5 text-gray-300">{row.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Glass>

          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricBox value="±0.005 in" label="Precision dimension hold" sub="Per print" />
            <MetricBox value="0.003 in"  label="Parallelism control"      sub="Verified w/ dial indicator" />
            <MetricBox value="0.002 in"  label="Flatness control"         sub="Granite + indicator" />
            <MetricBox value="100%"      label="Features inspected"       sub="Recorded to spreadsheet" />
          </div>
        </Container>
      </section>

      {/* AAR — the reflection */}
      <AARSection aar={project.aar} />

      {/* Optional downloadable artifacts — populated when project.downloads
          is set in src/content/projects.js. */}
      <Downloads items={project.downloads} />

      <ProjectCTA
        title="Machining + inspection roles"
        body="This project maps directly onto full-time manufacturing engineering, quality engineering, and CNC roles. Happy to walk through the inspection log and process planning in detail."
        primary={{ label: 'Get in touch', to: '/#contact' }}
      />

      <ProjectPager currentId="multitool" />
    </ProjectLayout>
  )
}
