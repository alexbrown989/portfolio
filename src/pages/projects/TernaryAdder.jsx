// src/pages/projects/TernaryAdder.jsx
//
// DRAFT project page. All copy is a plausible scaffold based on the About
// page's existing "Analog Computation: Ternary logic adder" reference —
// swap in real schematics, measurements, and lessons before publishing.

import ProjectLayout from '../ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox,
  ProjectPager, ProjectCTA,
} from '../../shared/ui'
import { projects } from '../../content/projects'

const truthRows = [
  { a: '−', b: '−', sum: '+', carry: '−' },
  { a: '−', b: '0', sum: '−', carry: '0' },
  { a: '−', b: '+', sum: '0', carry: '0' },
  { a: '0', b: '−', sum: '−', carry: '0' },
  { a: '0', b: '0', sum: '0', carry: '0' },
  { a: '0', b: '+', sum: '+', carry: '0' },
  { a: '+', b: '−', sum: '0', carry: '0' },
  { a: '+', b: '0', sum: '+', carry: '0' },
  { a: '+', b: '+', sum: '−', carry: '+' },
]

function TruthTable() {
  return (
    <div className="overflow-x-auto rounded-xl border border-line bg-surface-3/40">
      <table className="w-full text-sm font-mono">
        <thead className="bg-surface-3/70">
          <tr className="text-[11px] uppercase tracking-[0.18em] text-gray-400">
            <th className="px-4 py-2 text-left">A</th>
            <th className="px-4 py-2 text-left">B</th>
            <th className="px-4 py-2 text-left">Sum</th>
            <th className="px-4 py-2 text-left">Carry</th>
          </tr>
        </thead>
        <tbody>
          {truthRows.map((r, i) => (
            <tr key={i} className={i % 2 ? 'bg-surface-2/40' : ''}>
              <td className="px-4 py-1.5 text-gray-300">{r.a}</td>
              <td className="px-4 py-1.5 text-gray-300">{r.b}</td>
              <td className="px-4 py-1.5 text-brand-200">{r.sum}</td>
              <td className="px-4 py-1.5 text-brand-200">{r.carry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Simple SVG showing the three balanced-ternary voltage rails (−V, 0, +V).
function VoltageBands() {
  const rails = [
    { label: '+V  →  “+”', y: 24, color: '#22bfe0' },
    { label: ' 0  →  “0”', y: 82, color: '#94a3b8' },
    { label: '−V  →  “−”', y: 140, color: '#f472b6' },
  ]
  return (
    <div className="rounded-xl border border-line bg-black/30 p-4">
      <svg viewBox="0 0 400 170" className="w-full h-40">
        {rails.map((r) => (
          <g key={r.label}>
            <line x1="0" x2="400" y1={r.y} y2={r.y} stroke={r.color} strokeWidth="1.2" strokeDasharray="4 4" />
            <text x="12" y={r.y - 6} fill={r.color} fontSize="11" fontFamily="JetBrains Mono">{r.label}</text>
          </g>
        ))}
        {/* Fake signal that steps through the three states */}
        <polyline
          points="0,140 60,140 60,82 140,82 140,24 220,24 220,140 300,140 300,82 400,82"
          fill="none"
          stroke="#22bfe0"
          strokeWidth="2"
        />
      </svg>
    </div>
  )
}

const project = projects.find(p => p.id === 'ternary')

export default function TernaryAdder() {
  return (
    <ProjectLayout>
      <PageHero
        kicker="// Analog Computation • Draft Case Study"
        title="Balanced Ternary Logic Adder"
        subtitle={project?.summary}
        chips={project?.tech || []}
        status={{ label: 'Draft', tone: 'warn' }}
      />

      {/* Why balanced ternary */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Motivation"
            title="Why balanced ternary?"
            subtitle="Balanced ternary encodes each trit as {−, 0, +}. Arithmetic uses fewer digits than binary, sign is intrinsic (no two’s complement gymnastics), and rounding cost is symmetric. The catch: analog implementation is unforgiving — every mid-rail threshold has to survive noise, drift, and rail bounce."
          />
          <div className="grid md:grid-cols-2 gap-5">
            <Glass>
              <h3 className="text-white font-semibold mb-2">Design brief</h3>
              <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
                <li>Encode each trit on a single wire using ±V rails around 0 V ground.</li>
                <li>Realize sum & carry from a documented balanced-ternary truth table.</li>
                <li>Prove the design end-to-end in LTspice before breadboarding.</li>
                <li>Design for observability — every internal node measurable with a single scope probe.</li>
              </ul>
            </Glass>
            <Glass>
              <h3 className="text-white font-semibold mb-2">Signal model</h3>
              <VoltageBands />
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                Three-level signaling on one wire replaces two binary wires; adders reuse the same
                op-amp comparator core with different reference clamps.
              </p>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Truth table & topology */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Truth Table"
            title="Balanced-ternary half-adder"
            subtitle="Derived from the standard {−, 0, +} addition table; used as the ground truth for LTspice verification."
          />
          <div className="grid lg:grid-cols-[1.1fr_1fr] gap-5">
            <TruthTable />
            <Glass>
              <h3 className="text-white font-semibold mb-2">Topology at a glance</h3>
              <ul className="space-y-2 text-sm text-gray-300 list-disc pl-5">
                <li>Window comparator per input → decode trit into two binary rails internally.</li>
                <li>Combinational gates realize the sum / carry logic.</li>
                <li>Analog summing amplifier recombines the binary rails back to a ternary output.</li>
                <li>Reference clamps hold ±V/2 thresholds regardless of load.</li>
              </ul>
              <p className="text-xs text-gray-400 mt-3 leading-relaxed">
                TODO: replace with LTspice schematic capture and annotated node labels.
              </p>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Outcomes */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// Outcomes"
            title="Simulation + bench measurements"
            subtitle="Populate with your final LTspice sweeps and scope traces — the layout below is ready for images / waveforms."
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricBox value="27" label="Input states swept"    sub="3 × 3 half-adder × 3 carry" />
            <MetricBox value="±5 V" label="Rail voltage"        sub="Balanced about ground" />
            <MetricBox value="< 200 mV" label="Threshold margin" sub="Design target on noise budget" />
            <MetricBox value="LTspice → bench" label="Verified"  sub="Simulation matched to breadboard" />
          </div>
        </Container>
      </section>

      {/* AAR */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="// After Action Review"
            title="What the analog build taught me"
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
        title="Bring this to your team?"
        body="Interested in non-binary logic, analog computation, or building measurement-first analog systems from scratch? I’m happy to talk through the design in depth."
        primary={{ label: 'Get in touch', to: '/#contact' }}
      />

      <ProjectPager currentId="ternary" />
    </ProjectLayout>
  )
}
