// src/shared/Media.jsx
// Graceful media components. If the referenced file has not been dropped
// into /public/projects/ yet, the layout still renders — you get a HUD-styled
// placeholder card with the expected filename, not a broken image icon.

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { Image as ImageIcon, Film, AlertCircle } from 'lucide-react'

// Ambient blurred backdrop used to fill the letterbox / pillarbox gaps when a
// portrait phone clip or off-ratio photo sits inside a landscape frame. This
// is the same "ambient mode" treatment YouTube / Instagram use so vertical
// media reads as intentional instead of black bars on a dark card.
const FILL_CLASS =
  'absolute inset-0 w-full h-full object-cover scale-125 blur-2xl saturate-150 opacity-45 pointer-events-none select-none'

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
  // Only contained media can leave gaps; cover media already fills the frame.
  const showFill = fit === 'contain' && !failed
  return (
    <div className={`relative ${aspect} w-full overflow-hidden rounded-xl border border-line bg-surface-2 ${className}`}>
      {!failed ? (
        <>
          {showFill && (
            <img src={src} alt="" aria-hidden loading="lazy" className={FILL_CLASS} />
          )}
          {showFill && <span aria-hidden className="absolute inset-0 bg-surface-0/35 pointer-events-none" />}
          <img
            src={src}
            alt={alt || ''}
            loading="lazy"
            onError={() => setFailed(true)}
            className={`relative z-10 w-full h-full ${fit === 'contain' ? 'object-contain' : 'object-cover'}`}
          />
        </>
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
  const fillRef = useRef(null)
  const reduce = useReducedMotion()

  // Ambient blurred video fill behind contained (letterboxed) clips. Skipped
  // for reduced-motion users — a static blurred poster stands in instead.
  const showVideoFill = fit === 'contain' && !failed && !reduce
  const showPosterFill = fit === 'contain' && !failed && reduce && Boolean(poster)

  // Browsers only allow autoplay when the video is actually muted. React does
  // NOT reliably reflect the `muted` attribute to the DOM property, so we set
  // it imperatively and kick off playback once the element is mounted.
  const isMuted = muted || autoPlay
  useEffect(() => {
    for (const el of [ref.current, fillRef.current]) {
      if (!el) continue
      el.muted = true
      el.defaultMuted = true
      if (autoPlay) {
        const p = el.play?.()
        if (p && typeof p.catch === 'function') p.catch(() => {})
      }
    }
  }, [isMuted, autoPlay, src, showVideoFill])

  return (
    <div className={`relative ${aspect} w-full overflow-hidden rounded-xl border border-line bg-surface-0 ${className}`}>
      {!failed ? (
        <>
          {showVideoFill && (
            <video
              ref={fillRef}
              src={src}
              poster={poster}
              autoPlay={autoPlay}
              loop={loop}
              muted
              playsInline
              tabIndex={-1}
              aria-hidden
              preload="auto"
              className={FILL_CLASS}
            />
          )}
          {showPosterFill && <img src={poster} alt="" aria-hidden className={FILL_CLASS} />}
          {(showVideoFill || showPosterFill) && (
            <span aria-hidden className="absolute inset-0 bg-surface-0/35 pointer-events-none" />
          )}
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
            className={`relative z-10 w-full h-full ${fit === 'cover' ? 'object-cover' : 'object-contain'}`}
          />
        </>
      ) : (
        <Placeholder label={label || 'Video'} path={src} kind="video" />
      )}
    </div>
  )
}
