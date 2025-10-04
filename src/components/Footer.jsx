// src/components/Footer.jsx
import { site } from '../content/siteConfig'
import { motion } from 'framer-motion'

// Local contact info (since site.contact was removed)
const CONTACT = {
  email: 'alexbrow@uw.edu',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/alexanderchasebrown/' },
    // { label: 'GitHub', href: 'https://github.com/<your-handle>' },
    // { label: 'Resume', href: '/resume.pdf' }, // if you want a resume link here
  ],
}

export default function Footer() {
  const year = new Date().getFullYear()
  const brandName = site?.brand?.name ?? 'Alex Brown'
  const logoEmoji = site?.brand?.logoEmoji ?? '⚙'
  const tagline   = site?.brand?.tagline
  const nav       = Array.isArray(site?.nav) ? site.nav : []

  const smooth = (hash) => {
    if (!hash?.startsWith('#')) return
    const el = document.querySelector(hash)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="mt-20">
      {/* subtle separator */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="bg-gray-900/50 backdrop-blur border-t border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 grid place-items-center">
                <span className="text-white text-xl">{logoEmoji}</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{brandName}</div>
                {tagline && <div className="text-xs text-gray-400">{tagline}</div>}
                <div className="text-xs text-gray-500 mt-1">© {year} • All systems nominal.</div>
              </div>
            </div>

            {/* Quick nav */}
            <nav className="flex flex-wrap gap-4">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  onClick={(e) => {
                    if (n.href.startsWith('#')) {
                      e.preventDefault()
                      smooth(n.href)
                    }
                  }}
                  className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {n.label}
                </a>
              ))}
            </nav>

            {/* Socials / email */}
            <div className="flex flex-wrap items-center gap-4">
              {CONTACT.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {s.label}
                </a>
              ))}
              {CONTACT.email && (
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-sm text-gray-400 hover:text-cyan-400 transition-colors"
                >
                  {CONTACT.email}
                </a>
              )}
            </div>
          </div>

          {/* Back to top */}
          <div className="mt-6 flex justify-end">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-cyan-400/40 text-cyan-300 hover:text-white hover:border-cyan-400/70 hover:bg-white/5 transition"
              aria-label="Back to top"
            >
              <span className="text-sm">Back to top</span>
              <motion.span
                initial={false}
                animate={{ y: [2, -2, 2] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              >
                ↑
              </motion.span>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
