// src/App.jsx
// Root router. Wraps every route in the shared AppShell so navigation, chrome,
// and background are identical across Home, About, and project detail pages.

import { Suspense, lazy, Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppShell from './shared/AppShell'
import Hero from './components/Hero'

/* ----- Lazy modules ----- */
const Projects      = lazy(() => import('./components/Projects'))
const Contact       = lazy(() => import('./components/Contact'))
const Footer        = lazy(() => import('./components/Footer'))
const Manifesto     = lazy(() => import('./components/Manifesto'))
const Timeline      = lazy(() => import('./components/Timeline'))
const AboutPage     = lazy(() => import('./pages/About'))

const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const BETH          = lazy(() => import('./pages/projects/BETH.jsx'))
const Coastal       = lazy(() => import('./pages/projects/Coastal.jsx'))
const Micromobility = lazy(() => import('./pages/projects/Micromobility.jsx'))
const Turret        = lazy(() => import('./pages/projects/Turret.jsx'))
const VibrationPCM  = lazy(() => import('./pages/projects/VibrationPCM.jsx'))
const TernaryAdder  = lazy(() => import('./pages/projects/TernaryAdder.jsx'))
const FEAValidation = lazy(() => import('./pages/projects/FEAValidation.jsx'))

/* ----- Error boundary ----- */
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null } }
  static getDerivedStateFromError(error) { return { hasError: true, error } }
  componentDidCatch(error, info) {
    if (typeof console !== 'undefined') {
      console.error(`Error in ${this.props.name}`, error, info)
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mx-auto max-w-3xl my-8 px-6">
          <div className="rounded-xl border border-red-500/25 bg-red-500/[0.06] p-5">
            <h3 className="text-red-300 font-semibold mb-2">
              Something went wrong in {this.props.name}
            </h3>
            <details className="text-xs text-gray-400">
              <summary className="cursor-pointer hover:text-gray-300">Details</summary>
              <pre className="mt-2 p-2 bg-black/40 rounded overflow-auto">
                {this.state.error?.toString()}
              </pre>
            </details>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

/* ----- Loading state ----- */
function LoadingFallback({ message = 'Loading…' }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-brand-500/25 border-t-brand-400 rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-mono uppercase tracking-[0.2em] text-gray-400">{message}</p>
      </div>
    </div>
  )
}

/* ----- Home content ----- */
function HomeContent() {
  return (
    <>
      <section id="hero" className="min-h-[92vh] flex items-center">
        <ErrorBoundary name="Hero"><Hero /></ErrorBoundary>
      </section>

      <ErrorBoundary name="Manifesto">
        <Suspense fallback={null}>
          <section id="manifesto" className="py-20">
            <Manifesto />
          </section>
        </Suspense>
      </ErrorBoundary>

      <section id="projects" className="py-24 md:py-28">
        <div className="container mx-auto px-6 max-w-6xl">
          <ErrorBoundary name="Projects">
            <Suspense fallback={<LoadingFallback message="Loading projects" />}>
              <Projects />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      <ErrorBoundary name="Timeline">
        <Suspense fallback={null}>
          <section id="timeline" className="py-24 md:py-28">
            <Timeline />
          </section>
        </Suspense>
      </ErrorBoundary>

      <section id="contact" className="py-24 md:py-28">
        <div className="container mx-auto px-6 max-w-6xl">
          <ErrorBoundary name="Contact">
            <Suspense fallback={<LoadingFallback message="Loading contact" />}>
              <Contact />
            </Suspense>
          </ErrorBoundary>
        </div>
      </section>

      <ErrorBoundary name="Footer">
        <Suspense fallback={null}><Footer /></Suspense>
      </ErrorBoundary>
    </>
  )
}

function withBoundary(name, Node) {
  return (
    <ErrorBoundary name={name}>
      <Suspense fallback={<LoadingFallback message="Loading project" />}>
        {Node}
      </Suspense>
    </ErrorBoundary>
  )
}

/* ----- App ----- */
export default function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomeContent />} />

        <Route
          path="/about"
          element={
            <ErrorBoundary name="About">
              <Suspense fallback={<LoadingFallback message="Loading about" />}>
                <AboutPage />
              </Suspense>
            </ErrorBoundary>
          }
        />

        {/* Custom project pages override the generic detail route */}
        <Route path="/projects/beth"           element={withBoundary('BETH',          <BETH />)} />
        <Route path="/projects/coastal"        element={withBoundary('Coastal',       <Coastal />)} />
        <Route path="/projects/micromobility"  element={withBoundary('Micromobility', <Micromobility />)} />
        <Route path="/projects/turret"         element={withBoundary('Turret',        <Turret />)} />
        <Route path="/projects/vibration"      element={withBoundary('VibrationPCM',  <VibrationPCM />)} />
        <Route path="/projects/vibration-pcm"  element={withBoundary('VibrationPCM',  <VibrationPCM />)} />
        <Route path="/projects/ternary"        element={withBoundary('TernaryAdder',  <TernaryAdder />)} />
        <Route path="/projects/fea-validation" element={withBoundary('FEAValidation', <FEAValidation />)} />

        {/* Generic fallback for anything data-driven */}
        <Route path="/projects/:id" element={withBoundary('ProjectDetail', <ProjectDetail />)} />

        <Route path="*" element={<HomeContent />} />
      </Routes>
    </AppShell>
  )
}
