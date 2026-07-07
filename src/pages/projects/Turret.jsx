// src/pages/projects/Turret.jsx
import { lazy, Suspense } from 'react'
import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA, STARSection, AARSection,
} from '../../shared/ui'
import { projects } from '../../content/projects'
import { motion } from 'framer-motion'

const STLViewer = lazy(() => import('../../shared/STLViewer.jsx'))

const project = projects.find(p => p.id === 'turret') || {}

const roadmap = [
  { phase: 'Phase 1', title: 'Sensor Fusion',        text: 'Integrate LiDAR + camera modules for environment awareness.' },
  { phase: 'Phase 2', title: 'On-board Perception',  text: 'Lightweight vision model (e.g. YOLOv8n) for detection and tracking.' },
  { phase: 'Phase 3', title: 'Autonomous Behaviors', text: 'Target acquisition and centering without operator input.' },
  { phase: 'Phase 4', title: 'ROS Integration',      text: 'Migrate to ROS for composable behaviors and interoperability.' },
]

export default function Turret() {
  return (
    <ProjectLayout>
      <PageHero
        kicker="// Foundational Platform for Autonomous Systems"
        title="Mechatronics Integration: 2-Axis Robotic Turret"
        subtitle="Designed, fabricated, and validated a multi-part robotic turret that achieves repeatable positioning under test. Built as a robust R&D platform for sensor fusion and future autonomy."
        chips={project.tech || []}
        status={{ label: 'Active', tone: 'brand', pulse: true }}
      />

      {/* Assembly + fabrication */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Design → Fabrication"
            title="From CAD to bench-ready hardware in under 24 hours"
          />
          <div className="grid lg:grid-cols-2 gap-5">
            <Glass pad={false}>
              <div className="p-4">
                <div className="aspect-[16/10] rounded-xl border border-line bg-black/50 overflow-hidden">
                  <img
                    src={project.image || '/projects/turret-full.jpg'}
                    alt="Finished turret assembly"
                    className="w-full h-full object-contain"
                    loading="eager"
                  />
                </div>
              </div>
              <div className="px-5 py-4 border-t border-line">
                <div className="text-white font-semibold">Assembled platform</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
                  Engineered for mechanical stability and precise servo seating; press-fit mounts reduce backlash to a repeatable minimum.
                </p>
              </div>
            </Glass>

            <Glass pad={false}>
              <div className="p-4">
                <div className="aspect-[16/10] rounded-xl border border-line bg-black overflow-hidden">
                  <video
                    src={project.printVideo || '/projects/turret-print.mp4'}
                    controls
                    className="w-full h-full object-contain"
                    poster="/projects/print-turret.jpg"
                  />
                </div>
              </div>
              <div className="px-5 py-4 border-t border-line">
                <div className="text-white font-semibold">Print timelapse</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
                  Nine-part assembly fabricated via FDM printing — modular parts stay serviceable and re-printable.
                </p>
              </div>
            </Glass>
          </div>
        </Container>
      </section>

      {/* CAD viewer */}
      {project.stl && (
        <section className="pb-10">
          <Container>
            <SectionTitle
              kicker="// CAD"
              title="Interactive assembly"
              subtitle="Explore the multi-part SolidWorks assembly. Key design features: press-fit servo mounts and a stabilized dual-axis gimbal."
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
                  zoom={2.2}
                />
              </Suspense>
              <div className="px-5 py-3 border-t border-line text-xs text-gray-400 font-mono">
                Drag to rotate · Scroll to zoom · Double-click to reset
              </div>
            </Glass>
          </Container>
        </section>
      )}

      {/* Controls & performance */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Controls"
            title="Embedded control & motion profile"
          />
          <div className="grid lg:grid-cols-2 gap-5">
            <Glass pad={false}>
              <div className="p-4">
                <div className="aspect-[16/10] rounded-xl border border-line bg-black overflow-hidden">
                  <video
                    src={project.video || '/projects/turret-op.mp4'}
                    controls
                    className="w-full h-full object-contain"
                    poster="/projects/turret-demo.jpg"
                  />
                </div>
              </div>
              <div className="px-5 py-4 border-t border-line">
                <div className="text-white font-semibold">Live scan demonstration</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
                  Randomized sweep on each axis. NodeMCU orchestrates angular limits and timing to keep motion within stable ranges.
                </p>
              </div>
            </Glass>

            <Glass pad={false}>
              <div className="p-4">
                <div className="aspect-[16/10] rounded-xl border border-line bg-black overflow-hidden">
                  <img
                    src={project.codeImage || '/projects/turret-code.png'}
                    alt="Embedded C++ control logic"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div className="px-5 py-4 border-t border-line">
                <div className="text-white font-semibold">Embedded C++</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">
                  Arduino IDE toolchain handles servo motion profiles, limit enforcement, and scan cadence.
                </p>
              </div>
            </Glass>
          </div>

          <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricBox value="0.8°" label="Angular repeatability (σ)" sub="100-cycle bench test" />
            <MetricBox value="±45°" label="Operational range / axis"  sub="Servo-limited for stability" />
            <MetricBox value="9"    label="Printed parts integrated"  sub="Modular, serviceable" />
            <MetricBox value="C++"  label="Control language"          sub="Arduino / NodeMCU" />
          </div>
        </Container>
      </section>

      {/* Roadmap */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Roadmap"
            title="Where this platform is going"
          />
          <Glass>
            <div className="relative pl-6">
              <div className="absolute left-2 top-1 bottom-1 w-px bg-gradient-to-b from-brand-400/60 via-brand-500/25 to-transparent" />
              {roadmap.map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, x: 8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.06 }}
                  className="relative mb-5 last:mb-0"
                >
                  <div className="absolute -left-3 top-1.5 w-2.5 h-2.5 rounded-full bg-brand-400 shadow-ring-brand" />
                  <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90">
                    {r.phase}
                  </div>
                  <div className="text-white font-semibold">{r.title}</div>
                  <p className="text-sm text-gray-300 mt-1 leading-relaxed">{r.text}</p>
                </motion.div>
              ))}
            </div>
          </Glass>
        </Container>
      </section>

      <STARSection star={project.star} />
      <AARSection aar={project.aar} />

      <ProjectCTA
        title="Why this project matters"
        body="End-to-end mechatronics execution: mechanical architecture, rapid fabrication, embedded control, and validation. Designed to scale into intelligent robotics through iterative R&D."
        primary={{ label: 'Get in touch', to: '/#contact' }}
      />

      <ProjectPager currentId="turret" />
    </ProjectLayout>
  )
}
