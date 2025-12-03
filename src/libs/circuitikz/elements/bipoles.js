/**
 * CircuitTikZ Bipoles - Componentes com 2 terminais
 * Resistor, Capacitor, Indutor, etc
 */

import { elementRegistry } from '../../elementRegistry'

export const RESISTOR = {
  id: 'resistor',
  type: 'bipole',
  library: 'circuitikz',
  label: 'Resistor',
  category: 'bipoles',
  description: 'Resistor (2 terminais)',

  svgRender: (obj, isSelected, scale = 1) => ({
    tag: 'g',
    children: [
      // Linha esquerda
      {
        tag: 'line',
        x1: obj.x - 0.5 * scale,
        y1: obj.y * scale,
        x2: obj.x - 0.2 * scale,
        y2: obj.y * scale,
        stroke: '#000',
        strokeWidth: 1,
      },
      // Caixa do resistor
      {
        tag: 'rect',
        x: (obj.x - 0.2) * scale,
        y: (obj.y - 0.15) * scale,
        width: 0.4 * scale,
        height: 0.3 * scale,
        fill: '#fff',
        stroke: isSelected ? '#2563eb' : '#000',
        strokeWidth: isSelected ? 2 : 1,
      },
      // Linha direita
      {
        tag: 'line',
        x1: obj.x + 0.2 * scale,
        y1: obj.y * scale,
        x2: obj.x + 0.5 * scale,
        y2: obj.y * scale,
        stroke: '#000',
        strokeWidth: 1,
      },
    ],
  }),

  propertySchema: {
    positioning: {
      label: 'Posição',
      x: { type: 'number', label: 'X', min: -20, max: 20, decimals: 2 },
      y: { type: 'number', label: 'Y', min: -20, max: 20, decimals: 2 },
      rotation: { type: 'number', label: 'Rotação (°)', min: 0, max: 360, decimals: 0 },
    },
    component: {
      label: 'Componente',
      value: { type: 'number', label: 'Valor (Ω)', min: 0.1, max: 1000000, decimals: 1 },
      label_text: { type: 'text', label: 'Rótulo', placeholder: 'ex: R1, 1kΩ' },
    },
  },

  defaults: {
    x: 0,
    y: 0,
    rotation: 0,
    value: 1000, // 1k ohm
    label_text: 'R',
  },

  ports: [
    { id: 'left', anchor: 'left', direction: 'in', type: 'terminal', label: 'A' },
    { id: 'right', anchor: 'right', direction: 'out', type: 'terminal', label: 'B' },
  ],

  capabilities: {
    rotate: { type: 'discrete', snapAngles: [0, 90, 180, 270] },
    flip: { horizontal: true, vertical: true },
    scale: { uniform: false },
    lock: true,
    visibility: true,
    zOrder: true,
  },

  codeGenerator: (obj) => {
    const x1 = obj.x.toFixed(2)
    const y1 = obj.y.toFixed(2)
    const x2 = (obj.x + 1).toFixed(2)
    const y2 = obj.y.toFixed(2)

    return `\\draw (${x1},${y1}) to[R, l=$${obj.label_text}$] (${x2},${y2});`
  },

  validate: (obj) => {
    const errors = []
    if (obj.value <= 0) errors.push('Valor deve ser > 0')
    if (obj.rotation % 90 !== 0) errors.push('Rotação deve ser múltiplo de 90°')
    return errors
  },

  constraints: { minValue: 0.1, maxValue: 1000000 },
}

export const CAPACITOR = {
  id: 'capacitor',
  type: 'bipole',
  library: 'circuitikz',
  label: 'Capacitor',
  category: 'bipoles',
  description: 'Capacitor (2 terminais)',

  svgRender: (obj, isSelected, scale = 1) => ({
    tag: 'g',
    children: [
      // Linha esquerda
      {
        tag: 'line',
        x1: obj.x - 0.5 * scale,
        y1: obj.y * scale,
        x2: obj.x - 0.15 * scale,
        y2: obj.y * scale,
        stroke: '#000',
        strokeWidth: 1,
      },
      // Placa 1
      {
        tag: 'line',
        x1: (obj.x - 0.15) * scale,
        y1: (obj.y - 0.15) * scale,
        x2: (obj.x - 0.15) * scale,
        y2: (obj.y + 0.15) * scale,
        stroke: isSelected ? '#2563eb' : '#000',
        strokeWidth: isSelected ? 2 : 2,
      },
      // Placa 2
      {
        tag: 'line',
        x1: (obj.x + 0.15) * scale,
        y1: (obj.y - 0.15) * scale,
        x2: (obj.x + 0.15) * scale,
        y2: (obj.y + 0.15) * scale,
        stroke: isSelected ? '#2563eb' : '#000',
        strokeWidth: isSelected ? 2 : 2,
      },
      // Linha direita
      {
        tag: 'line',
        x1: obj.x + 0.15 * scale,
        y1: obj.y * scale,
        x2: obj.x + 0.5 * scale,
        y2: obj.y * scale,
        stroke: '#000',
        strokeWidth: 1,
      },
    ],
  }),

  propertySchema: {
    positioning: {
      label: 'Posição',
      x: { type: 'number', label: 'X', decimals: 2 },
      y: { type: 'number', label: 'Y', decimals: 2 },
      rotation: { type: 'number', label: 'Rotação (°)', decimals: 0 },
    },
    component: {
      label: 'Componente',
      value: { type: 'number', label: 'Valor (F)', min: 1e-12, max: 1, decimals: 12 },
      label_text: { type: 'text', label: 'Rótulo', placeholder: 'ex: C1, 100µF' },
    },
  },

  defaults: {
    x: 0,
    y: 0,
    rotation: 0,
    value: 1e-6, // 1µF
    label_text: 'C',
  },

  ports: [
    { id: 'left', anchor: 'left', direction: 'in', type: 'terminal', label: 'A' },
    { id: 'right', anchor: 'right', direction: 'out', type: 'terminal', label: 'B' },
  ],

  capabilities: {
    rotate: { type: 'discrete', snapAngles: [0, 90, 180, 270] },
    flip: { horizontal: true, vertical: true },
    scale: { uniform: false },
    lock: true,
    visibility: true,
    zOrder: true,
  },

  codeGenerator: (obj) => {
    const x1 = obj.x.toFixed(2)
    const y1 = obj.y.toFixed(2)
    const x2 = (obj.x + 1).toFixed(2)
    const y2 = obj.y.toFixed(2)

    return `\\draw (${x1},${y1}) to[C, l=$${obj.label_text}$] (${x2},${y2});`
  },

  validate: (obj) => {
    const errors = []
    if (obj.value <= 0) errors.push('Valor deve ser > 0')
    return errors
  },

  constraints: { minValue: 1e-12, maxValue: 1 },
}

export const INDUCTOR = {
  id: 'inductor',
  type: 'bipole',
  library: 'circuitikz',
  label: 'Indutor',
  category: 'bipoles',

  svgRender: (obj, isSelected, scale = 1) => ({
    tag: 'g',
    children: [
      // Linha esquerda
      {
        tag: 'line',
        x1: obj.x - 0.5 * scale,
        y1: obj.y * scale,
        x2: obj.x - 0.3 * scale,
        y2: obj.y * scale,
        stroke: '#000',
        strokeWidth: 1,
      },
      // Bobinas (simplificado: retângulos)
      ...Array.from({ length: 3 }).map((_, i) => ({
        tag: 'circle',
        cx: (obj.x - 0.2 + i * 0.15) * scale,
        cy: obj.y * scale,
        r: 0.08 * scale,
        fill: 'none',
        stroke: isSelected ? '#2563eb' : '#000',
        strokeWidth: isSelected ? 2 : 1,
      })),
      // Linha direita
      {
        tag: 'line',
        x1: obj.x + 0.3 * scale,
        y1: obj.y * scale,
        x2: obj.x + 0.5 * scale,
        y2: obj.y * scale,
        stroke: '#000',
        strokeWidth: 1,
      },
    ],
  }),

  propertySchema: {
    positioning: {
      label: 'Posição',
      x: { type: 'number', label: 'X', decimals: 2 },
      y: { type: 'number', label: 'Y', decimals: 2 },
    },
    component: {
      label: 'Componente',
      value: { type: 'number', label: 'Valor (H)', min: 1e-12, max: 1000, decimals: 9 },
      label_text: { type: 'text', label: 'Rótulo', placeholder: 'ex: L1, 10µH' },
    },
  },

  defaults: {
    x: 0,
    y: 0,
    rotation: 0,
    value: 1e-6, // 1µH
    label_text: 'L',
  },

  ports: [
    { id: 'left', anchor: 'left', direction: 'in', type: 'terminal' },
    { id: 'right', anchor: 'right', direction: 'out', type: 'terminal' },
  ],

  capabilities: {
    rotate: { type: 'discrete', snapAngles: [0, 90, 180, 270] },
    flip: { horizontal: true, vertical: true },
    scale: { uniform: false },
    lock: true,
    visibility: true,
    zOrder: true,
  },

  codeGenerator: (obj) => {
    const x1 = obj.x.toFixed(2)
    const y1 = obj.y.toFixed(2)
    const x2 = (obj.x + 1).toFixed(2)
    const y2 = obj.y.toFixed(2)

    return `\\draw (${x1},${y1}) to[L, l=$${obj.label_text}$] (${x2},${y2});`
  },

  validate: (obj) => {
    if (obj.value <= 0) return ['Valor deve ser > 0']
    return []
  },

  constraints: {},
}

// Registrar
export function registerCircuitTikZBipoles() {
  elementRegistry.register('resistor', RESISTOR)
  elementRegistry.register('capacitor', CAPACITOR)
  elementRegistry.register('inductor', INDUCTOR)
}
