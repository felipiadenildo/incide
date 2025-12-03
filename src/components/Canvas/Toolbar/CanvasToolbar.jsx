/**
 * CanvasToolbar - Toolbar de ações do Canvas (ícones only)
 *
 * Fica ACIMA do canvas, com:
 * - Undo / Redo
 * - Zoom in / out / reset
 * - Toggle grid
 */

import React from 'react'
import { useAppStore } from '../../../store/useAppStore'
import './CanvasToolbar.css'

export function CanvasToolbar() {
  const {
    undo,
    redo,
    addZoom,
    resetView,
    toggleGrid,
    canvasView,
    getSelectionCount,
  } = useAppStore((state) => ({
    undo: state.undo,
    redo: state.redo,
    addZoom: state.addZoom,
    resetView: state.resetView,
    toggleGrid: state.toggleGrid,
    canvasView: state.canvasView,
    getSelectionCount: state.getSelectionCount,
  }))

  const selectionCount = getSelectionCount()

  return (
    <div className="canvas-toolbar">
      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          type="button"
          onClick={undo}
          title="Undo (Ctrl+Z)"
        >
          ↶
        </button>
        <button
          className="toolbar-btn"
          type="button"
          onClick={redo}
          title="Redo (Ctrl+Shift+Z)"
        >
          ↷
        </button>
      </div>

      <div className="toolbar-group">
        <button
          className="toolbar-btn"
          type="button"
          onClick={() => addZoom(0.1)}
          title="Zoom In"
        >
          ＋
        </button>
        <button
          className="toolbar-btn"
          type="button"
          onClick={() => addZoom(-0.1)}
          title="Zoom Out"
        >
          －
        </button>
        <button
          className="toolbar-btn"
          type="button"
          onClick={resetView}
          title="Reset View"
        >
          ⤢
        </button>
        <span className="toolbar-label">
          {Math.round(canvasView.zoom * 100)}%
        </span>
      </div>

      <div className="toolbar-group">
        <button
          className={
            'toolbar-btn' +
            (canvasView.showGrid ? ' toolbar-btn-active' : '')
          }
          type="button"
          onClick={toggleGrid}
          title="Toggle Grid"
        >
          #⃣
        </button>
        <span className="toolbar-label">
          Sel: {selectionCount}
        </span>
      </div>
    </div>
  )
}

export default CanvasToolbar
