import { create } from "zustand"
import { devtools } from "zustand/middleware"

const initialState = {
  // ... elementos existentes ...
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
    type: "sandbox",  // sandbox, tikz, circuitikz
    created: new Date().toISOString(),
    modified: new Date().toISOString(),
  },
  
  /**
 * Muda tipo do workspace ATIVO (com confirmação)
 */
changeActiveWorkspaceType: (newType) => {
  const state = get()
  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId)
  
  if (!activeWorkspace) return
  
  // ✅ CONFIRMAÇÃO se editor não vazio
  if (state.elements.length > 0) {
    const confirmed = window.confirm(
      `Mudar workspace para ${newType}?\n\n` +
      `⚠️ Elementos existentes podem ficar incompatíveis.\n` +
      `Deseja continuar?`
    )
    if (!confirmed) return
  }
  
  set((state) => ({
    workspaces: state.workspaces.map(ws =>
      ws.id === state.activeWorkspaceId 
        ? { ...ws, type: newType }
        : ws
    ),
    project: { ...state.project, modified: new Date().toISOString() }
  }))
  
  console.log(`[Store] Workspace type changed to: ${newType}`)
},

  // ✅ NOVO: WORKSPACES
  workspaces: [
    {
      id: 'workspace-1',
      name: 'Workspace 1',
      type: 'sandbox',
      created: new Date().toISOString()
    }
  ],
  activeWorkspaceId: 'workspace-1',
}

export const useAppStore = create(
  devtools(
    (set, get) => ({
      ...initialState,

      // ========== ELEMENTOS (EXISTENTES + WORKSPACE) ==========
      
      addElement: (element) =>
        set((state) => {
          // ✅ Filtra elementos por workspaceId
          const workspaceElements = state.elements.filter(e => 
            e.workspaceId === element.workspaceId
          )
          
          return {
            elements: [
              ...state.elements.filter(e => e.workspaceId !== element.workspaceId),
              ...workspaceElements,
              element
            ],
            project: { ...state.project, modified: new Date().toISOString() },
          }
        }),

      // ... outros métodos existentes permanecem iguais ...
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

      // ... resto dos métodos existentes permanecem IGUAIS ...

      // ========== WORKSPACES NOVOS ==========
      
      /**
       * Define workspace ativo (usado pelo InsertPanel)
       */
      setActiveWorkspace: (workspaceId) => {
        if (!workspaceId) return
        
        set({ activeWorkspaceId: workspaceId })
        console.log('[Store] Active workspace:', workspaceId)
      },

      /**
       * Cria novo workspace
       */
      createWorkspace: (type = 'sandbox') =>
        set((state) => {
          const id = `workspace-${state.workspaces.length + 1}`
          const newWorkspace = {
            id,
            name: `Workspace ${state.workspaces.length + 1}`,
            type,
            created: new Date().toISOString()
          }
          
          return {
            workspaces: [...state.workspaces, newWorkspace],
            activeWorkspaceId: id,
            project: { ...state.project, modified: new Date().toISOString() }
          }
        }),

      /**
       * Renomeia workspace
       */
      renameWorkspace: (workspaceId, newName) =>
        set((state) => ({
          workspaces: state.workspaces.map(ws =>
            ws.id === workspaceId ? { ...ws, name: newName } : ws
          ),
          project: { ...state.project, modified: new Date().toISOString() }
        })),

      /**
       * Deleta workspace (mantém pelo menos 1)
       */
      deleteWorkspace: (workspaceId) =>
        set((state) => {
          const workspaces = state.workspaces.filter(ws => ws.id !== workspaceId)
          
          if (workspaces.length === 0) return state // Mínimo 1 workspace
          
          const firstWorkspaceId = workspaces[0].id
          return {
            workspaces,
            activeWorkspaceId: firstWorkspaceId,
            elements: state.elements.filter(e => e.workspaceId !== workspaceId),
            selectedIds: new Set(),
            project: { ...state.project, modified: new Date().toISOString() }
          }
        }),

      /**
       * Getter: workspace ativo
       */
      getActiveWorkspace: () => {
        const state = get()
        return state.workspaces.find(ws => ws.id === state.activeWorkspaceId)
      },

      /**
       * Getter: elementos do workspace ativo
       */
      getActiveWorkspaceElements: () => {
        const state = get()
        const activeId = state.activeWorkspaceId
        return state.elements.filter(e => e.workspaceId === activeId)
      },

      // ========== SELEÇÃO (FILTRADA POR WORKSPACE) ==========
      
      selectElement: (elementId) =>
        set((state) => {
          const activeElements = state.elements.filter(e => 
            e.workspaceId === state.activeWorkspaceId
          )
          const elementExists = activeElements.some(e => e.id === elementId)
          
          if (!elementExists) return state
          
          const next = new Set()
          if (elementId != null) next.add(elementId)
          return { selectedIds: next }
        }),

      toggleSelection: (elementId) =>
        set((state) => {
          const next = new Set(state.selectedIds)
          if (next.has(elementId)) next.delete(elementId)
          else next.add(elementId)
          return { selectedIds: next }
        }),

      clearSelection: () => set(() => ({ selectedIds: new Set() })),

            /**
       * Conta selecionados no workspace ATIVO
       */
      getSelectionCount: () => {
        const state = get()
        const activeElements = state.elements.filter(e => 
          e.workspaceId === state.activeWorkspaceId
        )
        return state.selectedIds.size
      },

      /**
       * Verifica se elemento está no workspace ativo
       */
      isElementInActiveWorkspace: (elementId) => {
        const state = get()
        const element = state.elements.find(e => e.id === elementId)
        return element?.workspaceId === state.activeWorkspaceId
      },


      // ========== PROJECT (EXISTENTE) ==========
      
      setProjectType: (type) =>
        set((state) => {
          if (!["sandbox", "tikz", "circuittikz"].includes(type)) return state
          console.log("[Store] project type changed to:", type)
          return {
            project: {
              ...state.project,
              type,
              modified: new Date().toISOString(),
            },
            // Atualiza todos workspaces para novo tipo
            workspaces: state.workspaces.map(ws => ({
              ...ws,
              type
            }))
          }
        }),


        // ✅ ADICIONE LOGO DEPOIS:
changeActiveWorkspaceType: (newType) => {
  const state = get()
  const activeWorkspace = state.workspaces.find(ws => ws.id === state.activeWorkspaceId)
  
  if (!activeWorkspace) return
  
  // ✅ CONFIRMAÇÃO se editor não vazio
  if (state.elements.length > 0) {
    const confirmed = window.confirm(
      `Mudar workspace para ${newType}?\n\n` +
      `⚠️ Elementos existentes podem ficar incompatíveis.\n` +
      `Deseja continuar?`
    )
    if (!confirmed) return
  }
  
  set((state) => ({
    workspaces: state.workspaces.map(ws =>
      ws.id === state.activeWorkspaceId 
        ? { ...ws, type: newType }
        : ws
    ),
    project: { ...state.project, modified: new Date().toISOString() }
  }))
},


      // ========== CANVAS VIEW (EXISTENTE COMPLETO) ==========


      
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

      // ========== EDITOR (EXISTENTE COMPLETO) ==========
      
      setEditorMode: (mode) =>
        set((state) => ({
          editorMode: ["visual", "code", "pretty"].includes(mode)
            ? mode
            : state.editorMode,
        })),

      setCodeEditorValue: (code) => set(() => ({ codeEditorValue: code })),

      // ========== HISTÓRICO (EXISTENTE COMPLETO) ==========
      
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

      // ========== PROJECT (EXISTENTE + MELHORADO) ==========
      
      setProjectName: (name) =>
        set((state) => ({
          project: {
            ...state.project,
            name,
            modified: new Date().toISOString(),
          },
        })),

      // ✅ JÁ ATUALIZADO com workspaces
      setProjectType: (type) =>
        set((state) => {
          if (!["sandbox", "tikz", "circuittikz"].includes(type)) return state;
          console.log("[Store] project type changed to:", type);
          return {
            project: {
              ...state.project,
              type,
              modified: new Date().toISOString(),
            },
            workspaces: state.workspaces.map(ws => ({
              ...ws,
              type
            }))
          };
        }),

      resetProject: () => set(() => ({
        ...initialState,
        project: {
          ...initialState.project,
          created: new Date().toISOString(),
        },
      })),

      // ========== DEBUG (ATUALIZADO) ==========
      
      debug: () => {
        const state = get();
        console.log("=== App Store Debug ===");
        console.log("Workspaces:", state.workspaces.length, state.activeWorkspaceId);
        console.log("Elements total:", state.elements.length);
        console.log("Project:", state.project);
        console.log("History past/future:", 
          state.history.past.length, "/", state.history.future.length);
      },
    }),
    { name: "appStore", trace: true }
  )

  
);
