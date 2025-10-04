// src/pages/projects/VibrationPCM.jsx
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import ProjectLayout from '../ProjectLayout'
import STLViewer from '../../shared/STLViewer'

/* ------------------------- small shared bits ------------------------- */
function Glass({ className = '', children, hover = true, pad = true }) {
  return (
    <motion.div
      whileHover={hover ? { scale: 1.012, y: -2 } : {}}
      transition={{ duration: 0.22 }}
      className={`relative rounded-2xl border border-white/12 bg-white/7 backdrop-blur-sm overflow-hidden ${pad ? 'p-5' : ''} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">{children}</div>
    </motion.div>
  )
}

function SectionTitle({ kicker, title }) {
  return (
    <div className="mb-3">
      {kicker && (
        <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200">
          {kicker}
        </div>
      )}
      <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
      <div className="mt-2 h-px w-24 bg-gradient-to-r from-cyan-400/80 to-transparent rounded-full" />
    </div>
  )
}

/* ----------------------- image helper (contain) ---------------------- */
function ImageCard({
  src,
  alt,
  className = '',
  aspect = 'aspect-[4/3]', // keep consistent composition
  maxH = 'max-h-72',       // prevent giant images on desktop
}) {
  return (
    <div className={`rounded-xl border border-white/10 bg-black/30 p-2 ${aspect} ${maxH} w-full overflow-hidden ${className}`}>
      {/* object-contain prevents “zoomed-in” cropping */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-contain"
      />
    </div>
  )
}

/* ------------------- Hypothesis visual: two beams ------------------- */
function HypothesisBeams() {
  return (
    <div className="h-56 md:h-64 grid md:grid-cols-2 gap-4">
      {/* Control beam */}
      <div className="relative rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="absolute top-2 left-3 text-xs text-gray-400">Control (no heat)</div>
        <motion.div
          className="absolute left-4 right-4 top-1/2 h-[2px] bg-gray-300 origin-left"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -4, 4, -4, 4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      {/* Heated PCM beam */}
      <div className="relative rounded-xl border border-white/10 bg-white/5 overflow-hidden">
        <div className="absolute top-2 left-3 text-xs text-gray-400">PCM composite (heated)</div>
        <div className="absolute top-2 right-3 text-[10px] bg-amber-500/20 border border-amber-400/40 text-amber-200 px-2 py-0.5 rounded">
          heat ↑
        </div>
        <motion.div
          className="absolute left-4 right-4 top-1/2 h-[2px] bg-cyan-300 origin-left"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -6, 4, -2, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

/* --------------------- Results visual: waveforms --------------------- */
function DampingWaveform() {
  const createDecayPath = (amp, decay, freq, len) => {
    let p = `M 0 50`
    for (let x = 0; x < len; x++) {
      const y = amp * Math.sin(x / freq) * Math.exp(-x * decay)
      p += ` L ${x} ${50 - y}`
    }
    return p
  }
  const controlPath = useMemo(() => createDecayPath(40, 0.005, 10, 300), [])
  const pcmPath     = useMemo(() => createDecayPath(40, 0.03,  10, 300), [])

  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: 'spring', duration: 2.4, bounce: 0, delay: i * 0.5 },
        opacity: { duration: 0.1, delay: i * 0.5 },
      },
    }),
  }

  return (
    <div className="relative h-60 w-full rounded-xl border border-white/10 bg-black/50 p-4">
      <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
        {/* Grid */}
        <path d="M 0 50 H 300" stroke="#4B5563" strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M 50 0 V 100" stroke="#4B5563" strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M 150 0 V 100" stroke="#4B5563" strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M 250 0 V 100" stroke="#4B5563" strokeWidth="0.5" strokeDasharray="2 2" />

        {/* Waveforms */}
        <motion.path
          d={controlPath}
          variants={draw}
          custom={0}
          initial="hidden"
          animate="visible"
          stroke="#9CA3AF"
          strokeWidth="1.5"
          fill="none"
        />
        <motion.path
          d={pcmPath}
          variants={draw}
          custom={1}
          initial="hidden"
          animate="visible"
          stroke="#22D3EE"
          strokeWidth="2"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 5px rgba(34, 211, 238, 0.5))' }}
        />
      </svg>
      <div className="absolute bottom-2 right-3 text-xs">
        <span className="text-[#9CA3AF]">■ Control (Epoxy)</span>
        <span className="text-[#22D3EE] ml-4">■ PCM Composite (Heated)</span>
      </div>
    </div>
  )
}

/* ------------------------------ Page ------------------------------- */
export default function VibrationPCM() {
  const { search } = useLocation()
  const debug = new URLSearchParams(search).get('debug') === '1'

  return (
    <ProjectLayout>
      {/* Header */}
      <section className="pt-24 pb-6">
        <div className="container mx-auto px-6">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200">
            // Engineering a "Smart" Composite with Thermally-Activated Damping
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2">
            Vibration Analysis of Phase-Change Materials
          </h1>
          <p className="text-gray-300 mt-3 max-w-3xl">
            Led an end-to-end R&amp;D project that designed a novel composite and validated a
            <span className="text-cyan-300 font-semibold"> 10× increase</span> in damping performance.
            Built a custom, high-rigidity test apparatus from the ground up.
          </p>
        </div>
      </section>

      {/* Hypothesis */}
      <section className="pb-10">
        <div className="container mx-auto px-6">
          <SectionTitle title="The Hypothesis: Can a Material’s Damping be “Switched On”?" />
          <div className="grid md:grid-cols-2 gap-6">
            <Glass>
              <HypothesisBeams />
              <p className="text-sm text-gray-300 mt-3">
                Embedding a Phase-Change Material (PCM) like beeswax can create a “smart” composite that transitions
                to a near-critically damped state when thermally triggered.
              </p>
            </Glass>

            <Glass>
              <ImageCard
                src="/projects/pcm_samples.jpg"
                alt="Eight fabricated composite samples in mold"
                // aspect is already 4:3; tweak if your photo is taller
                aspect="aspect-[4/3]"
                maxH="max-h-64 md:max-h-72"
              />
              <p className="text-sm text-gray-300 mt-3">
                An 8-sample matrix isolated the effects of epoxy, beeswax (PCM), and graphite (conductive filler) on
                dynamic properties.
              </p>
            </Glass>
          </div>
        </div>
      </section>

      {/* NEW: Methodical Material Synthesis */}
      <section className="pb-10">
        <div className="container mx-auto px-6">
          <SectionTitle title="Methodical Material Synthesis" />
          <div className="grid md:grid-cols-2 gap-6">
            <Glass>
              <ImageCard
                src="/projects/pcm_mixing_setup.jpg"
                alt="Numbered cups for precise chemical mixing"
                aspect="aspect-[16/10]"     // wider crop usually helps mixing-table photos
                maxH="max-h-64 md:max-h-72"
              />
              <p className="text-sm text-gray-300 mt-3">
                A systematic protocol measured each component by mass/volume to ensure consistency across the 8-sample matrix.
              </p>
            </Glass>

            <Glass>
              <div className="text-sm text-gray-400 mb-2">Experimental Matrix Highlights</div>
              <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
                <li><span className="text-white">Sample 1 (Control):</span> Pure epoxy baseline.</li>
                <li><span className="text-white">Samples 2–4 (Graphite):</span> 2g/5g/10g graphite to tune stiffness &amp; conductivity.</li>
                <li><span className="text-white">Sample 5 (Beeswax):</span> Isolated PCM effect on resonance.</li>
                <li><span className="text-white">Sample 6 (Composite):</span> Combined PCM + conductive filler for synergy.</li>
              </ul>
            </Glass>
          </div>
        </div>
      </section>

      {/* Apparatus + STL viewer */}
      <section className="pb-8">
        <div className="container mx-auto px-6">
          <SectionTitle title="Apparatus Design: A Case Study in Iteration" />
          <Glass pad={false}>
            {/* If the STL is missing/invalid, STLViewer shows its own safe fallback */}
            <STLViewer
              src="/models/resonance_rig.stl"
              height={420}
              layFlat
              debug={debug}
            />
            <div className="px-5 py-4 text-sm text-gray-300 border-t border-white/10">
              The final design looks simple, but its monolithic structure and adaptable clamp are direct results of a
              rigorous, iterative process that embraced and learned from early design failures.
            </div>
          </Glass>

          {/* HOTSPOT NOTES (simple card list instead of click targets for reliability) */}
          <div className="grid md:grid-cols-3 gap-4 mt-4 text-sm">
            <Glass>
              <div className="font-semibold text-white">LESSON 1: Monolithic Design</div>
              <p className="text-gray-300 mt-1">
                Multi-part concepts were rejected—every joint introduced flex and noise, compromising data fidelity.
              </p>
            </Glass>
            <Glass>
              <div className="font-semibold text-white">LESSON 2: Adaptable Fixturing</div>
              <p className="text-gray-300 mt-1">
                Replaced a “perfect slot” with an open-topped channel to handle real-world sample variation without losing stability.
              </p>
            </Glass>
            <Glass>
              <div className="font-semibold text-white">LESSON 3: 3D-Aware CAD</div>
              <p className="text-gray-300 mt-1">
                A hidden bolt collision only appeared in 3D section views—fixed before fabrication to protect the dataset.
              </p>
            </Glass>
          </div>
        </div>
      </section>

      {/* NEW: Design Through Failure section */}
      <section className="pb-10">
        <div className="container mx-auto px-6">
          <SectionTitle title="Design Through Failure: The Evolution of the Rig" />
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <Glass>
              <div className="font-semibold text-white">Failure #1: Static vs. Dynamic Rigidity</div>
              <p className="text-gray-300 mt-1">
                Off-the-shelf vises are made for holding, not vibrating. The experiment needed a vibrationally inert foundation.
              </p>
            </Glass>
            <Glass>
              <div className="font-semibold text-white">Failure #2: Every Joint Flexes</div>
              <p className="text-gray-300 mt-1">
                A modular, bed-sized design seemed convenient—but bolted interfaces added micro-movement and corrupted readings.
              </p>
            </Glass>
            <Glass>
              <div className="font-semibold text-white">Failure #3: The Precision Trap</div>
              <p className="text-gray-300 mt-1">
                A perfect, closed slot didn’t accept real cast parts. The open-channel clamp balanced tolerance with stability.
              </p>
            </Glass>
          </div>
        </div>
      </section>

      {/* Experimentation & Results */}
      <section className="pb-8">
        <div className="container mx-auto px-6">
          <SectionTitle title="Experimentation & Validated Results" />
          <div className="grid md:grid-cols-2 gap-6">
            <Glass>
              <ImageCard
                src="/projects/rig_sensor.jpg"
                alt="Sample in the resonance rig with sensor attached"
                aspect="aspect-[4/3]"
                maxH="max-h-64 md:max-h-72"
              />
              <p className="text-sm text-gray-300 mt-3">
                Complete setup: custom rig + composite sample + piezo sensor for data capture.
              </p>
            </Glass>

            <Glass>
              <DampingWaveform />
              <p className="text-sm text-gray-300 mt-3">
                Oscilloscope-equivalent view: PCM composite (heated) decays ~10× faster than the control, validating the hypothesis.
              </p>
            </Glass>
          </div>

          {/* Metrics */}
          <div className="grid sm:grid-cols-4 gap-3 mt-6">
            <Glass hover={false}><div className="text-2xl font-bold text-white">10×</div><div className="text-xs text-gray-400 mt-1">Increase in Damping Factor</div></Glass>
            <Glass hover={false}><div className="text-2xl font-bold text-white">~Critical</div><div className="text-xs text-gray-400 mt-1">Achieved State (Thermally Triggered)</div></Glass>
            <Glass hover={false}><div className="text-2xl font-bold text-white">±0.1 mm</div><div className="text-xs text-gray-400 mt-1">Fabrication Tolerance</div></Glass>
            <Glass hover={false}><div className="text-2xl font-bold text-white">&lt;$500</div><div className="text-xs text-gray-400 mt-1">DFAM Prototype Cost</div></Glass>
          </div>
        </div>
      </section>

      {/* Future Work */}
      <section className="pb-12">
        <div className="container mx-auto px-6">
          <SectionTitle title="Future Work: From Proof-of-Concept to Engineering Solution" />
          <Glass>
            <ul className="list-disc pl-5 text-sm text-gray-300 space-y-2">
              <li><span className="text-white">Enhance Rigor:</span> PID-controlled Peltier heating + FFT-based analysis.</li>
              <li><span className="text-white">Next-Gen Materials:</span> Laminated composites with viscoelastic cores to beat commercial damping sheets.</li>
              <li><span className="text-white">Proof-of-Technology:</span> Self-quieting electronics panel demonstrator.</li>
              <li><span className="text-white">Computational Validation:</span> Predictive FEA model matched to experimental ring-down.</li>
            </ul>
          </Glass>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-16">
        <div className="container mx-auto px-6">
          <Glass>
            <div className="grid md:grid-cols-[1fr_auto] gap-4 items-center">
              <div>
                <h2 className="text-2xl font-bold text-white">Why This Project Matters</h2>
                <p className="text-sm text-gray-300 mt-2">
                  End-to-end R&amp;D: novel material concept → custom apparatus → rigorous experimentation → validated results.
                  Hands-on thermomechanics with production-minded design.
                </p>
              </div>
              <a
                href="/#contact"
                className="px-5 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm text-center"
              >
                Get in Touch
              </a>
            </div>
          </Glass>

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
