// src/pages/ProjectLayout.jsx
// Thin wrapper kept for backwards compatibility with existing project pages.
// All chrome now lives in the shared AppShell so Home and Project pages share
// the same background, nav, and typography stack.
import AppShell from '../shared/AppShell'

export default function ProjectLayout({ children }) {
  return <AppShell>{children}</AppShell>
}
