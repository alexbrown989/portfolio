// src/pages/projects/FEAValidation.jsx
//
// DRAFT project page. Copy is a scaffold built from the "future work" section
// of the Vibration/PCM project. Swap in your ANSYS captures and measured
// ring-down curves once the correlation study is complete.

import { useMemo } from 'react'
import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA,
} from '../../shared/ui'
import { projects } from '../../content/projects'
import { motion } from 'framer-motion'

// Two synthetic decay curves — one under-damped model, one experimental
// target. Replace with real data files once the correlation study exists.
function CorrelationChart() {
  const paths = useMemo(() => {
    const build = (amp, decay, freq, samples = 300) => {
      let d = `M 0 60`
      for (let x = 0; x < samples; x++) {
        const y = amp * Math.sin(x / freq) * Math.exp(-x * decay)
        d += ` L ${x} ${60 - y}`
      }
      return d
    }
    return {
      model:      build(40, 0.010, 10),
      experiment: build(40, 0.020, 10),
    }
  }, [])

  return (
    <div className="relative rounded-xl border border-line bg-black/40 p-4">
      <svg viewBox="0 0 300 120" preserveAspectRatio="none" className="w-full h-56">
        {/* grid */}
        {[30, 60, 90].map(y => (
          <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="#334155" strokeWidth="0.5" strokeDasharray="2 3" />
        ))}
        {[75, 150, 225].map(x => (
          <line key={x} x1={x} x2={x} y1="0" y2="120" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 3" />
        ))}

        <motion.path
          d={paths.model}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2 }}
          stroke="#94a3b8"
          strokeWidth="1.4"
          fill="none"
        />
        <motion.path
          d={paths.experiment}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.4 }}
          stroke="#22bfe0"
          strokeWidth="1.8"
          fill="none"
          style={{ filter: 'drop-shadow(0 0 4px rgba(34,191,224,.5))' }}
        />
      </svg>

      <div className="absolute bottom-2 right-3 text-[11px] font-mono flex gap-4">
        <span className="text-gray-400">■ FEA model</span>
        <span className="text-brand-300">■ Measured ring-down</span>
      </div>
    </div>
  )
}

const project = projects.find(p => p.id === 'fea-validation')

export default function FEAValidation() {
  return (
    <ProjectLayout>
      <PageHero
        kicker="// Simulation & Test • Draft Case Study"
        title="FEA-Predicted Damping vs. Experimental Ring-Down"
        subtitle={project?.summary}
        chips={project?.tech || []}
        status={{ label: 'Draft', tone: 'warn' }}
      />

      {/* Motivation */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Why This Matters"
            title="From proof of concept to predictive model"
            subtitle="The PCM composite vibration study established the effect; this project answers the harder question: can we predict the effect in software before we build the sample? A model that matches experiment lets us design damping into a structure instead of tuning it after the fact."
          />
          <div className="grid md:grid-cols-3 gap-4">
            <Glass>
              <div className="text-white font-semibold mb-1">Objective</div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Correlate a temperature-dependent FEA model with measured modal frequencies and
                damping ratios of the composite beam across the PCM phase transition.
              </p>
            </Glass>
            <Glass>
              <div className="text-white font-semibold mb-1">Approach</div>
              <p className="text-sm text-gray-300 leading-relaxed">
                Meshed beam in ANSYS with layered composite properties → modal + transient runs →
                extract ring-down envelope → compare against measured piezo scope traces.
              </p>
            </Glass>
            <Glass>
              <div className="text-white font-semibold mb-1">Deliverable</div>
              <p className="text-sm text-gray-300 leading-relaxed">
                A validated, publishable model of thermally activated damping that becomes a
                design tool for future composite layups.
              </p>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Correlation */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Correlation"
            title="Model vs. measurement"
            subtitle="Illustrative curves shown below. Replace with real FEA output and scope-captured ring-downs once the correlation runs are complete."
          />
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-5">
            <Glass pad={false}>
              <div className="p-5"><CorrelationChart /></div>
              <div className="px-5 py-3 border-t border-line text-xs text-gray-400">
                Decay envelopes overlaid on a shared time axis. Match quality is judged on both
                frequency (peak-to-peak spacing) and damping ratio (log-decrement across cycles).
              </div>
            </Glass>
            <div className="grid grid-cols-2 gap-3">
              <MetricBox value="<5%" label="Target modal-freq error" sub="First two modes" />
              <MetricBox value="±10%" label="Target damping-ratio error" sub="Across phase transition" />
              <MetricBox value="2" label="Modes correlated" sub="1st bending, 1st torsion" />
              <MetricBox value="ANSYS" label="Solver stack" sub="Modal + transient" />
            </div>
          </div>
        </Container>
      </section>

      {/* Pipeline */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Pipeline"
            title="From CAD to correlated model"
          />
          <ol className="grid md:grid-cols-4 gap-4 counter-reset:step">
            {[
              { t: 'Meshing',    d: 'Layered composite beam meshed with element size chosen for first two modal wavelengths.' },
              { t: 'Materials',  d: 'Temperature-dependent moduli + loss factors imported from the vibration bench study.' },
              { t: 'Simulation', d: 'Modal solve for frequencies; transient run to extract free-decay envelope.' },
              { t: 'Correlate',  d: 'Overlay against measured scope traces; iterate loss factors and boundary conditions.' },
            ].map((s, i) => (
              <Glass key={s.t}>
                <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90">
                  Step {String(i + 1).padStart(2, '0')}
                </div>
                <div className="text-white font-semibold mt-1">{s.t}</div>
                <p className="text-sm text-gray-300 mt-1.5 leading-relaxed">{s.d}</p>
              </Glass>
            ))}
          </ol>
        </Container>
      </section>

      {/* AAR */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// After Action Review"
            title="What the simulation loop taught me"
          />
          <div className="grid md:grid-cols-3 gap-4">
            <Glass>
              <div className="text-emerald-300 text-xs font-mono uppercase tracking-[0.18em] mb-2">What went right</div>
              <p className="text-sm text-gray-300">{project?.aar?.right}</p>
            </Glass>
            <Glass>
              <div className="text-amber-300 text-xs font-mono uppercase tracking-[0.18em] mb-2">What went wrong</div>
              <p className="text-sm text-gray-300">{project?.aar?.wrong}</p>
            </Glass>
            <Glass>
              <div className="text-brand-300 text-xs font-mono uppercase tracking-[0.18em] mb-2">Lessons learned</div>
              <p className="text-sm text-gray-300">{project?.aar?.learned}</p>
            </Glass>
          </div>
        </Container>
      </section>

      <ProjectCTA
        title="Interested in simulation-driven design?"
        body="This project sits at the intersection of experimental mechanics, FEA, and materials characterization — if that overlaps with your team, let’s talk."
        primary={{ label: 'Get in touch', to: '/#contact' }}
      />

      <ProjectPager currentId="fea-validation" />
    </ProjectLayout>
  )
}
