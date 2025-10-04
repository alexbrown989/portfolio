// src/shared/STLViewer.jsx
import React, { useEffect, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Bounds, Html } from '@react-three/drei'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

/** ---------- small helpers ---------- */
function NiceBg() {
  return <color attach="background" args={['#0b1220']} />
}
function Lights() {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 3]} intensity={1} castShadow />
    </>
  )
}

/** Parse STL from an ArrayBuffer safely */
function MeshFromArrayBuffer({ buffer, layFlat = true, color = '#A8B2BE' }) {
  const geometry = useMemo(() => {
    const loader = new STLLoader()
    const g = loader.parse(buffer)
    g.computeVertexNormals?.()
    g.computeBoundingBox?.()
    if (layFlat) g.rotateX(-Math.PI / 2)
    return g
  }, [buffer, layFlat])

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial metalness={0.2} roughness={0.5} color={color} />
    </mesh>
  )
}

/** Friendly error panel that never crashes the route */
function ErrorPanel({ message, onRetry, src }) {
  return (
    <div className="h-full w-full grid place-items-center bg-[rgba(10,15,28,.7)] text-center p-4">
      <div className="max-w-sm">
        <div className="text-red-300 font-semibold mb-1">3D model failed to load</div>
        <div className="text-xs text-gray-300">{message}</div>
        <div className="text-[10px] text-gray-400 mt-2">
          Path: <span className="text-cyan-300">{src}</span>
          <br />
          Verify it exists in <code>/public</code> and is accessible in the browser.
        </div>
        <button
          onClick={onRetry}
          className="mt-3 px-3 py-1.5 rounded border border-cyan-400/40 text-cyan-200 bg-cyan-500/10 hover:bg-cyan-500/20"
        >
          Retry
        </button>
      </div>
    </div>
  )
}

/** Placeholder 3D scene so the canvas still renders even if STL failed */
function PlaceholderScene({ controlsTarget = [0, 0, 0] }) {
  return (
    <>
      <NiceBg />
      <Lights />
      <gridHelper args={[10, 10, '#1f2937', '#111827']} />
      <axesHelper args={[3]} />
      <OrbitControls enableDamping dampingFactor={0.08} target={new THREE.Vector3(...controlsTarget)} />
    </>
  )
}

/** ---------- MAIN VIEWER (robust) ---------- */
export default function STLViewer({
  src,
  height = 480,
  className = '',
  layFlat = true,
  color = '#A8B2BE',
  cameraPosition = [160, 160, 90],
  controlsTarget = [0, 0, 0],
  zoom = 1,
  debug = false,
  onLoad,     // optional callback when mesh is ready
  onError,    // optional callback on failure
}) {
  // ✅ SSR / non-DOM guard: bail out immediately with a friendly fallback
  if (typeof window === 'undefined' || !globalThis?.document) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden border border-white/10 bg-white/5 ${className}`}
        style={{ height }}
      >
        <div className="h-full w-full grid place-items-center text-center p-4">
          <div>
            <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200 mb-1">
              // 3D preview unavailable
            </div>
            <div className="text-sm text-gray-300">
              This viewer requires a browser environment. The STL will load normally on the client.
            </div>
          </div>
        </div>
      </div>
    )
  }

  const [buf, setBuf] = useState(null)
  const [error, setError] = useState(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        setError(null)
        setBuf(null)

        // preflight fetch with no caching so dev changes are seen
        const res = await fetch(src, { cache: 'no-cache' })
        if (!res.ok) throw new Error(`HTTP ${res.status} while fetching ${src}`)

        // must be at least header(80) + triCount(4)
        const ab = await res.arrayBuffer()
        if (ab.byteLength < 84) throw new Error('File too small to be a valid STL')

        // rough sanity check: if server returns HTML, we likely hit a 404/redirect page
        const ct = res.headers.get('content-type') || ''
        if (ct.includes('text/html')) {
          throw new Error('Received HTML instead of STL (likely a 404/redirect)')
        }

        if (!alive) return
        setBuf(ab)
        onLoad?.()
      } catch (e) {
        if (!alive) return
        const msg = e instanceof Error ? e.message : String(e)
        setError(msg)
        onError?.(msg)
        console.error('[STLViewer] load error:', msg)
      }
    })()
    return () => { alive = false }
  }, [src, attempt, onLoad, onError])

  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-white/10 bg-white/5 ${className}`}
      style={{ height }}
    >
      {debug && (
        <div className="absolute z-10 top-2 left-2 px-2 py-1 text-[10px] rounded bg-black/60 border border-white/10">
          <span className="text-gray-300">STL: </span>
          <span className="text-cyan-300">{src}</span>
        </div>
      )}

      {/* If we had a hard error, keep a canvas with a placeholder so page never blanks */}
      {error ? (
        <>
          <ErrorPanel message={error} src={src} onRetry={() => setAttempt(a => a + 1)} />
          <div className="absolute inset-0 pointer-events-none opacity-30">
            <Canvas camera={{ position: cameraPosition, fov: 55, zoom }}>
              <PlaceholderScene controlsTarget={controlsTarget} />
            </Canvas>
          </div>
        </>
      ) : (
        <Canvas dpr={[1, 2]} camera={{ position: cameraPosition, fov: 55, zoom }}>
          <NiceBg />
          <Lights />

          {!buf && (
            <Html center className="text-xs text-cyan-300">
              Loading STL…
            </Html>
          )}

          {buf && (
            <Bounds margin={1.2}>
              <MeshFromArrayBuffer buffer={buf} layFlat={layFlat} color={color} />
            </Bounds>
          )}

          <OrbitControls
            enableDamping
            dampingFactor={0.08}
            target={new THREE.Vector3(...controlsTarget)}
          />
        </Canvas>
      )}
    </div>
  )
}
