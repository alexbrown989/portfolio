// src/components/Contact.jsx
import { useState } from 'react'
import { Mail, Linkedin, Circle, Copy, Check, Printer } from 'lucide-react'
import { SectionTitle } from '../shared/ui'
import ResumeLink from './ResumeLink'

const DEFAULTS = {
  email: 'alexbrow@uw.edu',
  linkedinUrl: 'https://www.linkedin.com/in/alexanderchasebrown/',
  badge: 'Available Summer 2027 · Seeking full-time engineering roles',
}

export default function Contact({
  email = DEFAULTS.email,
  linkedinUrl = DEFAULTS.linkedinUrl,
  badge = DEFAULTS.badge,
}) {
  const [copied, setCopied] = useState(false)

  const copyEmail = async (e) => {
    e.preventDefault()
    try {
      await navigator.clipboard?.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* ignore — fall through to mailto: */
      window.location.href = `mailto:${email}`
    }
  }

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
          Open to full-time roles across aerospace, mechanical, manufacturing, R&amp;D, and defense-adjacent
          engineering. Fastest way to reach me is email; I typically reply within a day.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {/* Email — mailto on click, secondary copy button */}
          <a
            href={`mailto:${email}`}
            className="glow-btn inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors"
          >
            <Mail className="w-4 h-4" />
            {email}
          </a>
          <button
            type="button"
            onClick={copyEmail}
            className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-line-strong text-gray-100 hover:border-brand-400/60 hover:text-white transition-colors"
            aria-live="polite"
          >
            {copied
              ? <><Check className="w-4 h-4 text-emerald-300" /> Copied</>
              : <><Copy  className="w-4 h-4" /> Copy email</>
            }
          </button>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line-strong text-gray-100 hover:border-brand-400/60 hover:text-white transition-colors"
          >
            <Linkedin className="w-4 h-4 text-brand-300" />
            LinkedIn
          </a>

          {/* Resume — PDF (with decrypt animation) + print-friendly HTML */}
          <ResumeLink />
          <ResumeLink format="html" showIcon={false}>
            <Printer className="w-4 h-4" />
            <span>Print view</span>
          </ResumeLink>
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
      <SectionTitle kicker="Contact" title="Let’s connect" />
      <Contact />
    </div>
  )
}
