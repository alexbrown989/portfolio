// src/shared/AppShell.jsx
// One background, one nav, one boot-reveal. Every page renders inside this
// shell so route changes feel like moving inside one product instead of
// bouncing between separately-styled sites.

import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Navigation from '../components/Navigation'

function BackgroundFX() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-mesh" />
      {/* Fine engineering grid — masked so it fades at the edges */}
      <div className="absolute inset-0 bg-grid" />
      {/* Very subtle HUD scanlines */}
      <div className="absolute inset-0 bg-scanlines opacity-40" />
      {/* Two calm accent lights */}
      <div
        className="absolute -top-40 left-1/4 w-[560px] h-[560px] rounded-full blur-3xl opacity-[0.18]"
        style={{ background: 'radial-gradient(circle, rgba(10,165,199,0.35), transparent 60%)' }}
      />
      <div
        className="absolute bottom-[-10%] right-[-6%] w-[520px] h-[520px] rounded-full blur-3xl opacity-[0.14]"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.35), transparent 60%)' }}
      />
      {/* Bottom vignette to anchor content */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-surface-0" />
    </div>
  )
}

// Corner crosshair marks that anchor the viewport — set-and-forget HUD detail.
// Placed inside the sticky shell so they follow scroll and read as chrome.
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

export default function AppShell({ children }) {
  const { pathname } = useLocation()
  const [key, setKey] = useState(pathname)

  // Re-fire the boot-reveal animation on every route change so navigating
  // through the site feels like a system stepping through pages, not a
  // static SPA swap.
  useEffect(() => { setKey(pathname) }, [pathname])

  return (
    <div className="min-h-screen relative bg-surface-0 text-gray-100 antialiased selection:bg-brand-500/25">
      <BackgroundFX />
      <ViewportCrosshairs />
      <Navigation />
      <main key={key} className="relative z-10 boot-reveal">
        {children}
      </main>
    </div>
  )
}
