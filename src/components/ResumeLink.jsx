// src/components/ResumeLink.jsx
//
// Shared resume link. PDF links use the browser's native download behavior:
// no blank tab, popup, delayed navigation, or animation.

import { Link } from 'react-router-dom'
import { FileDown, ArrowUpRight } from 'lucide-react'

const RESUME_URL = '/Resume.pdf'
const HTML_URL   = '/resume'

/**
 * Resume anchor. Pass `format="pdf"` (default) to download the PDF, or
 * `format="html"` to route to the printable HTML resume view.
 * Any children override the default label.
 */
export default function ResumeLink({
  format = 'pdf',
  className = '',
  children,
  variant = 'default',
  showIcon = true,
}) {
  const label = children || (format === 'pdf' ? 'Resume' : 'Print-friendly resume')
  const Icon = format === 'pdf' ? FileDown : ArrowUpRight

  const buttonCls =
    variant === 'primary'
      ? `glow-btn inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 text-white text-sm font-semibold hover:bg-brand-400 transition-colors ${className}`
      : variant === 'ghost'
      ? `inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white bg-brand-500 hover:bg-brand-400 transition-colors ${className}`
      : `inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-line text-gray-300 hover:text-white hover:border-brand-400/60 transition-colors ${className}`

  if (format === 'html') {
    return (
      <Link to={HTML_URL} className={buttonCls}>
        {showIcon && <Icon className="w-4 h-4" />}
        {label}
      </Link>
    )
  }

  return (
    <a
      href={RESUME_URL}
      download="alex-brown-resume.pdf"
      className={buttonCls}
    >
      {showIcon && <Icon className="w-4 h-4" />}
      {label}
    </a>
  )
}
