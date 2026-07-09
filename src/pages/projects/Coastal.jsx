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
import { usePageMeta } from '../../shared/usePageMeta'

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
  const [energyPct,  setEnergyPct]  = useState(100)
  const [erosionPct, setErosionPct] = useState(0)
  const canvasRef = useRef(null)
  const stateRef  = useRef(null)
  const reduce = useReducedMotion()

  // Reset world-state whenever the scenario toggles.
  useEffect(() => {
    const cssW = 720, cssH = 320
    // Shore layout: ground starts at x=500. The seawall (when defended)
    // is anchored INTO the shoreline at that exact column — no gap,
    // reads as a real seawall bolted to the shore. Wave impacts at the
    // seawall face when defended, or at the shore face when undefended.
    const groundStartX = 500
    const seawallX     = groundStartX - 4    // wall sits flush against the shore
    const barrierX     = defended ? seawallX - 4 : groundStartX
    stateRef.current = {
      cssW, cssH,
      seawallX, groundStartX, barrierX,
      loss: new Float32Array(cssW - groundStartX),
      spray:     [],
      sediment:  [],
      breaking:  [],
      t: 0,
      lastCrestPast: false,
      strikes: 0,
      lastEnergy: defended ? 63 : 100,
    }
    setErosionPct(0)
    setEnergyPct(defended ? 63 : 100)
  }, [defended])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !stateRef.current) return
    const ctx = canvas.getContext('2d')

    // DPR scaling
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const cssW = 720, cssH = 320
    canvas.width  = cssW * dpr
    canvas.height = cssH * dpr
    canvas.style.width  = '100%'
    canvas.style.height = 'auto'
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    let raf, last = performance.now()
    const rand = (a, b) => a + Math.random() * (b - a)

    // Two-harmonic ocean surface, in world-y (larger y = down).
    const waveY = (x, t) => {
      const restY = 200
      const swell = Math.sin(x * 0.011 - t * 1.2) * 14
      const chop  = Math.sin(x * 0.045 - t * 3.5) * 4
      return restY - swell - chop
    }

    // The leading crest advances at ~180 px/s, resets when it strikes.
    // We define the crest as a virtual x that moves and gets "consumed" by
    // the barrier. That way the wave visually terminates at the seawall or
    // shoreline instead of drawing through the building.
    let crestX = -60
    const crestSpeed = 180 // px/s

    const step = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const s = stateRef.current
      s.t += dt

      // Advance the crest; reset behind the horizon after it strikes.
      crestX += crestSpeed * dt
      const barrierHit = crestX >= s.barrierX

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, cssH)
      sky.addColorStop(0, '#0b1220')
      sky.addColorStop(1, '#050a14')
      ctx.fillStyle = sky
      ctx.fillRect(0, 0, cssW, cssH)

      // Distant sun/glow
      const glow = ctx.createRadialGradient(120, 60, 8, 120, 60, 220)
      glow.addColorStop(0, 'rgba(253,224,71,0.14)')
      glow.addColorStop(1, 'rgba(253,224,71,0)')
      ctx.fillStyle = glow
      ctx.fillRect(0, 0, cssW, cssH)

      // WATER — draw ONLY up to the barrier so the wave never passes it.
      // If defended, wall at seawallX. If undefended, cliff face at
      // groundStartX. Water body is a closed path from x=0 to barrierX.
      const waterLimit = s.barrierX
      ctx.beginPath()
      ctx.moveTo(0, cssH)
      for (let x = 0; x <= waterLimit; x += 4) {
        ctx.lineTo(x, waveY(x, s.t))
      }
      ctx.lineTo(waterLimit, cssH)
      ctx.closePath()
      const water = ctx.createLinearGradient(0, 190, 0, cssH)
      water.addColorStop(0, 'rgba(14,116,144,0.9)')
      water.addColorStop(1, 'rgba(8,51,68,1)')
      ctx.fillStyle = water
      ctx.fill()

      // Foam highlight along the water surface — also stops at barrier
      ctx.beginPath()
      for (let x = 0; x <= waterLimit; x += 4) {
        const y = waveY(x, s.t)
        if (x === 0) ctx.moveTo(x, y)
        else         ctx.lineTo(x, y)
      }
      ctx.strokeStyle = 'rgba(125,211,252,0.35)'
      ctx.lineWidth = 1
      ctx.stroke()

      // GROUND / shoreline (with per-column erosion depths)
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
      ctx.strokeStyle = 'rgba(226,232,240,0.18)'
      ctx.lineWidth = 1
      ctx.stroke()

      // Building — sits well back from the shoreline, on solid ground
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

      // Seawall — drawn flush against the shore, embedded into the ground.
      // The wave impacts its water-facing face; back face melds into land.
      if (defended) {
        ctx.fillStyle = '#334155'
        ctx.strokeStyle = 'rgba(34,191,224,0.7)'
        ctx.lineWidth = 1.4
        // Vertical wall: 8px wide, from y=132 (crest) down to y=210 (into ground)
        ctx.fillRect(s.seawallX - 8, 132, 8, 78)
        ctx.strokeRect(s.seawallX - 8, 132, 8, 78)
        // Beveled top cap for readability
        ctx.beginPath()
        ctx.moveTo(s.seawallX - 8, 132)
        ctx.lineTo(s.seawallX - 4, 128)
        ctx.lineTo(s.seawallX,     132)
        ctx.closePath()
        ctx.fillStyle = '#475569'
        ctx.fill()
        ctx.stroke()
      }

      // Draw incoming crest as a raised arc up to the barrier
      const crestVisibleTo = Math.min(crestX, s.barrierX)
      if (crestVisibleTo > 40) {
        ctx.beginPath()
        for (let x = Math.max(0, crestX - 100); x <= crestVisibleTo; x += 3) {
          const y = waveY(x, s.t) - 10 * Math.max(0, 1 - (crestVisibleTo - x) / 100)
          if (x === Math.max(0, crestX - 100)) ctx.moveTo(x, y)
          else                                 ctx.lineTo(x, y)
        }
        ctx.strokeStyle = 'rgba(125,211,252,0.9)'
        ctx.lineWidth = 2
        ctx.stroke()
      }

      // IMPACT: wave crest reaches barrier — spawn dense particle burst
      if (barrierHit && !s.lastCrestPast) {
        s.strikes++
        // FOAM crash particles: fan out UP-BACK from the barrier
        const foamCount = defended ? 90 : 130
        for (let i = 0; i < foamCount; i++) {
          const theta = rand(-Math.PI * 0.85, -Math.PI * 0.15) // upward hemisphere biased leftward
          const speed = rand(120, 340)
          s.spray.push({
            x: s.barrierX + rand(-6, 6),
            y: 180 + rand(-8, 2),
            vx: Math.cos(theta) * speed * (defended ? 0.9 : 1.15),
            vy: Math.sin(theta) * speed,
            life: rand(0.55, 1.1),
            age: 0,
            r: rand(0.8, 1.8),
          })
        }
        // BREAKING wave-face debris (denser, close to the barrier)
        for (let i = 0; i < (defended ? 30 : 50); i++) {
          s.breaking.push({
            x: s.barrierX + rand(-12, 4),
            y: rand(150, 200),
            vx: rand(-140, -20),
            vy: rand(-120, 40),
            life: rand(0.4, 0.8),
            age: 0,
            r: rand(1, 2.4),
          })
        }
        // SEDIMENT particles: only when undefended, and they come from the
        // shoreline face (not the seawall). Also mutates the erosion profile.
        if (!defended) {
          const sedCount = 55
          for (let i = 0; i < sedCount; i++) {
            const px = s.groundStartX + rand(0, 40)
            s.sediment.push({
              x: px,
              y: 200 + rand(-2, 4),
              vx: rand(-30, 100),
              vy: rand(-220, -80),
              life: rand(0.9, 1.8),
              age: 0,
              r: rand(0.7, 1.7),
              c: 'rgba(252,165,165,0.95)',
            })
            const colIdx = Math.max(0, Math.min(s.loss.length - 1, Math.round(px - s.groundStartX)))
            s.loss[colIdx] += rand(0.25, 0.65)
            if (colIdx > 0)                 s.loss[colIdx - 1] += 0.12
            if (colIdx < s.loss.length - 1) s.loss[colIdx + 1] += 0.12
          }
        } else {
          // Defended: a tiny residual scour so it's not literally zero
          for (let i = 0; i < 6; i++) {
            const px = s.groundStartX + rand(0, 40)
            s.sediment.push({
              x: px,
              y: 200 + rand(-2, 4),
              vx: rand(-20, 60),
              vy: rand(-110, -50),
              life: rand(0.6, 1.1),
              age: 0,
              r: rand(0.6, 1.3),
              c: 'rgba(148,163,184,0.85)',
            })
          }
        }

        // Reset crest to advance again from the horizon
        crestX = rand(-120, -60)
      }
      s.lastCrestPast = barrierHit

      // ADVANCE + DRAW spray (foam)
      ctx.fillStyle = 'rgba(240,249,255,0.95)'
      const nextSpray = []
      for (const p of s.spray) {
        p.age += dt
        p.vy += 420 * dt
        p.x  += p.vx * dt
        p.y  += p.vy * dt
        if (p.age < p.life && p.y < 260 && p.x > -10) {
          ctx.globalAlpha = (1 - p.age / p.life) * 0.9
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
          nextSpray.push(p)
        }
      }
      s.spray = nextSpray

      // ADVANCE + DRAW breaking-face particles
      ctx.fillStyle = 'rgba(186,230,253,0.9)'
      const nextBreak = []
      for (const p of s.breaking) {
        p.age += dt
        p.vy += 480 * dt
        p.x  += p.vx * dt
        p.y  += p.vy * dt
        if (p.age < p.life && p.y < 260) {
          ctx.globalAlpha = (1 - p.age / p.life) * 0.85
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
          nextBreak.push(p)
        }
      }
      s.breaking = nextBreak

      // ADVANCE + DRAW sediment
      const nextSed = []
      for (const p of s.sediment) {
        p.age += dt
        p.vy += 340 * dt
        p.x  += p.vx * dt
        p.y  += p.vy * dt
        if (p.age < p.life && p.y < 305) {
          ctx.globalAlpha = 1 - p.age / p.life
          ctx.fillStyle = p.c
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
          nextSed.push(p)
        }
      }
      ctx.globalAlpha = 1
      s.sediment = nextSed

      // Metrics (throttled ~3 fps to React)
      // Wave energy at shore: 100% baseline undefended, ~63% defended (37% reduction from the study).
      const targetEnergy = defended ? 63 : 100
      s.lastEnergy += (targetEnergy - s.lastEnergy) * dt * 2
      // Erosion: sum of column loss, mapped so ~1200 units total = 100%.
      // Undefended reaches meaningful erosion after ~6 strikes.
      const totalLoss = s.loss.reduce((a, b) => a + b, 0)
      const erosion = Math.min(100, totalLoss / 12)
      if ((s.t * 3 | 0) !== ((s.t - dt) * 3 | 0)) {
        setEnergyPct(Math.round(s.lastEnergy))
        setErosionPct(Math.round(erosion))
      }

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
