import { useState } from 'react'

export function SectionTitle({ kicker = '', title }) {
  return (
    <div className="mb-4">
      {kicker ? (
        <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200">
          {kicker}
        </div>
      ) : null}
      <h2 className="text-2xl md:text-3xl font-bold text-white">{title}</h2>
      <div className="mt-2 h-px w-24 bg-gradient-to-r from-cyan-400/80 to-transparent rounded-full" />
    </div>
  )
}

export function Glass({ className = '', children }) {
  return (
    <div className={`rounded-2xl border border-white/12 bg-white/7 ${className}`}>
      {children}
    </div>
  )
}

export function DataCard({ label, value, children }) {
  return (
    <div className="rounded-xl border border-white/12 bg-white/7 p-4">
      <div className="text-xs text-gray-400">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {children}
    </div>
  )
}

export function Accordion({ items }) {
  return (
    <div className="space-y-3">
      {items.map((it, i) => <AccordionItem key={i} {...it} />)}
    </div>
  )
}

export function AccordionItem({ title, children }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-white/12 bg-white/7 overflow-hidden">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full text-left px-4 py-3 flex items-center justify-between"
      >
        <span className="text-sm font-semibold text-white">{title}</span>
        <span className="text-gray-400">{open ? '−' : '+'}</span>
      </button>
      <div className={`px-4 pb-4 text-sm text-gray-200 transition-all ${open ? 'block' : 'hidden'}`}>
        {children}
      </div>
    </div>
  )
}
