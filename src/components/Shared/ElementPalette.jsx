/**
 * ElementPalette - Grid de elementos disponíveis para inserção
 *
 * Lê elementos do elementRegistry por biblioteca (TikZ / CircuitTikZ)
 * e dispara callback onInsert(type) ao clicar.
 */

import React, { useMemo } from 'react'
import { elementRegistry } from '../../libs/elementRegistry'
import { useAppStore } from '../../store/useAppStore'
import './ElementPalette.css'

export function ElementPalette({ onInsert }) {
  const projectType = useAppStore((state) => state.project.type)

  const elements = useMemo(() => {
    return elementRegistry
      .getAll()
      .filter((el) => el.library === projectType)
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [projectType])

  if (elements.length === 0) {
    return (
      <div className="element-palette-empty">
        Nenhum elemento registrado para {projectType}.
      </div>
    )
  }

  return (
    <div className="element-palette">
      {elements.map((el) => (
        <button
          key={el.id}
          type="button"
          className="element-palette-item"
          title={el.description || el.label}
          onClick={() => onInsert?.(el.id)}
        >
          <div className="element-icon">
            {el.category === 'bipoles' ? '⚡' : '⬤'}
          </div>
          <div className="element-label">
            <span className="element-label-main">{el.label}</span>
            <span className="element-label-sub">{el.id}</span>
          </div>
        </button>
      ))}
    </div>
  )
}

export default ElementPalette
