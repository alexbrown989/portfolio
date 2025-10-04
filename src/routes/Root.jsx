import { Routes, Route } from 'react-router-dom'
import App from '../App.jsx'                 // your current one-page home
import About from '../pages/About.jsx'       // full profile page
import ProjectDetail from '../pages/ProjectDetail.jsx'

export default function Root() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects/:id" element={<ProjectDetail />} />
      <Route path="*" element={<App />} />
    </Routes>
  )
}
