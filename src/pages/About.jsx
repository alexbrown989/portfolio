// src/pages/About.jsx
import { lazy, Suspense, useMemo } from 'react'
import { motion } from 'framer-motion'
import ProjectLayout from './ProjectLayout'

const Contact = lazy(() => import('../components/Contact'))
const Footer  = lazy(() => import('../components/Footer'))

const headline = 'From Navy Corpsman to Mechanical Engineer'

const story = [
  `My engineering journey began not in a classroom, but in high-stakes clinical settings as a U.S. Navy Corpsman. For five years, I learned lessons that cannot be taught in a lecture hall. The military instilled in me a deep sense of ownership and an unwavering mission-first focus. I learned to execute with precision when the stakes were high, to lead with composure, and to understand that the success of any system ultimately comes down to its impact on people. Managing a complex medical supply system and developing safety protocols taught me to see the world through the lens of an engineer, optimizing processes where failure was not an option.`,
  `That background is the bedrock of my approach to engineering today. I am not just a student; I am a builder, driven by an insatiable curiosity to understand how things work and a compulsion to make them better. My work is a constant dialogue between the theoretical and the tangible. I thrive on translating a spark of an idea, like a new theory on passive thermodynamics, into a fully functional prototype like the 2-axis autonomous turret I designed and fabricated from the ground up. This obsession with the entire lifecycle of creation, from LTspice circuits to custom composite materials, is what fuels me.`,
  `What sets me apart from other candidates is this unique fusion of lived operational experience and rigorous hands-on R&D. While many learn theory, I have applied systems thinking in environments where the human cost of a design flaw is immediate and real. This perspective gives me a level of maturity and practical problem-solving ability that cannot be replicated academically. I am now seeking an opportunity to bring this blend of leadership and technical skill to a team tackling the world's most critical problems. I thrive where the challenges are steep, the mission is critical, and the goal is to build what comes next.`,
]

const stats = [
  { label: 'Operational Downtime', value: '-20%', caption: 'driven by logistics engineering' },
  { label: 'Training Compliance',  value: '92%',  caption: '57 personnel' },
  { label: 'Procedural Errors',    value: '-30%', caption: 'systematic analysis' },
  { label: 'Surgical Procedures',  value: '200+', caption: 'zero critical failures' },
]

const portfolioLines = [
  'Zero-Energy Thermal (BET-H): Phase-change architecture with about 250 kJ/kg latent capacity',
  'PIV Innovation: Visual field redesign that improved measurement accuracy by 40 percent',
  'Autonomous Robotics: 2-axis turret from concept to prototype in four weeks',
  'Coastal Engineering: 3D-printed seawall models for wave interaction analysis',
  'Materials and Vibration: Composite damping test rig with Arduino data acquisition and scope validation',
  'Analog Computation: Ternary logic adder that connects theory to hardware',
  'Equity Engineering: Co-authoring a study on inclusive micromobility design',
]

const leadership = [
  'Grew SAME membership by 30 percent with hands-on technical workshops',
  'Managed a budget greater than 10 thousand dollars with military-grade rigor',
  'Connected more than 50 students to industry partners and internships',
]

const amazon = [
  'Built ergonomic analytics that reduced error by 20 percent',
  'Optimized emergency response pathways that reduced response time by 25 percent',
  'Maintained 100 percent compliance through process improvement',
]

function FocusBox({ className = '', children }) {
  return (
    <div className={`relative group overflow-hidden ${className}`}>
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-0"
        style={{ mixBlendMode: 'multiply' }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

function SectionTitle({ kicker = '', title }) {
  return (
    <div className="mb-4">
      {kicker && (
        <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200 drop-shadow-[0_1px_0_rgba(0,0,0,.7)]">
          {kicker}
        </div>
      )}
      <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
      <div className="mt-2 h-px w-24 bg-gradient-to-r from-cyan-400/80 to-transparent rounded-full" />
    </div>
  )
}

function StatCard({ value, label, caption, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: i * 0.05 }}
      className="rounded-2xl"
    >
      <FocusBox className="p-5 bg-white/8 border border-white/12 rounded-2xl">
        <div className="text-3xl font-extrabold text-white">{value}</div>
        <div className="text-sm text-gray-100 mt-1">{label}</div>
        <div className="text-xs text-gray-400 mt-1">{caption}</div>
      </FocusBox>
    </motion.div>
  )
}

function ResearchCard({ title, detail, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-2xl"
    >
      <FocusBox className="p-5 bg-white/7 border border-white/12 rounded-2xl hover:border-cyan-400/40 transition">
        <div className="font-semibold text-white">{title}</div>
        <div className="text-sm text-gray-300">{detail}</div>
      </FocusBox>
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
      <div className="min-h-screen relative">
        {/* Header */}
        <section className="pt-20 pb-8">
          <div className="container mx-auto px-6">
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200 drop-shadow-[0_1px_0_rgba(0,0,0,.7)]">
              // About Me
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-2">
              {headline}
            </h1>
            <div className="mt-3 h-px w-28 bg-gradient-to-r from-cyan-400/80 to-transparent rounded-full" />
          </div>
        </section>

        {/* Story + photo */}
        <section className="pb-6">
          <div className="container mx-auto px-6">
            <div className="grid lg:grid-cols-[1.08fr_420px] gap-10 items-start">
              <div className="leading-relaxed">
                {story.map((p, i) => (
                  <p key={i} className={`text-gray-100 ${i === 0 ? 'text-[17px]' : 'mt-5'}`}>
                    {p}
                  </p>
                ))}
              </div>
              <motion.figure
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                className="relative rounded-2xl overflow-hidden border border-white/12 bg-white/6 shadow-[0_12px_40px_rgba(0,0,0,.25)]"
              >
                <img
                  src="/projects/navy.jpg"
                  alt="U.S. Navy - Hospital Corpsman"
                  className="w-full h-[520px] object-cover object-center [filter:contrast(1.06)_saturate(1.1)]"
                  loading="eager"
                />
                <div className="pointer-events-none absolute -inset-2 rounded-[22px] blur-2xl bg-gradient-to-br from-cyan-500/15 to-purple-500/15" />
              </motion.figure>
            </div>
          </div>
        </section>

        {/* Active R&D */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            <SectionTitle kicker="Active R&D" title="Current Research Portfolio" />
            <div className="grid md:grid-cols-2 gap-4">
              {portfolio.map((p, i) => (
                <ResearchCard key={i} title={p.title} detail={p.detail} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Numbers That Matter */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <SectionTitle kicker="Impact" title="The Numbers That Matter" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((s, i) => <StatCard key={i} {...s} i={i} />)}
            </div>
          </div>
        </section>

        {/* Leadership / Amazon */}
        <section className="py-10">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-6">
            <FocusBox className="rounded-2xl p-6 bg-white/7 border border-white/12">
              <SectionTitle kicker="Leadership" title="SAME (UWT)" />
              <ul className="space-y-2 text-gray-100 text-[15px] list-disc pl-5">
                {leadership.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </FocusBox>
            <FocusBox className="rounded-2xl p-6 bg-white/7 border border-white/12">
              <SectionTitle kicker="Ops and Analytics" title="Amazon (2023-2024)" />
              <ul className="space-y-2 text-gray-100 text-[15px] list-disc pl-5">
                {amazon.map((l, i) => <li key={i}>{l}</li>)}
              </ul>
            </FocusBox>
          </div>
        </section>

        {/* Availability */}
        <section className="py-10">
          <div className="container mx-auto px-6">
            <FocusBox className="rounded-2xl p-6 bg-white/8 border border-white/12">
              <SectionTitle kicker="Availability" title="Ready to Contribute" />
              <ul className="grid sm:grid-cols-2 gap-2 text-gray-100 text-[15px]">
                <li>Available: <span className="font-semibold text-white">Summer 2026</span> with openness to extended co-ops</li>
                <li>Location: <span className="font-semibold text-white">Flexible, willing to relocate</span></li>
                <li>Security: <span className="font-semibold text-white">Able to obtain and maintain a U.S. security clearance.</span></li>
                <li>Focus: <span className="font-semibold text-white">High-impact engineering challenges</span></li>
              </ul>
            </FocusBox>
          </div>
        </section>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Contact + Footer */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <Suspense fallback={null}><Contact /></Suspense>
          </div>
        </section>
        <Suspense fallback={null}><Footer /></Suspense>
      </div>
    </ProjectLayout>
  )
}
