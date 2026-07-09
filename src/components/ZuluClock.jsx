// src/components/ZuluClock.jsx
//
// Compact aerospace clock. Shows Zulu (UTC) time in the nav; on hover
// (or tap on mobile) reveals the local time in the target zones you
// care about. Character detail, not a load-bearing element.

import { useEffect, useState } from 'react'

function pad(n) { return n < 10 ? `0${n}` : `${n}` }

function fmt(date, tz) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false,
  }).formatToParts(date).reduce((a, p) => ({ ...a, [p.type]: p.value }), {})
  return `${parts.hour}:${parts.minute}`
}

export default function ZuluClock() {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000)
    return () => clearInterval(id)
  }, [])

  const utc = `${pad(now.getUTCHours())}:${pad(now.getUTCMinutes())}`
  const pst = fmt(now, 'America/Los_Angeles')
  const est = fmt(now, 'America/New_York')

  return (
    <div
      className="hidden xl:flex items-center gap-3 px-3 py-1.5 rounded-lg border border-line text-[10.5px] font-mono uppercase tracking-[0.18em] text-gray-400 group hover:border-brand-500/40 transition-colors relative"
      title="UTC · Pacific · Eastern"
    >
      <span className="text-brand-300">Z {utc}</span>
      <span className="hidden 2xl:inline text-gray-500">·</span>
      <span className="hidden 2xl:inline">PST {pst}</span>
      <span className="hidden 2xl:inline text-gray-500">·</span>
      <span className="hidden 2xl:inline">EST {est}</span>

      {/* Tooltip for smaller widths */}
      <div className="pointer-events-none absolute top-full right-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity 2xl:hidden bg-surface-1/95 border border-line rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
        <div className="text-brand-300">Zulu · {utc}</div>
        <div className="text-gray-400">Pacific · {pst}</div>
        <div className="text-gray-400">Eastern · {est}</div>
      </div>
    </div>
  )
}
