// src/components/Manifesto.jsx
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../shared/ui'

const bullets = [
  { label: 'Aerospace present',    text: 'Lead Intern at Verus Aerospace: AS9102 FAI, Infor VISUAL ERP configuration control, Quality Clinic operations.' },
  { label: 'Operational history',  text: 'Managed a $102K medical supply system to 20% downtime reduction and 92% training compliance across 57 personnel.' },
  { label: 'Advanced R&D',         text: 'Improved fluid-measurement accuracy 40% through a novel PIV Visual Field Architecture on the Saipan coastal study.' },
  { label: 'Hands-on prototyping', text: 'Machined a folding multi-tool to ±0.005 in against a full GD&T print. Designed the reduction gearbox behind a 1-DOF robotic elbow.' },
]

export default function Manifesto() {
  return (
    <Container>
      <div className="text-center mb-8">
        <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-brand-300/90 mb-2">
          // About
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
          Mission-critical builder
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        className="relative rounded-2xl border border-line bg-surface-2/60 backdrop-blur-sm p-6 md:p-8"
      >
        <p className="text-gray-200 leading-relaxed text-[16px]">
          Five years in the U.S. Navy taught me to run high-stakes systems under real accountability.
          Now that mindset is inside an active aerospace-manufacturing internship at Verus Aerospace,
          working through GD&amp;T, AS9102, and production physics on flight-critical hardware, backed
          by a portfolio of hands-on machining, mechatronics, and thermal R&amp;D projects.
        </p>

        <ul className="mt-5 grid md:grid-cols-2 gap-3">
          {bullets.map((b) => (
            <li key={b.label} className="rounded-xl border border-line bg-surface-3/40 p-4">
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90 mb-1">
                {b.label}
              </div>
              <div className="text-sm text-gray-200 leading-relaxed">{b.text}</div>
            </li>
          ))}
        </ul>

        <p className="mt-6 text-brand-300 font-medium text-sm">
          Seeking full-time mechanical engineering roles starting Summer 2027.
        </p>

        <div className="mt-6 flex justify-center">
          <Link
            to="/about"
            className="glow-btn inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors"
          >
            Read full profile <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    </Container>
  )
}
