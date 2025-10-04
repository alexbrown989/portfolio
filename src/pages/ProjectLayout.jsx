// src/pages/ProjectLayout.jsx
import Navigation from '../components/Navigation'
import Particles from '../components/Particles'
import { AnimatePresence, motion } from 'framer-motion'

export default function ProjectLayout({ children }) {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      {/* Top nav on project pages */}
      <Navigation />

      {/* Background FX (matches Home vibe) */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* faint cyan grid */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        {/* soft orbs */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
            style={{ animationDelay: '1s' }}
          />
        </AnimatePresence>
        {/* lightweight particles */}
        <Particles count={0} />
      </div>

      <main className="relative z-10">{children}</main>
    </div>
  )
}
