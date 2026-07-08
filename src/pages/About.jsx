// src/pages/About.jsx
import { lazy, Suspense, useMemo } from 'react'
import { motion } from 'framer-motion'
import ProjectLayout from './ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass,
} from '../shared/ui'

const Contact = lazy(() => import('../components/Contact'))
const Footer  = lazy(() => import('../components/Footer'))

const story = [
  `My engineering journey began not in a classroom, but in high-stakes clinical settings as a U.S. Navy Corpsman. For five years I learned lessons no lecture hall can teach. The military instilled a deep sense of ownership and a mission-first focus. I learned to execute with precision when the stakes were high, to lead with composure, and to understand that the success of any system ultimately comes down to its impact on people. Managing a complex medical supply system and developing safety protocols taught me to see the world through the lens of an engineer — optimizing processes where failure was not an option.`,
  `That background is the bedrock of how I approach engineering today. I am not just a student; I am a builder, driven by curiosity about how things work and a compulsion to make them better. My work is a constant dialogue between the theoretical and the tangible — translating a spark of an idea (a new theory on passive thermodynamics; a two-axis autonomous turret) into a fully functional prototype. That obsession with the entire lifecycle of creation, from LTspice circuits to composite materials, is what fuels me.`,
  `Today that mindset lives inside my current internship at Verus Aerospace in Tacoma, where I support manufacturing, quality, and process improvement for flight-critical hardware. I maintain Engineering Masters and configuration control in Infor VISUAL ERP, develop inspection plans, run AS9102 First Article Inspection activities, and perform independent over-check inspections on Gulfstream assemblies. As the Lead Intern I also coordinate onboarding for incoming interns and lead the Quality Clinic — tracking non-conforming hardware through disposition and redesigning the workflow that keeps engineering, quality, and production aligned. It is the environment where operations, GD&T, and real production physics meet, and it is exactly where I want to be.`,
  `What sets me apart is the fusion of lived operational experience and rigorous hands-on R&D. While many learn theory, I have applied systems thinking in environments where the human cost of a design flaw is immediate and real. I’m now looking for the opportunity to bring that blend of leadership and technical skill to a team tackling the world’s most critical problems, where the challenges are steep, the mission is critical, and the goal is to build what comes next.`,
]

const stats = [
  { value: '-20%', label: 'Operational downtime', caption: 'via logistics engineering' },
  { value: '92%',  label: 'Training compliance',  caption: '57 personnel' },
  { value: '-30%', label: 'Procedural errors',    caption: 'systematic analysis' },
  { value: '200+', label: 'Surgical procedures',  caption: 'zero critical failures' },
]

const portfolioLines = [
  'Aerospace Manufacturing (Verus Aerospace): AS9102 FAI, Infor VISUAL ERP, GD&T inspection, Quality Clinic redesign, and multi-spindle CNC (Ti / Inconel) exposure.',
  'Machining & GD&T: folding multi-tool fabricated to ±0.005 in precision, 0.003 in parallelism, 0.002 in flatness; every feature inspected against print.',
  'Mechanical Design: reduction gearbox for a 1-DOF robotic elbow — gear-ratio + shaft + bearing calcs, tolerance stack-up, and design-review-approved assembly.',
  'Zero-Energy Thermal (BET-H): phase-change architecture with about 250 kJ/kg latent capacity.',
  'PIV Innovation: visual-field redesign that improved measurement accuracy by 40%.',
  'Autonomous Robotics: two-axis turret from concept to prototype in four weeks.',
  'Materials and Vibration: composite damping test rig with Arduino DAQ and scope validation — 10× damping improvement.',
  'Equity Engineering: co-authoring a study on inclusive micromobility design.',
]

const leadership = [
  'Grew SAME membership by 30% with hands-on technical workshops.',
  'Managed a >$10K budget with military-grade rigor.',
  'Connected 50+ students to industry partners and internships.',
]

const amazon = [
  'Built ergonomic analytics that reduced error by 20%.',
  'Optimized emergency response pathways that cut response time by 25%.',
  'Maintained 100% compliance through process improvement.',
]

function StatCard({ value, label, caption, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: i * 0.05 }}
      className="rounded-2xl border border-line bg-surface-2/60 backdrop-blur-sm p-5"
    >
      <div className="text-3xl font-extrabold text-white tabular-nums">{value}</div>
      <div className="text-sm text-gray-200 mt-1">{label}</div>
      <div className="text-xs text-gray-400 mt-0.5">{caption}</div>
    </motion.div>
  )
}

function ResearchCard({ title, detail, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: i * 0.05 }}
      className="rounded-2xl border border-line bg-surface-2/60 backdrop-blur-sm p-5 hover:border-brand-500/40 transition-colors"
    >
      <div className="text-white font-semibold">{title}</div>
      <div className="text-sm text-gray-300 mt-1 leading-relaxed">{detail}</div>
    </motion.div>
  )
}

export default function About() {
  const portfolio = useMemo(() => {
    return portfolioLines.map((line) => {
      const [title, ...rest] = line.split(':')
      return { title: title.trim(), detail: rest.join(':').trim() }
    })
  }, [])

  return (
    <ProjectLayout>
      <PageHero
        kicker="// About Me"
        title="From Navy Corpsman to Mechanical Engineer"
        subtitle="Five years of high-stakes Navy operations, then a decisive turn into mechanical engineering R&D."
      />

      {/* Story + photo */}
      <section className="pb-10">
        <Container>
          <div className="grid lg:grid-cols-[1.1fr_400px] gap-8 items-start">
            <div className="leading-relaxed space-y-5">
              {story.map((p, i) => (
                <p key={i} className={`text-gray-200 ${i === 0 ? 'text-[16px]' : 'text-[15px]'}`}>
                  {p}
                </p>
              ))}
            </div>
            <motion.figure
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative rounded-2xl overflow-hidden border border-line bg-surface-2 shadow-card"
            >
              <img
                src="/projects/navy.jpg"
                alt="U.S. Navy — Hospital Corpsman"
                className="w-full h-[520px] object-cover object-center"
                loading="eager"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-1 to-transparent" />
            </motion.figure>
          </div>
        </Container>
      </section>

      {/* Active R&D */}
      <section className="pb-10">
        <Container>
          <SectionTitle kicker="// Active R&D" title="Current research portfolio" />
          <div className="grid md:grid-cols-2 gap-4">
            {portfolio.map((p, i) => <ResearchCard key={i} title={p.title} detail={p.detail} i={i} />)}
          </div>
        </Container>
      </section>

      {/* Impact numbers */}
      <section className="pb-10">
        <Container>
          <SectionTitle kicker="// Impact" title="The numbers that matter" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.map((s, i) => <StatCard key={i} {...s} i={i} />)}
          </div>
        </Container>
      </section>

      {/* Leadership / Amazon */}
      <section className="pb-10">
        <Container>
          <div className="grid lg:grid-cols-2 gap-5">
            <Glass>
              <SectionTitle kicker="// Leadership" title="SAME (UWT)" />
              <ul className="space-y-2 text-[15px] text-gray-200 list-disc pl-5 leading-relaxed">
                {leadership.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </Glass>
            <Glass>
              <SectionTitle kicker="// Ops & Analytics" title="Amazon (2023 – 2024)" />
              <ul className="space-y-2 text-[15px] text-gray-200 list-disc pl-5 leading-relaxed">
                {amazon.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </Glass>
          </div>
        </Container>
      </section>

      {/* Availability */}
      <section className="pb-10">
        <Container>
          <Glass>
            <SectionTitle kicker="// Availability" title="Ready to contribute" />
            <ul className="grid sm:grid-cols-2 gap-3 text-[15px] text-gray-200">
              <li>Available: <span className="font-semibold text-white">Summer 2026</span> — open to extended co-ops.</li>
              <li>Location: <span className="font-semibold text-white">Flexible, willing to relocate.</span></li>
              <li>Security: <span className="font-semibold text-white">Able to obtain and maintain a U.S. security clearance.</span></li>
              <li>Focus: <span className="font-semibold text-white">High-impact engineering challenges.</span></li>
            </ul>
          </Glass>
        </Container>
      </section>

      <div className="h-px w-full bg-gradient-to-r from-transparent via-line to-transparent" />

      <section className="py-16">
        <Container>
          <Suspense fallback={null}><Contact /></Suspense>
        </Container>
      </section>
      <Suspense fallback={null}><Footer /></Suspense>
    </ProjectLayout>
  )
}
