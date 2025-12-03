// src/services/languageRegistry.js

/**
 * languageRegistry
 * Mapeia tipos de projeto para configuração de linguagem/ambiente.
 * Resiliente e pronto para futuras libs (pgfplots, flowchart, etc).
 */

export const languageRegistry = {
  tikz: {
    id: 'tikz',
    label: 'TikZ',
    environment: 'tikzpicture',
    requiredPackages: ['tikz'],
    // futuro: options (escala, styles globais, estilos de tema)
  },

  circuitikz: {
    id: 'circuitikz',
    label: 'CircuitiTikZ',
    environment: 'circuitikz',
    requiredPackages: ['circuitikz'],
  },

  // ganchos para futuras libs:
  // pgfplots: {
  //   id: 'pgfplots',
  //   label: 'PGFPlots',
  //   environment: 'tikzpicture', // normalmente usa tikzpicture com axis
  //   requiredPackages: ['tikz', 'pgfplots'],
  // },
  //
  // flowchart: {
  //   id: 'flowchart',
  //   label: 'Flowchart',
  //   environment: 'tikzpicture',
  //   requiredPackages: ['tikz'],
  // },
}

/**
 * Retorna config de linguagem para um tipo de projeto.
 * Se o tipo for desconhecido, faz fallback resiliente para TikZ.
 */
export function getLanguageConfig(projectType) {
  if (projectType && languageRegistry[projectType]) {
    return languageRegistry[projectType]
  }
  // fallback padrão: TikZ
  return languageRegistry.tikz
}
