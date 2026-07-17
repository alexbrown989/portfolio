// src/pages/ResumePrint.jsx
//
// Print-optimized HTML resume view. Everything the browser needs to
// produce a clean single-column PDF via Cmd/Ctrl-P is here. Site chrome
// (nav, chat, background FX, viewport crosshairs) is suppressed in the
// print stylesheet at the bottom of this file so the printed page looks
// like a real resume, not a screenshot.

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Printer, Mail, FileDown, ArrowLeft } from 'lucide-react'
import { usePageMeta } from '../shared/usePageMeta'

const CONTACT = {
  email: 'alexbrow@uw.edu',
  phone: '678-689-7331',
  site: 'www.alexandercbrown.com',
  status: 'U.S. Citizen · DoD Secret Clearance Eligible',
}

const summary = `U.S. Navy veteran and Mechanical Engineering student with aerospace manufacturing experience in configuration control, inspection planning, AS9102 FAI support, nonconformance tracking, ERP workflows, and production process improvement. Hands-on hardware focus spanning DFM, tooling, work instructions, and scaling defense systems. Available full time in 2027.`

const experience = [
  {
    role: 'Manufacturing Quality Engineering Intern',
    org: 'Verus Aerospace',
    location: 'Tacoma, WA',
    dates: 'Dec 2025 – Present',
    bullets: [
      'Supported rapid production of mission-critical aerospace hardware by maintaining Engineering Masters, revision control, and ERP tracking across thousands of active components, improving configuration traceability and release readiness.',
      'Supported recovery of a delayed supplier production issue involving 10 backlogged orders and approximately 40 parts by assisting with a supplier audit, identifying scrap and process-control concerns, and improving corrective action visibility between quality, manufacturing, and supplier stakeholders.',
      'Improved quality verification before hardware release by creating inspection plans, supporting AS9102 First Article Inspection activities, and performing independent over-check inspections on aerospace assemblies and major OEM hardware to identify defects, dimensional discrepancies, and documentation gaps.',
      'Led Quality Clinic operations for non-conforming hardware by tracking parts through rework, reassignment, and scrap disposition while redesigning material flow, visual organization, and disposition processes to improve traceability, communication, and turnaround efficiency.',
    ],
  },
  {
    role: 'Multi-Tool Fabrication Project',
    org: 'University of Washington',
    location: 'Tacoma, WA',
    dates: 'May 2026 – Jun 2026',
    bullets: [
      'Fabricated a functional folding multi-tool assembly using manual mill and CNC machining operations, manufacturing mating components including arms, jaws, pivot features, and bottle opener geometry.',
      'Interpreted engineering drawings and machined aluminum components to tolerance requirements including ±0.010 in general dimensions, ±0.005 in precision dimensions, 0.003 in parallelism, and 0.002 in flatness controls.',
      'Calculated feeds, speeds, and machining parameters for aluminum to achieve required surface finish, dimensional accuracy, and repeatable material removal across multiple operations.',
      'Verified part quality using calipers, gauges, and dial indicators, recording measurements against drawing tolerances to confirm assembly fit and identify dimensional variation.',
    ],
  },
  {
    role: 'Gearbox Project',
    org: 'University of Washington',
    location: 'Tacoma, WA',
    dates: 'May 2026 – Jun 2026',
    bullets: [
      'Designed a shaft-reduction gearbox for a 1-degree-of-freedom robotic elbow by coordinating CAD development, mechanical calculations, and design review tasks under a fixed project deadline.',
      'Developed a fully constrained CAD assembly to validate component fit, shaft alignment, gear placement, motion clearance, bearing support, and system integration before final design submission.',
      'Verified gearbox performance requirements by performing gear ratio selection, torque transmission, shaft sizing, bearing selection, and load calculations for the robotic joint.',
      'Improved manufacturability and assembly repeatability by applying GD&T principles, tolerance stack-up analysis, and clearance/interference fit checks to reduce alignment risk and control backlash.',
    ],
  },
  {
    role: 'Hospital Corpsman',
    org: 'U.S. Navy',
    location: 'Various Locations',
    dates: 'Aug 2018 – May 2023',
    bullets: [
      'Managed a $102K medical inventory system across 6,200+ items, reducing supply bottlenecks and supporting 20% lower operational downtime in a fast-paced military environment.',
      'Enforced strict safety engineering protocols for 50+ hazardous materials by creating comprehensive SDS documentation to achieve 100% federal regulatory compliance.',
    ],
  },
]

const skills = [
  { label: 'Technical', items: ['SolidWorks', 'Onshape', 'MATLAB', 'GD&T (ASME Y14.5)', 'AS9102 FAI', 'ERP', 'Microsoft Office Suite', 'FEA', 'Python', 'C++'] },
  { label: 'Professional', items: ['Shop-floor problem solving', 'Cross-functional communication', 'Technical documentation', 'Adaptability'] },
]

const education = [
  { degree: 'B.S. Mechanical Engineering', school: 'University of Washington', dates: 'Jun 2027' },
]

export default function ResumePrint() {
  usePageMeta({
    title: 'Resume · Alex Brown · Mechanical Engineer',
    description: 'One-page resume — Alex Brown, mechanical engineer, aerospace-focused. Currently Lead Intern at Verus Aerospace. Seeking full-time engineering roles starting Summer 2027.',
    path: '/resume',
  })

  // Add a body class so print CSS below can suppress site chrome.
  useEffect(() => {
    document.body.classList.add('print-resume-mode')
    return () => document.body.classList.remove('print-resume-mode')
  }, [])

  return (
    <div className="min-h-screen bg-white text-slate-900 print:bg-white">
      {/* Screen-only header bar with print + back controls */}
      <div className="print:hidden sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-6 py-3 flex items-center justify-between gap-3">
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-700 hover:text-slate-900">
            <ArrowLeft className="w-4 h-4" /> Back to site
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="/Resume.pdf"
              download="alex-brown-resume.pdf"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm border border-slate-300 hover:border-slate-500"
            >
              <FileDown className="w-4 h-4" /> PDF
            </a>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm bg-slate-900 text-white hover:bg-slate-800"
            >
              <Printer className="w-4 h-4" /> Print / Save
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-6 py-8 print:p-0 print:max-w-none">
        {/* Header */}
        <header className="mb-5 border-b border-slate-200 pb-4">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Alexander Brown</h1>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-mono">
              Mechanical Engineer · Aerospace-Focused
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {CONTACT.email}
            </span>
            <span>{CONTACT.site}</span>
            <span>{CONTACT.phone}</span>
            <span>{CONTACT.status}</span>
          </div>
        </header>

        {/* Skills */}
        <section className="mb-5">
          <h2 className="text-[10.5px] font-mono uppercase tracking-[0.24em] text-slate-500 mb-2">Skills</h2>
          <div className="space-y-1.5">
            {skills.map((s) => (
              <div key={s.label} className="text-[13px] leading-snug">
                <span className="font-semibold text-slate-900">{s.label}: </span>
                <span className="text-slate-700">{s.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Summary */}
        <section className="mb-5">
          <h2 className="text-[10.5px] font-mono uppercase tracking-[0.24em] text-slate-500 mb-1">Summary</h2>
          <p className="text-[13.5px] leading-relaxed text-slate-800">{summary}</p>
        </section>

        {/* Experience */}
        <section className="mb-5">
          <h2 className="text-[10.5px] font-mono uppercase tracking-[0.24em] text-slate-500 mb-2">Experience</h2>
          <div className="space-y-4">
            {experience.map((x, i) => (
              <div key={i} className="break-inside-avoid">
                <div className="flex items-baseline justify-between flex-wrap gap-x-3">
                  <div className="text-[14px] font-semibold text-slate-900">
                    {x.role} · <span className="font-normal text-slate-700">{x.org}</span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 whitespace-nowrap">{x.dates}</div>
                </div>
                {x.location && <div className="text-[12px] text-slate-500">{x.location}</div>}
                <ul className="mt-1.5 space-y-1 list-disc pl-5">
                  {x.bullets.map((b, j) => (
                    <li key={j} className="text-[13px] leading-snug text-slate-800">{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section className="mb-2">
          <h2 className="text-[10.5px] font-mono uppercase tracking-[0.24em] text-slate-500 mb-2">Education</h2>
          {education.map((e, i) => (
            <div key={i}>
              <div className="flex items-baseline justify-between flex-wrap gap-x-3">
                <div className="text-[14px] font-semibold text-slate-900">
                  {e.degree} · <span className="font-normal text-slate-700">{e.school}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-500 whitespace-nowrap">{e.dates}</div>
              </div>
              {e.detail && <div className="text-[13px] text-slate-700">{e.detail}</div>}
            </div>
          ))}
        </section>

        <footer className="mt-6 pt-3 border-t border-slate-200 text-[11px] text-slate-500 print:hidden">
          Generated from {CONTACT.site} · {CONTACT.status} · Available full time in 2027
        </footer>
      </main>

      {/* Print CSS — suppress everything not part of the resume */}
      <style>{`
        @page { size: letter; margin: 0.55in 0.6in; }
        @media print {
          body.print-resume-mode {
            background: #fff !important;
            color: #0f172a !important;
          }
          body.print-resume-mode nav,
          body.print-resume-mode aside,
          body.print-resume-mode footer,
          body.print-resume-mode [aria-label="Viewport crosshairs"],
          body.print-resume-mode [aria-label="Portfolio chat"],
          body.print-resume-mode [aria-label="Open chat with Alex's assistant"],
          body.print-resume-mode [aria-label="Close chat"],
          body.print-resume-mode [aria-label="Orbital determinism widget"],
          body.print-resume-mode [aria-label="Open orbital widget"],
          body.print-resume-mode .fixed { display: none !important; }
        }
      `}</style>
    </div>
  )
}
