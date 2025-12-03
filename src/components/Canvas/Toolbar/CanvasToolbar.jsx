// src/components/Canvas/CanvasToolbar.jsx

/**
 * CanvasToolbar - Barra fina única (estilo Figma/draw.io)
 * - Uma row com todos os controles de canvas e edição
 * - Ícones opacos/desabilitados quando ação não está disponível
 */

import React from "react"
import { useAppStore } from "../../../store/useAppStore"
import "./CanvasToolbar.css"

export function CanvasToolbar() {
  const project = useAppStore((s) => s.project)
  const canvasView = useAppStore((s) => s.canvasView)

  const changeActiveWorkspaceType = useAppStore(
    (s) => s.changeActiveWorkspaceType
  )
  const toggleGrid = useAppStore((s) => s.toggleGrid)
  const resetView = useAppStore((s) => s.resetView)
  const addZoom = useAppStore((s) => s.addZoom)
  const setZoom = useAppStore((s) => s.setZoom)

  const getSelectionCount = useAppStore((s) => s.getSelectionCount)
  const clearSelection = useAppStore((s) => s.clearSelection)
  const deleteElement = useAppStore((s) => s.deleteElement)

  const undo = useAppStore((s) => s.undo)
  const redo = useAppStore((s) => s.redo)
  const history = useAppStore((s) => s.history)

  const editorMode = useAppStore((s) => s.editorMode)
  const setEditorMode = useAppStore((s) => s.setEditorMode)

  const selectionCount = getSelectionCount()
  const canEditSelection = selectionCount > 0
  const canUndo = history.past.length > 0
  const canRedo = history.future.length > 0

  const currentMode = project?.type || "sandbox"
  const currentZoomPercent = Math.round((canvasView.zoom || 1) * 100)

  const handleZoomIn = () => addZoom(0.1)
  const handleZoomOut = () => addZoom(-0.1)
  const handleResetZoom = () => resetView()
  const handleZoomResetTo100 = () => setZoom(1)

  const handleDeleteSelection = () => {
    if (!canEditSelection) {
      clearSelection()
      return
    }
    const state = useAppStore.getState()
    Array.from(state.selectedIds).forEach((id) => deleteElement(id))
  }

  const handleProjectTypeChange = (type) => {
    changeActiveWorkspaceType(type)
  }

  const toggleEditorMode = () => {
    setEditorMode(editorMode === "visual" ? "code" : "visual")
  }

  return (
    <div className="canvas-toolbar">
      {/* Workspace / project type */}
      <div className="ctb-group">
        <button
          type="button"
          className={
            "ctb-chip" + (currentMode === "sandbox" ? " ctb-chip-active" : "")
          }
          onClick={() => handleProjectTypeChange("sandbox")}
          title="Sandbox (mixed)"
        >
          ●
        </button>
        <button
          type="button"
          className={
            "ctb-chip" + (currentMode === "tikz" ? " ctb-chip-active" : "")
          }
          onClick={() => handleProjectTypeChange("tikz")}
          title="TikZ"
        >
          ▱
        </button>
        <button
          type="button"
          className={
            "ctb-chip" + (currentMode === "circuittikz" ? " ctb-chip-active" : "")
          }
          onClick={() => handleProjectTypeChange("circuittikz")}
          title="CircuitTikZ"
        >
          ⟟
        </button>
      </div>

      {/* Grid / Snap / Reset view */}
      <div className="ctb-group">
        <button
          type="button"
          className={
            "ctb-icon-btn" + (canvasView.showGrid ? " ctb-icon-btn-active" : "")
          }
          onClick={toggleGrid}
          title={canvasView.showGrid ? "Ocultar grid" : "Mostrar grid"}
        >
          #
        </button>

        {/* Snap futuro - placeholder visual, hoje sem ação */}
        <button
          type="button"
          className="ctb-icon-btn ctb-icon-btn-disabled"
          title="Snap to grid (em breve)"
          disabled
        >
          ⌁
        </button>

        <button
          type="button"
          className="ctb-icon-btn"
          onClick={handleResetZoom}
          title="Resetar visão"
        >
          ⤾
        </button>
      </div>

      {/* Zoom controls */}
      <div className="ctb-group ctb-group-zoom">
        <button
          type="button"
          className="ctb-icon-btn"
          onClick={handleZoomOut}
          title="Zoom out"
        >
          –
        </button>
        <button
          type="button"
          className="ctb-zoom-label"
          onClick={handleZoomResetTo100}
          title="Resetar zoom para 100%"
        >
          {currentZoomPercent}%
        </button>
        <button
          type="button"
          className="ctb-icon-btn"
          onClick={handleZoomIn}
          title="Zoom in"
        >
          +
        </button>
      </div>

      {/* Editor mode (Visual / Code / Pretty) */}
      <div className="ctb-group ctb-group-editor">
        <button
          type="button"
          className="ctb-toggle-btn"
          onClick={toggleEditorMode}
          title={
            editorMode === "visual"
              ? "Modo visual (clique para ir para Code)"
              : "Modo code (clique para ir para Visual)"
          }
        >
          <span
            className={
              "ctb-toggle-segment" +
              (editorMode === "visual" ? " ctb-toggle-segment-active" : "")
            }
          >
            V
          </span>
          <span
            className={
              "ctb-toggle-segment" +
              (editorMode === "code" ? " ctb-toggle-segment-active" : "")
            }
          >
            C
          </span>
        </button>
      </div>

      {/* Undo / Redo */}
      <div className="ctb-group">
        <button
          type="button"
          className={
            "ctb-icon-btn" +
            (canUndo ? "" : " ctb-icon-btn-disabled ctb-icon-btn-muted")
          }
          onClick={canUndo ? undo : undefined}
          disabled={!canUndo}
          title={canUndo ? "Undo" : "Nada para desfazer"}
        >
          ↺
        </button>
        <button
          type="button"
          className={
            "ctb-icon-btn" +
            (canRedo ? "" : " ctb-icon-btn-disabled ctb-icon-btn-muted")
          }
          onClick={canRedo ? redo : undefined}
          disabled={!canRedo}
          title={canRedo ? "Redo" : "Nada para refazer"}
        >
          ↻
        </button>
      </div>

      {/* Seleção / Ações de elemento */}
      <div className="ctb-group ctb-group-selection">
        <div
          className={
            "ctb-selection-indicator" +
            (canEditSelection ? " ctb-selection-indicator-active" : "")
          }
          title={
            canEditSelection
              ? `${selectionCount} elemento(s) selecionado(s)`
              : "Nenhum elemento selecionado"
          }
        >
          ☐ {selectionCount}
        </div>

        {/* Duplicate (placeholder para futuro) */}
        <button
          type="button"
          className={
            "ctb-icon-btn" +
            (canEditSelection ? "" : " ctb-icon-btn-disabled ctb-icon-btn-muted")
          }
          disabled={!canEditSelection}
          title={
            canEditSelection
              ? "Duplicar seleção (em breve)"
              : "Seleção vazia"
          }
        >
          ⧉
        </button>

        {/* Delete / Clear selection */}
        <button
          type="button"
          className={
            "ctb-icon-btn" +
            (canEditSelection ? " ctb-icon-btn-danger" : " ctb-icon-btn-muted")
          }
          onClick={handleDeleteSelection}
          title={
            canEditSelection
              ? "Excluir elementos selecionados"
              : "Limpar seleção"
          }
        >
          🗑
        </button>
      </div>
    </div>
  )
}

export default CanvasToolbar
