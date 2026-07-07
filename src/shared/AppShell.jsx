// src/shared/AppShell.jsx
// One background & chrome layer for every page.
// The old app used two different background stacks (one in App.jsx for /, one
// in ProjectLayout for /projects/*) that fought each other on route changes.
// This component is now the single source of truth for site chrome so the
// Home → Project → About transition feels like moving inside one product.

import Navigation from '../components/Navigation'

function BackgroundFX() {
  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-mesh" />
      {/* Fine engineering grid — masked so it fades at the edges */}
      <div className="absolute inset-0 bg-grid" />
      {/* Two calm accent lights (not the neon orbs from before) */}
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

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen relative bg-surface-0 text-gray-100 antialiased">
      <BackgroundFX />
      <Navigation />
      <main className="relative z-10">{children}</main>
    </div>
  )
}
