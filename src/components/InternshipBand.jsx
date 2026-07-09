// src/components/InternshipBand.jsx
// Load-bearing home-page section. Elevates the Verus Aerospace internship
// out of the timeline collapse so the strongest credential is visible in
// the first scroll.

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Anchor, Building2, ShieldCheck, Cpu, Gauge, ClipboardCheck, ArrowRight, Timer } from 'lucide-react'
import { Container, SectionTitle, CornerBrackets, StatusPill, Glass } from '../shared/ui'
import { timeline } from '../content/timeline'

// Verus start date — matches the timeline entry period. Anchored to the
// first of the month so 'days on mission' reads as a whole number.
const MISSION_START = new Date('2025-12-01T00:00:00Z')

function useMissionClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])
  const dt = now - MISSION_START
  const days = Math.max(0, Math.floor(dt / 86_400_000))
  const hrs  = Math.max(0, Math.floor((dt % 86_400_000) / 3_600_000))
  return { days, hrs }
}

const CAPS = [
  { Icon: ClipboardCheck, label: 'AS9102 FAI',                    detail: 'First Article Inspection support on flight-critical hardware.' },
  { Icon: Building2,      label: 'Infor VISUAL ERP',              detail: 'Engineering Masters + configuration control across active programs.' },
  { Icon: ShieldCheck,    label: 'Gulfstream over-check',         detail: 'Independent inspections finding dimensional / doc issues pre-release.' },
  { Icon: Gauge,          label: 'Quality Clinic leadership',     detail: 'Non-conforming hardware disposition + workflow redesign.' },
  { Icon: Cpu,            label: 'Multi-spindle CNC exposure',    detail: 'Close-tolerance titanium and Inconel components at production scale.' },
  { Icon: Anchor,         label: 'Lead Intern',                   detail: 'Onboarding + coordination of incoming interns.' },
]

export default function InternshipBand() {
  const verus = timeline.find(t => (t.org || '').toLowerCase().includes('verus')) || {}
  const highlights = (verus.highlights || []).slice(0, 5)
  const { days, hrs } = useMissionClock()

  return (
    <Container>
      <SectionTitle
        code="SEC 001"
        kicker="Current internship"
        title="Verus Aerospace · Engineering Intern (Lead Intern)"
        subtitle="Aerospace manufacturing, quality, and process improvement for flight-critical hardware in a high-mix production environment. This is the live-fire environment where GD&T, ERP configuration control, and real production physics meet."
      />

      <div className="grid lg:grid-cols-[1.15fr_1fr] gap-5">
        {/* Left: STAR-style summary card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
        >
          <CornerBrackets className="rounded-2xl border border-line bg-surface-2/60 backdrop-blur-sm p-6 md:p-7">
            <div className="flex flex-wrap items-center gap-2">
              <StatusPill label="Active · Dec 2025 – Present" tone="brand" pulse />
              <span className="text-[10.5px] font-mono uppercase tracking-[0.24em] text-gray-500">
                Tacoma, WA · Aerospace Manufacturing
              </span>
              <span
                className="ml-auto inline-flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300"
                title="Time since mission start"
              >
                <Timer className="w-3 h-3" />
                T+ {days}d {String(hrs).padStart(2, '0')}h
              </span>
            </div>

            <p className="mt-5 text-gray-200 leading-relaxed text-[15px]">
              {verus.summary}
            </p>

            <ul className="mt-5 space-y-2.5">
              {highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-300 leading-relaxed">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-400 flex-shrink-0" />
                  <span>{h}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/#timeline"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('timeline')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors text-sm"
              >
                Full timeline <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-line-strong text-gray-100 hover:border-brand-400/60 hover:text-white transition-colors text-sm"
              >
                Read the story
              </Link>
            </div>
          </CornerBrackets>
        </motion.div>

        {/* Right: capabilities matrix */}
        <div className="grid grid-cols-2 gap-3">
          {CAPS.map(({ Icon, label, detail }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: i * 0.04, duration: 0.35 }}
            >
              <Glass hover={false} pad={false} className="p-4 h-full">
                <Icon className="w-4 h-4 text-brand-300" />
                <div className="text-white font-semibold text-sm mt-2 leading-tight">{label}</div>
                <div className="text-[12px] text-gray-400 mt-1 leading-relaxed">{detail}</div>
              </Glass>
            </motion.div>
          ))}
        </div>
      </div>
    </Container>
  )
}
