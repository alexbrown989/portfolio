// src/pages/projects/Gearbox.jsx
//
// Small-team mechanical design case study.
//
// TODO(alex): drop the following into /public/projects/ (paths already wired):
//   gearbox-render.jpg   — final CAD render / exploded view
//   gearbox-cad-1.jpg    — CAD assembly screenshot #1
//   gearbox-cad-2.jpg    — CAD assembly screenshot #2
//   gearbox-review.jpg   — (optional) design review artifact / annotated CAD

import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA, STARSection, AARSection, Downloads,
} from '../../shared/ui'
import { SafeImage } from '../../shared/Media'
import { projects } from '../../content/projects'

const project = projects.find(p => p.id === 'gearbox') || {}

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
        kicker="// Mechanical Systems Design"
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

      {/* CAD media */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// CAD"
            title="Live assembly & design snapshots"
            subtitle="The CAD assembly was maintained live across the whole quarter — shaft alignment, gear placement, bearing fitment, and fastener access all validated in one file before final submission."
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
            kicker="// Calculations"
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
            kicker="// DFM"
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
        title="Mechanical design internships"
        body="This project is a clean fit for entry-level mechanical design and integration roles: CAD-heavy, calculation-defensible, and reviewed by real engineers. Happy to walk through the stack-up or torque math in depth."
        primary={{ label: 'Get in touch', to: '/#contact' }}
      />

      <ProjectPager currentId="gearbox" />
    </ProjectLayout>
  )
}
