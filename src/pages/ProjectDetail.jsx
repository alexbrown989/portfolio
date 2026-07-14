// src/pages/ProjectDetail.jsx
// Data-driven fallback for projects that don't have a hand-built detail page.
import { lazy, Suspense, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { projects } from '../content/projects'
import ProjectLayout from './ProjectLayout'
import YouTube from '../shared/Youtube'
import { SafeVideo } from '../shared/Media'
import {
  Container, PageHero, Glass, ProjectPager, ProjectCTA, BackToProjects,
} from '../shared/ui'

const STLViewer = lazy(() => import('../shared/STLViewer.jsx'))

export default function ProjectDetail() {
  const { id } = useParams()
  const project = projects.find(p => p.id === id)
  const chips = useMemo(() => project?.tech ?? [], [project])

  if (!project) {
    return (
      <ProjectLayout>
        <Container className="py-24">
          <div className="rounded-2xl border border-line bg-surface-2/60 p-8">
            <h1 className="text-2xl font-bold text-white">Project not found</h1>
            <p className="text-gray-400 mt-2 text-sm">
              We couldn’t find a project with the id <code className="font-mono text-brand-300">{id}</code>.
            </p>
            <div className="mt-5"><BackToProjects /></div>
          </div>
        </Container>
      </ProjectLayout>
    )
  }

  return (
    <ProjectLayout>
      <PageHero
        kicker={`// ${project.category || 'Project'}`}
        title={project.title}
        subtitle={project.summary}
        chips={chips}
        status={project.status ? { label: project.status, tone: project.status === 'DRAFT' ? 'warn' : 'brand' } : undefined}
      />

      <section className="pb-12">
        <Container>
          <div className="grid lg:grid-cols-[1.15fr_1fr] gap-6">
            <div className="space-y-5">
              {project.youtube && (
                <Glass pad={false}>
                  <YouTube url={project.youtube} title={project.title} />
                </Glass>
              )}

              {project.video && !project.youtube && (
                <Glass pad={false}>
                  <SafeVideo src={project.video} label={project.title} aspect="aspect-video" />
                </Glass>
              )}

              {project.stl && (
                <Glass pad={false}>
                  <Suspense fallback={
                    <div className="h-[420px] flex items-center justify-center text-brand-300 text-sm font-mono">
                      Loading 3D model…
                    </div>
                  }>
                    <STLViewer src={project.stl} height={480} layFlat />
                  </Suspense>
                  <div className="px-5 py-3 border-t border-line text-xs text-gray-400 font-mono">
                    Drag to rotate · Scroll to zoom · Double-click to reset
                  </div>
                </Glass>
              )}

              {project.image && !project.youtube && !project.video && !project.stl && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full rounded-2xl border border-line"
                />
              )}
            </div>

            <aside className="space-y-4">
              {project.long?.problem && (
                <Glass>
                  <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90 mb-1.5">Problem</div>
                  <p className="text-sm text-gray-300 leading-relaxed">{project.long.problem}</p>
                </Glass>
              )}
              {project.long?.approach && (
                <Glass>
                  <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90 mb-1.5">Approach</div>
                  <p className="text-sm text-gray-300 leading-relaxed">{project.long.approach}</p>
                </Glass>
              )}
              {Array.isArray(project.long?.results) && (
                <Glass>
                  <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90 mb-1.5">Results</div>
                  <ul className="list-disc pl-5 text-sm text-gray-300 space-y-1 leading-relaxed">
                    {project.long.results.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </Glass>
              )}
              {project.aar && (
                <Glass>
                  <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90 mb-2">After Action Review</div>
                  <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
                    {project.aar.right   && <div><b className="text-emerald-300">Right:</b> {project.aar.right}</div>}
                    {project.aar.wrong   && <div><b className="text-amber-300">Wrong:</b> {project.aar.wrong}</div>}
                    {project.aar.learned && <div><b className="text-brand-300">Learned:</b> {project.aar.learned}</div>}
                  </div>
                </Glass>
              )}
              {Array.isArray(project.downloads) && project.downloads.length > 0 && (
                <Glass>
                  <div className="text-[11px] font-mono uppercase tracking-[0.18em] text-brand-300/90 mb-2">Downloads</div>
                  <div className="flex flex-col gap-2">
                    {project.downloads.map((d, i) => (
                      <a key={i} href={d.href} download className="text-sm text-brand-300 hover:text-brand-200">
                        {d.label} ↧
                      </a>
                    ))}
                  </div>
                </Glass>
              )}
              <Link to="/#projects" className="text-sm text-brand-300 hover:text-brand-200 inline-block">
                ← Back to Projects
              </Link>
            </aside>
          </div>
        </Container>
      </section>

      <ProjectCTA />
      <ProjectPager currentId={project.id} />
    </ProjectLayout>
  )
}
