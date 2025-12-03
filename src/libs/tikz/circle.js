// src/libs/tikz/circle.js

/**
 * Circle
 * Library: tikz | Category: shapes
 */

export const descriptor = {
  type: "circle",
  library: "tikz",
  category: "shapes",
  label: "Circle",

  // usado pela palette (ordem e ícone da categoria)
  icon: "🔵",
  categoryOrder: 10,
  order: 10,

  // valores padrão do elemento
  defaults: {
    x: 0,
    y: 0,
    radius: 1,
    stroke: "#0f172a",
    strokeWidth: 0.05,
    fill: "none",
  },

  // propriedades editáveis no PropertiesPanel
  propertySchema: {
    geometry: {
      label: "Geometria",
      fields: {
        x: { type: "number", label: "X" },
        y: { type: "number", label: "Y" },
        radius: { type: "number", label: "Raio", min: 0 },
      },
    },
    style: {
      label: "Estilo",
      fields: {
        stroke: { type: "color", label: "Cor da borda" },
        strokeWidth: { type: "number", label: "Espessura", min: 0 },
        fill: { type: "color", label: "Preenchimento" },
      },
    },
  },

  // validação opcional
  validate(element) {
    const errors = []
    if (element.radius != null && element.radius < 0) {
      errors.push("Raio não pode ser negativo")
    }
    return errors
  },

  // renderização no canvas
  svgRender(element, isSelected, zoom) {
    const x = Number.isFinite(element.x) ? element.x : 0
    const y = Number.isFinite(element.y) ? element.y : 0
    const r = Number.isFinite(element.radius) ? element.radius : 1

    return {
      tag: "circle",
      cx: x,
      cy: y,
      r,
      stroke: isSelected ? "#2563eb" : element.stroke ?? "#0f172a",
      strokeWidth: (element.strokeWidth ?? 0.05) / (zoom || 1),
      fill: element.fill ?? "none",
    }
  },

  // geração de código TikZ
  codeGenerator(element /*, ctx */) {
    const x = element.x ?? 0
    const y = element.y ?? 0
    const r = element.radius ?? 1
    return `\\draw (${x},${y}) circle (${r});`
  },
}

console.log("✔ [tikz] shapes/circle")
