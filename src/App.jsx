// src/App.jsx
import { useEffect, useState, Suspense, lazy, Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// --- CORE COMPONENTS (always loaded) ---
import Navigation from './components/Navigation'
import Hero from './components/Hero'

// --- LAZY LOADED COMPONENTS (for performance) ---
const Projects      = lazy(() => import('./components/Projects'))
const Contact       = lazy(() => import('./components/Contact'))
const Footer        = lazy(() => import('./components/Footer'))
const Manifesto     = lazy(() => import('./components/Manifesto').catch(() => ({ default: () => null })))
const MissionLog    = lazy(() => import('./components/MissionLog').catch(() => ({ default: () => null })))
const Timeline      = lazy(() => import('./components/Timeline').catch(() => ({ default: () => null })))
const AboutPage     = lazy(() => import('./pages/About'))

// GENERIC project page (data-driven)
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))

// CUSTOM project pages (hand-built views)
const BETH          = lazy(() => import('./pages/projects/BETH.jsx'))
const Coastal       = lazy(() => import('./pages/projects/Coastal.jsx'))
const Micromobility = lazy(() => import('./pages/projects/Micromobility.jsx'))
const Turret        = lazy(() => import('./pages/projects/Turret.jsx'))
const VibrationPCM  = lazy(() => import('./pages/projects/VibrationPCM.jsx'))

// --- ERROR BOUNDARY ---
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  componentDidCatch(error, info) { console.error(`Error in ${this.props.name}`, error, info) }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 my-4 rounded-xl border border-red-500/20 bg-red-500/5">
          <h3 className="text-red-400 font-semibold mb-2">Component Error: {this.props.name}</h3>
          <details className="text-xs text-gray-400">
            <summary className="cursor-pointer hover:text-gray-300">Details</summary>
            <pre className="mt-2 p-2 bg-black/30 rounded overflow-auto">
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      )
    }
    return this.props.children
  }
}

// --- LOADING COMPONENT ---
const LoadingFallback = ({ message = 'Loading component...' }) => (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="w-12 h-12 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm text-gray-400 animate-pulse">{message}</p>
    </div>
  </div>
)

// --- MAIN APP ---
export default function App() {
  // Keep simple config used by components and background
  const [config, setConfig] = useState({
    particles: true,
    animations: true,
    liveData: true,
  })

  // Simple boot splash
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  // Shortcuts: toggle particles & jump home
  useEffect(() => {
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'p') { e.preventDefault(); setConfig(p => ({ ...p, particles: !p.particles })) }
        if (e.key === 'h') { e.preventDefault(); window.location.href = '/#hero' }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-2 border-4 border-purple-500/20 rounded-full" />
            <div
              className="absolute inset-2 border-4 border-purple-500 border-b-transparent rounded-full animate-spin"
              style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}
            />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-4">
            INITIALIZING SYSTEMS
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
          </div>
        </motion.div>
      </div>
    )
  }

  // Sections list for nav (unchanged)
  const sections = [
    { id: 'hero', label: 'Home', icon: '🏠' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'skills', label: 'Skills', icon: '⚙️' },
    { id: 'contact', label: 'Contact', icon: '📧' },
  ]

  // Background layer (shared by routes)
  const BackgroundFX = () => (
    <div className="fixed inset-0 pointer-events-none">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />
      <AnimatePresence>
        {config.particles && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: '1s' }}
            />
          </>
        )}
      </AnimatePresence>
    </div>
  )

  // Home page content
  const HomeContent = () => (
    <>
      {/* Hero */}
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <ErrorBoundary name="Hero"><Hero config={config} /></ErrorBoundary>
      </section>

      {/* Manifesto (optional) */}
      <ErrorBoundary name="Manifesto">
        <Suspense fallback={null}>
          <section id="manifesto" className="py-24">
            <div className="container mx-auto px-6"><Manifesto /></div>
          </section>
        </Suspense>
      </ErrorBoundary>

      {/* Mission Log (optional) */}
      <ErrorBoundary name="MissionLog">
        <Suspense fallback={null}><MissionLog sections={sections} /></Suspense>
      </ErrorBoundary>

      {/* Projects */}
      <section id="projects" className="py-32">
        <div className="container mx-auto px-6">
          <ErrorBoundary name="Projects">
            <Suspense fallback={<LoadingFallback message="Loading projects..." />}>
              <Projects config={config} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      {/* Timeline */}
      <ErrorBoundary name="Timeline">
        <Suspense fallback={null}>
          <section id="timeline" className="py-32">
            <div className="container mx-auto px-6"><Timeline /></div>
          </section>
        </Suspense>
      </ErrorBoundary>

      {/* Contact */}
      <section id="contact" className="py-32">
        <div className="container mx-auto px-6">
          <ErrorBoundary name="Contact">
            <Suspense fallback={<LoadingFallback message="Loading contact..." />}>
              <Contact config={config} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      {/* Footer */}
      <ErrorBoundary name="Footer">
        <Suspense fallback={null}><Footer /></Suspense>
      </ErrorBoundary>
    </>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100">
      <BackgroundFX />
      <Navigation sections={sections} />
      <main className="relative z-10">
        <Routes>
          <Route path="/" element={<HomeContent />} />
          <Route path="/about" element={<Suspense fallback={null}><AboutPage /></Suspense>} />

          {/* CUSTOM project pages override the generic route */}
          <Route path="/projects/beth"          element={<Suspense fallback={null}><BETH /></Suspense>} />
          <Route path="/projects/coastal"       element={<Suspense fallback={null}><Coastal /></Suspense>} />
          <Route path="/projects/micromobility" element={<Suspense fallback={null}><Micromobility /></Suspense>} />
          <Route path="/projects/turret"        element={<Suspense fallback={null}><Turret /></Suspense>} />
          <Route path="/projects/vibration"     element={<Suspense fallback={null}><VibrationPCM /></Suspense>} />

          {/* GENERIC project page for everything else */}
          <Route path="/projects/:id" element={<Suspense fallback={null}><ProjectDetail /></Suspense>} />

          <Route path="*" element={<HomeContent />} />
        </Routes>
      </main>

      {/* shortcuts */}
      <div className="fixed bottom-3 left-3 text-xs text-gray-500 font-mono hidden lg:block">
        <div>Shortcuts:</div>
        <div>Ctrl+P: Particles</div>
        <div>Ctrl+H: Home</div>
      </div>
    </div>
  )
}
