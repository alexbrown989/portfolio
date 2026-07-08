// src/pages/projects/Coastal.jsx
import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
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

function CoastalWaveSim() {
  const [defended, setDefended] = useState(true)
  const [t, setT] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) return
    let raf, start
    const step = (now) => {
      if (!start) start = now
      setT(((now - start) / 3400) % 1)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [reduce])

  // Wave crest advances left → right. Wave amplitude visually attenuates
  // past the seawall when defended.
  const crestX = 20 + t * 340

  // Attenuation depends on defended state and how far past the seawall we are.
  const seawallX = 240
  const pastWall = crestX > seawallX
  const attenuation =
    defended && pastWall
      ? Math.max(0, 1 - (crestX - seawallX) / 60)
      : 1
  const crestHeight = 32 * (defended && pastWall ? attenuation : 1)

  return (
    <div className="rounded-xl border border-line bg-surface-3/60 overflow-hidden">
      <svg viewBox="0 0 400 200" className="w-full h-64">
        <defs>
          <linearGradient id="sky" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#0f172a" />
            <stop offset="100%" stopColor="#0a0f1a" />
          </linearGradient>
          <linearGradient id="water" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%"   stopColor="#0e7490" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#083344" stopOpacity="1" />
          </linearGradient>
          <linearGradient id="crest" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#22bfe0" />
          </linearGradient>
          <linearGradient id="ground" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={defended ? '#a3a3a3' : '#7f1d1d'} />
            <stop offset="100%" stopColor={defended ? '#374151' : '#450a0a'} />
          </linearGradient>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width="400" height="120" fill="url(#sky)" />
        {/* Sun / hazy light */}
        <circle cx="60" cy="40" r="16" fill="rgba(253,224,71,0.14)" />
        {/* Water */}
        <rect x="0" y="120" width="400" height="60" fill="url(#water)" />

        {/* Base ocean wavelets */}
        <path
          d={`M 0 120 ${Array.from({ length: 30 }, (_, i) =>
            `Q ${i * 14 + 7} ${120 + (i % 2 ? 4 : -4)} ${i * 14 + 14} 120`,
          ).join(' ')} L 400 200 L 0 200 Z`}
          fill="rgba(34,191,224,0.12)"
        />

        {/* Advancing crest */}
        <motion.path
          d={`
            M ${crestX - 40} 120
            Q ${crestX - 20} ${120 - crestHeight}
              ${crestX}     120
            Q ${crestX + 20} ${120 + crestHeight * 0.4}
              ${crestX + 40} 120
            Z
          `}
          fill="url(#crest)"
          animate={{ opacity: pastWall && defended ? attenuation : 1 }}
        />
        {/* Crest foam */}
        <motion.path
          d={`M ${crestX - 22} ${120 - crestHeight * 0.75} Q ${crestX - 10} ${120 - crestHeight * 1.1} ${crestX} ${120 - crestHeight * 0.75}`}
          stroke="#f8fafc" strokeWidth="1.5" fill="none"
          opacity={pastWall && defended ? attenuation : 1}
        />

        {/* Shoreline / ground */}
        <path
          d="M 300 120 L 400 120 L 400 200 L 300 200 Z"
          fill="url(#ground)"
        />

        {/* Erosion markings when not defended */}
        {!defended && (
          <>
            {Array.from({ length: 4 }, (_, i) => (
              <motion.path
                key={i}
                d={`M ${310 + i * 20} 125 l 6 -3 l -3 8 l 5 -2`}
                stroke="#fca5a5" strokeWidth="1.2" fill="none" strokeLinecap="round"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </>
        )}

        {/* Building on the shoreline */}
        <rect x="340" y="80" width="42" height="40" fill="#1f2937" stroke="rgba(148,163,184,0.35)" />
        <rect x="348" y="90"  width="7" height="9" fill="#22bfe0" opacity="0.5" />
        <rect x="365" y="90"  width="7" height="9" fill="#22bfe0" opacity="0.5" />
        <rect x="348" y="105" width="7" height="9" fill="#22bfe0" opacity="0.5" />
        <rect x="365" y="105" width="7" height="9" fill="#22bfe0" opacity="0.5" />

        {/* Seawall */}
        {defended && (
          <>
            <rect x={seawallX - 6} y="70" width="12" height="60" rx="1.5" fill="#334155" stroke="#22bfe0" strokeWidth="1.2" />
            <text
              x={seawallX} y="66"
              textAnchor="middle"
              fontFamily="ui-monospace, JetBrains Mono, monospace"
              fontSize="8"
              fill="rgba(148,163,184,0.9)"
              style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}
            >
              Seawall
            </text>
          </>
        )}

        {/* Legend */}
        <g transform="translate(12, 180)">
          <text fontFamily="ui-monospace, JetBrains Mono, monospace" fontSize="9" fill="rgba(226,232,240,0.75)" style={{ letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            Scenario · {defended ? 'defended' : 'undefended'}
          </text>
        </g>
      </svg>

      {/* Controls + metrics */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 p-4 border-t border-line">
        <div>
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
        <div className="grid grid-cols-3 gap-2 text-center min-w-0">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Wave energy at shore</div>
            <div className={`text-sm font-semibold ${defended ? 'text-brand-200' : 'text-red-300'}`}>
              {defended ? '↓ 37%' : 'Baseline'}
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Vorticity</div>
            <div className={`text-sm font-semibold ${defended ? 'text-brand-200' : 'text-red-300'}`}>
              {defended ? '↓ 42%' : 'Baseline'}
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
        kicker="// Protecting $45M in Pacific Infrastructure"
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
            kicker="// Data & Fabrication"
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
            kicker="// Analysis"
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
            <SectionTitle kicker="// Field Context" title="Watch the tank run" />
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
            <SectionTitle kicker="// Model" title="Interactive 3D geometry" />
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
