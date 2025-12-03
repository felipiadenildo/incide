/**
 * SVGRenderer - Renderiza elementos como SVG dentro do Canvas
 *
 * Integra:
 * - useAppStore: elementos, seleção, view (pan/zoom, grid)
 * - elementRegistry: svgRender de cada tipo (TikZ / CircuitTikZ)
 *
 * Suporta:
 * - Seleção single/múltipla (click / Shift+click)
 * - Grid opcional
 * - Zoom baseado em canvasView.zoom
 */

import React, { useMemo } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { elementRegistry } from '../../libs/elementRegistry'
import './SVGRenderer.css'

export function SVGRenderer() {
  const {
    elements,
    selectedIds,
    canvasView,
    selectElement,
    toggleSelection,
  } = useAppStore((state) => ({
    elements: state.elements,
    selectedIds: Array.from(state.selectedIds),
    canvasView: state.canvasView,
    selectElement: state.selectElement,
    toggleSelection: state.toggleSelection,
  }))

  const svgElements = useMemo(() => {
    return elements.map((elem) => {
      try {
        const descriptor = elementRegistry.get(elem.type)
        const isSelected = selectedIds.includes(elem.id)

        const svgProps = descriptor.svgRender(
          elem,
          isSelected,
          canvasView.zoom
        )

        // Suporte a descriptor que retorna <g> com children virtuais
        if (svgProps.tag === 'g' && Array.isArray(svgProps.children)) {
          const { children, ...groupProps } = svgProps
          return (
            <g
              key={elem.id}
              onClick={(e) => {
                e.stopPropagation()
                if (e.shiftKey) {
                  toggleSelection(elem.id)
                } else {
                  selectElement(elem.id)
                }
              }}
              style={{ cursor: 'pointer' }}
              {...groupProps}
            >
              {children.map((child, index) => renderSvgElement(child, `${elem.id}-child-${index}`))}
            </g>
          )
        }

        return (
          <g
            key={elem.id}
            onClick={(e) => {
              e.stopPropagation()
              if (e.shiftKey) {
                toggleSelection(elem.id)
              } else {
                selectElement(elem.id)
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            {renderSvgElement(svgProps, elem.id)}
          </g>
        )
      } catch (e) {
        console.error(`Erro ao renderizar elemento '${elem.type}':`, e)
        return null
      }
    })
  }, [elements, selectedIds, canvasView.zoom, selectElement, toggleSelection])

  return (
    <svg
      className="svg-renderer"
      // viewBox simples; mais tarde podemos mapear coords TikZ → pixels
      viewBox={`${canvasView.panX} ${canvasView.panY} 20 15`}
      onClick={() => {
        // Click no fundo limpa seleção
        useAppStore.getState().clearSelection()
      }}
    >
      {/* Grid por pattern */}
      {canvasView.showGrid && (
        <defs>
          <pattern
            id="grid-pattern"
            width={canvasView.gridSize}
            height={canvasView.gridSize}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${canvasView.gridSize} 0 L 0 0 0 ${canvasView.gridSize}`}
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="0.02"
            />
          </pattern>
        </defs>
      )}

      {canvasView.showGrid && (
        <rect
          x={-100}
          y={-100}
          width={200}
          height={200}
          fill="url(#grid-pattern)"
        />
      )}

      {svgElements}
    </svg>
  )
}

/**
 * Renderiza um nó SVG a partir de { tag, ...props }
 */
function renderSvgElement(props, key) {
  if (!props) return null
  const { tag, children, content, className, ...rest } = props

  switch (tag) {
    case 'circle':
      return <circle key={key} className={className} {...rest} />
    case 'rect':
      return <rect key={key} className={className} {...rest} />
    case 'line':
      return <line key={key} className={className} {...rest} />
    case 'path':
      return <path key={key} className={className} {...rest} />
    case 'text':
      return (
        <text key={key} className={className} {...rest}>
          {content}
        </text>
      )
    case 'g':
      return (
        <g key={key} className={className} {...rest}>
          {Array.isArray(children)
            ? children.map((child, index) =>
                renderSvgElement(child, `${key}-child-${index}`)
              )
            : null}
        </g>
      )
    default:
      return null
  }
}

export default SVGRenderer
