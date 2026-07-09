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

// Denser continent outlines. Coordinates in equirectangular
// (longitude in [-180, +180], latitude in [+90, -90]). Not survey-grade,
// but recognizable as their real continents at a glance. Each polygon
// runs around the coastline in a single direction so the fill is clean.

const CONTINENTS = [
  // NORTH AMERICA — Alaska → Canada → Great Lakes → Atlantic → Florida → Gulf → Mexico → Central America → west coast back to Alaska
  [
    [-168, 66], [-155, 71], [-140, 70], [-125, 70], [-108, 68], [-95, 68],
    [-83, 62], [-70, 60], [-58, 52], [-52, 48], [-58, 44], [-66, 45],
    [-70, 41], [-74, 38], [-76, 35], [-80, 31], [-81, 26], [-80, 25],
    [-84, 30], [-89, 30], [-95, 29], [-97, 26], [-97, 21], [-92, 18],
    [-88, 16], [-83, 8], [-78, 8], [-83, 14], [-95, 15], [-105, 18],
    [-115, 22], [-118, 32], [-122, 37], [-124, 42], [-124, 48], [-131, 53],
    [-140, 58], [-153, 59], [-160, 62], [-168, 66],
  ],
  // GREENLAND
  [
    [-73, 78], [-55, 82], [-30, 83], [-15, 79], [-20, 75], [-40, 68],
    [-52, 63], [-58, 66], [-70, 72], [-73, 78],
  ],
  // SOUTH AMERICA
  [
    [-78, 12], [-72, 12], [-62, 10], [-52, 5], [-35, -8], [-38, -22],
    [-52, -30], [-58, -35], [-65, -40], [-70, -48], [-73, -54], [-72, -50],
    [-74, -42], [-71, -30], [-72, -18], [-78, -8], [-80, 0], [-78, 12],
  ],
  // EUROPE — Iberia → France → UK arc → Scandinavia → Russia → Balkans → Iberia
  [
    [-9, 43], [-3, 44], [3, 47], [10, 55], [14, 66], [22, 70], [30, 70],
    [40, 66], [50, 62], [58, 58], [50, 54], [40, 51], [30, 47], [25, 43],
    [20, 40], [15, 39], [10, 43], [3, 43], [-3, 40], [-9, 43],
  ],
  // BRITISH ISLES (separate so it reads as an island)
  [ [-6, 55], [-2, 58], [0, 56], [-2, 51], [-6, 51], [-6, 55] ],
  // AFRICA
  [
    [-17, 22], [-16, 15], [-13, 8], [-8, 4], [0, 5], [8, 4], [10, -2],
    [18, -8], [22, -18], [22, -30], [19, -35], [24, -35], [30, -30],
    [35, -22], [40, -15], [42, -8], [50, -3], [51, 5], [45, 10], [42, 12],
    [40, 18], [35, 22], [31, 30], [22, 32], [10, 33], [0, 30], [-8, 30],
    [-14, 26], [-17, 22],
  ],
  // ARABIAN PENINSULA
  [
    [34, 30], [40, 30], [48, 25], [55, 22], [58, 18], [55, 13], [45, 12],
    [40, 15], [35, 22], [34, 30],
  ],
  // ASIA — broad continent from Turkey through Siberia + India + China + SE Asia
  [
    [30, 45], [40, 42], [48, 40], [55, 35], [62, 30], [70, 25], [78, 8],
    [82, 6], [90, 12], [95, 18], [100, 22], [104, 10], [109, 14], [115, 5],
    [122, 12], [122, 20], [118, 25], [122, 32], [130, 34], [132, 40],
    [128, 47], [130, 55], [140, 60], [150, 65], [155, 70], [165, 72],
    [180, 72], [170, 68], [140, 62], [120, 58], [100, 55], [80, 55],
    [60, 55], [45, 55], [35, 50], [30, 45],
  ],
  // JAPAN
  [ [138, 40], [141, 44], [143, 42], [139, 35], [136, 34], [138, 40] ],
  // SE ASIA / INDONESIA (single arc)
  [ [95, 5], [105, 0], [115, -5], [125, -8], [138, -5], [140, -2], [130, 2], [115, 4], [100, 4], [95, 5] ],
  // AUSTRALIA
  [
    [113, -22], [122, -18], [133, -12], [141, -12], [143, -14], [147, -19],
    [152, -25], [151, -32], [148, -37], [140, -38], [130, -32], [122, -34],
    [115, -32], [114, -25], [113, -22],
  ],
  // NEW ZEALAND
  [ [170, -41], [174, -37], [178, -40], [175, -46], [171, -46], [170, -41] ],
  // ANTARCTICA — thick belt from -60 to -85, following coastline curves
  [
    [-180, -68], [-150, -74], [-110, -73], [-80, -72], [-60, -80],
    [-45, -78], [-20, -70], [0, -68], [30, -70], [60, -66], [90, -66],
    [120, -66], [150, -78], [170, -78], [180, -78], [180, -85], [-180, -85], [-180, -68],
  ],
]

function makeEarthTexture() {
  const w = 2048, h = 1024
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')

  // Deep ocean base with a subtle latitudinal gradient (darker at poles).
  const g = ctx.createLinearGradient(0, 0, 0, h)
  g.addColorStop(0, '#052a4d')
  g.addColorStop(0.3, '#0a3e6a')
  g.addColorStop(0.5, '#0c4a72')
  g.addColorStop(0.7, '#0a3e6a')
  g.addColorStop(1, '#03203e')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)

  // Very faint ocean noise so it doesn't read as a flat gradient sphere.
  const oceanNoise = ctx.getImageData(0, 0, w, h)
  for (let i = 0; i < oceanNoise.data.length; i += 4) {
    const n = (Math.random() - 0.5) * 8
    oceanNoise.data[i]     = Math.max(0, Math.min(255, oceanNoise.data[i]     + n))
    oceanNoise.data[i + 1] = Math.max(0, Math.min(255, oceanNoise.data[i + 1] + n))
    oceanNoise.data[i + 2] = Math.max(0, Math.min(255, oceanNoise.data[i + 2] + n))
  }
  ctx.putImageData(oceanNoise, 0, 0)

  // Continent painter
  const lonLatToXY = (lon, lat) => [
    ((lon + 180) / 360) * w,
    ((90 - lat)  / 180) * h,
  ]

  const drawLand = (poly) => {
    ctx.beginPath()
    for (let i = 0; i < poly.length; i++) {
      const [x, y] = lonLatToXY(poly[i][0], poly[i][1])
      if (i === 0) ctx.moveTo(x, y)
      else         ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.fill()
  }

  // Land base color — warmer than pure green so it reads like real Earth
  // when viewed against ocean. Antarctica gets an ice tint applied after.
  ctx.fillStyle = '#3e6b3b'
  for (const poly of CONTINENTS) drawLand(poly)

  // Ice caps: brighten Antarctica and Greenland by re-painting them.
  ctx.fillStyle = '#dbe7f1'
  drawLand(CONTINENTS[1])                                              // Greenland
  drawLand(CONTINENTS[CONTINENTS.length - 1])                          // Antarctica

  // Add a green-brown shading gradient onto the land: darker (forest)
  // near equator, tan/desert around Sahara-latitude, snow at poles.
  // We do this by re-scanning image data — cheap since it's a small canvas.
  const img = ctx.getImageData(0, 0, w, h)
  const d = img.data
  for (let y = 0; y < h; y++) {
    const lat = 90 - (y / h) * 180
    // Deserts around 20–30N and 20–30S: mix in tan
    const desert = Math.max(0, 1 - Math.min(Math.abs(lat - 25), Math.abs(lat + 25)) / 10)
    // Boreal / snow above 55° or below -55°
    const cold   = Math.max(0, (Math.abs(lat) - 55) / 25)
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4
      // Only shade "land"-ish pixels (green channel dominant vs blue)
      const isLand = d[i + 1] > d[i + 2] + 4 || (d[i] > 190 && d[i + 1] > 190)
      if (!isLand) continue
      if (desert > 0.05) {
        d[i]     = Math.min(255, d[i]     + 60 * desert)
        d[i + 1] = Math.min(255, d[i + 1] + 30 * desert)
        d[i + 2] = Math.min(255, d[i + 2] - 5  * desert)
      }
      if (cold > 0.05) {
        d[i]     = Math.min(255, d[i]     + 90 * cold)
        d[i + 1] = Math.min(255, d[i + 1] + 90 * cold)
        d[i + 2] = Math.min(255, d[i + 2] + 90 * cold)
      }
    }
  }
  ctx.putImageData(img, 0, 0)

  // Subtle cloud smears in the mid-latitudes so the planet looks alive.
  ctx.globalAlpha = 0.16
  ctx.fillStyle = '#f8fafc'
  for (let i = 0; i < 60; i++) {
    const cx = Math.random() * w
    const cy = 80 + Math.random() * (h - 200)
    const rr = 30 + Math.random() * 120
    ctx.beginPath()
    ctx.ellipse(cx, cy, rr, rr * 0.32, 0, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1

  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = THREE.RepeatWrapping
  tex.anisotropy = 8
  return tex
}

// Separate cloud texture — same equirectangular projection, just wispy
// noise so the atmosphere layer reads.
function makeCloudTexture() {
  const w = 1024, h = 512
  const c = document.createElement('canvas')
  c.width = w; c.height = h
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  for (let i = 0; i < 90; i++) {
    const cx = Math.random() * w
    const cy = 40 + Math.random() * (h - 80)
    const rx = 20 + Math.random() * 100
    const ry = rx * (0.25 + Math.random() * 0.25)
    ctx.beginPath()
    ctx.ellipse(cx, cy, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2)
    ctx.fill()
  }
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/* ---------------- 3D scene components ---------------- */

function Earth() {
  const earthMap  = useMemo(() => makeEarthTexture(), [])
  const cloudMap  = useMemo(() => makeCloudTexture(), [])
  const globeRef  = useRef(null)
  const cloudsRef = useRef(null)
  const atmoRef   = useRef(null)
  // Slow spin on Y so the world reads as alive even before the user drags.
  // Clouds drift a bit faster than the surface for depth.
  useFrame((_, dt) => {
    if (globeRef.current)  globeRef.current.rotation.y  += dt * 0.045
    if (cloudsRef.current) cloudsRef.current.rotation.y += dt * 0.055
  })
  return (
    <group>
      {/* Textured Earth */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[EARTH_R, 96, 64]} />
        <meshStandardMaterial map={earthMap} roughness={0.88} metalness={0.05} />
      </mesh>
      {/* Cloud layer, slightly larger, transparent */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[EARTH_R * 1.012, 96, 64]} />
        <meshStandardMaterial
          map={cloudMap}
          transparent
          opacity={0.55}
          depthWrite={false}
        />
      </mesh>
      {/* Atmosphere rim — a slightly larger sphere rendered from the back
          side with an additive-ish fake fresnel via emissive scaling.
          Gives the planet its blue halo. */}
      <mesh ref={atmoRef} scale={1.055}>
        <sphereGeometry args={[EARTH_R, 64, 48]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.12} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </group>
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
        <div className="orbit-scroll-inner mt-4 rounded-lg border border-line overflow-x-auto max-w-full">
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
