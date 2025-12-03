/**
 * SVGRenderer - Renderiza elementos como SVG dentro do Canvas
 * ✅ CORREÇÃO: Proteção total + element definido
 */

import React, { useMemo, memo } from 'react'
import { useAppStore } from '../../store/useAppStore'
import { elementRegistry } from '../../libs/elementRegistry'
import './SVGRenderer.css'

/**
 * 🔥 Componente memoizado para cada elemento individual
 */
const SVGElement = memo(({ elem, isSelected, zoom, onSelect, onToggleSelect }) => {
  console.log(`[SVGElement] render ${elem.id}`, { isSelected });

  try {
    const descriptor = elementRegistry.get(elem.type);
    
    // 🔥 PROTEÇÃO 1: descriptor existe?
    if (!descriptor) {
      console.error(`❌ Descriptor não encontrado: ${elem.type}`);
      return (
        <rect 
          x={elem.x * zoom - 10} 
          y={elem.y * zoom - 10} 
          width={20} 
          height={20} 
          fill="#ff4444" 
          stroke="#ff0000" 
          strokeWidth="2"
        />
      );
    }

    // 🔥 PROTEÇÃO 2: svgRender existe e é função?
    if (!descriptor.svgRender || typeof descriptor.svgRender !== 'function') {
      console.error(`❌ svgRender inválido: ${elem.type}`);
      return (
        <rect 
          x={elem.x * zoom - 10} 
          y={elem.y * zoom - 10} 
          width={20} 
          height={20} 
          fill="#ffaa44" 
          stroke="#ff8800" 
          strokeWidth="2"
        />
      );
    }

    // 🔥 EXECUTAR svgRender COM PARAMETROS CORRETOS
    const svgProps = descriptor.svgRender(elem, isSelected, zoom);

    // 🔥 PROTEÇÃO 3: svgProps válido?
    if (!svgProps || !svgProps.tag) {
      console.error(`❌ svgRender retornou inválido '${elem.type}':`, svgProps);
      return (
        <rect 
          x={elem.x * zoom - 10} 
          y={elem.y * zoom - 10} 
          width={20} 
          height={20} 
          fill="#ff4444" 
          stroke="#ff0000" 
          strokeWidth="2"
        />
      );
    }

    const handleClick = (e) => {
      e.stopPropagation();
      console.log(`[SVGElement] click ${elem.id}`, { shiftKey: e.shiftKey });
      if (e.shiftKey) {
        onToggleSelect(elem.id);
      } else {
        onSelect(elem.id);
      }
    };

    // Suporte a <g> com children
    if (svgProps.tag === 'g' && Array.isArray(svgProps.children)) {
      const { children, ...groupProps } = svgProps;
      return (
        <g onClick={handleClick} style={{ cursor: 'pointer' }} {...groupProps}>
          {children.map((child, index) => renderSvgElement(child, `${elem.id}-child-${index}`))}
        </g>
      );
    }

    return (
      <g onClick={handleClick} style={{ cursor: 'pointer' }}>
        {renderSvgElement(svgProps, elem.id)}
      </g>
    );
  } catch (e) {
    console.error(`[SVGElement] Erro ao renderizar '${elem.type}':`, e);
    return (
      <rect 
        x={elem.x * zoom - 10} 
        y={elem.y * zoom - 10} 
        width={20} 
        height={20} 
        fill="#ff4444" 
        stroke="#ff0000" 
        strokeWidth="2"
      />
    );
  }
}, (prevProps, nextProps) => {
  return (
    prevProps.elem.id === nextProps.elem.id &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.zoom === nextProps.zoom
  );
});

export function SVGRenderer() {
  const elements = useAppStore((s) => s.elements);
  const selectedIdsSet = useAppStore((s) => s.selectedIds);
  const canvasView = useAppStore((s) => s.canvasView);
  const selectElement = useAppStore((s) => s.selectElement);
  const toggleSelection = useAppStore((s) => s.toggleSelection);
  const clearSelection = useAppStore((s) => s.clearSelection);

  console.log("[SVGRenderer] render", {
    elementsCount: elements.length,
    selectedCount: selectedIdsSet.size,
    zoom: canvasView.zoom,
  });

  const selectedIds = useMemo(() => Array.from(selectedIdsSet), [selectedIdsSet]);

  return (
    <svg
      className="svg-renderer"
      viewBox={`${canvasView.panX} ${canvasView.panY} 20 15`}
      onClick={() => {
        console.log("[SVGRenderer] background click, clearing selection");
        clearSelection();
      }}
    >
      {/* Grid */}
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

      {/* Elementos */}
      {elements.map((elem) => (
        <SVGElement
          key={elem.id}
          elem={elem}
          isSelected={selectedIds.includes(elem.id)}
          zoom={canvasView.zoom}
          onSelect={selectElement}
          onToggleSelect={toggleSelection}
        />
      ))}
    </svg>
  );
}

/**
 * Renderiza nó SVG a partir de { tag, ...props }
 */
function renderSvgElement(props, key) {
  if (!props || !props.tag) return null;
  
  const { tag, children, content, className, ...rest } = props;

  switch (tag) {
    case 'circle':
      return <circle key={key} className={className} {...rest} />;
    case 'rect':
      return <rect key={key} className={className} {...rest} />;
    case 'line':
      return <line key={key} className={className} {...rest} />;
    case 'path':
      return <path key={key} className={className} {...rest} />;
    case 'text':
      return (
        <text key={key} className={className} {...rest}>
          {content}
        </text>
      );
    case 'g':
      return (
        <g key={key} className={className} {...rest}>
          {Array.isArray(children)
            ? children.map((child, index) =>
                renderSvgElement(child, `${key}-child-${index}`)
              )
            : null}
        </g>
      );
    case 'ellipse':
      return <ellipse key={key} className={className} {...rest} />;
    default:
      console.warn(`⚠️ Tag SVG desconhecida: ${tag}`);
      return <rect key={key} width={20} height={20} fill="#ffaa44" />;
  }
}

export default SVGRenderer;
