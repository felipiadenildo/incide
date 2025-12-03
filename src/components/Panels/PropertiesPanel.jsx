/**
 * PropertiesPanel - Painel de propriedades do elemento selecionado
 *
 * Usa:
 * - useAppStore: selectedIds, elements, updateElement
 * - elementRegistry: propertySchema do tipo
 *
 * Comportamento:
 * - Nada selecionado: mensagem de ajuda
 * - 1 elemento: mostra propriedades completas (accordion simples por grupo)
 * - 2+ elementos: por enquanto, mostra mensagem (v1)
 */

import React, { useMemo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { elementRegistry } from '../../libs/elementRegistry'
import { PropertyPanel } from './PropertyPanel'
import './PropertiesPanel.css'

// PropertiesPanel.jsx
export function PropertiesPanel() {
  const elements = useAppStore((state) => state.elements);
  const selectedIdsSet = useAppStore((state) => state.selectedIds);
  const updateElement = useAppStore((state) => state.updateElement);
  const selectedIds = Array.from(selectedIdsSet);


  const selectedElement = useMemo(() => {
    if (selectedIds.length !== 1) return null
    return elements.find((e) => e.id === selectedIds[0]) || null
  }, [elements, selectedIds])

  const descriptor = useMemo(() => {
    if (!selectedElement) return null
    try {
      return elementRegistry.get(selectedElement.type)
    } catch {
      return null
    }
  }, [selectedElement])

  const handleChange = useCallback(
    (groupKey, propKey, nextValue) => {
      if (!selectedElement || !descriptor) return

      const next = { ...selectedElement }

      if (!next[groupKey]) {
        next[groupKey] = {}
      }

      // Estratégia simples: propriedades planas no elemento
      // Para v1, mapeamos diretamente: next[propKey] = valor
      if (groupKey === 'positioning' || groupKey === 'shape' || groupKey === 'appearance' || groupKey === 'component') {
        next[propKey] = nextValue
      }

      updateElement(selectedElement.id, next)
    },
    [selectedElement, descriptor, updateElement]
  )

  // Estados de UI
  if (selectedIds.length === 0) {
    return (
      <div className="properties-panel">
        <div className="properties-header">
          <span className="properties-title">Properties</span>
        </div>
        <div className="properties-empty">
          Selecione um elemento no canvas para editar as propriedades.
        </div>
      </div>
    )
  }

  if (selectedIds.length > 1) {
    return (
      <div className="properties-panel">
        <div className="properties-header">
          <span className="properties-title">Properties</span>
          <span className="properties-subtitle">
            {selectedIds.length} elementos selecionados
          </span>
        </div>
        <div className="properties-empty">
          Edição em grupo será adicionada depois. Por enquanto, selecione apenas um elemento.
        </div>
      </div>
    )
  }

  if (!selectedElement || !descriptor) {
    return (
      <div className="properties-panel">
        <div className="properties-header">
          <span className="properties-title">Properties</span>
        </div>
        <div className="properties-empty">
          Tipo de elemento não registrado no registry.
        </div>
      </div>
    )
  }

  const schemaEntries = Object.entries(descriptor.propertySchema || {})

  return (
    <div className="properties-panel">
      <div className="properties-header">
        <div>
          <span className="properties-title">Properties</span>
          <span className="properties-subtitle">
            {descriptor.label} · {selectedElement.id}
          </span>
        </div>
      </div>

      <div className="properties-body">
        {schemaEntries.map(([groupKey, groupSchema]) => (
          <PropertyPanel
            key={groupKey}
            groupKey={groupKey}
            groupSchema={groupSchema}
            value={selectedElement}
            onChange={handleChange}
          />
        ))}
      </div>
    </div>
  )
}

export default PropertiesPanel
