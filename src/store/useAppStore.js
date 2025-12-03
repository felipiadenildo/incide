/**
 * App Store - Zustand + Immer + Devtools
 *
 * - elements: todos os elementos (TikZ + CircuitTikZ)
 * - selectedIds: Set de ids selecionados (single / multi)
 * - canvasView: pan/zoom/grid
 * - editorMode: 'visual' | 'code' | 'pretty'
 * - history: undo/redo (snapshot simples)
 * - project: metadados (nome, tipo: tikz/circuitikz)
 */

import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware/devtools'

const initialState = {
  // === Elementos ===
  elements: [],

  // === Seleção ===
  selectedIds: new Set(),

  // === Canvas View ===
  canvasView: {
    panX: 0,
    panY: 0,
    zoom: 1,
    gridSize: 0.1,
    showGrid: true,
  },

  // === Editor Mode ===
  editorMode: 'visual', // 'visual' | 'code' | 'pretty'
  codeEditorValue: '',

  // === Histórico (undo/redo) ===
  history: {
    past: [],
    present: null,
    future: [],
    maxSteps: 50,
  },

  // === Projeto ===
  project: {
    name: 'Untitled',
    type: 'tikz', // 'tikz' | 'circuitikz'
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
}

export const useAppStore = create(
  devtools(
    immer((set, get) => ({
      // Estado inicial
      ...initialState,

      // ===================== ELEMENTOS =====================

      addElement: (element) =>
        set((state) => {
          state.elements.push(element)
          state.project.modified = new Date().toISOString()
        }),

      addElements: (elements) =>
        set((state) => {
          state.elements.push(...elements)
          state.project.modified = new Date().toISOString()
        }),

      deleteElement: (elementId) =>
        set((state) => {
          state.elements = state.elements.filter((e) => e.id !== elementId)
          state.selectedIds.delete(elementId)
          state.project.modified = new Date().toISOString()
        }),

      updateElement: (elementId, updates) =>
        set((state) => {
          const element = state.elements.find((e) => e.id === elementId)
          if (element) {
            Object.assign(element, updates)
            state.project.modified = new Date().toISOString()
          }
        }),

      updateElements: (updates) =>
        set((state) => {
          for (const { id, props } of updates) {
            const element = state.elements.find((e) => e.id === id)
            if (element) {
              Object.assign(element, props)
            }
          }
          state.project.modified = new Date().toISOString()
        }),

      clearElements: () =>
        set((state) => {
          state.elements = []
          state.selectedIds.clear()
          state.project.modified = new Date().toISOString()
        }),

      reorderElement: (elementId, direction) =>
        set((state) => {
          const idx = state.elements.findIndex((e) => e.id === elementId)
          if (idx === -1) return

          if (direction === 'forward' && idx < state.elements.length - 1) {
            ;[state.elements[idx], state.elements[idx + 1]] = [
              state.elements[idx + 1],
              state.elements[idx],
            ]
          } else if (direction === 'backward' && idx > 0) {
            ;[state.elements[idx], state.elements[idx - 1]] = [
              state.elements[idx - 1],
              state.elements[idx],
            ]
          } else if (direction === 'front') {
            const [item] = state.elements.splice(idx, 1)
            state.elements.push(item)
          } else if (direction === 'back') {
            const [item] = state.elements.splice(idx, 1)
            state.elements.unshift(item)
          }
        }),

      getElement: (elementId) => {
        const state = get()
        return state.elements.find((e) => e.id === elementId)
      },

      getSelectedElements: () => {
        const state = get()
        return state.elements.filter((e) => state.selectedIds.has(e.id))
      },

      // ===================== SELEÇÃO =====================

      selectElement: (elementId) =>
        set((state) => {
          state.selectedIds.clear()
          if (elementId != null) {
            state.selectedIds.add(elementId)
          }
        }),

      addToSelection: (elementId) =>
        set((state) => {
          state.selectedIds.add(elementId)
        }),

      removeFromSelection: (elementId) =>
        set((state) => {
          state.selectedIds.delete(elementId)
        }),

      toggleSelection: (elementId) =>
        set((state) => {
          if (state.selectedIds.has(elementId)) {
            state.selectedIds.delete(elementId)
          } else {
            state.selectedIds.add(elementId)
          }
        }),

      selectElements: (elementIds) =>
        set((state) => {
          state.selectedIds.clear()
          elementIds.forEach((id) => state.selectedIds.add(id))
        }),

      clearSelection: () =>
        set((state) => {
          state.selectedIds.clear()
        }),

      isSelected: (elementId) => {
        const state = get()
        return state.selectedIds.has(elementId)
      },

      getSelectionCount: () => {
        const state = get()
        return state.selectedIds.size
      },

      // ===================== CANVAS VIEW =====================

      setPan: (panX, panY) =>
        set((state) => {
          state.canvasView.panX = panX
          state.canvasView.panY = panY
        }),

      addPan: (deltaX, deltaY) =>
        set((state) => {
          state.canvasView.panX += deltaX
          state.canvasView.panY += deltaY
        }),

      setZoom: (zoom) =>
        set((state) => {
          const clamped = Math.max(0.1, Math.min(5, zoom))
          state.canvasView.zoom = clamped
        }),

      addZoom: (deltaZoom) =>
        set((state) => {
          const newZoom = state.canvasView.zoom + deltaZoom
          state.canvasView.zoom = Math.max(0.1, Math.min(5, newZoom))
        }),

      setGridSize: (gridSize) =>
        set((state) => {
          state.canvasView.gridSize = gridSize
        }),

      toggleGrid: () =>
        set((state) => {
          state.canvasView.showGrid = !state.canvasView.showGrid
        }),

      resetView: () =>
        set((state) => {
          state.canvasView = {
            panX: 0,
            panY: 0,
            zoom: 1,
            gridSize: 0.1,
            showGrid: true,
          }
        }),

      // ===================== EDITOR MODE =====================

      setEditorMode: (mode) =>
        set((state) => {
          if (['visual', 'code', 'pretty'].includes(mode)) {
            state.editorMode = mode
          }
        }),

      setCodeEditorValue: (code) =>
        set((state) => {
          state.codeEditorValue = code
        }),

      // ===================== HISTÓRICO (UNDO/REDO) =====================

      saveSnapshot: () =>
        set((state) => {
          const snapshot = {
            elements: JSON.stringify(state.elements),
            selectedIds: Array.from(state.selectedIds),
            timestamp: Date.now(),
          }

          if (state.history.present) {
            state.history.past.push(state.history.present)
          }
          state.history.present = snapshot
          state.history.future = []

          if (state.history.past.length > state.history.maxSteps) {
            state.history.past.shift()
          }
        }),

      undo: () =>
        set((state) => {
          if (state.history.past.length === 0) return

          if (state.history.present) {
            state.history.future.unshift(state.history.present)
          }

          const snapshot = state.history.past.pop()
          if (!snapshot) return

          state.elements = JSON.parse(snapshot.elements)
          state.selectedIds = new Set(snapshot.selectedIds)
          state.history.present = snapshot
        }),

      redo: () =>
        set((state) => {
          if (state.history.future.length === 0) return

          if (state.history.present) {
            state.history.past.push(state.history.present)
          }

          const snapshot = state.history.future.shift()
          if (!snapshot) return

          state.elements = JSON.parse(snapshot.elements)
          state.selectedIds = new Set(snapshot.selectedIds)
          state.history.present = snapshot
        }),

      // ===================== PROJECT =====================

      setProjectName: (name) =>
        set((state) => {
          state.project.name = name
          state.project.modified = new Date().toISOString()
        }),

      setProjectType: (type) =>
        set((state) => {
          if (['tikz', 'circuitikz'].includes(type)) {
            state.project.type = type
            state.project.modified = new Date().toISOString()
          }
        }),

      resetProject: () =>
        set(() => ({
          ...initialState,
          project: {
            ...initialState.project,
            created: new Date().toISOString(),
          },
        })),

      // ===================== DEBUG =====================

      debug: () => {
        const state = get()
        console.log('=== App Store Debug ===')
        console.log('Elements:', state.elements.length)
        console.log('Selected:', state.selectedIds.size)
        console.log('Project:', state.project)
        console.log(
          'History past/future:',
          state.history.past.length,
          '/',
          state.history.future.length
        )
      },
    })),
    {
      name: 'appStore',
      trace: true,
    }
  )
)
