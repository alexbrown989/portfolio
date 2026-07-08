// src/pages/NotFound.jsx
// Real 404. Signals system-integrity rather than "page not found" —
// treated as a status code with a clear next-action.

import { Link, useLocation } from 'react-router-dom'
import { AlertTriangle, ArrowRight, Home } from 'lucide-react'
import ProjectLayout from './ProjectLayout'
import { Container, Kicker, CornerBrackets } from '../shared/ui'

const suggestions = [
  { to: '/',                        label: 'Home' },
  { to: '/about',                   label: 'About' },
  { to: '/#internship',             label: 'Verus Aerospace internship' },
  { to: '/projects/multitool',      label: 'Multi-Tool Fabrication' },
  { to: '/projects/gearbox',        label: 'Robotic Elbow Gearbox' },
  { to: '/projects/turret',         label: '2-Axis Autonomous Turret' },
]

export default function NotFound() {
  const { pathname } = useLocation()
  return (
    <ProjectLayout>
      <section className="min-h-[80vh] flex items-center">
        <Container>
          <div className="max-w-3xl">
            <Kicker code="ERR 404">Route not registered</Kicker>

            <h1 className="mt-4 text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none">
              404
            </h1>

            <div className="mt-6">
              <CornerBrackets className="rounded-2xl border border-line bg-surface-2/60 backdrop-blur-sm p-5 md:p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-white font-semibold">The route you requested does not exist on this site.</div>
                    <div className="mt-1 text-sm text-gray-400 font-mono">
                      Requested path: <span className="text-brand-300">{pathname}</span>
                    </div>
                    <p className="mt-3 text-sm text-gray-300 leading-relaxed">
                      This is not a broken link on the portfolio; the URL was mistyped, moved,
                      or came from an outdated share. Below are known-good routes.
                    </p>
                  </div>
                </div>
              </CornerBrackets>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/"
                className="glow-btn inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-brand-500 text-white font-semibold hover:bg-brand-400 transition-colors"
              >
                <Home className="w-4 h-4" /> Return home <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-10">
              <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 mb-3">
                Suggested destinations
              </div>
              <ul className="grid sm:grid-cols-2 gap-2">
                {suggestions.map((s) => (
                  <li key={s.to}>
                    <Link
                      to={s.to}
                      className="group inline-flex items-center gap-2 text-sm text-gray-200 hover:text-white transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
                      {s.label}
                      <ArrowRight className="w-3.5 h-3.5 text-brand-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
    </ProjectLayout>
  )
}
