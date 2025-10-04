// src/shared/STLViewer.jsx
import { Canvas, useLoader } from '@react-three/fiber'
import { OrbitControls, Bounds, Html } from '@react-three/drei'
import { Suspense, useState } from 'react'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import * as THREE from 'three'
import React from 'react'

function Model({ src, layFlat = true, color = '#A8B2BE' }) {
  // useLoader handles fetch + Suspense and will throw on error (caught by our boundary)
  const geometry = useLoader(STLLoader, src)
  // Defensive: compute normals/bounds if missing
  geometry.computeVertexNormals?.()
  geometry.computeBoundingBox?.()
  if (layFlat) geometry.rotateX(-Math.PI / 2)

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial metalness={0.2} roughness={0.5} color={color} />
    </mesh>
  )
}

function ViewerError({ error, src }) {
  return (
    <div className="h-full w-full grid place-items-center bg-[rgba(10,15,28,.7)] text-center p-4">
      <div className="max-w-sm">
        <div className="text-red-300 font-semibold mb-2">STL failed to load</div>
        <div className="text-xs text-gray-300">
          {String(error?.message || error) || 'Unknown error'}
        </div>
        <div className="text-[10px] text-gray-400 mt-2">
          Check file path: <span className="text-cyan-300">{src}</span><br />
          Ensure it’s in <code>/public</code> and the browser can fetch it directly.
        </div>
      </div>
    </div>
  )
}

// Tiny error boundary scoped to the canvas
class MiniBoundary extends React.Component {
  constructor(props){ super(props); this.state = { hasError:false, error:null } }
  static getDerivedStateFromError(error){ return { hasError:true, error } }
  componentDidCatch(err){ console.error('STLViewer error:', err) }
  render(){
    if (this.state.hasError) return <ViewerError error={this.state.error} src={this.props.src} />
    return this.props.children
  }
}

// NOTE: We export default React here; App bundlers handle it
// eslint-disable-next-line no-undef
export default function STLViewer({
  src,
  height = 480,
  className = '',
  layFlat = true,
  debug = false,
}) {
  return (
    <div
      className={`relative rounded-xl overflow-hidden border border-white/10 bg-white/5 ${className}`}
      style={{ height }}
    >
      {debug && (
        <div className="absolute z-10 top-2 left-2 px-2 py-1 text-[10px] rounded bg-black/60 border border-white/10">
          <span className="text-gray-300">STL:</span>{' '}
          <span className="text-cyan-300">{src}</span>
        </div>
      )}
      <MiniBoundary src={src}>
        <Canvas shadows dpr={[1, 2]} camera={{ position: [160, 160, 90], fov: 55 }}>
          <color attach="background" args={['#0b1220']} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[4, 6, 3]} intensity={1} castShadow />
          <Suspense fallback={<Html center className="text-xs text-cyan-300">Loading STL…</Html>}>
            <Bounds margin={1.2}>
              <Model src={src} layFlat={layFlat} />
            </Bounds>
          </Suspense>
          <OrbitControls enableDamping dampingFactor={0.08} />
        </Canvas>
      </MiniBoundary>
    </div>
  )
}
