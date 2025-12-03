/**
 * InsertPanel - Painel de inserção de elementos (lado esquerdo, parte de baixo)
 */

import React from 'react'
import { ElementPalette } from '../Shared/ElementPalette'
import { useAppStore } from '../../store/useAppStore'
import ElementFactory from '../../services/elements/elementFactory'
import './InsertPanel.css'

export function InsertPanel() {
  const addElement = useAppStore((state) => state.addElement)

  const handleInsert = (type) => {
    const element = ElementFactory.create(type, { x: 0, y: 0 })
    addElement(element)
  }

  return (
    <div className="insert-panel">
      <div className="insert-panel-header">
        <span className="insert-panel-title">Insert</span>
      </div>
      <ElementPalette onInsert={handleInsert} />
    </div>
  )
}

export default InsertPanel
