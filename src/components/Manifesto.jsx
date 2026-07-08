// src/components/Manifesto.jsx
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Container } from '../shared/ui'

const bullets = [
  { label: 'Operational impact',   text: 'Managed $102K supply systems and led teams to 92% training compliance.' },
  { label: 'Advanced R&D',         text: 'Improved fluid measurement accuracy by 40% through PIV workflow redesign.' },
  { label: 'Hands-on prototyping', text: 'Built 5+ complex systems: autonomous robotics, zero-energy thermal regulation, vibration rigs.' },
  { label: 'Proven leadership',    text: 'Grew engineering-society membership by 30% as SAME president.' },
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
          I build mission-critical systems shaped by five years in the U.S. Navy and a deep focus on
          hands-on engineering R&amp;D. I translate complex theory into functional hardware that
          performs under pressure.
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
          Seeking a high-impact mechanical engineering internship for Summer 2026.
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
