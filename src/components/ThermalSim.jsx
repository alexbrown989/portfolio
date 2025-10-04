import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'

export default function ThermalSim() {
  const [load, setLoad] = useState(50)
  const [running, setRunning] = useState(false)
  const [temperature, setTemperature] = useState(25)
  const canvasRef = useRef(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  useEffect(() => {
    if (!running) return
    
    const interval = setInterval(() => {
      setTemperature(prev => {
        const target = 25 + (load * 0.75)
        return prev + (target - prev) * 0.1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [running, load])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 15, 28, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw heat gradient
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
      const intensity = temperature / 100
      
      gradient.addColorStop(0, `rgba(0, 100, 255, ${0.2 + intensity * 0.3})`)
      gradient.addColorStop(0.5, `rgba(255, 100, 0, ${intensity})`)
      gradient.addColorStop(1, `rgba(255, 0, 0, ${intensity * 0.8})`)

      ctx.fillStyle = gradient
      
      // Animated waves
      const time = Date.now() * 0.001
      for (let x = 0; x < canvas.width; x += 10) {
        const y = Math.sin(x * 0.01 + time) * 20 * intensity + canvas.height / 2
        ctx.fillRect(x, y, 8, 8)
      }

      requestAnimationFrame(animate)
    }

    animate()
  }, [temperature])

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
            /// THERMAL SIMULATION ///
          </span>
        </motion.div>
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-4"
        >
          PCM <span className="text-gradient">Heatflow Engine</span>
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.2 }}
          className="text-gray-400 max-w-2xl mx-auto"
        >
          Real-time thermal simulation demonstrating phase change material behavior 
          under variable load conditions.
        </motion.p>
      </div>

      {/* Simulation Interface */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.3 }}
        className="max-w-4xl mx-auto"
      >
        {/* Control Panel */}
        <div className="glass rounded-2xl p-6 mb-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-400 block mb-2">THERMAL LOAD INPUT</label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min={5}
                  max={200}
                  value={load}
                  onChange={(e) => setLoad(Number(e.target.value))}
                  className="flex-1 accent-primary"
                />
                <span className="font-mono text-primary text-xl min-w-[80px] text-right">
                  {load}W
                </span>
              </div>
            </div>
            
            <div>
              <label className="text-sm text-gray-400 block mb-2">SYSTEM TEMPERATURE</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 h-8 bg-surface-light rounded-full overflow-hidden">
                  <motion.div
                    animate={{ width: `${(temperature / 100) * 100}%` }}
                    className={`h-full bg-gradient-to-r ${
                      temperature < 40 ? 'from-blue-500 to-cyan-500' :
                      temperature < 70 ? 'from-yellow-500 to-orange-500' :
                      'from-orange-500 to-red-500'
                    }`}
                  />
                </div>
                <span className="font-mono text-primary text-xl min-w-[80px] text-right">
                  {temperature.toFixed(1)}°C
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRunning(!running)}
              className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                running 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}
            >
              {running ? '⏸ PAUSE' : '▶ START'} SIMULATION
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setLoad(50)
                setTemperature(25)
                setRunning(false)
              }}
              className="px-6 py-2 rounded-lg bg-surface-light border border-border text-gray-400 hover:text-white transition-all"
            >
              RESET
            </motion.button>
          </div>
        </div>

        {/* Visualization Canvas */}
        <div className="glass rounded-2xl p-6 h-80 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
          
          <div className="relative z-10 h-full flex items-end">
            <div className="grid grid-cols-3 gap-4 w-full">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Carbon Black</div>
                <motion.div
                  animate={{ 
                    height: `${Math.min(100, temperature * 1.5)}%`,
                    opacity: running ? [0.5, 1, 0.5] : 0.5
                  }}
                  transition={{ 
                    height: { duration: 0.5 },
                    opacity: { duration: 2, repeat: Infinity }
                  }}
                  className="bg-gradient-to-t from-gray-700 to-gray-500 rounded-t"
                />
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Graphite</div>
                <motion.div
                  animate={{ 
                    height: `${Math.min(100, temperature * 1.2)}%`,
                    opacity: running ? [0.5, 1, 0.5] : 0.5
                  }}
                  transition={{ 
                    height: { duration: 0.5 },
                    opacity: { duration: 2.5, repeat: Infinity }
                  }}
                  className="bg-gradient-to-t from-purple-700 to-purple-500 rounded-t"
                />
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">Copper</div>
                <motion.div
                  animate={{ 
                    height: `${Math.min(100, temperature)}%`,
                    opacity: running ? [0.5, 1, 0.5] : 0.5
                  }}
                  transition={{ 
                    height: { duration: 0.5 },
                    opacity: { duration: 3, repeat: Infinity }
                  }}
                  className="bg-gradient-to-t from-orange-700 to-orange-500 rounded-t"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-4 gap-4 mt-6">
          {[
            { label: 'Heat Flux', value: `${(load * 0.8).toFixed(1)} W/m²` },
            { label: 'Efficiency', value: `${(95 - load * 0.1).toFixed(1)}%` },
            { label: 'Phase State', value: temperature > 60 ? 'LIQUID' : 'SOLID' },
            { label: 'Time Constant', value: `${(12 / (load / 50)).toFixed(1)}s` },
          ].map((metric, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className="glass rounded-lg p-3 text-center"
            >
              <div className="text-xs text-gray-500">{metric.label}</div>
              <div className="text-lg font-mono text-primary mt-1">{metric.value}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}