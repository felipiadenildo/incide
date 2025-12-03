/**
 * Canvas - Renderiza canvas com filtro por workspace ATIVO + drag & drop
 * Suporte pan/zoom + insert visual + keyboard shortcuts
 */

import React, { useRef, useEffect, useCallback, useState } from "react"
import { useAppStore } from "../../store/useAppStore.js"
import SVGRenderer from "./SVGRenderer.jsx"
import "./Canvas.css"

export function Canvas() {
  const canvasRef = useRef(null)
  
  // ✅ Store - workspace filtering + canvas controls
  const {
    activeWorkspaceId,
    canvasView,
    setPan,
    addPan,
    setZoom,
    addZoom,
    resetView,
    toggleGrid,
    clearSelection
  } = useAppStore()

  // ✅ Drag state
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // ========== ZOOM + PAN ==========
  
  // Wheel zoom (Ctrl + wheel)
  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        addZoom(delta)
      }
    }

    const el = canvasRef.current
    if (!el) return

    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [addZoom])

  // Pan com mouse drag
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0 || e.ctrlKey || e.metaKey) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left - canvasView.panX,
      y: e.clientY - rect.top - canvasView.panY
    })
    setIsDragging(true)
    
    // Clear selection no background click
    if (!e.target.closest('[data-element]')) {
      clearSelection()
    }
  }, [canvasView.panX, canvasView.panY, clearSelection])

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    setPan(
      e.clientX - rect.left - dragOffset.x,
      e.clientY - rect.top - dragOffset.y
    )
  }, [isDragging, dragOffset.x, dragOffset.y, setPan])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  // ✅ Drag & Drop para novos elementos
  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    
    try {
      const elementData = JSON.parse(e.dataTransfer.getData('text/plain'))
      const rect = canvasRef.current.getBoundingClientRect()
      
      // ✅ Novo elemento com workspaceId ATIVO
      const newElement = {
        ...elementData,
        id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        x: (e.clientX - rect.left - canvasView.panX) / canvasView.zoom,
        y: (e.clientY - rect.top - canvasView.panY) / canvasView.zoom,
        workspaceId: activeWorkspaceId,  // ✅ Workspace correto
        rotation: 0,
        flipH: false,
        flipV: false,
        scale: 1
      }
      
      // Adiciona ao store
      useAppStore.getState().addElement(newElement)
    } catch (err) {
      console.warn('Drop inválido:', err)
    }
  }, [activeWorkspaceId, canvasView.panX, canvasView.panY, canvasView.zoom])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'copy'
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch(e.key.toLowerCase()) {
        case 'g':
          e.preventDefault()
          toggleGrid()
          break
        case 'r':
        case 'home':
          e.preventDefault()
          resetView()
          break
        case 'delete':
        case 'backspace':
          if (e.target === document.body) {
            useAppStore.getState().clearSelection()
          }
          break
        case 'escape':
          useAppStore.getState().clearSelection()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div 
      ref={canvasRef}
      className={`canvas-container ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragOver}
    >
      {/* ✅ SVGRenderer recebe workspaceId para filtrar */}
      <SVGRenderer 
        activeWorkspaceId={activeWorkspaceId}
        canvasRef={canvasRef}
      />
      
      {/* Debug overlay (dev only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="canvas-debug">
          W: {activeWorkspaceId.slice(-3)} | 
          Z: {canvasView.zoom.toFixed(1)}x | 
          P: ({canvasView.panX.toFixed(0)}, {canvasView.panY.toFixed(0)})
        </div>
      )}
    </div>
  )
}

export default Canvas
