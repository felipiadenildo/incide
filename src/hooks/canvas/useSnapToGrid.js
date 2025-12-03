/**
 * Hook para snap to grid
 */

import { useAppStore } from '../../store/useAppStore'

export function useSnapToGrid() {
  const gridSize = useAppStore((state) => state.canvasView.gridSize)

  /**
   * Snap uma coordenada ao grid
   */
  const snap = (value) => {
    if (gridSize === 0) return value
    return Math.round(value / gridSize) * gridSize
  }

  /**
   * Snap um objeto inteiro
   */
  const snapObject = (obj) => {
    const snapped = { ...obj }

    if ('x' in obj) snapped.x = snap(obj.x)
    if ('y' in obj) snapped.y = snap(obj.y)
    if ('x1' in obj) snapped.x1 = snap(obj.x1)
    if ('y1' in obj) snapped.y1 = snap(obj.y1)
    if ('x2' in obj) snapped.x2 = snap(obj.x2)
    if ('y2' in obj) snapped.y2 = snap(obj.y2)

    return snapped
  }

  return { snap, snapObject, gridSize }
}
