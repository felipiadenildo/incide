/**
 * Configuração global da aplicação
 */

export const APP_CONFIG = {
  // Versão
  VERSION: '0.1.0',
  APP_NAME: 'TikZ Editor',

  // Canvas
  CANVAS: {
    DEFAULT_WIDTH: 800,
    DEFAULT_HEIGHT: 600,
    MIN_ZOOM: 0.1,
    MAX_ZOOM: 5,
    INITIAL_ZOOM: 1,
    GRID_SIZE: 0.1,
    SNAP_DISTANCE: 0.1,
  },

  // TikZ defaults
  TIKZ: {
    DEFAULT_SCALE: 1,
    UNIT: 'cm',
    PRECISION: 2, // casas decimais
    DEFAULT_STROKE_WIDTH: 1,
    DEFAULT_STROKE_COLOR: '#000000',
    DEFAULT_FILL_COLOR: '#ffffff',
  },

  // UI
  UI: {
    PANEL_WIDTH_LEFT: 220,
    PANEL_WIDTH_RIGHT: 280,
    TOOLBAR_HEIGHT: 40,
    TABBAR_HEIGHT: 32,
  },

  // Debounce
  DEBOUNCE: {
    CODE_SYNC: 500, // ms
    CANVAS_RENDER: 16, // ms (60fps)
    AUTOSAVE: 2000, // ms
  },

  // Mode
  MODE: {
    VISUAL: 'visual',
    CODE: 'code',
    PRETTY: 'pretty',
  },

  // Library types
  LIBRARY: {
    TIKZ: 'tikz',
    CIRCUITIKZ: 'circuitikz',
  },
}

// Colors para UI
export const COLORS = {
  PRIMARY: '#2563eb',
  PRIMARY_HOVER: '#1d4ed8',
  SECONDARY: '#64748b',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#3b82f6',

  BG_PRIMARY: '#fafafa',
  BG_SECONDARY: '#f3f4f6',
  BG_HOVER: '#e5e7eb',

  TEXT_PRIMARY: '#1f2937',
  TEXT_SECONDARY: '#6b7280',
  TEXT_MUTED: '#9ca3af',

  BORDER: '#e5e7eb',
  BORDER_LIGHT: '#f3f4f6',
}

// Z-index stack
export const Z_INDEX = {
  BASE: 1,
  PANEL: 10,
  TOOLTIP: 100,
  MODAL: 1000,
  DROPDOWN: 50,
}
