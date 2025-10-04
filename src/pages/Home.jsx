import { Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import Navigation from '../components/Navigation'
import Hero from '../components/Hero'
const Manifesto = lazy(() => import('../components/Manifesto'))
const MissionLog = lazy(() => import('../components/MissionLog').catch(() => ({ default: () => null })))
const Projects = lazy(() => import('../components/Projects'))
const Timeline = lazy(() => import('../components/Timeline').catch(() => ({ default: () => null })))
const Contact = lazy(() => import('../components/Contact'))
const Footer = lazy(() => import('../components/Footer'))

export default function Home({ config }) {
  return (
    <>
      <section id="hero" className="min-h-screen flex items-center justify-center">
        <Hero config={config} />
      </section>

      {/* Manifesto teaser section (has button to /about) */}
      <section id="manifesto" className="py-24">
        <div className="container mx-auto px-6">
          <Suspense fallback={null}><Manifesto /></Suspense>
        </div>
      </section>

      <Suspense fallback={null}><MissionLog /></Suspense>

      <section id="projects" className="py-32">
        <div className="container mx-auto px-6">
          <Suspense fallback={<div className="py-12 text-center text-gray-400">Loading projects…</div>}><Projects /></Suspense>
        </div>
      </section>

      <section id="timeline" className="py-32">
        <div className="container mx-auto px-6">
          <Suspense fallback={null}><Timeline /></Suspense>
        </div>
      </section>

      

      <section id="contact" className="py-32">
        <div className="container mx-auto px-6">
          <Suspense fallback={<div className="py-12 text-center text-gray-400">Loading contact…</div>}>
            <Contact config={config} />
          </Suspense>
        </div>
      </section>

      <Suspense fallback={null}><Footer /></Suspense>
    </>
  )
}
