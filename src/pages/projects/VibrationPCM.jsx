// src/pages/projects/VibrationPCM.jsx
import { lazy, Suspense, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA, STARSection, AARSection,
} from '../../shared/ui'
import { projects } from '../../content/projects'

const STLViewer = lazy(() => import('../../shared/STLViewer.jsx'))
const project = projects.find(p => p.id === 'vibration') || {}

/* ------------------------------------------------------------------- */
/* Signature interactive: damping slider                                */
/* ------------------------------------------------------------------- */
//
// User drags a slider from "cold control (light damping)" to "PCM
// heated (heavy damping)" and the ring-down waveform reshapes in real
// time. Damping ratio ζ is derived from the slider and shown in the
// readout. Below-crit at low ζ, near-critical at high ζ.

function DampingSlider() {
  const [z, setZ] = useState(0.6) // 0 = control, 1 = full PCM effect
  const zeta = 0.005 + z * 0.145  // damping ratio: 0.005 → 0.15
  const freq = 12                 // sample frequency (fixed for display)
  const samples = 320

  const path = useMemo(() => {
    let d = `M 0 60`
    for (let x = 0; x <= samples; x++) {
      const t = x / samples * 6.28 * 5
      const env = Math.exp(-zeta * x * 0.16)
      const y = 60 - Math.sin(t * (freq / 10)) * env * 45
      d += ` L ${x} ${y.toFixed(2)}`
    }
    return d
  }, [zeta])

  const envelopePath = useMemo(() => {
    let d = `M 0 60`
    for (let x = 0; x <= samples; x++) {
      const env = Math.exp(-zeta * x * 0.16) * 45
      d += ` L ${x} ${(60 - env).toFixed(2)}`
    }
    for (let x = samples; x >= 0; x--) {
      const env = Math.exp(-zeta * x * 0.16) * 45
      d += ` L ${x} ${(60 + env).toFixed(2)}`
    }
    return d + ' Z'
  }, [zeta])

  const state =
    z < 0.15 ? { name: 'Control · cold', tone: 'text-gray-300', desc: 'Under-damped ring-down' }
    : z > 0.75 ? { name: 'PCM · heated', tone: 'text-brand-200', desc: 'Near-critical decay' }
    :         { name: 'Transition',      tone: 'text-amber-200', desc: 'PCM softening in the composite matrix' }

  return (
    <div className="rounded-xl border border-line bg-surface-3/60 overflow-hidden">
      <div className="p-4">
        <svg viewBox={`0 0 ${samples} 120`} preserveAspectRatio="none" className="w-full h-40 md:h-48 bg-black/40 rounded-lg border border-line">
          {/* Grid */}
          {[30, 60, 90].map(y => (
            <line key={y} x1="0" x2={samples} y1={y} y2={y} stroke="#334155" strokeWidth="0.4" strokeDasharray="2 3" />
          ))}
          {[80, 160, 240].map(x => (
            <line key={x} x1={x} x2={x} y1="0" y2="120" stroke="#334155" strokeWidth="0.4" strokeDasharray="2 3" />
          ))}
          {/* Envelope */}
          <path d={envelopePath} fill="rgba(34,191,224,0.10)" />
          {/* Waveform */}
          <motion.path
            d={path}
            stroke="#22bfe0"
            strokeWidth="1.5"
            fill="none"
            style={{ filter: 'drop-shadow(0 0 4px rgba(34,191,224,0.4))' }}
            animate={{ opacity: [0.6, 1, 0.9] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
        </svg>
      </div>

      <div className="px-4 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-500">Cold</span>
          <input
            type="range"
            min="0" max="1000"
            value={Math.round(z * 1000)}
            onChange={(e) => setZ(Number(e.target.value) / 1000)}
            aria-label="Damping (0 = cold control, 1 = heated PCM composite)"
            className="flex-1 accent-brand-500"
          />
          <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-200">Heated PCM</span>
        </div>

        <div className="mt-3 grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Damping ratio ζ</div>
            <div className="text-sm font-semibold text-white tabular-nums">{zeta.toFixed(3)}</div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Decay time · to 10%</div>
            <div className="text-sm font-semibold text-white tabular-nums">
              {(Math.log(10) / (zeta * freq)).toFixed(2)} s
            </div>
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-500">Regime</div>
            <div className={`text-sm font-semibold ${state.tone}`}>{state.name}</div>
          </div>
        </div>
        <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
          {state.desc}. Slide from cold control to heated PCM composite to see the ring-down envelope collapse.
        </p>
      </div>
    </div>
  )
}

/* ---------------------- Media helper ---------------------- */
function ImageCard({ src, alt, aspect = 'aspect-[4/3]' }) {
  return (
    <div className={`rounded-xl border border-line bg-black/30 p-2 ${aspect} w-full overflow-hidden`}>
      <img src={src} alt={alt} loading="lazy" className="w-full h-full object-contain" />
    </div>
  )
}

/* ---------------------- Hypothesis visual ---------------------- */
function HypothesisBeams() {
  return (
    <div className="grid md:grid-cols-2 gap-3 h-56 md:h-64">
      <div className="relative rounded-xl border border-line bg-surface-3/60 overflow-hidden">
        <div className="absolute top-2 left-3 text-xs font-mono uppercase tracking-[0.18em] text-gray-400">
          Control (no heat)
        </div>
        <motion.div
          className="absolute left-4 right-4 top-1/2 h-[2px] bg-gray-300 origin-left"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -4, 4, -4, 4, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
      <div className="relative rounded-xl border border-line bg-surface-3/60 overflow-hidden">
        <div className="absolute top-2 left-3 text-xs font-mono uppercase tracking-[0.18em] text-gray-400">
          PCM composite (heated)
        </div>
        <div className="absolute top-2 right-3 text-[10px] bg-amber-500/15 border border-amber-400/40 text-amber-200 px-2 py-0.5 rounded">
          heat ↑
        </div>
        <motion.div
          className="absolute left-4 right-4 top-1/2 h-[2px] bg-brand-300 origin-left"
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -6, 4, -2, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </div>
  )
}

/* ---------------------- Damping waveform ---------------------- */
function DampingWaveform() {
  const build = (amp, decay, freq, len) => {
    let p = `M 0 50`
    for (let x = 0; x < len; x++) {
      const y = amp * Math.sin(x / freq) * Math.exp(-x * decay)
      p += ` L ${x} ${50 - y}`
    }
    return p
  }
  const controlPath = useMemo(() => build(40, 0.005, 10, 300), [])
  const pcmPath     = useMemo(() => build(40, 0.030, 10, 300), [])

  return (
    <div className="relative h-60 w-full rounded-xl border border-line bg-black/50 p-4">
      <svg width="100%" height="100%" viewBox="0 0 300 100" preserveAspectRatio="none">
        <path d="M 0 50 H 300" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M 50 0 V 100" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M 150 0 V 100" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
        <path d="M 250 0 V 100" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 2" />
        <motion.path d={controlPath} stroke="#9CA3AF" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4 }} />
        <motion.path d={pcmPath}     stroke="#22bfe0" strokeWidth="2"  fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, delay: 0.4 }}
          style={{ filter: 'drop-shadow(0 0 4px rgba(34,191,224,0.45))' }} />
      </svg>
      <div className="absolute bottom-2 right-3 text-[11px] font-mono flex gap-4">
        <span className="text-gray-400">■ Control (epoxy)</span>
        <span className="text-brand-300">■ PCM composite (heated)</span>
      </div>
    </div>
  )
}

export default function VibrationPCM() {
  return (
    <ProjectLayout>
      <PageHero
        kicker="// Engineering a “Smart” Composite with Thermally Activated Damping"
        title="Vibration Analysis of Phase-Change Materials"
        subtitle={<>End-to-end R&amp;D that designed a novel composite and validated a <span className="text-brand-300 font-semibold">10× increase</span> in damping performance. Custom high-rigidity test apparatus built from the ground up.</>}
        chips={project.tech || []}
        status={{ label: 'Active', tone: 'brand', pulse: true }}
      />

      {/* Signature interactive */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Interactive"
            code="I/01"
            title="Ring-down · slide from control to heated PCM"
            subtitle="Damping ratio ζ increases as the PCM composite is thermally triggered. The waveform decays visibly faster and the envelope collapses toward the axis."
          />
          <DampingSlider />
        </Container>
      </section>

      {/* Hypothesis */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Hypothesis"
            title="Can a material’s damping be switched on?"
            subtitle="Embed a phase-change material (like beeswax) in an epoxy matrix and thermally trigger it into a near-critically damped state on demand."
          />
          <div className="grid md:grid-cols-2 gap-5">
            <Glass><HypothesisBeams /></Glass>
            <Glass>
              <ImageCard src="/projects/pcm_samples.jpg" alt="Eight fabricated composite samples" />
              <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                An 8-sample matrix isolated the effect of epoxy, beeswax (PCM), and graphite (conductive filler) on dynamic properties.
              </p>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Material synthesis */}
      <section className="pb-10">
        <Container>
          <SectionTitle kicker="// Synthesis" title="Methodical material preparation" />
          <div className="grid md:grid-cols-2 gap-5">
            <Glass>
              <ImageCard src="/projects/pcm_mixing_setup.jpg" alt="Numbered cups for precise mixing" aspect="aspect-[16/10]" />
              <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                Systematic protocol measured each component by mass / volume for consistency across the 8-sample matrix.
              </p>
            </Glass>
            <Glass>
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90 mb-2">Experimental matrix</div>
              <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5 leading-relaxed">
                <li><b className="text-white">Sample 1 (control):</b> pure epoxy baseline.</li>
                <li><b className="text-white">Samples 2–4 (graphite):</b> 2 / 5 / 10 g graphite to tune stiffness & conductivity.</li>
                <li><b className="text-white">Sample 5 (beeswax):</b> isolated PCM effect on resonance.</li>
                <li><b className="text-white">Sample 6 (composite):</b> combined PCM + conductive filler for synergy.</li>
              </ul>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Apparatus */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Apparatus"
            title="A case study in iteration"
            subtitle="The final rig looks simple, but its monolithic structure and adaptable clamp are direct products of three deliberate failures."
          />
          <Glass pad={false}>
            <Suspense fallback={
              <div className="h-[520px] flex items-center justify-center text-brand-300 text-sm font-mono">
                Loading 3D model…
              </div>
            }>
              <STLViewer
                src="/models/resonance_rig.stl"
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

          <div className="grid md:grid-cols-3 gap-4 mt-5">
            {[
              { t: 'Monolithic design',    d: 'Multi-part concepts were rejected. Every joint introduced flex and noise that compromised data fidelity.' },
              { t: 'Adaptable fixturing',  d: 'Replaced a "perfect slot" with an open-topped channel that handles real-world sample variation without losing stability.' },
              { t: '3D-aware CAD',         d: 'A hidden bolt collision only appeared in 3D section views. Caught before fabrication to protect the dataset.' },
            ].map((c) => (
              <Glass key={c.t}>
                <div className="text-white font-semibold">{c.t}</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">{c.d}</p>
              </Glass>
            ))}
          </div>
        </Container>
      </section>

      {/* Design through failure */}
      <section className="pb-10">
        <Container>
          <SectionTitle kicker="// Iteration Log" title="Design through failure" />
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { t: 'Failure 1 · static vs dynamic rigidity', d: 'Off-the-shelf vises are made for holding, not vibrating. The experiment needed a vibrationally inert foundation.' },
              { t: 'Failure 2 · every joint flexes',         d: 'A modular, bed-sized design seemed convenient, but bolted interfaces added micro-movement and corrupted readings.' },
              { t: 'Failure 3 · the precision trap',         d: 'A closed, perfect slot didn’t accept real cast parts. The open-channel clamp balanced tolerance with stability.' },
            ].map((c) => (
              <Glass key={c.t}>
                <div className="text-white font-semibold">{c.t}</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">{c.d}</p>
              </Glass>
            ))}
          </div>
        </Container>
      </section>

      {/* Experiment + results */}
      <section className="pb-10">
        <Container>
          <SectionTitle kicker="// Results" title="Experimentation & validated results" />
          <div className="grid md:grid-cols-2 gap-5">
            <Glass>
              <ImageCard src="/projects/rig_sensor.jpg" alt="Sample in the resonance rig with sensor attached" />
              <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                Complete setup: custom rig + composite sample + piezo sensor for data capture.
              </p>
            </Glass>
            <Glass>
              <DampingWaveform />
              <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                Scope-equivalent view: PCM composite (heated) decays ~10× faster than the control, validating the hypothesis.
              </p>
            </Glass>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            <MetricBox value="10×"        label="Damping factor increase"    sub="Thermally triggered" />
            <MetricBox value="~Critical"  label="Achieved damping state"     sub="Near-critical" />
            <MetricBox value="±0.1 mm"    label="Fabrication tolerance"      sub="DFAM sample matrix" />
            <MetricBox value="< $500"     label="Prototype cost"             sub="Off-the-shelf + printed" />
          </div>
        </Container>
      </section>

      {/* Future work */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Future Work"
            title="From proof-of-concept to engineering solution"
          />
          <Glass>
            <ul className="text-sm text-gray-300 space-y-2 list-disc pl-5 leading-relaxed">
              <li><b className="text-white">Enhance rigor:</b> PID-controlled Peltier heating + FFT-based analysis.</li>
              <li><b className="text-white">Next-gen materials:</b> laminated composites with viscoelastic cores to beat commercial damping sheets.</li>
              <li><b className="text-white">Proof-of-technology:</b> self-quieting electronics panel demonstrator.</li>
              <li><b className="text-white">Computational validation:</b> predictive FEA model matched to experimental ring-down data. The next R&D step.</li>
            </ul>
          </Glass>
        </Container>
      </section>

      <STARSection star={project.star} />
      <AARSection aar={project.aar} />

      <ProjectCTA
        title="Why this project matters"
        body="End-to-end R&D: novel material concept → custom apparatus → rigorous experimentation → validated results. Production-minded design applied to thermomechanics."
        primary={{ label: 'Get in touch', to: '/#contact' }}
      />

      <ProjectPager currentId="vibration" />
    </ProjectLayout>
  )
}
