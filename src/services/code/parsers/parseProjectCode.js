// src/services/code/parsers/parseProjectCode.js

/**
 * Orquestrador de parsing por linguagem.
 * Usa parsers específicos (TikZ, CircuitTikZ, futuras libs).
 */

import { parseTikz } from './parseTikz'
import { parseCircuitikz } from './parseCircuitikz'

/**
 * Faz o roteamento para o parser correto com base em projectType.
 * Retorna uma lista de elementos prontos para a store.
 *
 * @param {string} projectType - 'tikz' | 'circuitikz' | futuros
 * @param {string} code - código LaTeX da área do editor
 * @returns {Array<object>} elementos no formato esperado pela store
 */
export function parseProjectCode(projectType, code) {
  const type = projectType || 'tikz'

  if (type === 'circuitikz') {
    return parseCircuitikz(code)
  }

  // ganchos futuros:
  // if (type === 'pgfplots') return parsePgfplots(code)
  // if (type === 'flowchart') return parseFlowchart(code)

  // padrão: TikZ puro
  return parseTikz(code)
}
