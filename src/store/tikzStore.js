/**
 * TikZ specific store
 */

import { create } from 'zustand'

export const useTikzStore = create((set) => ({
  config: {
    scale: 1,
    unit: 'cm',
    gridSize: 0.1,
    precision: 2,
  },

  preamble: `\\documentclass[tikz,border=5pt]{standalone}
\\usepackage{tikz}
\\begin{document}`,

  epilogue: `\\end{document}`,

  setScale: (scale) =>
    set((state) => ({
      config: { ...state.config, scale },
    })),

  setPrecision: (precision) =>
    set((state) => ({
      config: { ...state.config, precision },
    })),

  setPreamble: (preamble) => set({ preamble }),
  setEpilogue: (epilogue) => set({ epilogue }),
}))
