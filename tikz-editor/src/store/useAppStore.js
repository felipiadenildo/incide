import { create } from "zustand";
import { EXAMPLE_TIKZ_CODE, EXAMPLE_CIRCUIT_CODE } from "./tikzStore.js";

export const useAppStore = create((set, get) => ({
  // ===== MULTI-PROJECT STATE =====
  projects: [
    {
      id: "project_0",
      type: "tikz",
      name: "Exemplo TikZ",
      code: EXAMPLE_TIKZ_CODE,
      objects: [
        {
          id: "obj_circle",
          type: "circle",
          layer: 0,
          x: 0,
          y: 3,
          radius: 0.5,
          fill: "#ADD8E6",
          stroke: "#0000FF",
          strokeWidth: 2,
        },
        {
          id: "obj_rect",
          type: "rectangle",
          layer: 1,
          x: 1.5,
          y: 3,
          width: 1,
          height: 0.8,
          fill: "#FFB6C6",
          stroke: "#FF0000",
          strokeWidth: 2,
        },
      ],
    },
    {
      id: "project_1",
      type: "circuitikz",
      name: "Exemplo CircuitTikZ",
      code: EXAMPLE_CIRCUIT_CODE,
      objects: [
        {
          id: "cir_v1",
          type: "voltage",
          layer: 0,
          x1: 0,
          y1: 0,
          x2: 0,
          y2: 2,
          label: "V",
          value: "5V",
        },
        {
          id: "cir_r1",
          type: "resistor",
          layer: 1,
          x1: 0,
          y1: 2,
          x2: 2,
          y2: 2,
          label: "R",
          value: "1k",
        },
      ],
    },
  ],
  activeProjectId: "project_0",
  selectedElementId: null,
  selectedIds: [],
  code: "",

  // ===== CODE EDITOR =====
  setCode: (code) =>
    set((state) => {
      const project = state.projects.find(
        (p) => p.id === state.activeProjectId
      );
      if (project) {
        project.code = code;
      }
      return { projects: [...state.projects] };
    }),

  getCode: () => {
    const state = get();
    const project = state.projects.find((p) => p.id === state.activeProjectId);
    return project?.code || "";
  },

  // ===== PROJECT MANAGEMENT =====
  createProject: (type, name = `Novo ${type}`) =>
    set((state) => {
      const newProject = {
        id: `project_${Date.now()}`,
        type,
        name,
        code: `\\begin{${type === "circuitikz" ? type : "tikzpicture"}\n  % ${type}\n\\end{${type === "circuitikz" ? type : "tikzpicture"}}`,
        objects: [],
      };
      return {
        projects: [...state.projects, newProject],
        activeProjectId: newProject.id,
        selectedElementId: null,
        selectedIds: [],
      };
    }),

  switchProject: (projectId) =>
    set({
      activeProjectId: projectId,
      selectedElementId: null,
      selectedIds: [],
    }),

  deleteProject: (projectId) =>
    set((state) => {
      const newProjects = state.projects.filter((p) => p.id !== projectId);
      return {
        projects: newProjects.length > 0 ? newProjects : state.projects,
        activeProjectId:
          state.activeProjectId === projectId
            ? newProjects[0]?.id || state.activeProjectId
            : state.activeProjectId,
      };
    }),

  renameProject: (projectId, newName) =>
    set((state) => {
      const project = state.projects.find((p) => p.id === projectId);
      if (project) {
        project.name = newName;
      }
      return { projects: [...state.projects] };
    }),

  // ===== OBJECT MANAGEMENT =====
  updateDiagramObject: (id, updates) =>
    set((state) => {
      const project = state.projects.find(
        (p) => p.id === state.activeProjectId
      );
      if (project) {
        const obj = project.objects.find((o) => o.id === id);
        if (obj) {
          Object.assign(obj, updates);
        }
      }
      return { projects: [...state.projects] };
    }),

  addDiagramObject: (obj) =>
    set((state) => {
      const project = state.projects.find(
        (p) => p.id === state.activeProjectId
      );
      if (project) {
        obj.layer = Math.max(...project.objects.map((o) => o.layer || 0), -1) + 1;
        project.objects.push(obj);
      }
      return { projects: [...state.projects] };
    }),

  removeDiagramObject: (id) =>
    set((state) => {
      const project = state.projects.find(
        (p) => p.id === state.activeProjectId
      );
      if (project) {
        project.objects = project.objects.filter((o) => o.id !== id);
      }
      return { projects: [...state.projects] };
    }),

  // ===== LAYER MANAGEMENT =====
  bringToFront: (id) =>
    set((state) => {
      const project = state.projects.find(
        (p) => p.id === state.activeProjectId
      );
      if (project) {
        const obj = project.objects.find((o) => o.id === id);
        if (obj) {
          obj.layer =
            Math.max(...project.objects.map((o) => o.layer || 0)) + 1;
        }
      }
      return { projects: [...state.projects] };
    }),

  sendToBack: (id) =>
    set((state) => {
      const project = state.projects.find(
        (p) => p.id === state.activeProjectId
      );
      if (project) {
        const obj = project.objects.find((o) => o.id === id);
        if (obj) {
          obj.layer =
            Math.min(...project.objects.map((o) => o.layer || 0)) - 1;
        }
      }
      return { projects: [...state.projects] };
    }),

  // ===== SELECTION =====
  selectElement: (id) =>
    set({
      selectedElementId: id,
      selectedIds: [],
    }),

  selectMultiple: (ids) =>
    set({
      selectedIds: ids,
      selectedElementId: null,
    }),

  deselectAll: () =>
    set({
      selectedElementId: null,
      selectedIds: [],
    }),
}));
