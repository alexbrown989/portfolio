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

// Ids that have a hand-built detail page. All go through /projects/:id in
// the router (see App.jsx), so a single href pattern is fine.
const CUSTOM_ROUTES = new Set([
  'beth', 'coastal', 'micromobility', 'turret', 'vibration',
  'multitool', 'gearbox', 'fea-validation',
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
    case 'fea-validation':return import('../pages/projects/FEAValidation.jsx')
    default:              return
  }
}

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false)
  const status = STATUS[project.status] || STATUS.COMPLETED
  const href = `/projects/${project.id}`

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
      <Link to={href} className="block">
        {/* Cover — clean image, no gradient wash. A subtle fade at the bottom
            keeps the chip strip readable. */}
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-3">
          {project.image ? (
            <img
              src={project.image}
              alt=""
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              style={{ objectPosition: 'center 55%' }}
            />
          ) : (
            <div className="w-full h-full bg-mesh" />
          )}
          {/* Subtle bottom fade */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-surface-2 to-transparent" />
          {/* Category chip top-left */}
          {project.category && (
            <div className="absolute top-3 left-3">
              <Chip>{project.category}</Chip>
            </div>
          )}
          {/* Status pill top-right */}
          {project.status && (
            <div className="absolute top-3 right-3">
              <StatusPill label={status.label} tone={status.tone} pulse={status.pulse} />
            </div>
          )}
        </div>

        <div className="p-5">
          <h3 className="text-lg font-semibold text-white tracking-tight">
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
              <span className="text-xs font-mono text-gray-500">{project.year}</span>
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
        kicker="// Selected Work"
        title="Engineering Projects"
        subtitle="Case studies from R&D — every project ties a hypothesis to a build, a measurement, and a lesson."
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {items.map((p, i) => (
          <ProjectCard key={p.id || i} project={p} index={i} />
        ))}
      </div>
    </div>
  )
}
