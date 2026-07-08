// src/pages/projects/Coastal.jsx
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import ProjectLayout from '../ProjectLayout'
import YouTube from '../../shared/Youtube'
import { projects } from '../../content/projects'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA, STARSection, AARSection,
} from '../../shared/ui'

const STLViewer = lazy(() => import('../../shared/STLViewer.jsx'))

const project = projects.find(p => p.id === 'coastal')

/* ------------------------------------------------------------------- */
/* Signature interactive: seawall wave sim                              */
/* ------------------------------------------------------------------- */
//
// SVG scene with a rolling wave that either crashes over an unprotected
// shoreline or is dissipated by a scaled seawall. Toggle switches the
// scenario and the readouts change accordingly. Cartoon geometry, not
// CFD — the point is to make the coastal-defense case immediately
// legible.

// Canvas-based wave / erosion sim.
// - Real ocean surface driven by a sum-of-sinusoids (2 harmonics + swell)
// - Sediment particles are launched from the shoreline whenever the wave
//   crest crosses onto the ground. Undefended: erosion accumulates and
//   the shoreline visibly retreats. Defended: the seawall dissipates
//   the crest energy, particle spawn drops, and the shoreline holds.
// - Spray droplets on impact for texture; foam line rides the crest.

function CoastalWaveSim() {
  const [defended, setDefended] = useState(true)
  const [energyPct,  setEnergyPct]  = useState(100) // energy at shore, undefended baseline = 100
  const [erosionPct, setErosionPct] = useState(0)   // 0..100 accumulated sediment loss
  const canvasRef = useRef(null)
  const stateRef  = useRef(null)     // particles + shoreline profile live here so React doesn't re-render on tick
  const reduce = useReducedMotion()

  // Init world-state on mount + on reset (defended toggle).
  useEffect(() => {
    const W = 720, H = 320
    const groundStartX = 500   // pixels — shoreline begins here
    stateRef.current = {
      W, H,
      groundStartX,
      // Ground profile — per-column height loss from erosion (pixels).
      // Positive values eat down into the shoreline.
      loss: new Float32Array(W - groundStartX),
      particles: [],       // sediment particles (splashed / eroded away)
      spray:     [],       // white foam droplets on wave impact
      t: 0,
      lastCrestPast: false,
      strikes: 0,
      lastEnergy: 100,
    }
    setErosionPct(0)
    setEnergyPct(defended ? 63 : 100)
  }, [defended])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !stateRef.current) return
    const ctx = canvas.getContext('2d')

    // Scale canvas for DPR
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cssW = 720, cssH = 320
    canvas.width  = cssW * dpr
    canvas.height = cssH * dpr
    canvas.style.width  = '100%'
    canvas.style.height = 'auto'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let raf, last = performance.now()
    const seawallX = 380
    const rand = (a, b) => a + Math.random() * (b - a)

    // Two-harmonic wave surface. Returns y at column x for time t.
    const waveY = (x, t) => {
      const restY = 200
      const swell = Math.sin(x * 0.011 - t * 1.2) * 14
      const chop  = Math.sin(x * 0.045 - t * 3.5) * 4
      return restY - swell - chop
    }

    // Approximate crest position: leading crest advances at ~85 px/s.
    // Wraps periodically to give a rhythm of impacts.
    const crestPeriodMs = 3000
    const crestX = (t) => {
      const cycle = (t * 1000) % crestPeriodMs / crestPeriodMs
      return -60 + cycle * (cssW + 120)
    }

    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const s = stateRef.current
      s.t += dt

      // Clear + sky
      const sky = ctx.createLinearGradient(0, 0, 0, cssH)
      sky.addColorStop(0, '#0b1220')
      sky.addColorStop(1, '#050a14')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, cssW, cssH)

      // Distant horizon glow
      const glow = ctx.createRadialGradient(120, 60, 8, 120, 60, 220)
      glow.addColorStop(0, 'rgba(253,224,71,0.14)')
      glow.addColorStop(1, 'rgba(253,224,71,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, cssW, cssH)

      // Water body — filled between the wave surface curve and the bottom
      ctx.beginPath()
      ctx.moveTo(0, cssH)
      for (let x = 0; x <= cssW; x += 6) {
        ctx.lineTo(x, waveY(x, s.t))
      }
      ctx.lineTo(cssW, cssH)
      ctx.closePath()
      const water = ctx.createLinearGradient(0, 190, 0, cssH)
      water.addColorStop(0, 'rgba(14,116,144,0.9)')
      water.addColorStop(1, 'rgba(8,51,68,1)')
      ctx.fillStyle = water
      ctx.fill()

      // Foam surface highlight (upper edge)
      ctx.beginPath()
      for (let x = 0; x <= cssW; x += 4) {
        const y = waveY(x, s.t)
        if (x === 0) ctx.moveTo(x, y)
        else         ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(125,211,252,0.35)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Ground / shoreline — erosion is tracked per column
      const groundBase = 200
      ctx.beginPath()
      ctx.moveTo(s.groundStartX, cssH)
      ctx.lineTo(s.groundStartX, groundBase + s.loss[0])
      for (let i = 0; i < s.loss.length; i++) {
        ctx.lineTo(s.groundStartX + i, groundBase + s.loss[i])
      }
      ctx.lineTo(cssW, cssH)
      ctx.closePath()
      const groundGrad = ctx.createLinearGradient(0, groundBase, 0, cssH)
      if (defended) {
        groundGrad.addColorStop(0, '#94a3b8')
        groundGrad.addColorStop(1, '#334155')
      } else {
        groundGrad.addColorStop(0, '#a16b6b')
        groundGrad.addColorStop(1, '#3f1414')
      }
      ctx.fillStyle = groundGrad
      ctx.fill()
      // Rough dark cliff face highlight
      ctx.strokeStyle = 'rgba(226,232,240,0.18)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Building
      ctx.fillStyle = '#0f172a'
      ctx.strokeStyle = 'rgba(148,163,184,0.4)'
      ctx.lineWidth = 1
      ctx.fillRect(600, 130, 70, 70)
      ctx.strokeRect(600, 130, 70, 70)
      ctx.fillStyle = 'rgba(34,191,224,0.55)'
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 2; c++) {
          ctx.fillRect(612 + c * 32, 142 + r * 20, 12, 14)
        }
      }

      // Seawall (only when defended)
      if (defended) {
        ctx.fillStyle = '#334155'
        ctx.strokeStyle = 'rgba(34,191,224,0.7)'
        ctx.lineWidth = 1.4
        ctx.fillRect(seawallX - 8, 140, 16, 76)
        ctx.strokeRect(seawallX - 8, 140, 16, 76)
        ctx.fillStyle = 'rgba(148,163,184,0.85)'
        ctx.font = '10px ui-monospace, JetBrains Mono, monospace'
        ctx.textAlign = 'center'
        ctx.fillText('SEAWALL', seawallX, 130)
      }

      // Wave impact — when the leading crest reaches ground OR seawall
      const cx = crestX(s.t)
      const impactX = defended ? seawallX : s.groundStartX + 8
      const nowPast = cx > impactX && cx < impactX + 40
      if (nowPast && !s.lastCrestPast) {
        s.strikes++
        // Spawn spray droplets at impact
        for (let i = 0; i < (defended ? 22 : 34); i++) {
          s.spray.push({
            x: impactX + rand(-8, 8),
            y: 180 + rand(-6, 4),
            vx: rand(-90, 40),
            vy: rand(-260, -160),
            life: rand(0.55, 1.0),
            age: 0,
          })
        }
        // Spawn sediment particles when undefended (real erosion event).
        // If defended, spawn a tiny number to communicate residual scour.
        const count = defended ? 4 : 32
        for (let i = 0; i < count; i++) {
          const px = s.groundStartX + rand(0, 30)
          s.particles.push({
            x: px,
            y: 200 + rand(-2, 4),
            vx: rand(-40, 90),
            vy: rand(-190, -70),
            life: rand(0.8, 1.6),
            age: 0,
            r: rand(0.7, 1.6),
            c: defended ? 'rgba(148,163,184,0.9)' : 'rgba(252,165,165,0.95)',
          })
          // Deepen the erosion trench (undefended = real damage)
          if (!defended) {
            const colIdx = Math.max(0, Math.min(s.loss.length - 1, Math.round(px - s.groundStartX)))
            s.loss[colIdx] += rand(0.15, 0.45)
            // Bleed to neighbors so the profile stays smooth
            if (colIdx > 0)                    s.loss[colIdx - 1] += 0.08
            if (colIdx < s.loss.length - 1)    s.loss[colIdx + 1] += 0.08
          }
        }
      }
      s.lastCrestPast = nowPast

      // Advance and draw spray
      ctx.fillStyle = 'rgba(226,232,240,0.9)'
      const nextSpray = []
      for (const p of s.spray) {
        p.age += dt
        p.vy += 380 * dt
        p.x  += p.vx * dt
        p.y  += p.vy * dt
        if (p.age < p.life && p.y < 260) {
          const alpha = 1 - p.age / p.life
          ctx.globalAlpha = alpha * 0.9
          ctx.beginPath()
          ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2)
          ctx.fill()
          nextSpray.push(p)
        }
      }
      ctx.globalAlpha = 1
      s.spray = nextSpray

      // Advance and draw sediment particles
      const nextP = []
      for (const p of s.particles) {
        p.age += dt
        p.vy += 320 * dt
        p.x  += p.vx * dt
        p.y  += p.vy * dt
        if (p.age < p.life && p.y < 300) {
          ctx.globalAlpha = 1 - p.age / p.life
          ctx.fillStyle = p.c
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
          nextP.push(p)
        }
      }
      ctx.globalAlpha = 1
      s.particles = nextP

      // Compute and expose live metrics (throttled)
      // Energy at shore: full when undefended, ~63% when defended (37% reduction).
      // Erosion: % of loss array totals, capped.
      const targetEnergy = defended ? 63 : 100
      s.lastEnergy = s.lastEnergy + (targetEnergy - s.lastEnergy) * dt * 2
      const totalLoss = s.loss.reduce((a, b) => a + b, 0)
      const erosion = Math.min(100, totalLoss / 8) // 800 total loss = 100%
      // Only nudge React 3x/s to avoid churn
      if ((s.t * 3 | 0) !== ((s.t - dt) * 3 | 0)) {
        setEnergyPct(Math.round(s.lastEnergy))
        setErosionPct(Math.round(erosion))
      }

      // Draw the leading crest arc (as a soft highlight over the water)
      ctx.beginPath()
      ctx.moveTo(cx - 60, waveY(cx - 60, s.t))
      for (let x = cx - 60; x <= cx + 60; x += 3) {
        ctx.lineTo(x, waveY(x, s.t) - 6)
      }
      ctx.strokeStyle = 'rgba(125,211,252,0.85)'
      ctx.lineWidth = 2
      ctx.stroke()

      // HUD scenario label
      ctx.fillStyle = 'rgba(226,232,240,0.75)'
      ctx.font = '10px ui-monospace, JetBrains Mono, monospace'
      ctx.textAlign = 'left'
      ctx.fillText(
        `SCENARIO · ${defended ? 'DEFENDED' : 'UNDEFENDED'}   STRIKES · ${s.strikes}`,
        12, 302,
      )

      if (!reduce) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [defended, reduce])

  return (
    <div className="rounded-xl border border-line bg-surface-3/60 overflow-hidden">
      <div className="p-4">
        <canvas ref={canvasRef} className="w-full rounded-lg border border-line bg-black/40" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 p-4 pt-0 border-t border-line md:border-t-0">
        <div className="pt-4 md:pt-0">
          <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 mb-1.5">
            Toggle scenario
          </div>
          <div className="inline-flex rounded-lg border border-line overflow-hidden">
            <button
              onClick={() => setDefended(true)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                defended
                  ? 'bg-brand-500/15 text-brand-200'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              With seawall
            </button>
            <button
              onClick={() => setDefended(false)}
              className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-line ${
                !defended
                  ? 'bg-red-500/15 text-red-200'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Without
            </button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center min-w-0 pt-4 md:pt-0">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Wave energy at shore</div>
            <div className={`text-sm font-semibold tabular-nums ${defended ? 'text-brand-200' : 'text-red-300'}`}>
              {energyPct}%
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Erosion</div>
            <div className={`text-sm font-semibold tabular-nums ${erosionPct > 20 ? 'text-red-300' : 'text-brand-200'}`}>
              {erosionPct}%
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Infra risk</div>
            <div className={`text-sm font-semibold ${defended ? 'text-brand-200' : 'text-red-300'}`}>
              {defended ? 'Reduced' : '$45M exposure'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const metrics = [
  { value: '↓ 37%', label: 'Wave energy at shoreline' },
  { value: '↓ 42%', label: 'Coastal vorticity magnitude' },
  { value: '3',     label: 'High-risk zones identified' },
  { value: '~40%',  label: 'PIV accuracy improvement' },
]

export default function Coastal() {
  return (
    <ProjectLayout>
      <PageHero
        kicker="Protecting $45M in Pacific Infrastructure"
        title={project?.title || 'Coastal Wave Dynamics & Seawall Design'}
        subtitle="First lab-scale pipeline to quantify wave–coast interactions for Saipan. A novel Visual Field Architecture background improved PIV measurement fidelity by ~40%, enabling a defensible, replicable test rig."
        chips={project?.tech || []}
        status={{ label: 'Active', tone: 'brand', pulse: true }}
      />

      {/* Signature interactive: seawall wave simulation */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Interactive"
            code="I/01"
            title="Wave impact · with seawall vs without"
            subtitle="Cartoon simulation. Toggle the scenario to see how the same wave interacts with a shoreline that has a scaled seawall versus one that does not."
          />
          <CoastalWaveSim />
        </Container>
      </section>

      {/* Crisis */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Context"
            code="C/02"
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
            code="D/03"
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
            code="A/04"
            title="Wave–structure interaction"
            subtitle="Flow-field visualization with velocity vectors and vorticity contours, powered by the improved PIV background."
          />
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-5">
            <Glass pad={false}>
              <video
                src="/projects/saipan.mp4"
                controls
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
            <SectionTitle kicker="Field context" code="F/05" title="Watch the tank run" />
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
            <SectionTitle kicker="Model" code="M/06" title="Interactive 3D geometry" />
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
                  zoom={2.1}
                />
              </Suspense>
              <div className="px-5 py-3 border-t border-line text-xs text-gray-400 font-mono">
                Drag to rotate · Scroll to zoom · Double-click to reset
              </div>
            </Glass>
          </Container>
        </section>
      )}

      <STARSection star={project.star} />
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
