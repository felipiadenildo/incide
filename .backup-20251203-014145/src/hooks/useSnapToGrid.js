export const GRID_SIZE = 20; // pixels
export const SNAP_THRESHOLD = 10; // pixels de tolerância

export function snapToGrid(value, snapSize = GRID_SIZE, isAltPressed = false) {
  if (isAltPressed) return value;
  return Math.round(value / snapSize) * snapSize;
}

export function getSnapGuides(value, snapSize = GRID_SIZE) {
  // Retorna linhas guia para visualizar snap
  const snapped = Math.round(value / snapSize) * snapSize;
  return {
    snapped,
    offset: Math.abs(value - snapped),
    shouldSnap: Math.abs(value - snapped) < SNAP_THRESHOLD,
  };
}
