/**
 * TopBar - Header info only (sem botões de ação)
 */

import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import './TopBar.css'

export function TopBar() {
  const { project, elements } = useAppStore((state) => ({
    project: state.project,
    elements: state.elements,
  }))

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Logo */}
        <div className="topbar-logo">
          <span className="logo-icon">📐</span>
          <span className="logo-text">TikZ Editor</span>
        </div>
      </div>

      <div className="topbar-center">
        {/* Project name */}
        <span className="project-name">{project.name}</span>
      </div>

      <div className="topbar-right">
        {/* Project type */}
        <span className="info-label">
          {project.type === 'tikz' ? '🎨 TikZ' : '⚡ CircuitTikZ'}
        </span>

        {/* Element count */}
        <span className="info-label info-muted">
          Elements: {elements.length}
        </span>

        {/* Version */}
        <span className="info-label info-version">v2.2</span>
      </div>
    </header>
  )
}

export default TopBar
