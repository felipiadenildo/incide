/**
 * CanvasTabs - Tabs de Workspaces na parte inferior (Workspace 1, 2, 3...)
 * Controla activeWorkspaceId → InsertPanel → ElementPalette
 */

import React, { useState, useEffect } from 'react'
import { useAppStore } from '../../../store/useAppStore'
import './CanvasTabs.css'

export function CanvasTabs() {
  const [editingTab, setEditingTab] = useState(null)
  const [newTabName, setNewTabName] = useState('')

  // ✅ WORKSPACES do store
  const {
    workspaces,
    activeWorkspaceId,
    setActiveWorkspace,
    createWorkspace,
    renameWorkspace,
    deleteWorkspace
  } = useAppStore()

  // ✅ Auto-nomeia novo workspace
  const handleNewWorkspace = () => {
    createWorkspace()
  }

  const handleRenameTab = (id, currentName) => {
    if (newTabName.trim()) {
      renameWorkspace(id, newTabName.trim())
    }
    setEditingTab(null)
    setNewTabName('')
  }

  // ✅ Ordena workspaces por criação
  const sortedWorkspaces = React.useMemo(() => {
    return workspaces.sort((a, b) => new Date(a.created) - new Date(b.created))
  }, [workspaces])

  const workspaceIcons = {
    sandbox: '🎨',
    tikz: '📐',
    circuittikz: '⚡'
  }

  return (
    <div className="canvas-tabs">
      <div className="canvas-tab-group">
        {/* Workspace Tabs */}
        {sortedWorkspaces.map((workspace) => (
          <div 
            key={workspace.id}
            className={`canvas-tab-wrapper ${
              activeWorkspaceId === workspace.id ? 'active' : ''
            } ${editingTab === workspace.id ? 'editing' : ''}`}
          >
            {editingTab === workspace.id ? (
              <input
                autoFocus
                value={newTabName}
                onChange={(e) => setNewTabName(e.target.value)}
                onBlur={() => handleRenameTab(workspace.id, workspace.name)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRenameTab(workspace.id, workspace.name)
                  } else if (e.key === 'Escape') {
                    setEditingTab(null)
                    setNewTabName('')
                  }
                }}
                className="canvas-tab-input"
                placeholder={workspace.name}
              />
            ) : (
              <button
                className={`canvas-tab ${activeWorkspaceId === workspace.id ? 'active' : ''}`}
                onClick={() => setActiveWorkspace(workspace.id)}
                onDoubleClick={() => {
                  setEditingTab(workspace.id)
                  setNewTabName(workspace.name)
                }}
                title={`Workspace: ${workspace.name} (${workspace.type})\nDouble-click to rename`}
              >
                <span className="tab-icon">
                  {workspaceIcons[workspace.type] || '📦'}
                </span>
                <span className="tab-label">{workspace.name}</span>
              </button>
            )}
            
            {/* Delete button */}
            {workspaces.length > 1 && (
              <button
                className="tab-delete-btn"
                onClick={() => deleteWorkspace(workspace.id)}
                title="Delete workspace"
              >
                ×
              </button>
            )}
          </div>
        ))}

        {/* New Workspace Button */}
        <button 
          className="canvas-tab new-workspace-tab"
          onClick={handleNewWorkspace}
          title="New Workspace (+ Ctrl+N)"
        >
          <span className="tab-icon">+</span>
          <span className="tab-label">Novo</span>
        </button>
      </div>
    </div>
  )
}

export default CanvasTabs
