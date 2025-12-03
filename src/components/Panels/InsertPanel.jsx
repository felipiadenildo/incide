/**
 * InsertPanel - Painel Insert SIMPLES com highlight do tipo workspace
 * Elementos filtrados/opacos + todas categorias minimizadas por default
 */

import React from 'react'
import { ElementPalette } from '../Shared/ElementPalette.jsx'
import { useAppStore } from '../../store/useAppStore.js'
import ElementFactory from '../../services/elements/elementFactory.js'
import './InsertPanel.css'

export function InsertPanel({ activeWorkspaceId }) {
  const { workspaces, projectType, addElement } = useAppStore()
  
  const activeWorkspace = workspaces?.find(w => w.id === activeWorkspaceId)
  const workspaceType = activeWorkspace?.type || projectType || 'sandbox'

  const handleInsert = (type) => {
    const element = ElementFactory.create(type, { 
      x: 0, 
      y: 0,
      workspaceId: activeWorkspaceId 
    })
    addElement(element)
  }

  const projectTypeIcons = {
    sandbox: '🎨',
    tikz: '📐',
    circuittikz: '⚡'
  }

  const projectTypeLabels = {
    sandbox: 'Sandbox',
    tikz: 'TikZ',
    circuittikz: 'CircuiTikZ'
  }

  return (
    <div className="insert-panel">
      {/* Header com highlight do tipo workspace - Insert ESQUERDA | Tipo DIREITA */}
      <div className="insert-panel-header">
        <span className="insert-panel-title">Insert</span>
        <div className={`project-type-highlight ${workspaceType}`}>
          <span className="type-icon">
            {projectTypeIcons[workspaceType]}
          </span>
          <span className="type-label">
            {projectTypeLabels[workspaceType] || workspaceType}
          </span>
        </div>
      </div>

      {/* ElementPalette - recebe tipo para filtrar + minimizado por default */}
      <div className="element-palette-container">
        <ElementPalette 
          onInsert={handleInsert}
          activeWorkspaceType={workspaceType}
          collapsedByDefault={true}
        />
      </div>
    </div>
  )
}

export default InsertPanel
