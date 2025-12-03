/**
 * CanvasTabs - Abas de projetos / documentos
 *
 * Por enquanto: uma aba estática "Main".
 * Depois: integrar com múltiplos projetos / documentos.
 */

import React from 'react'
import { useAppStore } from '../../../store/useAppStore'
import './CanvasTabs.css'

export function CanvasTabs() {
  const project = useAppStore((state) => state.project)

  return (
    <div className="canvas-tabs">
      <div className="canvas-tab canvas-tab-active">
        <span className="canvas-tab-title">
          {project.name || 'Main'}
        </span>
        <span className="canvas-tab-subtitle">
          {project.type === 'tikz' ? 'TikZ' : 'CircuitTikZ'}
        </span>
      </div>
    </div>
  )
}

export default CanvasTabs
