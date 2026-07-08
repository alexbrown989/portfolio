// src/components/Contact.jsx
import { Mail, Linkedin, FileDown, Circle } from 'lucide-react'
import { SectionTitle } from '../shared/ui'

const DEFAULTS = {
  email: 'alexbrow@uw.edu',
  linkedinUrl: 'https://www.linkedin.com/in/alexanderchasebrown/',
  resumeUrl: '/resume.pdf',
  badge: 'Now interviewing for Summer 2026 internships',
}

export default function Contact({
  email = DEFAULTS.email,
  linkedinUrl = DEFAULTS.linkedinUrl,
  resumeUrl = DEFAULTS.resumeUrl,
  badge = DEFAULTS.badge,
}) {
  return (
    <section aria-labelledby="contact-title">
      <div className="max-w-3xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/40 bg-emerald-500/[0.06] text-emerald-300 text-[11px] font-mono uppercase tracking-[0.18em]">
          <Circle className="w-2 h-2 fill-emerald-400 stroke-none" />
          {badge}
        </div>

        <h2 id="contact-title" className="mt-5 text-3xl md:text-4xl font-bold text-white tracking-tight">
          Let’s connect
        </h2>
        <p className="mt-3 text-gray-400 max-w-xl mx-auto text-[15px] leading-relaxed">
          Open to internships across mechanical, systems, R&amp;D, and emerging tech.
          The fastest way to reach me is email — I typically reply within a day.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${email}`}
            className="glow-btn inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {email}
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line-strong text-gray-100 hover:border-brand-400/60 hover:text-white transition-colors"
          >
            <Linkedin className="w-4 h-4 text-brand-300" />
            LinkedIn
          </a>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line text-gray-300 hover:text-white hover:border-brand-400/60 transition-colors"
            >
              <FileDown className="w-4 h-4" />
              Resume (PDF)
            </a>
          )}
        </div>
      </div>
    </section>
  )
}

// Also export a titled variant if Contact needs its own SectionTitle header
// (kept in the same file to keep imports simple).
export function ContactSection() {
  return (
    <div>
      <SectionTitle kicker="// Contact" title="Let’s connect" />
      <Contact />
    </div>
  )
}
