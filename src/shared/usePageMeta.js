// src/shared/usePageMeta.js
//
// Lightweight document-head updater. On mount, replaces <title> and
// selected <meta>/link tags for the current route. On unmount, restores
// the previous values. No external dependency; no re-renders. Enough
// for Google-rendered SPA indexing and per-page share previews.

import { useEffect } from 'react'

const CANONICAL = 'https://alexandercbrown.com'

function setMeta(name, content, isProperty = false) {
  if (!content) return null
  const attr = isProperty ? 'property' : 'name'
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  const prev = el ? el.getAttribute('content') : null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
  return { el, prev, created: prev === null && !document.head.querySelector(`meta[${attr}="${name}"][data-existed]`) }
}

function setCanonical(url) {
  let el = document.head.querySelector('link[rel="canonical"]')
  const prev = el ? el.getAttribute('href') : null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', url)
  return { el, prev }
}

/**
 * Update document meta for the current page. All fields optional; falls
 * back to the site defaults from index.html.
 *
 * @param {object} opts
 * @param {string} opts.title        - Full <title> string
 * @param {string} opts.description  - Meta description
 * @param {string} opts.path         - Path portion of the canonical URL (e.g. '/projects/gearbox')
 * @param {string} [opts.image]      - Absolute or root-relative og:image
 */
export function usePageMeta({ title, description, path, image } = {}) {
  useEffect(() => {
    const prevTitle = document.title
    if (title) document.title = title

    const url = path
      ? `${CANONICAL}${path.startsWith('/') ? path : `/${path}`}`
      : CANONICAL + '/'

    const restore = []
    const canonical = setCanonical(url)
    restore.push(() => { if (canonical.prev) canonical.el.setAttribute('href', canonical.prev) })

    const applyMeta = (name, content, prop = false) => {
      if (content == null) return
      const r = setMeta(name, content, prop)
      if (r && r.prev !== null) restore.push(() => r.el.setAttribute('content', r.prev))
    }

    applyMeta('description', description)
    applyMeta('og:title',       title, true)
    applyMeta('og:description', description, true)
    applyMeta('og:url',         url, true)
    applyMeta('twitter:title',       title)
    applyMeta('twitter:description', description)
    applyMeta('twitter:url',         url)
    if (image) {
      const full = image.startsWith('http') ? image : `${CANONICAL}${image.startsWith('/') ? image : `/${image}`}`
      applyMeta('og:image',      full, true)
      applyMeta('twitter:image', full)
    }

    return () => {
      if (title) document.title = prevTitle
      for (const fn of restore) fn()
    }
  }, [title, description, path, image])
}
