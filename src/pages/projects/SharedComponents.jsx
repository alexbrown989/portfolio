// src/components/project/SharedComponents.jsx
import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'

// Reusable Glass component with consistent styling
export function Glass({ children, className='', hover=true, delay=0 }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={hover ? { scale: 1.02, y: -4 } : {}}
      className={`rounded-2xl border border-white/12 bg-white/7 backdrop-blur-sm relative overflow-hidden group ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="relative p-5">{children}</div>
    </motion.div>
  )
}

// Animated statistic card
export function StatCard({ label, value, delay = 0, color = "cyan" }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  
  const gradients = {
    cyan: "from-cyan-400 to-blue-400",
    purple: "from-purple-400 to-pink-400",
    green: "from-green-400 to-emerald-400"
  }
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.5, type: "spring" }}
      className="rounded-xl border border-white/12 bg-gradient-to-br from-white/10 to-white/5 p-4 hover:border-cyan-400/30 transition-all duration-300"
    >
      <div className="text-xs text-gray-400">{label}</div>
      <motion.div 
        className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${gradients[color]} mt-1`}
        animate={inView ? { scale: [1, 1.1, 1] } : {}}
        transition={{ delay: delay + 0.3, duration: 0.5 }}
      >
        {value}
      </motion.div>
    </motion.div>
  )
}

// AAR (After Action Review) component
export function AARSection({ aar }) {
  if (!aar) return null
  
  const items = [
    { icon: '✓', color: 'text-green-400', label: 'What went right', text: aar.right },
    { icon: '⚠', color: 'text-yellow-400', label: 'What went wrong', text: aar.wrong },
    { icon: '→', color: 'text-purple-400', label: 'Lessons learned', text: aar.learned }
  ]
  
  return (
    <Glass>
      <h3 className="text-sm font-mono text-cyan-400 mb-4 uppercase tracking-wider">// After Action Review</h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-3"
          >
            <span className={`${item.color} mt-0.5`}>{item.icon}</span>
            <div className="flex-1">
              <div className="text-xs text-gray-400 mb-1">{item.label}</div>
              <div className="text-sm text-gray-200">{item.text}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </Glass>
  )
}

// Tech stack pills with hover effects
export function TechStack({ tech = [] }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="flex flex-wrap gap-2"
    >
      {tech.map((t, i) => (
        <motion.span 
          key={t}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.05 }}
          whileHover={{ scale: 1.1, y: -2 }}
          className="px-3 py-1 text-xs rounded-full border border-white/20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 text-gray-200 cursor-default"
        >
          {t}
        </motion.span>
      ))}
    </motion.div>
  )
}

// Project metrics grid
export function MetricsGrid({ metrics = [] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {metrics.map((metric, i) => (
        <StatCard
          key={metric.label}
          label={metric.label}
          value={metric.value}
          color={metric.color || "cyan"}
          delay={i * 0.1}
        />
      ))}
    </div>
  )
}

// Animated section header
export function SectionHeader({ children, badge }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="flex items-center gap-3 mb-6"
    >
      <h2 className="text-2xl font-bold text-white">{children}</h2>
      {badge && (
        <motion.span 
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="text-xs px-2 py-1 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full text-green-300 border border-green-400/30"
        >
          {badge}
        </motion.span>
      )}
    </motion.div>
  )
}

// Enhanced CTA section
export function ProjectCTA({ 
  title = "Want to learn more?",
  subtitle = "Get in touch to discuss this project",
  links = []
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl p-8 text-center text-white overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-80" />
      <motion.div
        animate={{ 
          x: [0, 100, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute -top-20 -left-20 w-96 h-96 bg-white/20 rounded-full blur-3xl"
      />
      
      <div className="relative">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-white/80 mb-6">{subtitle}</p>
        
        <div className="flex flex-wrap gap-3 justify-center">
          {links.map((link, i) => (
            <motion.a 
              key={i}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-lg bg-white/20 backdrop-blur border border-white/30 hover:bg-white/30 transition-all"
              href={link.href}
              download={link.download}
              target={link.external ? "_blank" : undefined}
            >
              {link.label}
            </motion.a>
          ))}
        </div>
      </div>
    </motion.div>
  )
}