import { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { site } from '../content/siteConfig'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const isHome = pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Smooth-scroll only when already on "/"
  const go = (e, href) => {
    if (!href?.startsWith('#')) return // let router handle real paths
    if (!isHome) return // allow normal navigation to "/#section"
    e.preventDefault()
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setMobileMenuOpen(false)
  }

  // Make anchor hrefs work both on "/" and other routes
  const hrefFor = (href) =>
    href?.startsWith('#') ? (isHome ? href : `/${href}`) : href || '/'

  // Active link styles
  const isActive = (href) => {
    if (!href) return false
    if (href === '/about') return pathname === '/about'
    if (href.startsWith('#')) return isHome && hash === href
    if (href === '/' || href === '#hero') return isHome && (!hash || hash === '#hero')
    return false
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-gray-900/95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand */}
          <motion.a
            href={hrefFor('#hero')}
            onClick={(e) => go(e, '#hero')}
            className="flex items-center gap-2 group"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 grid place-items-center shadow-lg shadow-cyan-500/20">
              <span className="text-white font-bold text-xl">
                {site.brand.logoEmoji}
              </span>
            </div>
            <span className="text-lg font-bold text-white hidden sm:block">
              {site.brand.name}
            </span>
          </motion.a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-2">
            {site.nav.map((link) => {
              const active = isActive(link.href)
              const content = (
                <span className="relative inline-flex items-center px-3 py-2 rounded-lg">
                  <span
                    className={`text-sm font-medium transition-colors ${
                      active ? 'text-white' : 'text-gray-300 hover:text-cyan-300'
                    }`}
                  >
                    {link.label}
                  </span>
                  {/* glow pill */}
                  <span
                    className={`absolute inset-0 rounded-lg -z-10 transition ${
                      active
                        ? 'bg-white/8 border border-white/15 shadow-[0_0_24px_rgba(34,211,238,.25)]'
                        : 'border border-transparent hover:bg-white/5 hover:border-white/10'
                    }`}
                  />
                </span>
              )

              // route vs anchor
              return link.href.startsWith('#') ? (
                <a
                  key={link.href}
                  href={hrefFor(link.href)}
                  onClick={(e) => go(e, link.href)}
                  className="relative"
                >
                  {content}
                </a>
              ) : (
                <Link key={link.href} to={link.href} className="relative">
                  {content}
                </Link>
              )
            })}

            {/* Optional resume button (kept subtle) */}
            <a
              href="/resume.pdf"
              target="_blank"
              className="ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-lg
                         text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-700
                         shadow-[0_8px_24px_rgba(56,189,248,.35)] hover:shadow-[0_12px_36px_rgba(56,189,248,.45)]
                         hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              Resume ↗
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="md:hidden relative w-10 h-10 flex items-center justify-center"
            aria-label="Toggle menu"
          >
            <div className="space-y-1.5">
              <motion.div
                animate={mobileMenuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-cyan-400"
              />
              <motion.div
                animate={mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-cyan-400"
              />
              <motion.div
                animate={mobileMenuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-cyan-400"
              />
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-3 pb-3 space-y-1"
          >
            {site.nav.map((link) =>
              link.href.startsWith('#') ? (
                <a
                  key={link.href}
                  href={hrefFor(link.href)}
                  onClick={(e) => go(e, link.href)}
                  className="block py-2 px-4 text-gray-300 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-all"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 px-4 text-gray-300 hover:text-cyan-300 hover:bg-white/5 rounded-lg transition-all"
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href="/resume.pdf"
              target="_blank"
              className="block py-2 px-4 text-white bg-gradient-to-r from-cyan-600 to-blue-700 rounded-lg text-center font-semibold"
              onClick={() => setMobileMenuOpen(false)}
            >
              Resume
            </a>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
