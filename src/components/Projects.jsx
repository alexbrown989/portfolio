import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../content/projects'

// Map any ids that have a custom hand-built page
const customRoutes = new Set(['beth', 'coastal', 'micromobility', 'turret', 'vibration'])

const statusConfig = {
  ACTIVE:     { color:'bg-amber-500/15 text-amber-300 border-amber-300/30', pulse:true,  label:'ACTIVE' },
  DEPLOYED:   { color:'bg-emerald-500/15 text-emerald-300 border-emerald-300/30', pulse:true,  label:'DEPLOYED' },
  COMPLETED:  { color:'bg-sky-500/15 text-sky-300 border-sky-300/30', pulse:false, label:'COMPLETED' },
  'R&D':      { color:'bg-purple-500/15 text-purple-300 border-purple-300/30', pulse:true,  label:'R&D' },
}

const gradientMaps = {
  thermal:'from-orange-500/20 via-red-600/20 to-pink-600/20',
  fluid:'from-blue-500/20 via-cyan-600/20 to-teal-600/20',
  structural:'from-purple-500/20 via-indigo-600/20 to-blue-600/20',
  computational:'from-green-500/20 via-emerald-600/20 to-cyan-600/20',
  default:'from-gray-500/20 via-gray-600/20 to-gray-700/20',
}

export default function Projects(){
  const [openId, setOpenId] = useState(null)
  const [hoveredId, setHoveredId] = useState(null)
  const [liveMetrics, setLiveMetrics] = useState({})
  const items = Array.isArray(projects) ? projects : []
  const cardRefs = useRef({})

  useEffect(() => {
    const interval = setInterval(() => {
      const m = {}
      items.forEach(p => {
        if (p.metrics) {
          m[p.id] = {
            ...p.metrics,
            temperature: p.metrics.temperature ? (parseFloat(p.metrics.temperature)+(Math.random()-0.5)*2).toFixed(1) : null,
            efficiency:  p.metrics.efficiency  ? (parseFloat(p.metrics.efficiency)+(Math.random()-0.5)*5).toFixed(1) : null,
            dataRate:    p.metrics.dataRate    ? (parseFloat(p.metrics.dataRate)+Math.random()*100).toFixed(0) : null,
          }
        }
      })
      setLiveMetrics(m)
    }, 3000)
    return () => clearInterval(interval)
  }, [items])

  const handleMouseMove = (e, id) => {
    const card = cardRefs.current[id]; if (!card) return
    const r = card.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
    const rotateY = (x - 0.5) * 14, rotateX = (y - 0.5) * -14 // gentler tilt
    card.style.transform = `perspective(1000px) rotateY(${rotateY}deg) rotateX(${rotateX}deg) scale(1.015)`
  }
  const handleMouseLeave = (id) => { const c = cardRefs.current[id]; if (c) c.style.transform = 'perspective(1000px) rotateY(0) rotateX(0) scale(1)' }

  const getProjectGradient = (p) => {
    if (p.category?.toLowerCase().includes('thermal')) return gradientMaps.thermal
    if (p.category?.toLowerCase().includes('fluid'))   return gradientMaps.fluid
    if (p.category?.toLowerCase().includes('struct'))  return gradientMaps.structural
    if (p.category?.toLowerCase().includes('comput'))  return gradientMaps.computational
    if (p.tech?.some(t => t.toLowerCase().includes('thermal'))) return gradientMaps.thermal
    if (p.tech?.some(t => t.toLowerCase().includes('piv') || t.toLowerCase().includes('fluid'))) return gradientMaps.fluid
    return gradientMaps.default
  }

  // Prefetch custom page bundle on hover for instant navigation
  const prefetchIfCustom = async (id) => {
    switch (id) {
      case 'beth':          return import('../pages/projects/BETH.jsx')
      case 'coastal':       return import('../pages/projects/Coastal.jsx')
      case 'micromobility': return import('../pages/projects/Micromobility.jsx')
      case 'turret':        return import('../pages/projects/Turret.jsx')
      case 'vibration':     return import('../pages/projects/VibrationPCM.jsx')
      default:              return
    }
  }

  return (
    <div>
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <h2 className="text-3xl font-semibold">Engineering Projects</h2>
        </div>
        <p className="text-gray-400 max-w-2xl">Real-world engineering solutions with live monitoring capabilities</p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {items.map((p, index) => {
          const img = typeof p.image === 'string' ? p.image : ''
          const status = statusConfig[p.status] || statusConfig.COMPLETED
          const gradient = getProjectGradient(p)
          const metrics = liveMetrics[p.id] || p.metrics || {}

          // Decide the link
          const isCustom = customRoutes.has(p.id)
          const href = isCustom ? `/projects/${p.id}` : `/projects/${p.id}` // same URL, but custom route overrides generic in App.jsx

          return (
            <motion.article key={p.id || index}
              ref={el => cardRefs.current[p.id] = el}
              initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:index*0.06 }}
              onMouseMove={(e)=>handleMouseMove(e,p.id)} onMouseLeave={()=>handleMouseLeave(p.id)}
              onMouseEnter={() => { setHoveredId(p.id); if (isCustom) prefetchIfCustom(p.id) }}
              className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur transition-all duration-300"
              style={{ transformStyle:'preserve-3d', transition:'transform .25s ease-out' }}>

              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 pointer-events-none`}
                   style={{ transform:'translateZ(-10px)' }} />

              {/* Cover */}
              <div
                className="relative h-64 md:h-64 xl:h-60 overflow-hidden bg-gray-900"
                style={img ? {
                  backgroundImage: `url(${img})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center 60%',
                  backgroundRepeat: 'no-repeat'
                } : undefined}
              >
                <AnimatePresence>
                  {hoveredId === p.id && (
                    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                      className="absolute inset-0 pointer-events-none"
                      style={{ backgroundImage:'linear-gradient(rgba(0,255,231,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,231,0.08) 1px, transparent 1px)', backgroundSize:'22px 22px' }} />
                  )}
                </AnimatePresence>
                {p.category && (
                  <div className="absolute top-3 left-3 px-2 py-1 bg-black/50 backdrop-blur rounded text-xs text-cyan-400 font-mono">{p.category}</div>
                )}
              </div>

              <div className="relative p-5">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {Array.isArray(p.tech) && p.tech.slice(0,3).map(t => (
                    <span key={t} className="px-2 py-0.5 text-xs border border-white/10 rounded text-gray-300 hover:border-cyan-400/50 transition-colors">{t}</span>
                  ))}
                  {p.status && (
                    <span className={`ml-auto px-2 py-0.5 text-xs border rounded flex items-center gap-1 ${status.color}`}>
                      {status.pulse && <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />}{status.label}
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2">{p.title || 'Untitled Project'}</h3>
                <p className="text-sm text-gray-300">{p.summary || ''}</p>

                {Object.keys(metrics).length > 0 && (
                  <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity: hoveredId === p.id ? 1 : .7, height:'auto' }} className="mt-3 p-2 bg-black/30 rounded-lg">
                    <div className="text-xs font-mono text-cyan-400/70 mb-1">LIVE METRICS</div>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(metrics).slice(0,4).map(([k,v]) => (
                        <div key={k} className="text-xs">
                          <span className="text-gray-500">{k}:</span>
                          <span className="ml-1 text-cyan-400 font-semibold">
                            {v}{k.includes('temp') && '°C'}{k.includes('efficiency') && '%'}{k.includes('rate') && '/s'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* small inline links */}
                <div className="mt-3 flex flex-wrap gap-3">
                  {Array.isArray(p.links) && p.links.map(l => (
                    <motion.a key={l.label} href={l.href} whileHover={{ x:3 }} className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center gap-1 transition-colors">
                      {l.label}<span className="text-xs">→</span>
                    </motion.a>
                  ))}
                </div>

                {/* Glowing CTA to routed page */}
                <div className="mt-4">
                  <Link
                    to={href}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                               bg-gradient-to-r from-cyan-600 to-blue-700 text-white font-medium
                               shadow-[0_8px_24px_rgba(56,189,248,.35)] hover:shadow-[0_12px_36px_rgba(56,189,248,.45)]
                               hover:-translate-y-0.5 active:translate-y-0 transition-all"
                  >
                    View Full Info ↗
                  </Link>
                </div>

                {(p.aar && (p.aar.right || p.aar.wrong || p.aar.learned)) && (
                  <motion.button onClick={()=>setOpenId(openId===p.id?null:p.id)} whileHover={{ scale:1.05 }} whileTap={{ scale:.95 }}
                    className="mt-4 px-3 py-1 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-full text-cyan-400 transition-all">
                    {openId===p.id ? 'Hide AAR ↑' : 'View AAR ↓'}
                  </motion.button>
                )}

                <AnimatePresence>
                  {openId===p.id && (
                    <motion.div initial={{ opacity:0, height:0, y:-10 }} animate={{ opacity:1, height:'auto', y:0 }} exit={{ opacity:0, height:0, y:-10 }}
                      transition={{ type:'spring', stiffness:300, damping:30 }} className="mt-4 border-t border-white/10 pt-4 text-sm">
                      <div className="space-y-3">
                        <div className="text-cyan-300 font-mono text-xs mb-2">/// AFTER ACTION REVIEW ///</div>
                        {p.aar?.right && (<div className="pl-3 border-l-2 border-green-500/50"><span className="text-green-400 text-xs font-semibold block mb-1">✓ What Went Right</span><p className="text-gray-300 text-xs">{String(p.aar.right)}</p></div>)}
                        {p.aar?.wrong && (<div className="pl-3 border-l-2 border-red-500/50"><span className="text-red-400 text-xs font-semibold block mb-1">✗ What Went Wrong</span><p className="text-gray-300 text-xs">{String(p.aar.wrong)}</p></div>)}
                        {p.aar?.learned && (<div className="pl-3 border-l-2 border-yellow-500/50"><span className="text-yellow-400 text-xs font-semibold block mb-1">★ Lessons Learned</span><p className="text-gray-300 text-xs">{String(p.aar.learned)}</p></div>)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {hoveredId === p.id && (
                  <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ boxShadow:'0 20px 40px rgba(0, 255, 231, 0.12), 0 10px 20px rgba(139, 92, 246, 0.08)' }} />
                )}
              </AnimatePresence>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}
