import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Box, Sphere, Torus } from '@react-three/drei'
import { motion } from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'framer-motion'

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#00FFE7" />
      
      {/* Main Geometry */}
      <group>
        <Box args={[2, 2, 2]} position={[-3, 0, 0]}>
          <meshStandardMaterial color="#00FFE7" metalness={0.8} roughness={0.2} />
        </Box>
        
        <Sphere args={[1.5, 32, 32]} position={[0, 0, 0]}>
          <meshStandardMaterial color="#8B5CF6" metalness={0.7} roughness={0.3} />
        </Sphere>
        
        <Torus args={[1.5, 0.5, 16, 32]} position={[3, 0, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <meshStandardMaterial color="#FF6B6B" metalness={0.6} roughness={0.4} />
        </Torus>
      </group>
      
      <OrbitControls enablePan enableZoom enableRotate autoRotate autoRotateSpeed={1} />
    </>
  )
}

export default function Model3D() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <div ref={ref}>
      {/* Section Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="inline-block mb-4"
        >
          <span className="text-xs font-mono text-primary uppercase tracking-widest">
            /// 3D MODEL VIEWER ///
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          Interactive <span className="text-gradient">3D Models</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          Load and interact with STL models. Rotate, zoom, and examine components in detail.
        </motion.p>
      </div>

      {/* 3D Viewer */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        <div className="glass rounded-2xl p-2 h-[500px]">
          <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
            <Suspense fallback={null}>
              <Scene />
            </Suspense>
          </Canvas>
        </div>

        <div className="mt-6 glass rounded-xl p-4">
          <p className="text-sm text-gray-400 text-center">
            <span className="text-primary">Tip:</span> Place your STL files in{' '}
            <code className="px-2 py-1 bg-surface rounded text-xs">/public/models/</code>
            {' '}to load custom models. Use mouse to rotate, scroll to zoom.
          </p>
        </div>
      </motion.div>
    </div>
  )
}