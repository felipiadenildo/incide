/**
 * Hook para renderizar elementos em SVG
 */

import { useAppStore } from '../../store/useAppStore'
import { elementRegistry } from '../../libs/elementRegistry'

export function useElementRendering() {
  const { elements, canvasView, selectedIds } = useAppStore((state) => ({
    elements: state.elements,
    canvasView: state.canvasView,
    selectedIds: state.selectedIds,
  }))

  /**
   * Renderiza um elemento para SVG
   */
  const renderElement = (element) => {
    try {
      const descriptor = elementRegistry.get(element.type)
      const isSelected = selectedIds.includes(element.id)

      return descriptor.svgRender(element, isSelected, canvasView.zoom)
    } catch (e) {
      console.error(`Erro ao renderizar ${element.type}:`, e)
      return null
    }
  }

  /**
   * Renderiza todos os elementos
   */
  const renderAll = () => {
    return elements
      .map((elem) => {
        const svg = renderElement(elem)
        return svg ? { ...svg, key: elem.id } : null
      })
      .filter(Boolean)
  }

  return { renderElement, renderAll, elements }
}
