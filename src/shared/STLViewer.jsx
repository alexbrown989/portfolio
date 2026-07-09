// src/shared/STLViewer.jsx
// Clean three.js STL viewer with balanced three-point lighting so parts read
// as physical objects, not "shiny cyan mystery blobs".

import React, { Suspense, useCallback, useEffect, useMemo, useRef } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, Bounds, Html, useBounds } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { RotateCcw } from 'lucide-react'

function ViewerError({ error, src }) {
  return (
    <div className="h-full w-full grid place-items-center bg-surface-2/60 text-center p-4">
      <div className="max-w-sm">
        <div className="text-red-300 font-semibold mb-2 text-sm">STL failed to load</div>
        <div className="text-xs text-gray-300">{String(error?.message || error) || 'Unknown error'}</div>
        <div className="text-[10px] text-gray-500 mt-2 font-mono">
          Path: <span className="text-brand-300">{src}</span>
        </div>
      </div>
    </div>
  )
}

class MiniBoundary extends React.Component {
  constructor(p) { super(p); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  componentDidCatch(err) { if (typeof console !== 'undefined') console.error('STLViewer error:', err) }
  render() { return this.state.hasError ? <ViewerError error={this.state.error} src={this.props.src} /> : this.props.children }
}

function Model({ src, layFlat = true, color = '#c8d1de' }) {
  const geometry = useLoader(STLLoader, src)
  geometry.computeVertexNormals?.()
  geometry.computeBoundingBox?.()
  if (layFlat) geometry.rotateX(-Math.PI / 2)
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial color={color} metalness={0.15} roughness={0.55} />
    </mesh>
  )
}

// Bridge component — captures the Bounds API and OrbitControls ref inside
// the R3F canvas and exposes them to the outer DOM Reset button via a
// callback prop. Also wires up a working dblclick + `r` shortcut inside
// the canvas.
function ResetBridge({ controlsRef, registerReset }) {
  const api = useBounds()
  const { gl } = useThree()

  const doReset = useCallback(() => {
    controlsRef.current?.reset?.()
    // Wait a frame so controls.reset() has settled, then re-fit.
    requestAnimationFrame(() => api.refresh().fit())
  }, [api, controlsRef])

  useEffect(() => {
    registerReset(doReset)
    return () => registerReset(null)
  }, [registerReset, doReset])

  useEffect(() => {
    const canvas = gl.domElement
    // dblclick — bind on both canvas and its parent so we catch it even
    // if OrbitControls swallows a click inside.
    const onDbl = (e) => { e.preventDefault(); doReset() }
    canvas.addEventListener('dblclick', onDbl)
    canvas.parentElement?.addEventListener('dblclick', onDbl)
    // Keyboard: `r` resets when the viewer is focused / hovered.
    const onKey = (e) => {
      if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey) {
        // Only trigger if pointer is over the canvas
        const rect = canvas.getBoundingClientRect()
        const withinCanvas = window.__lastMouse &&
          window.__lastMouse.x >= rect.left && window.__lastMouse.x <= rect.right &&
          window.__lastMouse.y >= rect.top  && window.__lastMouse.y <= rect.bottom
        if (withinCanvas) doReset()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      canvas.removeEventListener('dblclick', onDbl)
      canvas.parentElement?.removeEventListener('dblclick', onDbl)
      window.removeEventListener('keydown', onKey)
    }
  }, [gl, doReset])

  return null
}

// Small helper — tracks the mouse globally so we can decide if the user
// pressed `r` while hovering over any given viewer.
if (typeof window !== 'undefined' && !window.__abMouseHookInstalled) {
  window.__abMouseHookInstalled = true
  window.__lastMouse = { x: 0, y: 0 }
  window.addEventListener('mousemove', (e) => {
    window.__lastMouse = { x: e.clientX, y: e.clientY }
  }, { passive: true })
}

export default function STLViewer({
  src,
  height = 480,
  className = '',
  layFlat = true,
  debug = false,
  cameraPosition = [80, 80, 80],
  controlsTarget = [0, 0, 0],
  zoom = 10,
  fitMargin = 1.08,
  background = '#0a0f1a',
}) {
  const key = useMemo(() => `stl-${src}`, [src])
  const controlsRef = useRef(null)
  const resetFnRef  = useRef(null)

  if (typeof window === 'undefined' || !globalThis.document) {
    return (
      <div
        className={`rounded-xl border border-line bg-surface-2/60 text-xs text-gray-300 grid place-items-center ${className}`}
        style={{ height }}
      >
        3D viewer will load on the client…
      </div>
    )
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden border border-line bg-surface-2/60 ${className}`}
      style={{ height }}
    >
      {debug && (
        <div className="absolute z-10 top-2 left-2 px-2 py-1 text-[10px] rounded bg-black/60 border border-line font-mono">
          <span className="text-gray-300">STL: </span>
          <span className="text-brand-300">{src}</span>
        </div>
      )}

      {/* Reset button — DOM-level, wired to the Bounds API through resetFnRef. */}
      <button
        type="button"
        onClick={() => resetFnRef.current?.()}
        aria-label="Reset view"
        title="Reset view (R or double-click)"
        className="absolute z-10 top-2 right-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-md border border-line bg-surface-1/85 backdrop-blur text-[10.5px] font-mono uppercase tracking-[0.18em] text-gray-300 hover:text-white hover:border-brand-500/50 transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Reset
      </button>

      <MiniBoundary src={src}>
        <Canvas key={key} shadows dpr={[1, 2]} camera={{ position: cameraPosition, fov: 45, zoom }}>
          <color attach="background" args={[background]} />

          {/* Three-point lighting */}
          <ambientLight intensity={0.55} />
          <hemisphereLight args={['#8fb0d0', '#0a0f1a', 0.35]} />
          <directionalLight
            position={[6, 8, 4]}
            intensity={0.9}
            castShadow
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <directionalLight position={[-5, 4, -3]} intensity={0.35} color="#7dd3fc" />

          <Suspense fallback={<Html center className="text-xs text-brand-300 font-mono">Loading STL…</Html>}>
            <Bounds margin={fitMargin} clip observe>
              <Model src={src} layFlat={layFlat} />
              <ResetBridge
                controlsRef={controlsRef}
                registerReset={(fn) => { resetFnRef.current = fn }}
              />
            </Bounds>
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.08}
            target={controlsTarget}
          />
        </Canvas>
      </MiniBoundary>
    </div>
  )
}
