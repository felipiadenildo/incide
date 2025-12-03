/**
 * Hook para drag e pan no canvas
 */

import { useRef, useEffect, useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

export function useCanvasDrag(canvasRef) {
  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const [mode, setMode] = useState('idle') // idle, pan, move

  const addPan = useAppStore((state) => state.addPan)
  const selectedIds = useAppStore((state) => state.selectedIds)
  const updateElement = useAppStore((state) => state.updateElement)

  useEffect(() => {
    if (!canvasRef?.current) return

    const canvas = canvasRef.current

    // MOUSE DOWN
    const handleMouseDown = (e) => {
      if (e.button !== 0) return // Left mouse button only

      isDragging.current = true
      startPos.current = { x: e.clientX, y: e.clientY }

      // Se tem seleção = move, se não = pan
      setMode(selectedIds.length > 0 ? 'move' : 'pan')
    }

    // MOUSE MOVE
    const handleMouseMove = (e) => {
      if (!isDragging.current) return

      const deltaX = (e.clientX - startPos.current.x) / 50 // Scale factor
      const deltaY = (e.clientY - startPos.current.y) / 50

      if (mode === 'pan') {
        addPan(deltaX, deltaY)
      } else if (mode === 'move') {
        // Move elementos selecionados
        selectedIds.forEach((id) => {
          updateElement(id, {
            x: (e.clientX / 50) - startPos.current.x / 50,
            y: (e.clientY / 50) - startPos.current.y / 50,
          })
        })
      }

      startPos.current = { x: e.clientX, y: e.clientY }
    }

    // MOUSE UP
    const handleMouseUp = () => {
      isDragging.current = false
      setMode('idle')
    }

    canvas.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [selectedIds, mode, addPan, updateElement])

  return { isDragging: isDragging.current, mode }
}
