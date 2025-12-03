/**
 * ElementPalette - Paleta lateral de elementos com categorias colapsáveis
 * - Layout fino em lista, responsivo, com scroll interno
 * - Ícone à esquerda e nome centralizado
 * - 100% dinâmica a partir dos descriptors da lib, com fallbacks resilientes
 */

import React, { useMemo, useState, useCallback } from 'react'
import { elementRegistry } from '../../libs/elementRegistry'
import { useAppStore } from '../../store/useAppStore'
import './ElementPalette.css'

export function ElementPalette({
  onInsert,
  activeWorkspaceType = 'sandbox',
  collapsedByDefault = true,
}) {
  // Estado de categorias abertas/fechadas
  const [expandedCategories, setExpandedCategories] = useState(() =>
    collapsedByDefault ? {} : { shapes: true, bipoles: true, sources: true }
  )

  const projectType = useAppStore((state) => state.project.type)

  // ========= Agrupamento dinâmico por categoria =========
  const elementsByCategory = useMemo(() => {
    const all = elementRegistry.getAll()

    const safe = all.map((el) => ({
      ...el,
      type: el.type,
      id: el.type,
      label: el.label || el.type || 'Sem nome',
      category: el.category || 'outros',
      library: el.library || 'sandbox',
      icon: el.icon || null,
      categoryOrder: typeof el.categoryOrder === 'number' ? el.categoryOrder : 999,
      order: typeof el.order === 'number' ? el.order : 999,
    }))

    // Filtra por tipo de workspace, exceto sandbox
    let filtered = safe
    if (activeWorkspaceType !== 'sandbox') {
      filtered = safe.filter((el) => el.library === activeWorkspaceType)
    }

    // Agrupa em objeto: { [category]: { items: [], icon, order } }
    const groups = {}
    filtered.forEach((el) => {
      const cat = el.category || 'outros'
      if (!groups[cat]) {
        groups[cat] = {
          items: [],
          icon: el.icon || null,
          order: el.categoryOrder ?? 999,
        }
      }
      groups[cat].items.push(el)

      // se algum elemento tiver categoryOrder menor, assume como ordem da categoria
      if (typeof el.categoryOrder === 'number' && el.categoryOrder < groups[cat].order) {
        groups[cat].order = el.categoryOrder
      }
      // ícone da categoria: primeiro definido ganha, se ainda não tiver
      if (el.icon && !groups[cat].icon) {
        groups[cat].icon = el.icon
      }
    })

    // Ordena itens dentro da categoria: primeiro por order, depois por label
    Object.values(groups).forEach((group) => {
      group.items.sort((a, b) => {
        const ao = a.order ?? 999
        const bo = b.order ?? 999
        if (ao !== bo) return ao - bo
        return a.label.localeCompare(b.label)
      })
    })

    return groups
  }, [activeWorkspaceType])

  // ========= Helpers =========

  const toggleCategory = useCallback((category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }, [])

  const isCompatible = useCallback(
    (el) => activeWorkspaceType === 'sandbox' || el.library === activeWorkspaceType,
    [activeWorkspaceType]
  )

  const isCategoryExpanded = (category) => !!expandedCategories[category]

  // ========= Render de miniatura (robusto a erros) =========

  const renderSvgElement = (props) => {
    if (!props) return null
    const { tag, children, ...rest } = props
    const safeRest = { ...rest, strokeWidth: (rest.strokeWidth || 1) * 2 }

    switch (tag) {
      case 'circle':
        return <circle {...safeRest} r={Math.min(safeRest.r || 20, 35)} />
      case 'rect':
        return <rect {...safeRest} rx="3" ry="3" />
      case 'line':
        return <line {...safeRest} strokeWidth="3" strokeLinecap="round" />
      case 'path':
        return <path {...safeRest} strokeWidth="3" strokeLinecap="round" fill="none" />
      case 'ellipse':
        return <ellipse {...safeRest} rx={Math.min(safeRest.rx || 20, 30)} />
      case 'g':
        return (
          <g {...safeRest}>
            {Array.isArray(children) &&
              children.map((child, i) => (
                <React.Fragment key={i}>{renderSvgElement(child)}</React.Fragment>
              ))}
          </g>
        )
      default:
        return <rect x="15" y="15" width="70" height="70" fill="#e2e8f0" rx="8" />
    }
  }

  const renderMiniature = useCallback((element) => {
    try {
      const descriptor = elementRegistry.get(element.type)
      if (descriptor?.svgRender) {
        const svgProps = descriptor.svgRender(
          { ...element, x: 50, y: 50 },
          false,
          0.3
        )
        if (svgProps?.tag) {
          return (
            <svg
              width="24"
              height="24"
              viewBox="0 0 100 100"
              className="element-miniature"
            >
              <rect width="100" height="100" fill="#f8fafc" rx="6" />
              {renderSvgElement(svgProps)}
            </svg>
          )
        }
      }
    } catch (e) {
      console.warn('Miniatura falhou para:', element.type, e)
    }

    // Fallback robusto de ícone do item
    const cat = element.category || 'outros'
    const fallbackIcon =
      element.icon ||
      (cat === 'bipoles'
        ? '⚡'
        : cat === 'sources'
        ? '🔋'
        : cat === 'shapes'
        ? '🔲'
        : cat === 'sensors'
        ? '📊'
        : '⬤')

    return <div className="element-miniature-fallback">{fallbackIcon}</div>
  }, [])

  // ========= Render =========

  const hasCategories = Object.keys(elementsByCategory).length > 0

  return (
    <div className="element-palette">
      <div className="element-palette-scroll">
        {Object.entries(elementsByCategory)
          .sort(([, aGroup], [, bGroup]) => {
            const ao = aGroup.order ?? 999
            const bo = bGroup.order ?? 999
            return ao - bo
          })
          .map(([category, group]) => {
            const elements = group.items || []
            const cat = category || 'outros'

            // Ícone da categoria: do descriptor, ou fallback por tipo, ou genérico
            const catIcon =
              group.icon ||
              (cat === 'shapes'
                ? '🔲'
                : cat === 'bipoles'
                ? '⚡'
                : cat === 'sources'
                ? '🔋'
                : cat === 'sensors'
                ? '📊'
                : '📦')

            const prettyName =
              typeof cat === 'string' && cat.length
                ? cat.charAt(0).toUpperCase() + cat.slice(1)
                : 'Outros'

            return (
              <div key={cat} className="element-category">
                <div className="category-header-wrapper">
                  <button
                    className="category-header"
                    onClick={() => toggleCategory(cat)}
                  >
                    <span className="category-icon">{catIcon}</span>
                    <span className="category-label">
                      {prettyName}
                      <span className="category-count"> ({elements.length})</span>
                    </span>
                  </button>
                  <button
                    className={`category-toggle-btn ${
                      isCategoryExpanded(cat) ? 'expanded' : 'collapsed'
                    }`}
                    onClick={() => toggleCategory(cat)}
                    title={isCategoryExpanded(cat) ? 'Fechar' : 'Abrir'}
                  >
                    {isCategoryExpanded(cat) ? '▲' : '▼'}
                  </button>
                </div>

                {isCategoryExpanded(cat) && elements.length > 0 && (
                  <div className="category-content">
                    <div className="element-palette-section-items">
                      {elements.map((el) => (
                        <button
                          key={el.type}
                          type="button"
                          className={`element-palette-item ${
                            !isCompatible(el) ? 'disabled' : ''
                          }`}
                          title={
                            !isCompatible(el)
                              ? `${el.label} - incompatível com ${activeWorkspaceType}`
                              : el.label
                          }
                          onClick={
                            !isCompatible(el)
                              ? undefined
                              : () => onInsert?.(el.type || el.id)
                          }
                          disabled={!isCompatible(el)}
                          draggable={isCompatible(el)}
                          onDragStart={(e) => {
                            if (!isCompatible(el)) return
                            e.dataTransfer.setData(
                              'text/plain',
                              JSON.stringify({ type: el.type })
                            )
                            e.dataTransfer.effectAllowed = 'copy'
                          }}
                        >
                          {/* Ícone/miniatura à esquerda */}
                          <div className="element-palette-item-icon">
                            {renderMiniature(el)}
                          </div>

                          {/* Nome central (texto ocupa o meio) */}
                          <div className="element-palette-item-text">
                            <div className="element-label">{el.label}</div>
                            <div className="element-meta">
                              {el.library === 'tikz'
                                ? 'TikZ'
                                : el.library === 'circuittikz'
                                ? 'CircuitikZ'
                                : 'Sandbox'}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

        {!hasCategories && (
          <div className="element-palette-empty">
            Nenhum elemento para <strong>{activeWorkspaceType}</strong>
          </div>
        )}
      </div>
    </div>
  )
}

export default ElementPalette
