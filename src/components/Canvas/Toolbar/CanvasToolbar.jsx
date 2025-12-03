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

// CanvasToolbar.jsx
export function CanvasToolbar() {
  const undo = useAppStore((state) => state.undo);
  const redo = useAppStore((state) => state.redo);
  const addZoom = useAppStore((state) => state.addZoom);
  const resetView = useAppStore((state) => state.resetView);
  const toggleGrid = useAppStore((state) => state.toggleGrid);
  const canvasView = useAppStore((state) => state.canvasView);
  const getSelectionCount = useAppStore((state) => state.getSelectionCount);
  const selectionCount = getSelectionCount();


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
