/**
 * PropertiesPanel - Painel de propriedades do elemento selecionado
 *
 * CORREÇÃO: Console.log para debug e useMemo otimizado
 */

import React, { useMemo, useCallback } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { elementRegistry } from '../../libs/elementRegistry'
import { PropertyPanel } from './PropertyPanel'
import './PropertiesPanel.css'

export function PropertiesPanel() {
  const elements = useAppStore((state) => state.elements);
  const selectedIdsSet = useAppStore((state) => state.selectedIds);
  const updateElement = useAppStore((state) => state.updateElement);

  // 🔥 Memoizar conversão Set → Array
  const selectedIds = useMemo(() => Array.from(selectedIdsSet), [selectedIdsSet]);

  console.log("[PropertiesPanel] render", {
    selectedCount: selectedIds.length,
    elementsCount: elements.length,
  });

  // 🔥 Memoizar elemento selecionado com dependências específicas
  const selectedElement = useMemo(() => {
    if (selectedIds.length !== 1) {
      console.log("[PropertiesPanel] no single selection");
      return null;
    }
    const elem = elements.find((e) => e.id === selectedIds[0]) || null;
    console.log("[PropertiesPanel] selectedElement", elem?.id);
    return elem;
  }, [elements, selectedIds]);

  const descriptor = useMemo(() => {
    if (!selectedElement) return null
    try {
      const desc = elementRegistry.get(selectedElement.type);
      console.log("[PropertiesPanel] descriptor loaded", desc?.id);
      return desc;
    } catch {
      console.error("[PropertiesPanel] descriptor not found for", selectedElement.type);
      return null
    }
  }, [selectedElement]);

  const handleChange = useCallback(
    (groupKey, propKey, nextValue) => {
      if (!selectedElement || !descriptor) {
        console.log("[PropertiesPanel] handleChange blocked, no selection");
        return;
      }

      console.log("[PropertiesPanel] handleChange", { 
        id: selectedElement.id, 
        groupKey, 
        propKey, 
        nextValue 
      });

      const next = { ...selectedElement }

      if (!next[groupKey]) {
        next[groupKey] = {}
      }

      // Estratégia simples: propriedades planas no elemento
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
