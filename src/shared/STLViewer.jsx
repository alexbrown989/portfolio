// src/shared/STLViewer.jsx
import React, { Suspense, useMemo, useRef, useEffect } from 'react'
import { Canvas, useLoader, useThree } from '@react-three/fiber'
import { OrbitControls, Bounds, Html, useBounds } from '@react-three/drei'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'

/* -------------------- tiny error UI -------------------- */
function ViewerError({ error, src }) {
  return (
    <div className="h-full w-full grid place-items-center bg-[rgba(10,15,28,.7)] text-center p-4">
      <div className="max-w-sm">
        <div className="text-red-300 font-semibold mb-2">STL failed to load</div>
        <div className="text-xs text-gray-300">{String(error?.message || error) || 'Unknown error'}</div>
        <div className="text-[10px] text-gray-400 mt-2">
          Path: <span className="text-cyan-300">{src}</span>
        </div>
      </div>
    </div>
  )
}

class MiniBoundary extends React.Component {
  constructor(p){ super(p); this.state = { hasError:false, error:null } }
  static getDerivedStateFromError(error){ return { hasError:true, error } }
  componentDidCatch(err){ console.error('STLViewer error:', err) }
  render(){ return this.state.hasError ? <ViewerError error={this.state.error} src={this.props.src} /> : this.props.children }
}

/* -------------------- mesh loader -------------------- */
function Model({ src, layFlat = true, color = '#A8B2BE' }) {
  const geometry = useLoader(STLLoader, src)
  geometry.computeVertexNormals?.()
  geometry.computeBoundingBox?.()
  if (layFlat) geometry.rotateX(-Math.PI / 2)
  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial metalness={0.2} roughness={0.5} color={color} />
    </mesh>
  )
}

/* -------------------- dbl-click reset -------------------- */
function DoubleClickReset({ controlsRef }) {
  const api = useBounds()
  const { gl } = useThree()
  useEffect(() => {
    const handler = () => {
      // fit the current bounds and reset orbit target/distance
      api.fit()
      controlsRef.current?.reset?.()
    }
    gl.domElement.addEventListener('dblclick', handler)
    return () => gl.domElement.removeEventListener('dblclick', handler)
  }, [api, gl, controlsRef])
  return null
}

/* -------------------- exported viewer -------------------- */
export default function STLViewer({
  src,
  height = 480,
  className = '',
  layFlat = true,
  debug = false,
  // slightly tighter by default
  cameraPosition = [80, 80, 80],
  controlsTarget = [0, 0, 0],
  zoom = 10,               // tad more zoom
  fitMargin = 1.06,          // and a tighter fit
  background = '#0b1220',
}) {
  // SSR guard
  if (typeof window === 'undefined' || !globalThis.document) {
    return (
      <div
        className={`rounded-xl border border-white/10 bg-white/5 text-xs text-gray-300 grid place-items-center ${className}`}
        style={{ height }}
      >
        3D viewer will load on the client…
      </div>
    )
  }

  const key = useMemo(() => `stl-${src}`, [src])
  const controlsRef = useRef(null)

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

      <MiniBoundary src={src}>
        <Canvas key={key} shadows dpr={[1, 2]} camera={{ position: cameraPosition, fov: 55, zoom }}>
          <color attach="background" args={[background]} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 3]} intensity={1} castShadow />

          <Suspense fallback={<Html center className="text-xs text-cyan-300">Loading STL…</Html>}>
            {/* Bounds auto-frames; tighter margin => slightly zoomed in */}
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
