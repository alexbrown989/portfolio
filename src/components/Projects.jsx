// src/components/Projects.jsx
// Restrained project grid — no fake "live metrics", no wash-out gradient over
// the images. Each card is a straight information object: cover, chips,
// title, one-line summary, and a single CTA into the detail page.

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { projects } from '../content/projects'
import { SectionTitle, Chip, StatusPill } from '../shared/ui'
import { SafeImage } from '../shared/Media'

// Ids that have a hand-built detail page. All go through /projects/:id in
// the router (see App.jsx), so a single href pattern is fine.
const CUSTOM_ROUTES = new Set([
  'beth', 'coastal', 'micromobility', 'turret', 'vibration',
  'multitool', 'gearbox',
])

const STATUS = {
  ACTIVE:    { tone: 'brand',  pulse: true,  label: 'Active' },
  DEPLOYED:  { tone: 'ok',     pulse: true,  label: 'Deployed' },
  COMPLETED: { tone: 'idle',   pulse: false, label: 'Completed' },
  DRAFT:     { tone: 'warn',   pulse: false, label: 'Draft' },
  'R&D':     { tone: 'brand',  pulse: true,  label: 'R&D' },
}

// Prefetch bundles on hover so navigation feels instant.
async function prefetch(id) {
  switch (id) {
    case 'beth':          return import('../pages/projects/BETH.jsx')
    case 'coastal':       return import('../pages/projects/Coastal.jsx')
    case 'micromobility': return import('../pages/projects/Micromobility.jsx')
    case 'turret':        return import('../pages/projects/Turret.jsx')
    case 'vibration':     return import('../pages/projects/VibrationPCM.jsx')
    case 'multitool':     return import('../pages/projects/MultiToolFab.jsx')
    case 'gearbox':       return import('../pages/projects/Gearbox.jsx')
    default:              return
  }
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false)
  const status = STATUS[project.status] || STATUS.COMPLETED
  const href = `/projects/${project.id}`
  const indexLabel = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      onMouseEnter={() => {
        setHovered(true)
        if (CUSTOM_ROUTES.has(project.id)) prefetch(project.id)
      }}
      onMouseLeave={() => setHovered(false)}
      className="group relative rounded-2xl overflow-hidden border border-line bg-surface-2/60 backdrop-blur-sm shadow-card hover:border-brand-500/40 hover:shadow-card-hover transition-[border-color,box-shadow,transform] duration-200"
    >
      {/* Corner brackets — HUD accent */}
      {['top-2 left-2 border-l border-t','top-2 right-2 border-r border-t','bottom-2 left-2 border-l border-b','bottom-2 right-2 border-r border-b']
        .map((pos) => (
          <span
            key={pos}
            aria-hidden
            className={`pointer-events-none absolute ${pos} w-2.5 h-2.5 border-brand-400/0 group-hover:border-brand-400/60 transition-colors duration-200`}
          />
        ))}

      <Link to={href} className="block">
        {/* Cover */}
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-3">
          <SafeImage
            src={project.image}
            alt=""
            label={project.title}
            aspect="aspect-[16/10]"
            className="border-0 rounded-none"
          />
          {/* Subtle bottom fade */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-2 to-transparent" />
          {/* Index tag top-left */}
          <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.22em] rounded bg-surface-0/70 backdrop-blur border border-brand-500/25 text-brand-200">
            <span className="text-gray-500">P/</span>
            {indexLabel}
          </div>
          {/* Status pill top-right */}
          {project.status && (
            <div className="absolute top-3 right-3">
              <StatusPill label={status.label} tone={status.tone} pulse={status.pulse} />
            </div>
          )}
          {/* Category chip bottom-left */}
          {project.category && (
            <div className="absolute bottom-3 left-3">
              <Chip>{project.category}</Chip>
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-white tracking-tight leading-snug">
            {project.title}
          </h3>
          {project.summary && (
            <p className="text-sm text-gray-400 mt-2 leading-relaxed line-clamp-3">
              {project.summary}
            </p>
          )}

          {Array.isArray(project.tech) && project.tech.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.slice(0, 4).map((t) => (
                <span
                  key={t}
                  className="text-[11px] px-2 py-0.5 rounded border border-line text-gray-300"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-brand-300 font-medium inline-flex items-center gap-1 group-hover:text-brand-200 transition-colors">
              View case study
              <ArrowRight
                className={`w-4 h-4 transition-transform ${hovered ? 'translate-x-0.5' : ''}`}
              />
            </span>
            {project.year && (
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-gray-500">
                {project.year}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
  )
}

export default function Projects() {
  const items = Array.isArray(projects) ? projects : []

  return (
    <div>
      <SectionTitle
        code="SEC 002"
        kicker="Selected work"
        title="Engineering Projects"
        subtitle="Case studies from R&D and hands-on manufacturing. Every project ties a hypothesis to a build, a measurement, and a lesson."
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((p, i) => (
          <ProjectCard key={p.id || i} project={p} index={i} />
        ))}
      </div>
    </div>
  )
}
