/**
 * TikZ Shapes - Definições de formas básicas
 */

import { elementRegistry } from '../../elementRegistry'

export const CIRCLE = {
  id: 'circle',
  type: 'shape',
  library: 'tikz',
  label: 'Círculo',
  category: 'shapes',
  description: 'Círculo simples',

  svgRender: (obj, isSelected, scale = 1) => ({
    tag: 'circle',
    cx: obj.x * scale,
    cy: obj.y * scale,
    r: obj.radius * scale,
    fill: obj.fill,
    stroke: isSelected ? '#2563eb' : obj.stroke,
    strokeWidth: isSelected ? 3 : obj.strokeWidth,
    className: isSelected ? 'selected' : '',
  }),

  propertySchema: {
    positioning: {
      label: 'Posição',
      x: { type: 'number', label: 'X', min: -20, max: 20, step: 0.1, decimals: 2 },
      y: { type: 'number', label: 'Y', min: -20, max: 20, step: 0.1, decimals: 2 },
    },
    shape: {
      label: 'Forma',
      radius: { type: 'number', label: 'Raio', min: 0.1, max: 10, step: 0.1, decimals: 2 },
    },
    appearance: {
      label: 'Aparência',
      fill: { type: 'color', label: 'Preenchimento', default: '#ffffff' },
      stroke: { type: 'color', label: 'Borda', default: '#000000' },
      strokeWidth: { type: 'number', label: 'Espessura', min: 0.5, max: 5, step: 0.1, decimals: 1 },
    },
  },

  defaults: {
    x: 0,
    y: 0,
    radius: 0.5,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 1,
  },

  capabilities: {
    rotate: { type: 'free' },
    flip: { horizontal: false, vertical: false },
    scale: { uniform: true, minimum: 0.1, maximum: 10 },
    lock: true,
    visibility: true,
    zOrder: true,
  },

  codeGenerator: (obj) => {
    const x = obj.x.toFixed(2)
    const y = obj.y.toFixed(2)
    const r = obj.radius.toFixed(2)
    return `\\draw[fill=${obj.fill}, draw=${obj.stroke}] (${x},${y}) circle (${r});`
  },

  validate: (obj) => {
    const errors = []
    if (obj.radius <= 0) errors.push('Raio deve ser > 0')
    return errors
  },

  constraints: { minRadius: 0.1, maxRadius: 10 },
}

export const RECTANGLE = {
  id: 'rectangle',
  type: 'shape',
  library: 'tikz',
  label: 'Retângulo',
  category: 'shapes',
  description: 'Retângulo com posição e dimensões',

  svgRender: (obj, isSelected, scale = 1) => ({
    tag: 'rect',
    x: (obj.x - obj.width / 2) * scale,
    y: (obj.y - obj.height / 2) * scale,
    width: obj.width * scale,
    height: obj.height * scale,
    fill: obj.fill,
    stroke: isSelected ? '#2563eb' : obj.stroke,
    strokeWidth: isSelected ? 3 : obj.strokeWidth,
    className: isSelected ? 'selected' : '',
  }),

  propertySchema: {
    positioning: {
      label: 'Posição',
      x: { type: 'number', label: 'X (centro)', min: -20, max: 20, decimals: 2 },
      y: { type: 'number', label: 'Y (centro)', min: -20, max: 20, decimals: 2 },
    },
    shape: {
      label: 'Dimensões',
      width: { type: 'number', label: 'Largura', min: 0.1, max: 10, decimals: 2 },
      height: { type: 'number', label: 'Altura', min: 0.1, max: 10, decimals: 2 },
    },
    appearance: {
      label: 'Aparência',
      fill: { type: 'color', label: 'Preenchimento' },
      stroke: { type: 'color', label: 'Borda' },
      strokeWidth: { type: 'number', label: 'Espessura', min: 0.5, max: 5, decimals: 1 },
    },
  },

  defaults: {
    x: 0,
    y: 0,
    width: 2,
    height: 1,
    fill: '#ffffff',
    stroke: '#000000',
    strokeWidth: 1,
  },

  capabilities: {
    rotate: { type: 'free' },
    flip: { horizontal: true, vertical: true },
    scale: { uniform: false },
    lock: true,
    visibility: true,
    zOrder: true,
  },

  codeGenerator: (obj) => {
    const x1 = (obj.x - obj.width / 2).toFixed(2)
    const y1 = (obj.y - obj.height / 2).toFixed(2)
    const x2 = (obj.x + obj.width / 2).toFixed(2)
    const y2 = (obj.y + obj.height / 2).toFixed(2)
    return `\\draw[fill=${obj.fill}, draw=${obj.stroke}] (${x1},${y1}) rectangle (${x2},${y2});`
  },

  validate: (obj) => {
    const errors = []
    if (obj.width <= 0) errors.push('Largura deve ser > 0')
    if (obj.height <= 0) errors.push('Altura deve ser > 0')
    return errors
  },

  constraints: {},
}

export const LINE = {
  id: 'line',
  type: 'line',
  library: 'tikz',
  label: 'Linha',
  category: 'lines',

  svgRender: (obj, isSelected, scale = 1) => ({
    tag: 'line',
    x1: obj.x1 * scale,
    y1: obj.y1 * scale,
    x2: obj.x2 * scale,
    y2: obj.y2 * scale,
    stroke: isSelected ? '#2563eb' : obj.stroke,
    strokeWidth: isSelected ? 3 : obj.strokeWidth,
  }),

  propertySchema: {
    points: {
      label: 'Pontos',
      x1: { type: 'number', label: 'X1', decimals: 2 },
      y1: { type: 'number', label: 'Y1', decimals: 2 },
      x2: { type: 'number', label: 'X2', decimals: 2 },
      y2: { type: 'number', label: 'Y2', decimals: 2 },
    },
    appearance: {
      label: 'Aparência',
      stroke: { type: 'color', label: 'Cor' },
      strokeWidth: { type: 'number', label: 'Espessura', min: 0.5, max: 5, decimals: 1 },
    },
  },

  defaults: {
    x1: 0, y1: 0, x2: 1, y2: 1,
    stroke: '#000000',
    strokeWidth: 1,
  },

  capabilities: {
    rotate: { type: 'free' },
    flip: { horizontal: true, vertical: true },
    scale: { uniform: true },
    lock: true,
    visibility: true,
    zOrder: true,
  },

  codeGenerator: (obj) => {
    const x1 = obj.x1.toFixed(2)
    const y1 = obj.y1.toFixed(2)
    const x2 = obj.x2.toFixed(2)
    const y2 = obj.y2.toFixed(2)
    return `\\draw[${obj.stroke}] (${x1},${y1}) -- (${x2},${y2});`
  },

  validate: (obj) => {
    if (obj.x1 === obj.x2 && obj.y1 === obj.y2) {
      return ['Pontos não podem ser iguais']
    }
    return []
  },

  constraints: {},
}

// Registrar
export function registerTikZShapes() {
  elementRegistry.register('circle', CIRCLE)
  elementRegistry.register('rectangle', RECTANGLE)
  elementRegistry.register('line', LINE)
}
