// src/services/code/parsers/parseTikz.js

/**
 * Parser específico para TikZ.
 * Versão inicial: stub seguro que pode ir sendo enriquecido aos poucos.
 *
 * Convenção de retorno:
 * - Array de elementos prontos para a store:
 *   [{ type, x, y, ...props }]
 */

export function parseTikz(code) {
  if (!code || typeof code !== 'string') return []

  // Remover comentários e espaços extras
  const cleaned = code
    .split('\n')
    .map((line) => line.replace(/%.*/, '').trim())
    .join('\n')

  const elements = []

  // ===== Exemplo bem simples: \draw (x,y) -- (x2,y2); vira um "line" genérico =====
  const drawLineRegex =
    /\\draw\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)\s*--\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)\s*;/g

  let m
  while ((m = drawLineRegex.exec(cleaned)) !== null) {
    const [_, x1, y1, x2, y2] = m
    elements.push({
      type: 'line', // deve existir na lib tikz
      x1: parseFloat(x1),
      y1: parseFloat(y1),
      x2: parseFloat(x2),
      y2: parseFloat(y2),
    })
  }

  // ===== Exemplo simples de \node at (x,y) {texto}; =====
  const nodeRegex =
    /\\node(?:\[[^\]]*\])?\s*at\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)\s*\{([^}]*)\}\s*;/g

  while ((m = nodeRegex.exec(cleaned)) !== null) {
    const [_, x, y, text] = m
    elements.push({
      type: 'node', // deve existir na lib tikz
      x: parseFloat(x),
      y: parseFloat(y),
      text: text.trim(),
    })
  }

  // Outros comandos TikZ podem ser acrescentados aqui conforme a lib cresce

  return elements
}
