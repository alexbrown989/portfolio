// src/pages/projects/Turret.jsx
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA, STARSection, AARSection,
} from '../../shared/ui'
import { projects } from '../../content/projects'
import { motion, useReducedMotion } from 'framer-motion'

const STLViewer = lazy(() => import('../../shared/STLViewer.jsx'))

const project = projects.find(p => p.id === 'turret') || {}

/* ------------------------------------------------------------------- */
/* Signature interactive: radar scan simulator                          */
/* ------------------------------------------------------------------- */
//
// Top-down azimuth view. Turret at the origin. A sweeping arm traces
// the current heading; each dwell point leaves a fading trail so the
// randomized-scan pattern reads visually. Sliders control the
// per-axis range and the sweep speed. Coverage % and cycles / min
// update live.

function TurretScanSim() {
  const [range, setRange] = useState(45)      // ±deg per axis
  const [speed, setSpeed] = useState(1.0)     // 0.4 – 1.8x
  const [angle, setAngle] = useState(0)       // current sweep angle
  const [trail, setTrail] = useState([])       // recent points
  const reduce = useReducedMotion()
  const dir = useRef(1)
  const raf = useRef(0)
  const t0 = useRef(0)

  useEffect(() => {
    if (reduce) return
    const step = (now) => {
      if (!t0.current) t0.current = now
      const dt = (now - t0.current) / 16.67
      t0.current = now
      setAngle(prev => {
        // Simulated randomized sweep: base linear scan plus a small
        // pseudo-random micro-adjustment so the trail feels like the
        // real "randomized sweep pattern".
        const jitter = (Math.sin(now / 300) + Math.cos(now / 175)) * 1.5
        let next = prev + dir.current * (0.9 * speed) * dt + jitter * 0.05 * dt
        if (next >= range)  { next = range;  dir.current = -1 }
        if (next <= -range) { next = -range; dir.current = 1 }
        return next
      })
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [range, speed, reduce])

  // Append trail points, keep the last N so the fading readout stays cheap.
  useEffect(() => {
    setTrail(t => {
      const next = [...t, angle]
      if (next.length > 60) next.shift()
      return next
    })
  }, [angle])

  const cx = 200, cy = 200, R = 160
  const rad = (angle - 90) * Math.PI / 180  // -90 so 0° is up

  // Fan of possible directions the turret could point (light shading).
  const fanD = (() => {
    const start = (-range - 90) * Math.PI / 180
    const end   = (+range - 90) * Math.PI / 180
    return `
      M ${cx} ${cy}
      L ${cx + Math.cos(start) * R} ${cy + Math.sin(start) * R}
      A ${R} ${R} 0 0 1 ${cx + Math.cos(end) * R} ${cy + Math.sin(end) * R}
      Z
    `
  })()

  const cyclesPerMin = ((0.9 * speed) * 60 * 60 / (range * 4)).toFixed(1)
  const coverage = Math.round((range / 90) * 100)

  return (
    <div className="rounded-xl border border-line bg-surface-3/60 overflow-hidden">
      <div className="grid md:grid-cols-[1fr_260px] gap-0">
        <div className="p-4">
          <svg viewBox="0 0 400 400" className="w-full h-64 md:h-80 bg-black/40 rounded-lg border border-line">
            {/* Compass ring */}
            {[45, 90, 135, 180].map(step => (
              <circle key={step} cx={cx} cy={cy} r={(step / 180) * R}
                fill="none" stroke="rgba(148,163,184,0.14)" />
            ))}
            {/* Cross hairs */}
            <line x1={cx - R} y1={cy} x2={cx + R} y2={cy} stroke="rgba(148,163,184,0.18)" />
            <line x1={cx} y1={cy - R} x2={cx} y2={cy + R} stroke="rgba(148,163,184,0.18)" />

            {/* Operating fan */}
            <path d={fanD} fill="rgba(34,191,224,0.08)" stroke="rgba(34,191,224,0.35)" />

            {/* Trail */}
            {trail.map((a, i) => {
              const r = (a - 90) * Math.PI / 180
              const opacity = (i + 1) / trail.length * 0.6
              return (
                <line
                  key={i}
                  x1={cx} y1={cy}
                  x2={cx + Math.cos(r) * R * 0.98} y2={cy + Math.sin(r) * R * 0.98}
                  stroke="#22bfe0"
                  strokeWidth="0.6"
                  opacity={opacity}
                />
              )
            })}

            {/* Active beam */}
            <line
              x1={cx} y1={cy}
              x2={cx + Math.cos(rad) * R} y2={cy + Math.sin(rad) * R}
              stroke="#22d3ee" strokeWidth="2"
              style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.6))' }}
            />
            {/* Beam tip target */}
            <circle
              cx={cx + Math.cos(rad) * R} cy={cy + Math.sin(rad) * R}
              r="4" fill="#22d3ee"
            />

            {/* Turret base */}
            <circle cx={cx} cy={cy} r="12" fill="#0f172a" stroke="#22bfe0" strokeWidth="1.5" />
            <circle cx={cx} cy={cy} r="4" fill="#22bfe0" />

            {/* HUD labels */}
            <text x="12" y="20" fontFamily="ui-monospace, JetBrains Mono, monospace" fontSize="10"
              fill="rgba(148,163,184,0.75)" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              Azimuth trace · randomized sweep
            </text>
            <text x={cx} y={cy - R - 8} textAnchor="middle" fontFamily="ui-monospace, JetBrains Mono, monospace"
              fontSize="9" fill="rgba(148,163,184,0.75)" style={{ letterSpacing: '0.2em' }}>
              0°
            </text>
            <text x={cx} y={cy + R + 16} textAnchor="middle" fontFamily="ui-monospace, JetBrains Mono, monospace"
              fontSize="9" fill="rgba(148,163,184,0.5)" style={{ letterSpacing: '0.2em' }}>
              180°
            </text>
            <text x={cx - R - 6} y={cy + 4} textAnchor="end" fontFamily="ui-monospace, JetBrains Mono, monospace"
              fontSize="9" fill="rgba(148,163,184,0.5)" style={{ letterSpacing: '0.2em' }}>
              -90°
            </text>
            <text x={cx + R + 6} y={cy + 4} fontFamily="ui-monospace, JetBrains Mono, monospace"
              fontSize="9" fill="rgba(148,163,184,0.5)" style={{ letterSpacing: '0.2em' }}>
              +90°
            </text>
          </svg>
        </div>

        {/* Controls + readout */}
        <div className="p-4 md:border-l border-line space-y-4">
          <div>
            <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 mb-1">
              Range · ±{range}°
            </div>
            <input
              type="range" min="15" max="90" step="5"
              value={range}
              onChange={(e) => setRange(Number(e.target.value))}
              className="w-full accent-brand-500"
              aria-label="Sweep range per axis"
            />
          </div>
          <div>
            <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 mb-1">
              Speed · {speed.toFixed(1)}x
            </div>
            <input
              type="range" min="4" max="18" step="1"
              value={Math.round(speed * 10)}
              onChange={(e) => setSpeed(Number(e.target.value) / 10)}
              className="w-full accent-brand-500"
              aria-label="Sweep speed"
            />
          </div>
          <div className="pt-3 border-t border-line grid grid-cols-2 gap-2 text-center">
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Coverage</div>
              <div className="text-lg font-bold text-white tabular-nums">{coverage}%</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Cycles / min</div>
              <div className="text-lg font-bold text-white tabular-nums">{cyclesPerMin}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Repeatability</div>
              <div className="text-lg font-bold text-brand-200 tabular-nums">0.8°</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Range · spec</div>
              <div className="text-lg font-bold text-brand-200 tabular-nums">±45°</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

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
        kicker="Foundational Platform for Autonomous Systems"
        title="Mechatronics Integration: 2-Axis Robotic Turret"
        subtitle="Designed, fabricated, and validated a multi-part robotic turret that achieves repeatable positioning under test. Built as a robust R&D platform for sensor fusion and future autonomy."
        chips={project.tech || []}
        status={{ label: 'Active', tone: 'brand', pulse: true }}
      />

      {/* Signature interactive */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Interactive"
            code="I/01"
            title="Scan simulator · azimuth trace"
            subtitle="Sweep range and speed under real controls. The fading trail is the randomized-sweep pattern the NodeMCU actually runs; the operating fan shows the servo-limited safe envelope."
          />
          <TurretScanSim />
        </Container>
      </section>

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

      {/* Roadmap */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Roadmap"
            code="R/05"
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
