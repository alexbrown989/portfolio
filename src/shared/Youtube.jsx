// src/shared/YouTube.jsx
import { useMemo, useState } from 'react'

function getIdFromUrl(urlOrId = '') {
  // accepts full URL or a bare ID
  if (!urlOrId) return ''
  if (/^[\w-]{11}$/.test(urlOrId)) return urlOrId
  const m =
    urlOrId.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/) ||
    urlOrId.match(/\/shorts\/([\w-]{11})/)
  return m ? m[1] : ''
}

export default function YouTube({ url, id, title = 'YouTube video', className = '' }) {
  const videoId = useMemo(() => getIdFromUrl(id || url), [id, url])
  const [playing, setPlaying] = useState(false)
  const poster = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`

  return (
    <div className={`relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black ${className}`}>
      {!playing ? (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="w-full h-full text-left"
          aria-label="Play video"
        >
          <img
            src={poster}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-full p-4 bg-white/15 backdrop-blur border border-white/20">
              <svg width="42" height="42" viewBox="0 0 24 24" fill="currentColor" className="text-white">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </button>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  )
}
