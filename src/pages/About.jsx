// src/pages/About.jsx
//
// Cleaned-up About. Tighter hierarchy, HUD kickers per section, richer
// hero photo panel, mobile-friendly stat + capability grids.

import { lazy, Suspense, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Anchor, ShieldCheck, GraduationCap, Wrench, Award, MapPin } from 'lucide-react'
import ProjectLayout from './ProjectLayout'
import {
  Container, PageHero, SectionTitle, Glass, MetricBox, CornerBrackets,
} from '../shared/ui'

const Contact = lazy(() => import('../components/Contact'))
const Footer  = lazy(() => import('../components/Footer'))

/* ------------------------------------------------------------------- */
/* Content                                                              */
/* ------------------------------------------------------------------- */

const story = [
  `My engineering journey began not in a classroom, but in high-stakes clinical settings as a U.S. Navy Corpsman. For five years I learned lessons no lecture hall can teach. The military instilled ownership and a mission-first focus. I learned to execute with precision when the stakes were high, to lead with composure, and to understand that the success of any system ultimately comes down to its impact on people.`,
  `That background is the bedrock of how I approach engineering today. I am not just a student; I am a builder, driven by curiosity about how things work and a compulsion to make them better. My work is a constant dialogue between the theoretical and the tangible: translating a spark of an idea, from a new theory on passive thermodynamics to a two-axis autonomous turret, into fully functional hardware.`,
  `Today that mindset lives inside my internship at Verus Aerospace in Tacoma, WA. I support flight-critical hardware through AS9102 First Article Inspection activities, Infor VISUAL ERP configuration control, and independent over-check inspections on Gulfstream assemblies. As the Lead Intern I also coordinate onboarding for incoming interns and lead the Quality Clinic. Aerospace manufacturing is where operations, GD&T, and real production physics meet, and it is exactly where I want to be.`,
  `Looking forward, I am seeking a full-time engineering role starting Summer 2027 where operational maturity, hands-on manufacturing fluency, and R&D depth all pull in the same direction.`,
]

const kpis = [
  { value: '-20%',  label: 'Operational downtime',   sub: 'via logistics engineering' },
  { value: '92%',   label: 'Training compliance',    sub: '57 personnel · Navy' },
  { value: '-30%',  label: 'Procedural errors',      sub: 'systematic SOP redesign' },
  { value: '200+',  label: 'Surgical procedures',    sub: 'zero critical failures' },
]

const capabilities = [
  { Icon: Wrench,        title: 'Manufacturing',    body: 'Manual mill + CNC · GD&T · AS9102 FAI · metrology · Infor VISUAL ERP.' },
  { Icon: ShieldCheck,   title: 'Quality',          body: 'Inspection planning · over-check inspections · non-conforming disposition · KPI monitoring.' },
  { Icon: GraduationCap, title: 'Mechanical R&D',   body: 'SolidWorks / Onshape · tolerance stack-up · MATLAB / Python · Arduino / NodeMCU / LTspice.' },
  { Icon: Anchor,        title: 'Operational',      body: '5 yr USN Corpsman · leadership under load · SOP authorship · cross-functional coordination.' },
]

const availability = [
  { label: 'Available', value: 'Summer 2027 · Full-time' },
  { label: 'Based',     value: 'Tacoma, WA' },
  { label: 'Relocate',  value: 'Yes, anywhere in the U.S.' },
  { label: 'Clearance', value: 'U.S. citizen · eligible' },
  { label: 'Priority',  value: 'Aerospace · defense-adjacent · advanced manufacturing · R&D' },
]

const portfolioLines = [
  'Aerospace Manufacturing (Verus Aerospace): AS9102 FAI, Infor VISUAL ERP, GD&T inspection, Quality Clinic redesign, multi-spindle CNC (Ti / Inconel) exposure.',
  'Machining & GD&T: folding multi-tool fabricated to ±0.005 in precision, 0.003 in parallelism, 0.002 in flatness. Every feature inspected against print.',
  'Mechanical Design: reduction gearbox for a 1-DOF robotic elbow. Gear ratio, shaft sizing, bearing selection, tolerance stack-up, and a design-review-approved assembly.',
  'Zero-Energy Thermal (BET-H): phase-change architecture with about 250 kJ/kg latent capacity.',
  'PIV Innovation: visual-field redesign that improved measurement accuracy 40%.',
  'Autonomous Robotics: two-axis turret from concept to prototype in four weeks.',
  'Materials and Vibration: composite damping test rig with Arduino DAQ and scope validation. 10× damping improvement.',
  'Equity Engineering: co-authoring a study on inclusive micromobility design.',
]

/* ------------------------------------------------------------------- */
/* Page                                                                 */
/* ------------------------------------------------------------------- */

export default function About() {
  const portfolio = useMemo(
    () => portfolioLines.map((line) => {
      const [title, ...rest] = line.split(':')
      return { title: title.trim(), detail: rest.join(':').trim() }
    }),
    []
  )

  return (
    <ProjectLayout>
      <PageHero
        kicker="About · Full profile"
        code="SEC 04"
        title="From Navy Corpsman to Aerospace Engineer"
        subtitle="Five years of high-stakes Navy operations, then a decisive turn into mechanical engineering R&D, now inside an active aerospace manufacturing and quality role at Verus Aerospace."
      />

      {/* Story + photo panel */}
      <section className="pb-10">
        <Container>
          <div className="grid lg:grid-cols-[1.15fr_380px] gap-8 items-start">
            <div className="space-y-4 max-w-[64ch]">
              {story.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className={`text-gray-200 leading-relaxed ${i === 0 ? 'text-[16px]' : 'text-[15px]'}`}
                >
                  {p}
                </motion.p>
              ))}
            </div>
            <motion.figure
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              className="relative"
            >
              <CornerBrackets className="rounded-2xl overflow-hidden border border-line bg-surface-2 shadow-card">
                <div className="relative">
                  <img
                    src="/projects/navy.jpg"
                    alt="U.S. Navy · Hospital Corpsman"
                    className="w-full h-[420px] md:h-[520px] object-cover object-center"
                    loading="eager"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-1 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/90">
                      Prior service
                    </div>
                    <div className="text-white font-semibold text-sm mt-0.5">
                      U.S. Navy Corpsman · 2018 – 2023
                    </div>
                    <div className="text-[11px] text-gray-400 mt-0.5 inline-flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      Armed Forces Service Medal
                    </div>
                  </div>
                </div>
              </CornerBrackets>
            </motion.figure>
          </div>
        </Container>
      </section>

      {/* Capabilities grid */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Capabilities"
            code="C/01"
            title="What I bring to a team"
          />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {capabilities.map(({ Icon, title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-line bg-surface-2/60 backdrop-blur-sm p-4 hover:border-brand-500/40 transition-colors"
              >
                <Icon className="w-5 h-5 text-brand-300" />
                <div className="text-white font-semibold mt-2">{title}</div>
                <p className="text-[13px] text-gray-400 mt-1.5 leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Impact KPIs */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Impact"
            code="I/02"
            title="Numbers that hold up under review"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map(k => <MetricBox key={k.label} {...k} />)}
          </div>
        </Container>
      </section>

      {/* Portfolio bullets */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Active R&D + Manufacturing"
            code="P/03"
            title="Current research portfolio"
          />
          <div className="grid md:grid-cols-2 gap-3">
            {portfolio.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-line bg-surface-2/60 backdrop-blur-sm p-4 hover:border-brand-500/40 transition-colors"
              >
                <div className="text-white font-semibold">{p.title}</div>
                <p className="text-[13.5px] text-gray-300 leading-relaxed mt-1">{p.detail}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Availability */}
      <section className="pb-10">
        <Container>
          <SectionTitle
            kicker="Availability"
            code="A/04"
            title="Ready to contribute"
          />
          <CornerBrackets className="rounded-2xl border border-line bg-surface-2/60 backdrop-blur-sm p-5 md:p-6">
            <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6">
              {availability.map(row => (
                <div key={row.label} className="grid grid-cols-[100px_1fr] gap-3 py-1">
                  <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 pt-0.5">
                    {row.label}
                  </div>
                  <div className="text-[14px] text-white font-semibold">{row.value}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-line text-xs text-gray-400 inline-flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-brand-300" />
              Willing to relocate for the right role.
            </div>
          </CornerBrackets>
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
