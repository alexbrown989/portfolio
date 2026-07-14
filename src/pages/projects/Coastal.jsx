// src/pages/projects/Coastal.jsx
import { lazy, Suspense } from 'react'
import ProjectLayout from '../ProjectLayout'
import YouTube from '../../shared/Youtube'
import { projects } from '../../content/projects'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA, STARSection, AARSection,
} from '../../shared/ui'
import { usePageMeta } from '../../shared/usePageMeta'

const STLViewer = lazy(() => import('../../shared/STLViewer.jsx'))

const project = projects.find(p => p.id === 'coastal')

/* ------------------------------------------------------------------- */
/* Wave sim removed. Keeping the story simple: photos, video, metrics.  */

const metrics = [
  { value: '↓ 37%', label: 'Wave energy at shoreline' },
  { value: '↓ 42%', label: 'Coastal vorticity magnitude' },
  { value: '3',     label: 'High-risk zones identified' },
  { value: '~40%',  label: 'PIV accuracy improvement' },
]

export default function Coastal() {
  usePageMeta({
    title: 'Saipan Coastal Wave Dynamics · PIV · Alex Brown',
    description: 'First lab-scale pipeline quantifying wave–coast interactions for Saipan. ~40% PIV accuracy gain via a novel Visual Field Architecture. Protects up to $45M in Pacific infrastructure.',
    path: '/projects/coastal',
    image: '/projects/coastal.jpg',
  })
  return (
    <ProjectLayout>
      <PageHero
        kicker="Protecting $45M in Pacific Infrastructure"
        title={project?.title || 'Coastal Wave Dynamics & Seawall Design'}
        subtitle="First lab-scale pipeline to quantify wave–coast interactions for Saipan. A novel Visual Field Architecture background improved PIV measurement fidelity by ~40%, enabling a defensible, replicable test rig."
        chips={project?.tech || []}
        status={{ label: 'Active', tone: 'brand', pulse: true }}
      />

      {/* Overview first — same pattern as other case studies */}
      <STARSection star={project.star} title="Overview" />

      {/* Crisis */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Context"
            code="C/01"
            title="Infrastructure at risk"
            subtitle="Critical Pacific-island infrastructure sits inside active erosion corridors. Existing coastal-defense guidance is either qualitative or over-generalized; a defensible design pipeline for Saipan-specific geometry did not exist."
          />
          <div className="grid md:grid-cols-2 gap-5">
            <Glass pad={false}>
              <div className="relative">
                <img
                  src="/projects/erosion.jpg"
                  alt="Infrastructure at risk"
                  className="w-full aspect-[16/10] object-cover rounded-t-2xl"
                />
                <span className="absolute top-3 right-3 px-2.5 py-1 text-[11px] rounded-md bg-red-500/80 text-white font-mono">
                  $45M AT RISK
                </span>
              </div>
              <div className="p-5 text-sm text-gray-300">
                Critical infrastructure inside active erosion corridors along Saipan’s western coast.
              </div>
            </Glass>
            <Glass pad={false}>
              <img
                src="/projects/tank.jpg"
                alt="Research poster and tank campaign planning"
                className="w-full aspect-[16/10] object-cover rounded-t-2xl"
              />
              <div className="p-5 text-sm text-gray-300">
                Research overview and tank-campaign planning artifacts used to guide the physical model runs.
              </div>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Data & fabrication */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Data & fabrication"
            code="D/02"
            title="From DEM to printed island"
          />
          <div className="grid md:grid-cols-2 gap-5">
            <Glass pad={false}>
              <img src="/projects/dem.jpg" alt="DEM processing in MATLAB" className="w-full aspect-[16/10] object-cover rounded-t-2xl" />
              <div className="p-5">
                <div className="text-white font-semibold">DEM processing</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
                  Bathymetry and coastal elevation processed in MATLAB to preserve slope fidelity for scale modeling.
                </p>
              </div>
            </Glass>
            <Glass pad={false}>
              <img src="/projects/print.jpg" alt="3D printer creating island geometry" className="w-full aspect-[16/10] object-cover rounded-t-2xl" />
              <div className="p-5">
                <div className="text-white font-semibold">3D-printed model</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
                  Saipan geometry printed at 0.2 mm layer height to preserve shoreline curvature through the tank trials.
                </p>
              </div>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Wave-structure interaction */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Analysis"
            code="A/03"
            title="Wave–structure interaction"
            subtitle="Flow-field visualization with velocity vectors and vorticity contours, powered by the improved PIV background."
          />
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-5">
            <Glass pad={false}>
              <video
                src="/projects/saipan.mp4"
                controls
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                poster="/projects/cover.jpg"
                className="w-full aspect-video rounded-t-2xl bg-black"
              />
              <div className="px-5 py-3 border-t border-line text-sm text-gray-300">
                Flow-field visualization with velocity vectors and vorticity contours from the tank runs.
              </div>
            </Glass>

            <div className="grid grid-cols-2 gap-3">
              {metrics.map(m => <MetricBox key={m.label} {...m} />)}
              <Glass className="col-span-2">
                <div className="text-white font-semibold mb-1.5">Technical notes</div>
                <ul className="text-sm text-gray-300 space-y-1.5 list-disc pl-5 leading-relaxed">
                  <li>Visual Field Architecture background improved particle correlation ~40%.</li>
                  <li>Froude similarity preserved for realistic wave kinematics.</li>
                  <li>PIV vectors cross-checked against manual particle tracks.</li>
                </ul>
              </Glass>
            </div>
          </div>
        </Container>
      </section>

      {/* Field context */}
      {project?.youtube && (
        <section className="pb-10">
          <Container>
            <SectionTitle kicker="Field context" code="F/04" title="Watch the tank run" />
            <Glass pad={false}>
              <YouTube url={project.youtube} title={project.title} />
            </Glass>
          </Container>
        </section>
      )}

      {/* STL model */}
      {project?.stl && (
        <section className="pb-10">
          <Container>
            <SectionTitle kicker="Model" code="M/05" title="Interactive 3D geometry" />
            <Glass pad={false}>
              <Suspense
                fallback={
                  <div className="h-[420px] flex items-center justify-center text-brand-300 text-sm font-mono">
                    Loading 3D model…
                  </div>
                }
              >
                <STLViewer
                  src={project.stl}
                  layFlat
                  height={420}
                  cameraPosition={[900, 900, 900]}
                  controlsTarget={[0, 0, 0]}
                  fitMargin={1.45}
                />
              </Suspense>
              <div className="px-5 py-3 border-t border-line text-xs text-gray-400 font-mono">
                Drag to rotate · Scroll to zoom · Double-click to reset
              </div>
            </Glass>
          </Container>
        </section>
      )}

      <AARSection aar={project.aar} />

      <ProjectCTA
        title="Interested in coastal resilience?"
        body="Happy to talk through the PIV workflow, scale-model design, and where this pipeline can extend to additional Pacific sites."
        primary={{ label: 'Get in touch', to: '/#contact' }}
        secondary={{
          label: 'LinkedIn write-up',
          href: 'https://www.linkedin.com/feed/update/urn:li:activity:7364834318910754817/',
        }}
      />

      <ProjectPager currentId="coastal" />
    </ProjectLayout>
  )
}
