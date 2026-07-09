// src/components/Orbit3DPanel.jsx
//
// Lazy-loaded 3D orbital-mechanics panel. Uses Three.js via
// @react-three/fiber + drei's OrbitControls so the user can drag to
// rotate the whole scene and see satellites from any angle.
//
// - Earth is a sphere with a procedurally-generated equirectangular
//   texture (blue oceans + green continent blobs at approximate real
//   positions). Small enough to generate at mount time; no external
//   image download.
// - Three satellites (ISS · GPS · GEO) orbit in real Kepler paths.
//   Each satellite's mesh position is updated every frame; the trailing
//   orbit ring is a static circle rotated to the correct inclination.
// - drei OrbitControls handles user drag / pinch / wheel. Auto-rotate is
//   off by default so the user's manipulation feels deterministic.

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Line } from '@react-three/drei'
import * as THREE from 'three'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

/* ---------------- Kepler solver (shared) ---------------- */

function solveKepler(M, e, tol = 1e-8, maxIter = 25) {
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

// Compute satellite position in the ECI-ish frame given orbital elements
// and time. Returns a THREE.Vector3.
function orbitalPosition({ aScene, e, periodS, incRad, raanRad, argpRad, epochM }, tS, out) {
  const n = (2 * Math.PI) / periodS
  const M = epochM + n * tS
  const E = solveKepler(M, e)
  const nu = 2 * Math.atan2(
    Math.sqrt(1 + e) * Math.sin(E / 2),
    Math.sqrt(1 - e) * Math.cos(E / 2),
  )
  const r = aScene * (1 - e * Math.cos(E))
  // Position in perifocal frame
  const px = r * Math.cos(nu)
  const py = r * Math.sin(nu)
  // Rotate: (argp) around z, (inc) around x, (raan) around z
  const cA = Math.cos(argpRad), sA = Math.sin(argpRad)
  const cI = Math.cos(incRad),  sI = Math.sin(incRad)
  const cR = Math.cos(raanRad), sR = Math.sin(raanRad)
  // R = Rz(raan) · Rx(inc) · Rz(argp)
  const x1 = px * cA - py * sA
  const y1 = px * sA + py * cA
  const z1 = 0
  const x2 = x1
  const y2 = y1 * cI - z1 * sI
  const z2 = y1 * sI + z1 * cI
  const x  = x2 * cR - y2 * sR
  const y  = x2 * sR + y2 * cR
  const z  = z2
  return out.set(x, z, y)   // three uses Y-up: swap y and z so orbits look nicer
}

/* ---------------- Orbit catalog (scene-space units) ----------------
   `aScene` is the semi-major axis in Three.js units. Earth radius = 1.
   Real relative altitudes are preserved (LEO ≈ 1.07 R_earth, MEO ≈ 4.16,
   GEO ≈ 6.6), scaled down 60% for visual budget. */
const EARTH_R = 1.0
const ORBITS = [
  {
    id: 'ISS', name: 'ISS', label: 'Low Earth Orbit',
    aScene: 1.55, e: 0.0003, periodS: 92.7 * 60,
    incRad: 51.6 * Math.PI / 180, raanRad: 0.4, argpRad: 0.0, epochM: 0.0,
    color: '#22bfe0', altitudeKm: 420, inclDeg: 51.6,
  },
  {
    id: 'GPS', name: 'GPS BIIF', label: 'Medium Earth Orbit',
    aScene: 2.6, e: 0.007, periodS: 11 * 3600 + 58 * 60,
    incRad: 55.0 * Math.PI / 180, raanRad: 2.1, argpRad: 0.6, epochM: 1.2,
    color: '#a78bfa', altitudeKm: 20200, inclDeg: 55.0,
  },
  {
    id: 'GEO', name: 'GEO comsat', label: 'Geostationary',
    aScene: 3.8, e: 0.0002, periodS: 86164,
    incRad: 0.0, raanRad: 0.0, argpRad: 3.14, epochM: 2.3,
    color: '#22c55e', altitudeKm: 35786, inclDeg: 0.0,
  },
]

// Speed up wall-clock time so relative motion is visible. Real ISS true
// anomaly moves ~1 deg / 15 s; we'd never see it move at real speed.
const TIME_SCALE = 240

/* ---------------- Earth texture (procedural) ---------------- */

function makeEarthTexture() {
  const w = 1024, h = 512
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')

  // Ocean base
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#0b3a63')
  g.addColorStop(0.5, '#0c4a6e')
  g.addColorStop(1, '#052a44')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  // Very simple continent silhouettes. Coordinates in equirectangular
  // (x = longitude 0..w = -180..+180, y = latitude 0..h = +90..-90).
  // Positions are eyeballed; the goal is "recognizably Earth" without
  // shipping a texture image.
  const land = (path, fill = '#245c3a') => {
    ctx.fillStyle = fill
    ctx.beginPath()
    for (let i = 0; i < path.length; i++) {
      const [lon, lat] = path[i]
      const x = ((lon + 180) / 360) * w
      const y = ((90  - lat) / 180) * h
      if (i === 0) ctx.moveTo(x, y)
      else         ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()
  }

  // North America
  land([
    [-140, 65], [-125, 68], [-95, 63], [-70, 55], [-58, 50],
    [-65, 40],  [-80, 30],  [-98, 22], [-110, 25], [-120, 34],
    [-130, 50], [-145, 60],
  ])
  // South America
  land([
    [-80, 10], [-70, 8], [-55, 5], [-40, -5], [-38, -20],
    [-58, -35], [-70, -50], [-73, -30], [-78, -12],
  ])
  // Europe + North Africa
  land([
    [-10, 40], [5, 45], [20, 55], [30, 60], [45, 55],
    [55, 45], [50, 35], [40, 30], [25, 15], [10, 20], [-10, 32],
  ])
  // Sub-Saharan Africa
  land([
    [10, 15], [25, 5], [40, 5], [45, -5], [42, -20],
    [30, -32], [20, -30], [12, -15], [8, 0],
  ])
  // Asia (broad)
  land([
    [30, 60], [50, 70], [80, 72], [130, 70], [155, 65],
    [140, 50], [125, 40], [115, 30], [95, 20], [78, 8],
    [65, 25], [50, 40], [40, 55],
  ])
  // Southeast Asia + Australia
  land([
    [100, 15], [110, 5], [130, 0], [145, -12],
    [150, -25], [138, -38], [120, -32], [115, -20], [105, -8],
  ])
  // Antarctica (belt)
  ctx.fillStyle = '#a8b7d0'
  ctx.fillRect(0, h - 22, w, 22)
  // Greenland
  land([[-45, 82], [-25, 80], [-15, 72], [-42, 68], [-52, 76]])

  // Soft cloud smear
  ctx.globalAlpha = 0.14
  ctx.fillStyle = '#eef2ff'
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * w
    const cy = 40 + Math.random() * (h - 80)
    const rr = 20 + Math.random() * 70
    ctx.beginPath()
    ctx.ellipse(cx, cy, rr, rr * 0.35, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  return tex
}

/* ---------------- 3D scene components ---------------- */

function Earth() {
  const texture = useMemo(() => makeEarthTexture(), [])
  const meshRef = useRef(null)
  // Slow spin on Y so the world reads as alive even before the user drags.
  useFrame((_, dt) => {
    if (meshRef.current) meshRef.current.rotation.y += dt * 0.06
  })
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[EARTH_R, 64, 48]} />
      <meshStandardMaterial map={texture} roughness={0.85} metalness={0.05} />
    </mesh>
  )
}

// Static ring of points for the orbit trace, sampled once from Kepler.
function OrbitRing({ orbit }) {
  const points = useMemo(() => {
    const N = 128
    const pts = []
    const v = new THREE.Vector3()
    for (let i = 0; i <= N; i++) {
      // Sample by mean anomaly across 0..2π
      const tS = (i / N) * orbit.periodS
      orbitalPosition({ ...orbit, epochM: 0 }, tS, v)
      pts.push(v.clone())
    }
    return pts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orbit.id])
  return <Line points={points} color={orbit.color} lineWidth={1} transparent opacity={0.55} dashed={false} />
}

function Satellite({ orbit }) {
  const ref = useRef(null)
  const v = useMemo(() => new THREE.Vector3(), [])
  useFrame((state) => {
    if (!ref.current) return
    orbitalPosition(orbit, state.clock.elapsedTime * TIME_SCALE, v)
    ref.current.position.copy(v)
  })
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial color={orbit.color} emissive={orbit.color} emissiveIntensity={0.65} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 4, 8]} intensity={1.1} />
      <directionalLight position={[-4, -2, -6]} intensity={0.25} color="#7dd3fc" />
      <Earth />
      {ORBITS.map(o => <OrbitRing key={`ring-${o.id}`} orbit={o} />)}
      {ORBITS.map(o => <Satellite key={`sat-${o.id}`} orbit={o} />)}
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={2.2}
        maxDistance={12}
        enablePan={false}
      />
    </>
  )
}

/* ---------------- Panel shell ---------------- */

export default function Orbit3DPanel({ onClose }) {
  return (
    <motion.aside
      role="dialog"
      aria-label="Orbital determinism widget"
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed z-50 top-16 right-3 md:right-6 w-[min(96vw,480px)] rounded-2xl border border-line bg-surface-1/95 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-line">
        <div>
          <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/90">
            Orbital determinism · 3D
          </div>
          <div className="text-white font-semibold text-sm mt-0.5 leading-tight">
            Drag to rotate · scroll to zoom
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
        <div className="rounded-lg border border-line bg-black/70 overflow-hidden">
          <div className="w-full aspect-square">
            <Canvas
              camera={{ position: [0, 2.4, 6], fov: 40 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: false }}
              style={{ background: 'transparent' }}
            >
              <color attach="background" args={['#020617']} />
              {/* Star-field via background color + scattered points */}
              <Stars />
              <Scene />
            </Canvas>
          </div>
        </div>

        {/* Table — mobile-friendly: horizontally scrollable, sticky first col */}
        <div className="mt-4 rounded-lg border border-line overflow-x-auto">
          <table className="w-full min-w-[420px] text-[12px]">
            <thead className="bg-surface-3/60 text-left">
              <tr className="text-[10px] font-mono uppercase tracking-[0.18em] text-gray-400">
                <th className="px-3 py-2 sticky left-0 bg-surface-3/60">Object</th>
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
                  <td className="px-3 py-1.5 font-semibold sticky left-0 bg-surface-1/95" style={{ color: o.color }}>{o.name}</td>
                  <td className="px-3 py-1.5 text-gray-300 whitespace-nowrap">{o.label}</td>
                  <td className="px-3 py-1.5 text-gray-300 tabular-nums whitespace-nowrap">{o.altitudeKm.toLocaleString()}</td>
                  <td className="px-3 py-1.5 text-gray-300 tabular-nums whitespace-nowrap">
                    {(o.periodS / 3600).toFixed(2)} h
                  </td>
                  <td className="px-3 py-1.5 text-gray-300 tabular-nums whitespace-nowrap">{o.inclDeg.toFixed(1)}°</td>
                  <td className="px-3 py-1.5 text-gray-300 tabular-nums whitespace-nowrap">{o.e.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 leading-relaxed">
          Kepler solver · Newton–Raphson · positions computed each frame
        </div>
      </div>
    </motion.aside>
  )
}

// Simple deterministic starfield behind the earth.
function Stars() {
  const positions = useMemo(() => {
    const N = 220
    const arr = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      // Random points on a big sphere
      const u = (i * 0.7391) % 1
      const v = (i * 0.3182 + 0.1) % 1
      const theta = 2 * Math.PI * u
      const phi   = Math.acos(2 * v - 1)
      const r = 20 + ((i * 13) % 30) / 30
      arr[i * 3    ] = r * Math.sin(phi) * Math.cos(theta)
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      arr[i * 3 + 2] = r * Math.cos(phi)
    }
    return arr
  }, [])
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#e5e7eb" sizeAttenuation transparent opacity={0.7} />
    </points>
  )
}

// The wrapped export was previously exposing AnimatePresence around the
// panel. That belongs in the caller so it can control unmount/remount.
export { AnimatePresence }
