import { create } from "zustand";
import { devtools } from "zustand/middleware";

const initialState = {
  elements: [],
  selectedIds: new Set(),
  canvasView: {
    panX: 0,
    panY: 0,
    zoom: 1,
    gridSize: 0.1,
    showGrid: true,
  },
  editorMode: "visual",
  codeEditorValue: "",
  history: {
    past: [],
    present: null,
    future: [],
    maxSteps: 50,
  },
  project: {
    name: "Untitled",
    type: "sandbox",  // ← sandbox, tikz, circuitikz
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
};

export const useAppStore = create(
  devtools(
    (set, get) => ({
      ...initialState,

      // ========== ELEMENTOS ==========

      addElement: (element) =>
        set((state) => ({
          elements: [...state.elements, element],
          project: { ...state.project, modified: new Date().toISOString() },
        })),

      addElements: (elements) =>
        set((state) => ({
          elements: [...state.elements, ...elements],
          project: { ...state.project, modified: new Date().toISOString() },
        })),

      deleteElement: (elementId) =>
        set((state) => {
          const nextElements = state.elements.filter((e) => e.id !== elementId);
          const nextSelected = new Set(state.selectedIds);
          nextSelected.delete(elementId);
          return {
            elements: nextElements,
            selectedIds: nextSelected,
            project: { ...state.project, modified: new Date().toISOString() },
          };
        }),

      updateElement: (elementId, updates) =>
        set((state) => ({
          elements: state.elements.map((e) =>
            e.id === elementId ? { ...e, ...updates } : e
          ),
          project: { ...state.project, modified: new Date().toISOString() },
        })),

      updateElements: (updates) =>
        set((state) => {
          const map = new Map(updates.map((u) => [u.id, u.props]));
          return {
            elements: state.elements.map((e) =>
              map.has(e.id) ? { ...e, ...map.get(e.id) } : e
            ),
            project: { ...state.project, modified: new Date().toISOString() },
          };
        }),

      clearElements: () =>
        set((state) => ({
          elements: [],
          selectedIds: new Set(),
          project: { ...state.project, modified: new Date().toISOString() },
        })),

      reorderElement: (elementId, direction) =>
        set((state) => {
          const idx = state.elements.findIndex((e) => e.id === elementId);
          if (idx === -1) return state;

          const next = [...state.elements];

          if (direction === "forward" && idx < next.length - 1) {
            [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
          } else if (direction === "backward" && idx > 0) {
            [next[idx], next[idx - 1]] = [next[idx - 1], next[idx]];
          } else if (direction === "front") {
            const [item] = next.splice(idx, 1);
            next.push(item);
          } else if (direction === "back") {
            const [item] = next.splice(idx, 1);
            next.unshift(item);
          }

          return { elements: next };
        }),

      getElement: (elementId) => {
        const state = get();
        return state.elements.find((e) => e.id === elementId);
      },

      getSelectedElements: () => {
        const state = get();
        return state.elements.filter((e) => state.selectedIds.has(e.id));
      },

      // ========== SELEÇÃO ==========

      selectElement: (elementId) =>
        set((state) => {
          const next = new Set();
          if (elementId != null) next.add(elementId);
          return { selectedIds: next };
        }),

      addToSelection: (elementId) =>
        set((state) => {
          const next = new Set(state.selectedIds);
          next.add(elementId);
          return { selectedIds: next };
        }),

      removeFromSelection: (elementId) =>
        set((state) => {
          const next = new Set(state.selectedIds);
          next.delete(elementId);
          return { selectedIds: next };
        }),

      toggleSelection: (elementId) =>
        set((state) => {
          const next = new Set(state.selectedIds);
          if (next.has(elementId)) next.delete(elementId);
          else next.add(elementId);
          return { selectedIds: next };
        }),

      selectElements: (elementIds) =>
        set(() => {
          const next = new Set(elementIds);
          return { selectedIds: next };
        }),

      clearSelection: () => set(() => ({ selectedIds: new Set() })),

      isSelected: (elementId) => {
        const state = get();
        return state.selectedIds.has(elementId);
      },

      getSelectionCount: () => {
        const state = get();
        return state.selectedIds.size;
      },

      // ========== CANVAS VIEW ==========

      setPan: (panX, panY) =>
        set((state) => ({
          canvasView: { ...state.canvasView, panX, panY },
        })),

      addPan: (dx, dy) =>
        set((state) => ({
          canvasView: {
            ...state.canvasView,
            panX: state.canvasView.panX + dx,
            panY: state.canvasView.panY + dy,
          },
        })),

      setZoom: (zoom) =>
        set((state) => ({
          canvasView: {
            ...state.canvasView,
            zoom: Math.max(0.1, Math.min(5, zoom)),
          },
        })),

      addZoom: (delta) =>
        set((state) => {
          const z = state.canvasView.zoom + delta;
          return {
            canvasView: {
              ...state.canvasView,
              zoom: Math.max(0.1, Math.min(5, z)),
            },
          };
        }),

      setGridSize: (gridSize) =>
        set((state) => ({
          canvasView: { ...state.canvasView, gridSize },
        })),

      toggleGrid: () =>
        set((state) => ({
          canvasView: {
            ...state.canvasView,
            showGrid: !state.canvasView.showGrid,
          },
        })),

      resetView: () =>
        set((state) => ({
          canvasView: {
            ...state.canvasView,
            panX: 0,
            panY: 0,
            zoom: 1,
          },
        })),

      // ========== EDITOR ==========

      setEditorMode: (mode) =>
        set((state) => ({
          editorMode: ["visual", "code", "pretty"].includes(mode)
            ? mode
            : state.editorMode,
        })),

      setCodeEditorValue: (code) => set(() => ({ codeEditorValue: code })),

      // ========== HISTÓRICO (v1 simples) ==========

      saveSnapshot: () =>
        set((state) => {
          const snapshot = {
            elements: JSON.stringify(state.elements),
            selectedIds: Array.from(state.selectedIds),
            timestamp: Date.now(),
          };

          const past = [...state.history.past, state.history.present].filter(
            Boolean
          );

          if (past.length > state.history.maxSteps) past.shift();

          return {
            history: {
              ...state.history,
              past,
              present: snapshot,
              future: [],
            },
          };
        }),

      undo: () =>
        set((state) => {
          if (!state.history.past.length) return state;

          const past = [...state.history.past];
          const newPresent = past.pop();
          const future = state.history.present
            ? [state.history.present, ...state.history.future]
            : state.history.future;

          return {
            elements: JSON.parse(newPresent.elements),
            selectedIds: new Set(newPresent.selectedIds),
            history: {
              ...state.history,
              past,
              present: newPresent,
              future,
            },
          };
        }),

      redo: () =>
        set((state) => {
          if (!state.history.future.length) return state;

          const [nextPresent, ...restFuture] = state.history.future;
          const past = state.history.present
            ? [...state.history.past, state.history.present]
            : state.history.past;

          return {
            elements: JSON.parse(nextPresent.elements),
            selectedIds: new Set(nextPresent.selectedIds),
            history: {
              ...state.history,
              past,
              present: nextPresent,
              future: restFuture,
            },
          };
        }),

      // ========== PROJECT ==========

      setProjectName: (name) =>
        set((state) => ({
          project: {
            ...state.project,
            name,
            modified: new Date().toISOString(),
          },
        })),

      setProjectType: (type) =>
        set((state) => {
          if (!["sandbox", "tikz", "circuitikz"].includes(type)) return state;
          console.log("[Store] project type changed to:", type);
          return {
            project: {
              ...state.project,
              type,
              modified: new Date().toISOString(),
            },
          };
        }),

      resetProject: () => ({
        ...initialState,
        project: {
          ...initialState.project,
          created: new Date().toISOString(),
        },
      }),

      // ========== DEBUG ==========

      debug: () => {
        const state = get();
        console.log("=== App Store Debug ===");
        console.log("Elements:", state.elements.length);
        console.log("Selected:", state.selectedIds.size);
        console.log("Project:", state.project);
        console.log(
          "History past/future:",
          state.history.past.length,
          "/",
          state.history.future.length
        );
      },
    }),
    { name: "appStore", trace: true }
  )
);
