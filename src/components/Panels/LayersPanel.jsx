/**
 * LayersPanel - Lista de elementos (layers) com seleção básica
 *
 * Para v1: lista plana em ordem de z-order.
 * Futuro: hierarquia / grupos.
 */

import React from 'react'
import { useAppStore } from '../../store/useAppStore'
import './LayersPanel.css'

export function LayersPanel() {
  const elements = useAppStore((s) => s.elements);
  const selectedIdsSet = useAppStore((s) => s.selectedIds);
  // const canvasView = useAppStore((s) => s.canvasView);
  const selectElement = useAppStore((s) => s.selectElement);
  const toggleSelection = useAppStore((s) => s.toggleSelection);

  const selectedIds = Array.from(selectedIdsSet);

  return (
    <div className="layers-panel">
      <div className="layers-header">
        <span className="layers-title">Layers</span>
        <span className="layers-count">{elements.length}</span>
      </div>

      <div className="layers-list">
        {elements.map((el) => {
          const isSelected = selectedIds.includes(el.id)
          return (
            <button
              key={el.id}
              type="button"
              className={
                'layers-item' + (isSelected ? ' layers-item-selected' : '')
              }
              onClick={(e) => {
                if (e.shiftKey) {
                  toggleSelection(el.id)
                } else {
                  selectElement(el.id)
                }
              }}
              title={el.id}
            >
              <span className="layers-bullet">
                {el.library === 'circuitikz' ? '⚡' : '⬤'}
              </span>
              <span className="layers-main">
                {el.label || el.type}
              </span>
              <span className="layers-sub">
                {el.id}
              </span>
            </button>
          )
        })}

        {elements.length === 0 && (
          <div className="layers-empty">
            Nenhum elemento. Use o painel Insert.
          </div>
        )}
      </div>
    </div>
  )
}

export default LayersPanel
