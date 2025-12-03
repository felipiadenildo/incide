/**
 * TikZ Configuration
 * Configuração global para elementos TikZ
 */

export const TIKZ_CONFIG = {
  // Canvas
  GRID_SIZE: 20,           // pixels
  SCALE: 40,               // pixels por unidade TikZ
  SNAP_GRID: 0.1,          // unidades TikZ
  
  // Zoom
  MIN_ZOOM: 0.1,
  MAX_ZOOM: 5,
  DEFAULT_ZOOM: 1,
  
  // Cores padrão
  DEFAULT_STROKE: '#000000',
  DEFAULT_FILL: '#ffffff',
  SELECTION_COLOR: '#2563eb',
  GRID_COLOR: '#e5e7eb',
  
  // Performance
  DEBOUNCE_DELAY: 300,     // ms para sync
  BATCH_SIZE: 100,          // elementos por lote
  
  // Validação
  MIN_RADIUS: 0.1,
  MAX_RADIUS: 5,
  MIN_WIDTH: 0.5,
  MAX_WIDTH: 10,
  MIN_HEIGHT: 0.5,
  MAX_HEIGHT: 10
}

export const TIKZ_LIBRARIES = {
  shapes: 'Shapes library',
  arrows: 'Arrows library',
  positioning: 'Positioning library'
}
