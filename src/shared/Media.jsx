// src/shared/Media.jsx
// Graceful media components. If the referenced file has not been dropped
// into /public/projects/ yet, the layout still renders — you get a HUD-styled
// placeholder card with the expected filename, not a broken image icon.

import { useEffect, useRef, useState } from 'react'
import { Image as ImageIcon, Film, AlertCircle } from 'lucide-react'

function Placeholder({ label, path, kind }) {
  const Icon = kind === 'video' ? Film : ImageIcon
  return (
    <div className="w-full h-full grid place-items-center bg-surface-3/40 border border-dashed border-brand-500/25 rounded-xl text-center px-6">
      <div>
        <Icon className="w-6 h-6 text-brand-400/60 mx-auto" />
        <div className="mt-3 text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/80">
          Awaiting Asset
        </div>
        <div className="mt-1.5 text-sm text-white font-semibold">{label}</div>
        {path && (
          <div className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-mono text-gray-400 bg-surface-3/60 border border-line rounded px-2 py-0.5">
            <AlertCircle className="w-3 h-3 text-amber-300/70" />
            <code>{path}</code>
          </div>
        )}
      </div>
    </div>
  )
}

export function SafeImage({ src, alt, label, className = '', aspect = 'aspect-[16/10]', fit = 'cover' }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`relative ${aspect} w-full overflow-hidden rounded-xl border border-line bg-surface-3/40 ${className}`}>
      {!failed ? (
        <img
          src={src}
          alt={alt || ''}
          loading="lazy"
          onError={() => setFailed(true)}
          className={`w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
        />
      ) : (
        <Placeholder label={label || alt || 'Image'} path={src} kind="image" />
      )}
    </div>
  )
}

export function SafeVideo({
  src,
  poster,
  label,
  className = '',
  aspect = 'aspect-video',
  fit = 'contain',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = true,
}) {
  const [failed, setFailed] = useState(false)
  const ref = useRef(null)

  // Browsers only allow autoplay when the video is actually muted. React does
  // NOT reliably reflect the `muted` attribute to the DOM property, so we set
  // it imperatively and kick off playback once the element is mounted.
  const isMuted = muted || autoPlay
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.muted = isMuted
    el.defaultMuted = isMuted
    if (autoPlay) {
      const p = el.play?.()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }
  }, [isMuted, autoPlay, src])

  return (
    <div className={`relative ${aspect} w-full overflow-hidden rounded-xl border border-line bg-black ${className}`}>
      {!failed ? (
        <video
          ref={ref}
          src={src}
          poster={poster}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={isMuted}
          preload={autoPlay ? 'auto' : 'metadata'}
          playsInline
          onError={() => setFailed(true)}
          className={`w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
        />
      ) : (
        <Placeholder label={label || 'Video'} path={src} kind="video" />
      )}
    </div>
  )
}
