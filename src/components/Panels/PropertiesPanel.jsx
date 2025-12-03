import React from "react"
import { useAppStore } from "../../store/useAppStore"
import { elementRegistry } from "../../libs/elementRegistry"
import { PropertyPanel } from "./PropertyPanel"
import "./PropertiesPanel.css"

export function PropertiesPanel() {
  // NUNCA criar novos arrays/objetos no selector
  const selectedElementIds = useAppStore((state) => state.selectedElementIds)
  const elements = useAppStore((state) => state.elements)
  const updateElement = useAppStore((state) => state.updateElement)

  const safeSelectedIds = Array.isArray(selectedElementIds)
    ? selectedElementIds
    : []

  const safeElements = Array.isArray(elements) ? elements : []

  const selectedElement =
    safeElements.find((el) => safeSelectedIds.includes(el.id)) || null

  if (!selectedElement) {
    return (
      <div className="properties-panel">
        <div className="properties-header">Properties</div>
        <div className="properties-empty">Nenhum elemento selecionado</div>
      </div>
    )
  }

  const descriptor = elementRegistry.get(selectedElement.type)

  if (!descriptor || !descriptor.propertySchema) {
    return (
      <div className="properties-panel">
        <div className="properties-header">Properties</div>
        <div className="properties-empty">Sem propriedades editáveis</div>
      </div>
    )
  }

  const handleChange = (propKey, value) => {
    if (typeof updateElement === "function") {
      updateElement(selectedElement.id, { [propKey]: value })
    }
  }

  return (
    <div className="properties-panel">
      <div className="properties-header">
        Properties - {descriptor.label || selectedElement.type}
      </div>
      <div className="properties-body">
        {Object.entries(descriptor.propertySchema).map(
          ([groupKey, groupSchema]) => {
            if (groupKey === "label") return null

            return (
              <PropertyPanel
                key={groupKey}
                groupKey={groupKey}
                groupSchema={groupSchema}
                element={selectedElement}
                onChange={handleChange}
              />
            )
          }
        )}
      </div>
    </div>
  )
}
