// src/shared/STLViewer.jsx
// Clean three.js STL viewer with balanced three-point lighting so parts read
// as physical objects, not "shiny cyan mystery blobs".

import React, { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, Bounds, Html, useBounds } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

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

function DoubleClickReset({ controlsRef }) {
  const api = useBounds()
  const { gl } = useThree()
  useEffect(() => {
    const handler = () => {
      api.fit()
      controlsRef.current?.reset?.()
    }
    gl.domElement.addEventListener('dblclick', handler)
    return () => gl.domElement.removeEventListener('dblclick', handler)
  }, [api, gl, controlsRef])
  return null
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

      <MiniBoundary src={src}>
        <Canvas key={key} shadows dpr={[1, 2]} camera={{ position: cameraPosition, fov: 45, zoom }}>
          <color attach="background" args={[background]} />

          {/* Three-point lighting: soft fill, main key, cool rim */}
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
            </Bounds>
          </Suspense>

          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.08}
            target={controlsTarget}
          />
          <DoubleClickReset controlsRef={controlsRef} />
        </Canvas>
      </MiniBoundary>
    </div>
  )
}
