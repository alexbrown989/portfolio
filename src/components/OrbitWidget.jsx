// src/components/OrbitWidget.jsx
//
// Aerospace-flavored orbital-mechanics widget for the header.
// A compact glyph shows Earth + two satellites drifting through their
// orbits; clicking opens a detailed panel with three real objects
// (ISS · LEO, GPS · MEO, geostationary at GEO), each propagated with
// a proper Kepler solver (M -> E -> ν -> position vector).
//
// Nothing here calls the network. Orbital elements are static-known
// approximations; time comes from Date.now(). Numbers are for
// character, not mission planning.

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Orbit, X } from 'lucide-react'

/* ---------------- Kepler math ---------------- */

// Solve E - e*sin(E) = M for E (eccentric anomaly), Newton's method.
function solveKepler(M, e, tol = 1e-9, maxIter = 30) {
  // Wrap M into [-pi, pi] for convergence
  let m = ((M + Math.PI) % (2 * Math.PI)) - Math.PI
  if (m < -Math.PI) m += 2 * Math.PI
  let E = e < 0.8 ? m : Math.PI
  for (let i = 0; i < maxIter; i++) {
    const f  = E - e * Math.sin(E) - m
    const fp = 1 - e * Math.cos(E)
    const dE = f / fp
    E -= dE
    if (Math.abs(dE) < tol) break
  }
  return E
}

// Given orbital elements + t (seconds since epoch), return the position
// in the orbital plane (x, y) relative to the primary at the focus.
// a is semi-major axis; scale is a display multiplier so we can render
// each orbit inside a shared SVG viewport.
function propagate({ a, e, periodS, omega, epochM }, tS) {
  const n = (2 * Math.PI) / periodS    // mean motion, rad/s
  const M = epochM + n * tS            // mean anomaly
  const E = solveKepler(M, e)
  // True anomaly
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2),
  )
  // Distance from focus
  const r = a * (1 - e * Math.cos(E))
  // Position in perifocal frame, then rotate by argument of periapsis omega
  const xp = r * Math.cos(nu)
  const yp = r * Math.sin(nu)
  const cosO = Math.cos(omega), sinO = Math.sin(omega)
  return {
    x:  xp * cosO - yp * sinO,
    y:  xp * sinO + yp * cosO,
    r,
    nu, E, M,
  }
}

/* ---------------- Orbit catalog ---------------- */
//
// Three orbits, sized to sit legibly inside a single 260-diameter viewport.
// `displayA` is the visual semi-major axis in SVG pixels; `e` is a real
// eccentricity approximation for each object; `periodS` is the real
// orbital period. Motion on the visual matches the real relative speed.

const EARTH_R = 26   // px in the SVG
const ORBITS = [
  {
    id: 'ISS',
    name: 'ISS',
    label: 'Low Earth Orbit',
    displayA: 42,     // px
    e: 0.0003,        // near-circular
    periodS: 92.7 * 60,  // ~92.7 min
    omega: 0.0,
    epochM: 0.0,
    color: '#22bfe0',
    altitudeKm: 420,
    inclDeg: 51.6,
  },
  {
    id: 'GPS',
    name: 'GPS BIIF',
    label: 'Medium Earth Orbit',
    displayA: 78,
    e: 0.007,
    periodS: 11 * 3600 + 58 * 60,   // ~11h 58m sidereal
    omega: 0.6,
    epochM: 1.2,
    color: '#a78bfa',
    altitudeKm: 20200,
    inclDeg: 55.0,
  },
  {
    id: 'GEO',
    name: 'GEO comsat',
    label: 'Geostationary',
    displayA: 112,
    e: 0.0002,
    periodS: 86164,   // sidereal day
    omega: 3.14,
    epochM: 2.3,
    color: '#22c55e',
    altitudeKm: 35786,
    inclDeg: 0.0,
  },
]

/* ---------------- Small orbit indicator (nav button) ---------------- */

function MiniGlyph() {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState(0)
  const raf = useRef(0)
  const t0 = useRef(0)

  useEffect(() => {
    if (reduce) return
    const step = (now) => {
      if (!t0.current) t0.current = now
      setPhase((now - t0.current) / 1000)
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [reduce])

  const s1 = { cx: 10 + Math.cos(phase * 2.4) * 7, cy: 10 + Math.sin(phase * 2.4) * 5 }
  const s2 = { cx: 10 + Math.cos(phase * 0.9 + 1) * 9, cy: 10 + Math.sin(phase * 0.9 + 1) * 6 }
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4">
      <ellipse cx="10" cy="10" rx="7" ry="5" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="0.5" />
      <ellipse cx="10" cy="10" rx="9" ry="6" fill="none" stroke="rgba(148,163,184,0.4)" strokeWidth="0.5" />
      <circle cx="10" cy="10" r="2.4" fill="#22bfe0" opacity="0.85" />
      <circle cx={s1.cx} cy={s1.cy} r="1" fill="#22bfe0" />
      <circle cx={s2.cx} cy={s2.cy} r="1" fill="#a78bfa" />
    </svg>
  )
}

/* ---------------- Full detail panel ---------------- */

function OrbitPanel({ onClose }) {
  const svgRef = useRef(null)
  const [now, setNow] = useState(Date.now() / 1000)
  const reduce = useReducedMotion()
  const raf = useRef(0)

  useEffect(() => {
    if (reduce) { setNow(Date.now() / 1000); return }
    const step = () => {
      setNow(Date.now() / 1000)
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [reduce])

  // Speed up the visualization so it's actually moving on screen
  // (real ISS crosses ~5 deg/s, so with a period of ~93 min the true
  // anomaly barely moves in real time). We keep proper relative rates.
  const timeScale = 100
  const tS = now * timeScale

  const cx = 160, cy = 160

  return (
    <motion.aside
      role="dialog"
      aria-label="Orbital determinism widget"
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed z-50 top-16 right-3 md:right-6 w-[min(96vw,420px)] rounded-2xl border border-line bg-surface-1/95 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 grid place-items-center">
            <Orbit className="w-4 h-4 text-brand-300" />
          </div>
          <div>
            <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/90">
              Orbital determinism
            </div>
            <div className="text-white font-semibold text-sm leading-tight">
              Live · 3 reference orbits
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.04]"
          aria-label="Close panel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4">
        <svg ref={svgRef} viewBox="0 0 320 320" className="w-full rounded-lg border border-line bg-black/50">
          <defs>
            <radialGradient id="orb-earth">
              <stop offset="0%"   stopColor="#0ea5e9" />
              <stop offset="65%"  stopColor="#1e40af" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <radialGradient id="orb-shine" cx="35%" cy="35%">
              <stop offset="0%"  stopColor="rgba(255,255,255,0.35)" />
              <stop offset="60%" stopColor="rgba(255,255,255,0)" />
            </radialGradient>
          </defs>

          {/* Star-field dots (deterministic) */}
          {Array.from({ length: 40 }, (_, i) => {
            const x = ((i * 41) % 320)
            const y = ((i * 97) % 320)
            const r = (i % 5 === 0) ? 0.9 : 0.5
            return <circle key={i} cx={x} cy={y} r={r} fill="rgba(226,232,240,0.35)" />
          })}

          {/* Orbits — draw the ellipse rotated by omega */}
          {ORBITS.map(o => {
            const b = o.displayA * Math.sqrt(1 - o.e * o.e)
            return (
              <g key={`ring-${o.id}`} transform={`translate(${cx} ${cy}) rotate(${(o.omega * 180) / Math.PI})`}>
                <ellipse
                  cx={o.displayA * o.e * -1}
                  cy={0}
                  rx={o.displayA}
                  ry={b}
                  fill="none"
                  stroke={o.color}
                  strokeOpacity="0.35"
                  strokeWidth="0.8"
                  strokeDasharray="2 3"
                />
              </g>
            )
          })}

          {/* Earth */}
          <circle cx={cx} cy={cy} r={EARTH_R} fill="url(#orb-earth)" />
          <circle cx={cx} cy={cy} r={EARTH_R} fill="url(#orb-shine)" />
          <circle cx={cx} cy={cy} r={EARTH_R} fill="none" stroke="rgba(56,189,248,0.6)" strokeWidth="0.6" />

          {/* Satellites — propagate every frame */}
          {ORBITS.map(o => {
            const p = propagate(o, tS)
            const px = cx + p.x
            const py = cy + p.y
            return (
              <g key={`sat-${o.id}`}>
                {/* Trailing tick */}
                <circle cx={px} cy={py} r="4.6" fill={o.color} opacity="0.18" />
                <circle cx={px} cy={py} r="2.6" fill={o.color} />
                <text
                  x={px + 6} y={py + 3}
                  fontFamily="ui-monospace, JetBrains Mono, monospace"
                  fontSize="8"
                  fill={o.color}
                  style={{ letterSpacing: '0.16em', textTransform: 'uppercase' }}
                >
                  {o.id}
                </text>
              </g>
            )
          })}
        </svg>

        {/* Orbital elements table */}
        <div className="mt-4 rounded-lg border border-line overflow-hidden">
          <table className="w-full text-[12px]">
            <thead className="bg-surface-3/60 text-left">
              <tr className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-400">
                <th className="px-3 py-2">Object</th>
                <th className="px-3 py-2">Regime</th>
                <th className="px-3 py-2">Alt (km)</th>
                <th className="px-3 py-2">Period</th>
                <th className="px-3 py-2">Incl</th>
                <th className="px-3 py-2">e</th>
              </tr>
            </thead>
            <tbody>
              {ORBITS.map((o, i) => (
                <tr key={o.id} className={i % 2 ? 'bg-surface-2/40' : ''}>
                  <td className="px-3 py-1.5 text-white font-semibold" style={{ color: o.color }}>{o.name}</td>
                  <td className="px-3 py-1.5 text-gray-300">{o.label}</td>
                  <td className="px-3 py-1.5 text-gray-300 tabular-nums">{o.altitudeKm.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-gray-300 tabular-nums">
                    {(o.periodS / 3600).toFixed(2)} h
                  </td>
                  <td className="px-3 py-1.5 text-gray-300 tabular-nums">{o.inclDeg.toFixed(1)}°</td>
                  <td className="px-3 py-1.5 text-gray-300 tabular-nums">{o.e.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 leading-relaxed">
          Kepler solver · Newton–Raphson on M = E − e·sin(E) · positions computed each frame
        </div>
      </div>
    </motion.aside>
  )
}

/* ---------------- Public component ---------------- */

export default function OrbitWidget() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close orbital widget' : 'Open orbital widget'}
        title="Orbital determinism"
        className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors ${
          open
            ? 'border-brand-500/40 bg-brand-500/[0.08]'
            : 'border-line hover:border-brand-500/40 hover:bg-white/[0.03]'
        }`}
      >
        <MiniGlyph />
      </button>

      <AnimatePresence>
        {open && <OrbitPanel onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  )
}
