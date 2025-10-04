// src/components/Manifesto.jsx
import { motion } from 'framer-motion'

const teaser = [
  // High-impact opener (no em dashes)
  "I build mission-critical systems shaped by 5 years in the U.S. Navy and a deep focus on hands-on engineering R&D. I translate complex theory into functional hardware that performs under pressure.",

  // Bullets (concise, assertive, no AI)
  "Operational Impact: Managed $102K military supply systems and led teams to 92% operational compliance.",
  "Advanced R&D: Improved fluid measurement accuracy by 40% through PIV workflow redesign.",
  "Hands-On Prototyping: Built 5+ complex systems, including autonomous robotics, zero-energy thermal regulation, and vibration analysis rigs.",
  "Proven Leadership: Grew engineering society membership by 30% as President of SAME.",

  // Internship year updated
  "Seeking a high-impact mechanical engineering internship for Summer 2026.",
]

export default function Manifesto() {
  return (
    <section id="manifesto" className="py-20">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-xs font-mono text-cyan-300 uppercase tracking-[0.25em] mb-2">// About</div>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Mission-Critical Builder
          </h2>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 md:p-8 overflow-hidden"
        >
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-100 leading-relaxed text-[17px]">{teaser[0]}</p>

            <ul className="mt-4 space-y-2">
              {teaser.slice(1, -1).map((t, i) => (
                <li key={i} className="text-sm text-gray-200 flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[6px] inline-block w-2 h-2 rounded-full bg-cyan-400/90 shadow-[0_0_12px_rgba(34,211,238,.6)]"
                  />
                  <span>{t}</span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-cyan-300 font-medium">
              {teaser[teaser.length - 1]}
            </p>
          </div>

          {/* CTA */}
          <div className="mt-6 flex justify-center">
            <a
              href="/about"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white
                         bg-gradient-to-r from-cyan-500 to-blue-600
                         shadow-[0_10px_30px_rgba(56,189,248,.30)]
                         hover:shadow-[0_18px_50px_rgba(56,189,248,.40)]
                         hover:translate-y-[-1px] active:translate-y-0 transition-all"
            >
              Read Full Profile
              <span className="text-sm opacity-90 group-hover:translate-x-0.5 transition-transform">→</span>
            </a>
          </div>

          {/* Subtle perimeter glow */}
          <div className="pointer-events-none absolute -inset-1 rounded-2xl blur-3xl bg-gradient-to-r from-cyan-400/15 to-purple-500/15" />
        </motion.div>
      </div>
    </section>
  )
}
