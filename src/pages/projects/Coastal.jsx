// src/pages/projects/Coastal.jsx
import { lazy, Suspense, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { projects } from '../../content/projects'
import ProjectLayout from '../ProjectLayout'
import YouTube from '../../shared/YouTube'

const STLViewer = lazy(() => import('../../shared/STLViewer.jsx'))

function Glass({ children, className = '', hover = true, pad = true }) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.01, y: -2 } : {}}
      transition={{ duration: 0.25 }}
      className={`rounded-2xl border border-white/12 bg-white/7 backdrop-blur-sm relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className={`relative ${pad ? 'p-5' : ''}`}>{children}</div>
    </motion.div>
  )
}

export default function Coastal() {
  const project = projects.find((p) => p.id === 'coastal')
  const heroRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true })

  return (
    <ProjectLayout>
      {/* Header */}
      <section ref={heroRef} className="pt-20 md:pt-24 pb-6">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200"
          >
            // Protecting $45M in Pacific Infrastructure
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.05 }}
            className="text-3xl md:text-4xl font-extrabold text-white mt-2"
          >
            {project?.title || 'Saipan Coastal Defense System'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.1 }}
            className="text-gray-300 mt-2 max-w-3xl text-[15px]"
          >
            First lab-scale pipeline to quantify wave–coast interactions for Saipan. Novel PIV background improved measurement fidelity by 40 percent.
          </motion.p>
        </div>
      </section>

      {/* Crisis: two images – erosion + poster/tank (map removed) */}
      <section className="pb-8 md:pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="text-xl md:text-2xl font-bold text-white mb-6">
            The Crisis: Infrastructure at Risk
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Glass>
              <div className="relative">
                <img
                  src="/projects/erosion.jpg"
                  alt="Infrastructure at risk"
                  className="w-full h-[300px] md:h-[320px] object-cover rounded-xl"
                />
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded shadow-lg"
                >
                  $45M AT RISK
                </motion.div>
              </div>
              <div className="text-sm text-gray-300 mt-3">
                Critical infrastructure located within active erosion corridors
              </div>
            </Glass>

            <Glass>
              <img
                src="/projects/tank.jpg"
                alt="Coastal Erosion Prevention Research Poster"
                className="w-full h-[300px] md:h-[320px] object-cover rounded-xl"
              />
              <div className="text-sm text-gray-300 mt-3">
                Research overview and tank campaign planning artifacts
              </div>
            </Glass>
          </div>
        </div>
      </section>

      {/* Data & Fabrication — Print (left) then DEM (right) */}
      <section className="pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Data and Fabrication</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* PRINT LEFT */}
            <Glass>
              <img
                src="/projects/print.jpg"
                alt="3D printer creating island geometry"
                className="w-full h-[240px] md:h-[260px] object-cover rounded-xl"
              />
              <div className="text-sm text-gray-300 mt-3">
                <span className="text-cyan-300 font-semibold">3D Print.</span> Saipan physical model printed at 0.2 mm layer height to preserve shoreline curvature for tank trials.
              </div>
            </Glass>

            {/* DEM RIGHT */}
            <Glass>
              <img
                src="/projects/dem.jpg"
                alt="DEM processing in MATLAB"
                className="w-full h-[240px] md:h-[260px] object-cover rounded-xl"
              />
              <div className="text-sm text-gray-300 mt-3">
                <span className="text-cyan-300 font-semibold">DEM Processing.</span> Bathymetry and coastal elevation processed in MATLAB to maintain slope fidelity for scale modeling.
              </div>
            </Glass>
          </div>
        </div>
      </section>

      {/* Wave–Structure Interaction Analysis (smaller + cleaner) */}
      <section className="pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-xl md:text-2xl font-bold text-white mb-4"
          >
            Wave–Structure Interaction Analysis
          </motion.h2>

          <div className="grid lg:grid-cols-2 gap-6">
            <Glass className="p-0">
              <video
                src="/projects/saipan.mp4"
                controls
                poster="/projects/cover.jpg"
                className="w-full aspect-video rounded-2xl"
              />
              <div className="p-4 border-t border-white/10">
                <p className="text-sm text-gray-300">
                  Flow field visualization with velocity vectors and vorticity contours
                </p>
              </div>
            </Glass>

            <div className="space-y-4">
              <Glass>
                <h3 className="text-base font-semibold text-white mb-3">Key Outcomes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Wave energy at shoreline', value: '↓ 37%' },
                    { label: 'Coastal vorticity magnitude', value: '↓ 42%' },
                    { label: 'High-risk zones identified', value: '3' },
                    { label: 'Prototype cycle time', value: 'weeks → days' },
                  ].map((d) => (
                    <div key={d.label} className="bg-black/30 rounded-lg p-3 border border-white/10">
                      <div className="text-xl md:text-2xl font-bold text-white">{d.value}</div>
                      <div className="text-[11px] text-gray-400 mt-1">{d.label}</div>
                    </div>
                  ))}
                </div>
              </Glass>

              <Glass>
                <h3 className="text-base font-semibold text-white mb-2">Technical Notes</h3>
                <ul className="list-disc pl-5 text-gray-200 text-[13px] space-y-1.5">
                  <li>Visual Field Architecture background improved particle correlation by 40 percent</li>
                  <li>Froude similarity preserved for realistic wave kinematics</li>
                  <li>PIV vectors cross-checked against manual particle tracks</li>
                  <li>Framework is reproducible across additional Pacific sites</li>
                </ul>
              </Glass>
            </div>
          </div>
        </div>
      </section>

      {/* Field Context (YouTube) – smaller card */}
      {project?.youtube && (
        <section className="pb-8">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-lg md:text-xl font-bold text-white mb-3">Field Context</h2>
            <Glass className="p-0">
              <YouTube url={project.youtube} title={project.title} />
            </Glass>
          </div>
        </section>
      )}

      {/* STL viewer (optional) */}
      {project?.stl && (
        <section className="pb-10">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-lg md:text-xl font-bold text-white mb-3">Interactive 3D Model</h2>
            <Glass className="p-0">
              <Suspense
                fallback={
                  <div className="h-[420px] flex items-center justify-center">
                    <div className="text-cyan-400 animate-pulse">Loading 3D model…</div>
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
              <div className="p-4 border-t border-white/10">
                <p className="text-xs text-gray-400">
                  <span className="text-cyan-400">Interactive:</span> Drag to rotate • Scroll to zoom • Double-click to reset
                </p>
              </div>
            </Glass>
          </div>
        </section>
      )}

      {/* CTA + back link */}
      <section className="pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="rounded-2xl p-6 md:p-7 text-center text-white bg-gradient-to-r from-blue-600/80 to-cyan-600/80 border border-white/10 shadow-[0_0_28px_rgba(56,189,248,.28)]">
            <h2 className="text-xl md:text-2xl font-bold">Interested in Coastal Resilience?</h2>
            <p className="text-white/85 mt-1.5 text-sm">Explore collaboration and data-driven coastal defense</p>
            <div className="flex flex-wrap gap-3 justify-center mt-4">
              <a
                className="px-5 py-2 rounded-lg bg-white/20 backdrop-blur border border-white/30 hover:bg-white/30 transition-all"
                href="https://www.linkedin.com/feed/update/urn:li:activity:7364834318910754817/"
                target="_blank"
              >
                LinkedIn Article →
              </a>
              <a
                className="px-5 py-2 rounded-lg bg-white/20 backdrop-blur border border-white/30 hover:bg-white/30 transition-all"
                href="/#contact"
              >
                Get in Touch
              </a>
            </div>
          </div>

          <div className="mt-6">
            <Link className="inline-flex items-center gap-2 text-cyan-300 hover:text-cyan-200 transition-colors" to="/#projects">
              <span>←</span> Back to Projects
            </Link>
          </div>
        </div>
      </section>
    </ProjectLayout>
  )
}
