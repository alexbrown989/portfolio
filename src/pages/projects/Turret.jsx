// src/pages/projects/Turret.jsx
import { lazy, Suspense } from 'react'
import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA, STARSection, AARSection,
} from '../../shared/ui'
import { projects } from '../../content/projects'
import { motion } from 'framer-motion'
import { Target, Eye, Cpu, GitMerge } from 'lucide-react'

const STLViewer = lazy(() => import('../../shared/STLViewer.jsx'))

const project = projects.find(p => p.id === 'turret') || {}

// Roadmap is deliberately marked as future work — none of these have shipped
// on the current hardware yet. Framing matches "looking toward the future"
// so nothing over-promises the platform's actual state.
const roadmap = [
  {
    phase: 'Next',    Icon: Eye,
    title: 'Sensor fusion',
    text: 'Integrate a LiDAR + camera module so the platform can perceive its environment instead of executing a blind scan.',
  },
  {
    phase: 'Then',    Icon: Cpu,
    title: 'On-board perception',
    text: 'Run a lightweight vision model on the compute (e.g. a small YOLO variant) for real-time detection and tracking.',
  },
  {
    phase: 'After',   Icon: Target,
    title: 'Autonomous behaviors',
    text: 'Close the loop: target acquisition and centering without operator input, feeding the servo controller directly.',
  },
  {
    phase: 'Long-term', Icon: GitMerge,
    title: 'ROS integration',
    text: 'Migrate the control stack to ROS so behaviors compose cleanly and the platform interoperates with other robotics work.',
  },
]

export default function Turret() {
  return (
    <ProjectLayout>
      <PageHero
        kicker="Foundational Platform for Autonomous Systems"
        title="Mechatronics Integration: 2-Axis Robotic Turret"
        subtitle="Designed, fabricated, and validated a multi-part robotic turret that achieves repeatable positioning under test. Built as a foundation for future sensor fusion and autonomy — not yet closed-loop."
        chips={project.tech || []}
        status={{ label: 'Active', tone: 'brand', pulse: true }}
      />

      <STARSection star={project.star} title="Overview" />

      {/* Assembly + fabrication */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Design → fabrication"
            code="D/02"
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
                  Engineered for mechanical stability and precise servo seating. Press-fit mounts reduce backlash to a repeatable minimum.
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
                  Nine-part assembly fabricated via FDM printing. Modular parts stay serviceable and re-printable.
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
              kicker="CAD"
              code="C/03"
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
            kicker="Controls"
            code="C/04"
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

      {/* Roadmap — deliberately framed as future work */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Looking toward the future"
            code="R/05"
            title="What the platform is scoped to do next"
            subtitle="None of the phases below have shipped on the current hardware. This is the R&D backlog the mechanical + embedded foundation was built to unlock."
          />
          <div className="grid md:grid-cols-2 gap-3">
            {roadmap.map((r, i) => (
              <motion.div
                key={r.title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.06 }}
              >
                <Glass hover={false} className="h-full">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-3/60 border border-line grid place-items-center flex-shrink-0">
                      <r.Icon className="w-4 h-4 text-brand-300" />
                    </div>
                    <div>
                      <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/90">
                        {r.phase} · not yet built
                      </div>
                      <div className="text-white font-semibold mt-0.5">{r.title}</div>
                      <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">{r.text}</p>
                    </div>
                  </div>
                </Glass>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      <AARSection aar={project.aar} />

      <ProjectCTA
        title="Why this project matters"
        body="End-to-end mechatronics execution: mechanical architecture, rapid fabrication, embedded control, and validation. Designed as scaffolding for the perception and autonomy work that comes next."
        primary={{ label: 'Get in touch', to: '/#contact' }}
      />

      <ProjectPager currentId="turret" />
    </ProjectLayout>
  )
}
