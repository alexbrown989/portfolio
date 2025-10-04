// src/pages/ProjectDetail.jsx
import { lazy, Suspense, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { projects } from '../content/projects'
import ProjectLayout from './ProjectLayout'
import YouTube from '../shared/YouTube'

const STLViewer = lazy(() => import('../shared/STLViewer.jsx'))

function Chip({ children }) {
  return (
    <span className="px-2 py-0.5 text-xs rounded border border-white/12 bg-white/5 text-gray-200">
      {children}
    </span>
  )
}

function Card({ title, children }) {
  return (
    <div className="rounded-2xl p-5 bg-white/7 border border-white/12 relative overflow-hidden group">
      <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative">
        {title && <div className="text-sm text-gray-300 mb-2">{title}</div>}
        {children}
      </div>
    </div>
  )
}

export default function ProjectDetail() {
  const { id } = useParams()
  const project = projects.find(p => p.id === id)

  if (!project) {
    return (
      <ProjectLayout>
        <div className="container mx-auto px-6 py-24">
          <div className="rounded-xl border border-white/10 bg-white/5 p-8">
            <h1 className="text-2xl font-bold text-white">Project not found</h1>
            <Link className="text-cyan-300 mt-4 inline-block" to="/#projects">← Back to Projects</Link>
          </div>
        </div>
      </ProjectLayout>
    )
  }

  const chips = useMemo(() => project.tech ?? [], [project])

  return (
    <ProjectLayout>
      {/* Header */}
      <section className="pt-24 pb-6">
        <div className="container mx-auto px-6">
          <div className="text-[11px] font-mono uppercase tracking-[0.25em] text-cyan-200">// Project</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-2">{project.title}</h1>
          <p className="text-gray-300 mt-3 max-w-3xl">{project.summary}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((t) => <Chip key={t}>{t}</Chip>)}
          </div>
        </div>
      </section>

      {/* Media + Details */}
      <section className="pb-14">
        <div className="container mx-auto px-6 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* YouTube first if present */}
            {project.youtube && (
              <YouTube url={project.youtube} title={project.title} />
            )}

            {project.video && !project.youtube && (
              <video
                src={project.video}
                controls
                className="w-full rounded-2xl border border-white/10 bg-black object-cover"
              />
            )}

            {project.stl && (
              <Suspense fallback={null}>
                {/* layFlat keeps models horizontal */}
                <STLViewer src={project.stl} height={520} layFlat className="mt-0" />
              </Suspense>
            )}

            {Array.isArray(project.gallery) && project.gallery.length > 0 && (
              <div className="grid sm:grid-cols-2 gap-4">
                {project.gallery.map((src, i) => (
                  <img key={i} src={src} alt="" className="rounded-xl border border-white/10 bg-white/5 object-cover" />
                ))}
              </div>
            )}
          </div>

          <aside className="space-y-6">
            {project.long?.problem && (
              <Card title="Problem">
                <div className="text-sm text-gray-200">{project.long.problem}</div>
              </Card>
            )}

            {project.long?.approach && (
              <Card title="Approach">
                <div className="text-sm text-gray-200">{project.long.approach}</div>
              </Card>
            )}

            {Array.isArray(project.long?.results) && (
              <Card title="Results">
                <ul className="list-disc pl-5 text-gray-200 text-sm space-y-1">
                  {project.long.results.map((r, i) => <li key={i}>{r}</li>)}
                </ul>
              </Card>
            )}

            {Array.isArray(project.downloads) && project.downloads.length > 0 && (
              <Card title="Downloads">
                <div className="flex flex-col gap-2">
                  {project.downloads.map((d,i) => (
                    <a key={i} href={d.href} download className="text-cyan-300 hover:text-cyan-200 text-sm">
                      {d.label} ↧
                    </a>
                  ))}
                </div>
              </Card>
            )}

            <Link className="inline-block text-cyan-300" to="/#projects">← Back to Projects</Link>
          </aside>
        </div>
      </section>
    </ProjectLayout>
  )
}
