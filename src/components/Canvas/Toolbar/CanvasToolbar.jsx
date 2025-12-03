/**
 * CanvasToolbar - Layout ESQUERDA/DIREITA + Ícones minimalistas alinhados
 * 🔗 ESQUERDA: Gerais (Mode/Zoom/Grid) | DIREITA: Seleção (Edit/Delete)
 * 📱 Responsivo + Comentado para edição futura
 */

import React, { useState } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import './CanvasToolbar.css'

export function CanvasToolbar() {
  const [showModeDropdown, setShowModeDropdown] = useState(false)
  
  const {
    getSelectionCount,
    getSelectedElements,
    changeActiveWorkspaceType,
    toggleGrid,
    resetView,
    setEditorMode,
    editorMode,
    deleteElement,
    clearSelection
  } = useAppStore()

  const selectionCount = getSelectionCount()
  const canEditSelection = selectionCount > 0

  // ===============================
  // 🔧 WORKSPACE MODES (ESQUERDA)
  // ===============================
  const workspaceModes = [
    { id: 'sandbox', icon: '●', label: 'Mixed', tooltip: 'Todos elementos' },
    { id: 'tikz', icon: '▱', label: 'TikZ', tooltip: 'Diagramas TikZ' },
    { id: 'circuittikz', icon: '⟟', label: 'Circuit', tooltip: 'Circuitos' }
  ]

  const handleModeChange = (typeId) => {
    changeActiveWorkspaceType(typeId)
    setShowModeDropdown(false)
  }

  // ===============================
  // 🔧 SELECTION TOOLS (DIREITA)
  // ===============================
  const handleDelete = () => {
    if (!canEditSelection) return
    clearSelection()
  }

  const toggleEditorMode = () => {
    setEditorMode(editorMode === 'visual' ? 'code' : 'visual')
  }

  return (
    <div className="canvas-toolbar">
      {/* ================================= */
      /* 🔗 ESQUERDA: GENERAL TOOLS */
      /* ================================= */}
      <div className="toolbar-left">
        {/* Workspace Mode Dropdown */}
        <div className="mode-selector">
          <button 
            className="btn-icon"
            onClick={() => setShowModeDropdown(!showModeDropdown)}
            title="Workspace Mode"
          >
            {workspaceModes[0].icon}▾
          </button>
          
          {showModeDropdown && (
            <div className="dropdown">
              {workspaceModes.map(mode => (
                <button
                  key={mode.id}
                  className="dropdown-item"
                  onClick={() => handleModeChange(mode.id)}
                >
                  {mode.icon} {mode.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* View Controls */}
        <button className="btn-icon" onClick={toggleGrid} title="Grid (G)">
          ⋋
        </button>
        <button className="btn-icon" onClick={resetView} title="Reset (R)">
          ⟲
        </button>
      </div>

      {/* ================================= */
      /* 📏 SELECTION COUNTER CENTRAL */
      /* ================================= */}
      {selectionCount > 0 && (
        <div className="selection-counter" title={`${selectionCount} selecionados`}>
          {selectionCount}
        </div>
      )}

      {/* ================================= */
      /* 🔗 DIREITA: CONTEXTUAL TOOLS */
      /* ================================= */}
      <div className="toolbar-right">
        {/* Flip/Rotate (disabled sem seleção) */}
        <button 
          className={`btn-icon ${canEditSelection ? '' : 'disabled'}`}
          onClick={() => {}} // flipH
          title="Flip Horizontal (requer seleção)"
          disabled={!canEditSelection}
        >
          ⟷
        </button>
        
        <button 
          className={`btn-icon ${canEditSelection ? '' : 'disabled'}`}
          onClick={() => {}} // rotate
          title="Rotate 90° (requer seleção)"
          disabled={!canEditSelection}
        >
          ⟳
        </button>

        {/* Delete (disabled sem seleção) */}
        <button 
          className={`btn-icon ${canEditSelection ? '' : 'disabled'}`}
          onClick={handleDelete}
          title="Delete (Del) - requer seleção"
          disabled={!canEditSelection}
        >
          🗑
        </button>

        {/* Editor Toggle */}
        <button 
          className={`btn-icon editor-toggle ${editorMode}`}
          onClick={toggleEditorMode}
          title={`Editor: ${editorMode}`}
        >
          {editorMode === 'visual' ? '👁' : '✎'}
        </button>
      </div>
    </div>
  )
}

export default CanvasToolbar
