// src/components/Navigation.jsx
import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { site } from '../content/siteConfig'
import OrbitWidget from './OrbitWidget'
import ZuluClock from './ZuluClock'
import ResumeLink from './ResumeLink'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => { setMobileOpen(false) }, [pathname, hash])

  // Smooth-scroll only when already on "/"
  const go = (e, href) => {
    if (!href?.startsWith('#')) return
    if (!isHome) return
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileOpen(false)
  }

  const hrefFor = (href) =>
    href?.startsWith('#') ? (isHome ? href : `/${href}`) : href || '/'

  const isActive = (href) => {
    if (!href) return false
    if (href === '/about')     return pathname === '/about'
    if (href.startsWith('#'))  return isHome && hash === href
    if (href === '/' || href === '#hero') return isHome && (!hash || hash === '#hero')
    return false
  }

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 transition-colors duration-200
        ${scrolled
          ? 'bg-surface-0/85 backdrop-blur-xl border-b border-line'
          : 'bg-transparent border-b border-transparent'}
      `}
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <Link
            to="/"
            className="flex items-center gap-3 group"
            aria-label={site.brand.name}
          >
            <div className="w-9 h-9 rounded-lg bg-surface-2 border border-brand-500/30 grid place-items-center transition-colors group-hover:border-brand-400/60">
              <span className="text-brand-300 font-mono font-bold text-sm tracking-tight">
                {site.brand.logoInitials || 'AB'}
              </span>
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-white tracking-tight">
                {site.brand.name}
              </span>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-gray-500">
                {site.brand.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {site.nav.map((link) => {
              const active = isActive(link.href)
              const cls = `
                relative inline-flex items-center px-3 py-2 rounded-lg text-sm transition-colors
                ${active
                  ? 'text-white bg-white/[0.04] border border-brand-500/30'
                  : 'text-gray-300 border border-transparent hover:text-white hover:bg-white/[0.03]'}
              `
              return link.href.startsWith('#') ? (
                <a
                  key={link.href}
                  href={hrefFor(link.href)}
                  onClick={(e) => go(e, link.href)}
                  className={cls}
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} to={link.href} className={cls}>
                  {link.label}
                </Link>
              )
            })}
            <ZuluClock />
            <OrbitWidget />
            <ResumeLink variant="ghost" className="ml-1" />
          </div>

          {/* Mobile toolbar — orbit widget stays accessible alongside menu */}
          <div className="md:hidden flex items-center gap-1.5">
            <OrbitWidget />
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="relative w-10 h-10 grid place-items-center rounded-lg border border-line hover:border-brand-400/60 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-5 h-5 text-brand-300" /> : <Menu className="w-5 h-5 text-brand-300" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {site.nav.map((link) =>
              link.href.startsWith('#') ? (
                <a
                  key={link.href}
                  href={hrefFor(link.href)}
                  onClick={(e) => go(e, link.href)}
                  className="block py-2 px-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.03] transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="block py-2 px-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/[0.03] transition-colors"
                >
                  {link.label}
                </Link>
              )
            )}
            <ResumeLink
              variant="primary"
              className="w-full justify-center mt-2"
              showIcon={false}
            >
              Resume
            </ResumeLink>
          </div>
        )}
      </div>
    </nav>
  )
}
