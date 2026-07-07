// src/components/Footer.jsx
import { site } from '../content/siteConfig'
import { ArrowUp } from 'lucide-react'

const CONTACT = {
  email: 'alexbrow@uw.edu',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alexanderchasebrown/' },
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()
  const brandName = site?.brand?.name ?? 'Alex Brown'
  const initials  = site?.brand?.logoInitials ?? 'AB'
  const tagline   = site?.brand?.tagline
  const nav       = Array.isArray(site?.nav) ? site.nav : []

  return (
    <footer className="mt-16 relative">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-line to-transparent" />

      <div className="bg-surface-1/60 backdrop-blur-md border-t border-line">
        <div className="container mx-auto px-6 max-w-6xl py-10">
          <div className="grid gap-8 md:grid-cols-3">
            {/* Brand */}
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-2 border border-brand-500/30 grid place-items-center">
                <span className="text-brand-300 font-mono font-bold text-sm">{initials}</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{brandName}</div>
                {tagline && <div className="text-xs text-gray-400 mt-0.5">{tagline}</div>}
                <div className="text-xs text-gray-500 mt-3">© {year} · All systems nominal.</div>
              </div>
            </div>

            {/* Nav */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-500 mb-3">
                Navigate
              </div>
              <div className="flex flex-col gap-1.5">
                {nav.map((n) => (
                  <a
                    key={n.href}
                    href={n.href}
                    className="text-sm text-gray-300 hover:text-brand-300 transition-colors w-fit"
                    onClick={(e) => {
                      if (n.href.startsWith('#')) {
                        e.preventDefault()
                        document.querySelector(n.href)?.scrollIntoView({ behavior: 'smooth' })
                      }
                    }}
                  >
                    {n.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Contact */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-500 mb-3">
                Get in touch
              </div>
              <div className="flex flex-col gap-1.5">
                <a href={`mailto:${CONTACT.email}`} className="text-sm text-gray-300 hover:text-brand-300 transition-colors w-fit">
                  {CONTACT.email}
                </a>
                {CONTACT.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-300 hover:text-brand-300 transition-colors w-fit"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-gray-600">
              Built with intent — no vibe, all engineering.
            </span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-line text-gray-300 hover:text-white hover:border-brand-400/60 transition-colors text-xs"
              aria-label="Back to top"
            >
              Back to top
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
