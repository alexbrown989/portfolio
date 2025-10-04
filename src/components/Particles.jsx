import { useMemo } from 'react'

export default function Particles({ count = 80 }) {
  const dots = useMemo(() =>
    Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2.5,
      dur: 10 + Math.random() * 18,
      delay: -Math.random() * 20
    })), [count])

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <div
          key={d.id}
          className="absolute rounded-full bg-cyan-400/50"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
            animation: `floatY ${d.dur}s ease-in-out ${d.delay}s infinite`,
            boxShadow: '0 0 12px rgba(34,211,238,0.45)'
          }}
        />
      ))}
    </div>
  )
}
