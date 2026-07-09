// src/shared/AppShell.jsx
// One background, one nav, one boot-reveal. Every page renders inside this
// shell so route changes feel like moving inside one product.

import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import Navigation from '../components/Navigation'
import ChatLauncher from '../components/chat/ChatLauncher'
import useKonami from './useKonami'
import { printConsoleWelcome } from './consoleWelcome'

function BackgroundFX() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-scanlines opacity-40" />
      <div
        className="absolute -top-40 left-1/4 w-[560px] h-[560px] rounded-full blur-3xl opacity-[0.18]"
        style={{ background: 'radial-gradient(circle, rgba(10,165,199,0.35), transparent 60%)' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-6%] w-[520px] h-[520px] rounded-full blur-3xl opacity-[0.14]"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 60%)' }}
      />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-surface-0" />
    </div>
  )
}

function ViewportCrosshairs() {
  const c = 'absolute w-3 h-3 border-brand-400/40'
  return (
    <div aria-hidden className="fixed inset-4 z-40 pointer-events-none">
      <span className={`${c} top-0 left-0 border-l border-t`} />
      <span className={`${c} top-0 right-0 border-r border-t`} />
      <span className={`${c} bottom-0 left-0 border-l border-b`} />
      <span className={`${c} bottom-0 right-0 border-r border-b`} />
    </div>
  )
}

// Fine scroll-progress line pinned under the nav. Uses framer-motion's
// useScroll so it does not re-render on every scroll event.
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 })
  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: '0 0' }}
      className="fixed top-16 left-0 right-0 z-40 h-px bg-gradient-to-r from-brand-500 via-brand-400 to-accent-400 pointer-events-none"
    />
  )
}

// Handle anchor scrolling when arriving from another route. On plain route
// changes, jump to top so About / project pages don't inherit the last
// scroll position.
function useRouteScroll() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const id = hash.slice(1)
      // Wait one frame so the target has mounted.
      requestAnimationFrame(() => {
        const el = document.getElementById(id)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        else window.scrollTo({ top: 0 })
      })
    } else {
      window.scrollTo({ top: 0 })
    }
  }, [pathname, hash])
}

// Small classified-mode banner: only shown after the Konami code trigger.
// Lives for 30 seconds then disappears. Doesn't touch anything else.
function ClassifiedBanner({ active, onDismiss }) {
  useEffect(() => {
    if (!active) return
    const id = setTimeout(onDismiss, 30_000)
    return () => clearTimeout(id)
  }, [active, onDismiss])
  if (!active) return null
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -32, opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed top-16 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-md border border-amber-400/60 bg-amber-500/[0.10] backdrop-blur text-amber-200 text-[10.5px] font-mono uppercase tracking-[0.24em] shadow-lg pointer-events-none"
    >
      // Classified · You found the easter egg · Auto-dismiss in 30s
    </motion.div>
  )
}

export default function AppShell({ children }) {
  const { pathname } = useLocation()
  const [key, setKey] = useState(pathname)
  const [classified, setClassified] = useState(false)

  useRouteScroll()
  useKonami(() => setClassified(true))

  useEffect(() => { setKey(pathname) }, [pathname])
  useEffect(() => { printConsoleWelcome() }, [])

  return (
    <div className={`min-h-screen relative bg-surface-0 text-gray-100 antialiased selection:bg-brand-500/25 ${classified ? 'classified-mode' : ''}`}>
      <BackgroundFX />
      <ViewportCrosshairs />
      <Navigation />
      <ScrollProgress />
      <AnimatePresence>
        <ClassifiedBanner active={classified} onDismiss={() => setClassified(false)} />
      </AnimatePresence>
      <main key={key} className="relative z-10 boot-reveal">
        {children}
      </main>
      <ChatLauncher />
    </div>
  )
}
