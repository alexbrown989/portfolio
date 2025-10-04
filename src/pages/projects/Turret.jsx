import { lazy, Suspense } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProjectLayout from '../ProjectLayout'
import { projects } from '../../content/projects'

const STLViewer = lazy(() => import('../../shared/STLViewer.jsx'))

/* ---------- Small UI helpers ---------- */
function Glass({ children, className = '', hover = true, pad = true }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl border border-white/12 bg-white/7 backdrop-blur-sm relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className={`relative ${pad ? 'p-5 md:p-6' : ''}`}>{children}</div>
    </motion.div>
  )
}

function Chip({ children }) {
  return (
    <span className="px-2.5 py-1 text-[11px] rounded-full border border-cyan-400/40 text-cyan-200 bg-cyan-500/10">
      {children}
    </span>
  )
}

function MetricBox({ value, label, sub }) {
  return (
    <div className="rounded-xl bg-black/30 border border-white/10 p-4">
      <div className="text-2xl font-extrabold text-white leading-none">{value}</div>
      <div className="text-xs text-gray-300 mt-1">{label}</div>
      {sub && <div className="text-[11px] text-gray-400 mt-1">{sub}</div>}
    </div>
  )
}

/* ---------- Page ---------- */
export default function Turret() {
  const project = projects.find(p => p.id === 'turret') || {
    title: '2-Axis Autonomous Turret',
    summary: 'SolidWorks multi-part assembly; NodeMCU + Arduino randomized scan algorithm; designed for future sensing.',
    image: '/projects/turret-full.jpg',
    video: '/projects/turret-demo.mp4',
    stl: '/models/Turret.stl',
    tech: ['SolidWorks', 'Arduino', 'NodeMCU']
  }

  return (
    <ProjectLayout>
      {/* Header */}
      <section className="pt-24 pb-6">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200">// Foundational Platform for Autonomous Systems</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2">Mechatronics Integration: 2-Axis Robotic Turret</h1>
          <p className="text-gray-300 mt-3 max-w-3xl">
            Designed, fabricated, and validated a multi-part robotic turret that achieves repeatable positioning under test.
            This serves as a robust R&D platform for sensor fusion and future autonomy.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(project.tech || []).map(t => <Chip key={t}>{t}</Chip>)}
          </div>
        </div>
      </section>

      {/* Digital Design → Physical Prototype */}
      <section className="pb-10">
        <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-2 gap-6">
          {/* Left: Finished assembly photo (zoomed-out feel via object-contain + aspect) */}
          <Glass>
            <div className="relative">
              <div className="w-full aspect-[16/10] rounded-xl border border-white/10 bg-black/40 overflow-hidden">
                <img
                  src={project.image || '/projects/turret-full.jpg'}
                  alt="Finished turret assembly"
                  className="w-full h-full object-contain p-2"
                  loading="eager"
                />
              </div>
              <div className="absolute top-4 right-4">
                <span className="px-2.5 py-1 text-[11px] rounded-full border border-cyan-300/40 text-cyan-100 bg-cyan-500/15 shadow-lg shadow-cyan-500/10">
                  ±0.5 mm critical fitment
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-300 mt-3">
              Final assembly engineered for mechanical stability and precise servo seating to reduce backlash.
            </p>
          </Glass>

          {/* Right: Print timelapse or fabrication video */}
          <Glass>
            <div className="w-full aspect-[16/10] rounded-xl border border-white/10 bg-black overflow-hidden">
              {/* Replace with your timelapse path */}
              <video
                src={project.printVideo || '/projects/turret-print.mp4'}
                controls
                className="w-full h-full object-contain"
                poster="/projects/print-turret.jpg"
              />
            </div>
            <p className="text-sm text-gray-300 mt-3">
              Multi-part assembly fabricated via FDM printing. From CAD to bench-ready hardware in under 24 hours.
            </p>
          </Glass>
        </div>
      </section>

      {/* Interactive CAD Model */}
      {project.stl && (
        <section className="pb-10">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Interactive CAD Model</h2>
            <Glass pad={false} hover={false} className="p-0">
              <Suspense fallback={
                <div className="h-[520px] flex items-center justify-center text-cyan-300">Loading 3D model…</div>
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
              <div className="p-4 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  <span className="text-cyan-400">Interactive: </span>
                  Explore the multi-part SolidWorks assembly. Key design features include press-fit servo mounts and a stabilized dual-axis gimbal.
                  Drag to rotate • Scroll to zoom • Double-click to reset.
                </p>
              </div>
            </Glass>
          </div>
        </section>
      )}

      {/* Controls & Performance */}
      <section className="pb-10">
        <div className="container mx-auto px-6 max-w-6xl grid lg:grid-cols-2 gap-6">
          {/* Left: demo video (zoomed out) */}
          <Glass>
            <div className="w-full aspect-[16/10] rounded-xl border border-white/10 bg-black overflow-hidden">
              <video
                src={project.video || '/projects/turret-demo.mp4'}
                controls
                className="w-full h-full object-contain"
                poster="/projects/turret-demo.jpg"
              />
            </div>
            <p className="text-sm text-gray-300 mt-3">
              Live scan demonstration with randomized sweep pattern on each axis. NodeMCU orchestrates angular limits and timing.
            </p>
          </Glass>

          {/* Right: code screenshot (or snippet image) */}
          <Glass>
            <div className="w-full aspect-[16/10] rounded-xl border border-white/10 bg-black overflow-hidden">
              <img
                src={project.codeImage || '/projects/code-arduino.jpg'}
                alt="Embedded C++ control logic"
                className="w-full h-full object-contain p-2"
              />
            </div>
            <p className="text-sm text-gray-300 mt-3">
              Embedded C++ (Arduino IDE) handles servo motion profiles, limit enforcement, and scan cadence.
            </p>
          </Glass>
        </div>

        {/* Metrics (clearer wording) */}
        <div className="container mx-auto px-6 max-w-6xl mt-6">
          <Glass hover={false}>
            <h3 className="text-sm font-mono text-cyan-400 uppercase tracking-[0.2em] mb-3">// Key Outcomes</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <MetricBox value="0.8°" label="Angular repeatability (std dev)" sub="Measured over 100 cycles" />
              <MetricBox value="±45°" label="Operational range per axis" sub="Servo-limited for stability" />
              <MetricBox value="9" label="Printed parts integrated" sub="Modular, serviceable assembly" />
              <MetricBox value="C++" label="Control language" sub="Arduino / NodeMCU" />
            </div>
          </Glass>
        </div>
      </section>

      {/* Roadmap – “future vibes” with animated timeline */}
      <section className="pb-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">Future R&D Roadmap</h2>

          <Glass hover={false}>
            <div className="relative pl-6">
              {/* animated line */}
              <div className="absolute left-2 top-0 bottom-0 w-[2px] bg-gradient-to-b from-cyan-400/60 via-purple-400/60 to-transparent animate-pulse" />
              {/* items */}
              {[
                { when: 'Phase 1', title: 'Sensor Fusion', text: 'Integrate LiDAR and camera modules for environment awareness.' },
                { when: 'Phase 2', title: 'On-Board Perception', text: 'Lightweight vision model (e.g., YOLOv8n) for object detection/tracking.' },
                { when: 'Phase 3', title: 'Autonomous Behaviors', text: 'Target acquisition and centering without operator input.' },
                { when: 'Phase 4', title: 'ROS Integration', text: 'Migrate to ROS for composition of behaviors and interoperability.' },
              ].map((r, i) => (
                <motion.div
                  key={r.title}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative mb-5 last:mb-0"
                >
                  <div className="absolute -left-3 top-1.5 w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,.6)]" />
                  <div className="text-[11px] text-cyan-300/90 font-mono uppercase tracking-wider">{r.when}</div>
                  <div className="text-white font-semibold">{r.title}</div>
                  <div className="text-sm text-gray-300">{r.text}</div>
                </motion.div>
              ))}
            </div>
          </Glass>

          {/* CTA */}
          <div className="mt-8">
            <Glass>
              <h3 className="text-xl font-bold text-white mb-2">Why This Project Matters</h3>
              <p className="text-gray-300">
                End-to-end mechatronics execution: mechanical architecture, rapid fabrication, embedded control, and validation.
                This platform is built to scale into intelligent robotics through iterative R&D.
              </p>
              <div className="mt-4">
                <Link
                  to="/#contact"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-medium shadow-lg hover:shadow-cyan-500/25 transition-all"
                >
                  Get in touch ↗
                </Link>
              </div>
            </Glass>

            <div className="mt-6">
              <Link className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors" to="/#projects">
                <span>←</span> Back to Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </ProjectLayout>
  )
}
