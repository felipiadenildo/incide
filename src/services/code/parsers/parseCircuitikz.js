// src/services/code/parsers/parseCircuitikz.js

/**
 * Parser específico para CircuiTikZ.
 * Versão inicial: suporta alguns casos simples como:
 *   \draw (0,0) to[R] (2,0);
 *   \draw (0,0) to[C=1uF] (2,0);
 *
 * Convenção de retorno:
 * - Array de elementos prontos para a store:
 *   [{ type, x1, y1, x2, y2, value, ... }]
 */

export function parseCircuitikz(code) {
  if (!code || typeof code !== 'string') return []

  const cleaned = code
    .split('\n')
    .map((line) => line.replace(/%.*/, '').trim())
    .join('\n')

  const elements = []

  // Regex genérico para bipolos: to[R], to[C=<val>], to[L], etc.
  const bipoleRegex =
    /\\draw\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)\s*to\[\s*([A-Za-z]+)(?:=([^,\]]+))?[^\]]*\]\s*\(\s*([-\d.]+)\s*,\s*([-\d.]+)\s*\)\s*;/g

  let m
  while ((m = bipoleRegex.exec(cleaned)) !== null) {
    const [_, x1, y1, kind, valueRaw, x2, y2] = m
    const kindUpper = (kind || '').toUpperCase()

    // Mapeia símbolo CircuitikZ → type da lib
    let type = 'wire'
    if (kindUpper === 'R') type = 'resistor'
    else if (kindUpper === 'C') type = 'capacitor'
    else if (kindUpper === 'L') type = 'inductor'
    // futuros: V, I, etc.

    elements.push({
      type,
      x1: parseFloat(x1),
      y1: parseFloat(y1),
      x2: parseFloat(x2),
      y2: parseFloat(y2),
      value: valueRaw ? valueRaw.trim() : undefined,
    })
  }

  // Aqui você pode adicionar outros padrões, como fontes, ground, etc.

  return elements
}
