// src/components/Contact.jsx
import { motion } from 'framer-motion'

/**
 * Minimal, internship-focused contact section.
 * - No siteConfig dependency
 * - No form fields or "why me" copy
 * - Buttons: Email, LinkedIn, (optional) Résumé
 *
 * Optional props:
 *   <Contact email="you@school.edu"
 *            linkedinUrl="https://..."
 *            resumeUrl="/resume.pdf"
 *            badge="Open to Summer/Fall internships" />
 */
const DEFAULTS = {
  email: 'alexbrow@uw.edu',
  linkedinUrl: 'https://www.linkedin.com/in/alexanderchasebrown/',
  resumeUrl: 'resume.pdf', // put a file in /public if you want this button visible
  badge: 'Now interviewing for internships',
}

export default function Contact({
  email,
  linkedinUrl,
  resumeUrl,
  badge,
}) {
  const EMAIL = email ?? DEFAULTS.email
  const LINKEDIN = linkedinUrl ?? DEFAULTS.linkedinUrl
  const RESUME = resumeUrl ?? DEFAULTS.resumeUrl
  const BADGE = badge ?? DEFAULTS.badge

  return (
    <section aria-labelledby="contact-title">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-400/40 text-emerald-300 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          {BADGE}
        </div>

        {/* Heading + subcopy (tight, non-cringe) */}
        <h2 id="contact-title" className="mt-4 text-4xl md:text-5xl font-bold">
          Let’s connect
        </h2>
        <p className="mt-3 text-gray-400">
          Open to roles across mechanical, systems, R&amp;D, and emerging tech.
        </p>

        {/* Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <motion.a
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={`mailto:${EMAIL}`}
            className="px-5 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold"
          >
            Email
          </motion.a>

          <motion.a
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.98 }}
            href={LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-lg bg-[#0A66C2] text-white font-semibold hover:brightness-110"
          >
            LinkedIn
          </motion.a>

          {RESUME && (
            <motion.a
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              href={RESUME}
              target="_blank"
              className="px-5 py-3 rounded-lg border border-white/15 text-gray-200 hover:border-cyan-400/50 hover:text-white"
            >
              Resume (PDF)
            </motion.a>
          )}
        </div>
      </div>
    </section>
  )
}
