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

import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA, STARSection, AARSection, Downloads,
} from '../../shared/ui'
import { SafeImage, SafeVideo } from '../../shared/Media'
import { projects } from '../../content/projects'

const project = projects.find(p => p.id === 'multitool') || {}

const toleranceTable = [
  { feature: 'General dimensions',   spec: '±0.010 in',  method: 'Digital calipers' },
  { feature: 'Precision dimensions', spec: '±0.005 in',  method: 'Digital calipers, verified with pin gauges' },
  { feature: 'Parallelism',          spec: '0.003 in',   method: 'Dial indicator on granite surface' },
  { feature: 'Flatness',             spec: '0.002 in',   method: 'Dial indicator sweep' },
  { feature: 'Hole size',            spec: 'per print',  method: 'Pin gauges, calipers' },
  { feature: 'Symmetry / position',  spec: 'per print',  method: 'Feature relative measurement, print callouts' },
]

export default function MultiToolFab() {
  return (
    <ProjectLayout>
      <PageHero
        kicker="// Manufacturing · Machining & Metrology"
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

      {/* Final part / media strip */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Media"
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
            kicker="// GD&T"
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

      {/* Skills / capabilities summary — reads well to a recruiter */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Capabilities Demonstrated"
            title="What this project proves I can do"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Process planning',       body: 'Order-of-operations, fixturing, and inspection strategy planned before touching a machine.' },
              { title: 'Manual + CNC machining', body: 'Comfortable moving between manual mill and CNC for the right operation on the right feature.' },
              { title: 'GD&T interpretation',    body: 'Read a full drawing package and translate flatness / parallelism / position callouts into machining strategy.' },
              { title: 'Metrology',              body: 'Calipers, pin gauges, dial indicators, and granite surface used to prove parts against the print.' },
              { title: 'Assembly integration',   body: 'Pivots, bushings, spacers, and fasteners integrated into an articulated assembly that actually works.' },
              { title: 'DFM communication',      body: 'Iterated with machinist feedback on tolerances and features that were expensive or fragile to produce.' },
            ].map((c) => (
              <Glass key={c.title}>
                <div className="text-white font-semibold">{c.title}</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">{c.body}</p>
              </Glass>
            ))}
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
