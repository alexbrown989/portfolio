// src/pages/ResumePrint.jsx
//
// Print-optimized HTML resume view. Everything the browser needs to
// produce a clean single-column PDF via Cmd/Ctrl-P is here. Site chrome
// (nav, chat, background FX, viewport crosshairs) is suppressed in the
// print stylesheet at the bottom of this file so the printed page looks
// like a real resume, not a screenshot.

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Printer, Mail, Linkedin, FileDown, ArrowLeft } from 'lucide-react'
import { usePageMeta } from '../shared/usePageMeta'

const CONTACT = {
  email: 'alexbrow@uw.edu',
  linkedin: 'linkedin.com/in/alexanderchasebrown',
  site: 'alexandercbrown.com',
  location: 'Tacoma, WA',
}

const summary = `Mechanical engineering student and U.S. Navy veteran (five years as a Hospital Corpsman). Currently Lead Intern at Verus Aerospace supporting flight-critical hardware: AS9102 First Article Inspection, GD&T, Infor VISUAL ERP configuration control, Quality Clinic operations, and independent over-check inspections on Gulfstream assemblies. Seeking full-time engineering roles starting Summer 2027.`

const experience = [
  {
    role: 'Lead Engineering Intern',
    org: 'Verus Aerospace',
    location: 'Tacoma, WA',
    dates: 'Dec 2025 — Present',
    bullets: [
      'Maintain Engineering Masters and configuration control in Infor VISUAL ERP across active aerospace programs.',
      'Develop inspection plans and quality documentation to support AS9102 First Article Inspection on flight-critical hardware.',
      'Perform independent over-check inspections on Gulfstream assemblies; identify dimensional / documentation issues before release.',
      'Lead Quality Clinic operations: non-conforming hardware disposition and workflow redesign across engineering, quality, production.',
      'Selected as Lead Intern; onboard incoming interns and coordinate ERP / quality / production support for new hires.',
      'Exposure to multi-spindle CNC machining of titanium and Inconel at production scale.',
    ],
  },
  {
    role: 'President',
    org: 'Society of American Military Engineers (SAME) · UW Tacoma',
    location: 'Tacoma, WA',
    dates: 'Oct 2024 — Present',
    bullets: [
      'Grew membership +30% via hands-on technical programming and targeted outreach.',
      'Manage $10K+ budget across workshops, competitions, and networking events.',
      'Built partnerships with 5+ industry teams to open internship pipelines for students.',
    ],
  },
  {
    role: 'Onsite Medical Representative',
    org: 'Amazon',
    location: 'Kent, WA',
    dates: 'May 2023 — Jan 2024',
    bullets: [
      'Excel-based injury tracking using ergonomic engineering principles cut data errors 20%.',
      'Optimized emergency response pathways with safety + engineering; cut response times 25%.',
      'Wellness programs reduced absenteeism 20% and increased engagement 15%.',
    ],
  },
  {
    role: 'Hospital Corpsman',
    org: 'U.S. Navy',
    location: '',
    dates: 'Aug 2018 — May 2023',
    bullets: [
      'Optimized a $102K medical supply system; 20% downtime reduction via workflow redesign.',
      'Authored SOPs that reduced documentation errors 30% through systems analysis.',
      'Raised training compliance to 92% across 57 personnel.',
      'Armed Forces Service Medal recipient.',
    ],
  },
]

const projects = [
  { id: 'multitool',     title: 'Multi-Tool Fabrication',                dates: 'Mar – Jun 2026',
    body: 'Fabricated a folding multi-tool from raw aluminum on manual mill + CNC. Held ±0.005 in precision, 0.003 in parallelism, 0.002 in flatness against a GD&T drawing package. Verified every feature with calipers, gauges, and dial indicators.' },
  { id: 'gearbox',       title: 'Three-Stage Reduction Gearbox',         dates: 'Mar – Apr 2026',
    body: 'Small-team design of a three-stage spur-gear reduction for a 1-DOF robotic elbow. 4000 → 50 RPM (80:1), full AGMA 2001-D04 bending-stress analysis, mixed 4140 steel + 6061-T6 aluminum stack. Design-review approved.' },
  { id: 'turret',        title: '2-Axis Autonomous Turret',              dates: '2024',
    body: 'SolidWorks multi-part assembly + FDM prints + NodeMCU / Arduino embedded C++. 0.8° angular repeatability (σ) over 100 cycles at ±45° per axis. Foundation for future sensor fusion.' },
  { id: 'vibration',     title: 'Vibration Analysis of Phase-Change Materials', dates: '2024',
    body: 'Novel epoxy + PCM + graphite composite with a custom monolithic test rig, driven through three iteration cycles. ~10× damping factor increase when thermally triggered; near-critical damping validated.' },
  { id: 'coastal',       title: 'Saipan Coastal Wave Dynamics',          dates: '2024',
    body: 'First lab-scale pipeline quantifying wave–coast interactions for Saipan. Novel Visual Field Architecture background improved PIV particle correlation ~40%. Documented 37% wave-energy reduction and 42% vorticity reduction with the seawall in place.' },
  { id: 'beth',          title: 'BET-H · Biological Elastin Thermoregulation', dates: '2024',
    body: 'Speculative framework: passive thermal regulation inspired by elastin\'s entropy-driven behavior. Materials, formulations, and validation data intentionally reserved.' },
  { id: 'micromobility', title: 'Equitable Micromobility Study (Co-Author)', dates: '2024',
    body: 'Co-authored peer-reviewed study translating equity policy from 250+ U.S. programs into 4,000+ analytical codes and a concrete engineering constraint set.' },
]

const skills = [
  { label: 'Aerospace + Quality', items: ['AS9102 First Article Inspection', 'GD&T', 'Metrology (calipers, pin gauges, dial indicators)', 'Infor VISUAL ERP', 'Quality Systems', 'Inspection Planning'] },
  { label: 'Design + Analysis',   items: ['SolidWorks', 'Onshape', 'AGMA 2001-D04', 'Tolerance Stack-Up', 'DFM'] },
  { label: 'Manufacturing',       items: ['Manual Mill', 'CNC Machining', 'FDM printing', 'Multi-spindle CNC exposure (Ti / Inconel)'] },
  { label: 'Software + Data',     items: ['MATLAB', 'Python', 'Excel dashboards', 'PIVLab'] },
  { label: 'Embedded + Analog',   items: ['Arduino / NodeMCU', 'Embedded C++', 'LTspice'] },
]

const education = [
  { degree: 'B.S. Mechanical Engineering', school: 'University of Washington Tacoma', dates: 'Sep 2021 — Jun 2027',
    detail: 'Focus: thermal systems, fluid mechanics, mechatronics, design-for-manufacturability.' },
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
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
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
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Alex Brown</h1>
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500 font-mono">
              Mechanical Engineer · Aerospace-Focused
            </div>
          </div>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[13px] text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> {CONTACT.email}
            </span>
            <span className="inline-flex items-center gap-1">
              <Linkedin className="w-3.5 h-3.5" /> {CONTACT.linkedin}
            </span>
            <span>{CONTACT.site}</span>
            <span>{CONTACT.location}</span>
          </div>
        </header>

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

        {/* Projects */}
        <section className="mb-5">
          <h2 className="text-[10.5px] font-mono uppercase tracking-[0.24em] text-slate-500 mb-2">Projects</h2>
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="break-inside-avoid">
                <div className="flex items-baseline justify-between flex-wrap gap-x-3">
                  <div className="text-[13.5px] font-semibold text-slate-900">
                    {p.title}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 whitespace-nowrap">{p.dates}</div>
                </div>
                <p className="text-[13px] leading-snug text-slate-700 mt-0.5">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mb-5">
          <h2 className="text-[10.5px] font-mono uppercase tracking-[0.24em] text-slate-500 mb-2">Skills</h2>
          <div className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
            {skills.map((s) => (
              <div key={s.label} className="text-[13px] leading-snug">
                <span className="font-semibold text-slate-900">{s.label}: </span>
                <span className="text-slate-700">{s.items.join(' · ')}</span>
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
              <div className="text-[13px] text-slate-700">{e.detail}</div>
            </div>
          ))}
        </section>

        <footer className="mt-6 pt-3 border-t border-slate-200 text-[11px] text-slate-500 print:hidden">
          Generated from {CONTACT.site} · U.S. citizen, clearance-eligible · Available Summer 2027
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
