/**
 * CodeParser - TikZ / CircuitTikZ
 *
 * v2:
 * - TikZ:
 *   - \draw[opts] (x,y) circle (r);
 *   - \draw[opts] (x1,y1) rectangle (x2,y2);
 *   - \draw[opts] (x1,y1) -- (x2,y2) (-- (x3,y3) ... );
 *   - \node[...] at (x,y) {texto};
 *
 * - CircuitTikZ:
 *   - \draw (x1,y1) to[R,...] (x2,y2);
 *   - \draw (x1,y1) to[C,...] (x2,y2);
 *   - \draw (x1,y1) to[L,...] (x2,y2);
 */

import { elementRegistry } from '../../libs/elementRegistry'

export class CodeParser {
  // ===================== API PÚBLICA =====================

  static parseCode(code) {
    if (!code || typeof code !== 'string') return []

    const tikzElements = this._parseTikz(code)
    const circuitElements = this._parseCircuitTikz(code)

    return [...tikzElements, ...circuitElements]
  }

  static generateCode(elements) {
    if (!Array.isArray(elements)) return ''

    return elements
      .map((elem) => {
        try {
          const descriptor = elementRegistry.get(elem.type)
          return descriptor.codeGenerator(elem)
        } catch (e) {
          console.error(`Erro ao gerar código para ${elem.type}:`, e)
          return `% Erro ao gerar código para ${elem.type} (${elem.id})`
        }
      })
      .join('\n')
  }

  static validateCode(code) {
    const errors = []

    if (!code || !code.trim()) {
      return { valid: true, errors: [] }
    }

    const drawCount = (code.match(/\\draw/g) || []).length
    const nodeCount = (code.match(/\\node/g) || []).length
    if (drawCount === 0 && nodeCount === 0) {
      errors.push('Nenhum comando \\draw ou \\node encontrado.')
    }

    const beginCount = (code.match(/\\begin{/g) || []).length
    const endCount = (code.match(/\\end{/g) || []).length
    if (beginCount !== endCount) {
      errors.push('Blocos \\begin{}/\\end{} desbalanceados.')
    }

    return { valid: errors.length === 0, errors }
  }

  // ===================== PARSERS INTERNOS =====================

  /**
   * TikZ puro: circle, rectangle, line, node
   */
  static _parseTikz(code) {
    const elements = []
    const lines = code
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('%'))

    for (const rawLine of lines) {
      const line = rawLine.replace(/\s+/g, ' ')

      // ---- CIRCLE ----
      const circleMatch = line.match(
        /^\\draw(\[[^\]]*])?\s*\(\s*([^,]+)\s*,\s*([^)]+)\)\s*circle\s*\(\s*([^)]+)\s*\)\s*;?$/
      )
      if (circleMatch) {
        const [, options = '', x, y, r] = circleMatch
        elements.push({
          id: `circle-${elements.length + 1}`,
          type: 'circle',
          library: 'tikz',
          x: parseFloat(x),
          y: parseFloat(y),
          radius: parseFloat(r),
          ...this._parseDrawOptions(options),
        })
        continue
      }

      // ---- RECTANGLE ----
      const rectMatch = line.match(
        /^\\draw(\[[^\]]*])?\s*\(\s*([^,]+)\s*,\s*([^)]+)\)\s*rectangle\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)\s*;?$/
      )
      if (rectMatch) {
        const [, options = '', x1, y1, x2, y2] = rectMatch
        const x1n = parseFloat(x1)
        const y1n = parseFloat(y1)
        const x2n = parseFloat(x2)
        const y2n = parseFloat(y2)
        const width = Math.abs(x2n - x1n)
        const height = Math.abs(y2n - y1n)

        elements.push({
          id: `rectangle-${elements.length + 1}`,
          type: 'rectangle',
          library: 'tikz',
          x: x1n + width / 2,
          y: y1n + height / 2,
          width,
          height,
          ...this._parseDrawOptions(options),
        })
        continue
      }

      // ---- LINHAS (múltiplos segmentos) ----
      // Ex: \draw[opts] (0,0) -- (1,0) -- (1,1);
      const polyLineMatch = line.match(
        /^\\draw(\[[^\]]*])?\s*((\(\s*[^)]+\s*\)\s*--\s*)+\(\s*[^)]+\s*\))\s*;?$/
      )
      if (polyLineMatch) {
        const [, options = '', pointsPart] = polyLineMatch
        const points = this._extractPoints(pointsPart) // [{x,y}, ...]
        if (points.length >= 2) {
          for (let i = 0; i < points.length - 1; i++) {
            const p1 = points[i]
            const p2 = points[i + 1]
            elements.push({
              id: `line-${elements.length + 1}`,
              type: 'line',
              library: 'tikz',
              x1: p1.x,
              y1: p1.y,
              x2: p2.x,
              y2: p2.y,
              ...this._parseDrawOptions(options),
            })
          }
        }
        continue
      }

      // ---- NODE ----
      // \node[opts] at (x,y) {texto};
      const nodeMatch = line.match(
        /^\\node(\[[^\]]*])?\s*at\s*\(\s*([^,]+)\s*,\s*([^)]+)\)\s*\{(.*)\}\s*;?$/
      )
      if (nodeMatch) {
        const [, options = '', x, y, content] = nodeMatch
        const parsedOpts = this._parseNodeOptions(options)
        elements.push({
          id: `text-${elements.length + 1}`,
          type: 'text',
          library: 'tikz',
          x: parseFloat(x),
          y: parseFloat(y),
          content: content.trim(),
          fontSize: parsedOpts.fontSize ?? 12,
          fontFamily: parsedOpts.fontFamily ?? 'Arial',
          fill: parsedOpts.fill ?? '#000000',
        })
        continue
      }
    }

    return elements
  }

  /**
   * CircuitTikZ bipoles simples.
   */
  static _parseCircuitTikz(code) {
    const elements = []
    const lines = code
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith('%'))

    for (const rawLine of lines) {
      const line = rawLine.replace(/\s+/g, ' ')

      // \draw (x1,y1) to[R, l=$1k$] (x2,y2);
      const bipoleMatch = line.match(
        /^\\draw\s*\(\s*([^,]+)\s*,\s*([^)]+)\)\s*to\[\s*([^,]+)\s*(?:,\s*([^\]]+))?]\s*\(\s*([^,]+)\s*,\s*([^)]+)\)\s*;?$/
      )
      if (!bipoleMatch) continue

      const [, x1, y1, compType, options = '', x2, y2] = bipoleMatch
      const typeCode = compType.trim().toUpperCase()

      const base = {
        id: `${typeCode.toLowerCase()}-${elements.length + 1}`,
        library: 'circuitikz',
        x: parseFloat(x1),
        y: parseFloat(y1),
        x2: parseFloat(x2),
        y2: parseFloat(y2),
        ...this._parseCircuitOptions(options),
      }

      if (typeCode === 'R') {
        elements.push({ ...base, type: 'resistor' })
      } else if (typeCode === 'C') {
        elements.push({ ...base, type: 'capacitor' })
      } else if (typeCode === 'L') {
        elements.push({ ...base, type: 'inductor' })
      }
    }

    return elements
  }

  // ===================== HELPERS =====================

  static _extractPoints(segmentStr) {
    // Recebe algo como: "(0,0) -- (1,0) -- (1,1)"
    const pointRegex = /\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g
    const points = []
    let m
    while ((m = pointRegex.exec(segmentStr)) !== null) {
      const [, x, y] = m
      points.push({ x: parseFloat(x), y: parseFloat(y) })
    }
    return points
  }

  static _parseDrawOptions(optionsRaw) {
    if (!optionsRaw) return {}
    const options = optionsRaw.replace(/^\[/, '').replace(/]$/, '')
    const parts = options.split(',').map((p) => p.trim())
    const out = {}

    for (const part of parts) {
      if (!part) continue
      const [key, value] = part.split('=').map((s) => s.trim())

      if (key === 'fill') {
        out.fill = this._normalizeColor(value)
      } else if (key === 'draw') {
        out.stroke = this._normalizeColor(value)
      } else if (key === 'line width') {
        const num = parseFloat(value)
        if (!Number.isNaN(num)) out.strokeWidth = num
      }
    }

    return out
  }

  static _parseCircuitOptions(optionsRaw) {
    if (!optionsRaw) return {}
    const out = {}

    const labelMatch = optionsRaw.match(/l=\$(.*?)\$/)
    if (labelMatch) {
      out.label_text = labelMatch[1]
    }

    return out
  }

  /**
   * Parse simplificado de opções de \node[...]
   * Ex.: \node[fill=red, font=\small] ...
   */
  static _parseNodeOptions(optionsRaw) {
    if (!optionsRaw) return {}
    const options = optionsRaw.replace(/^\[/, '').replace(/]$/, '')
    const parts = options.split(',').map((p) => p.trim())
    const out = {}

    for (const part of parts) {
      if (!part) continue

      // fill=color
      const [key, value] = part.split('=').map((s) => s.trim())
      if (key === 'fill') {
        out.fill = this._normalizeColor(value)
      }

      // font=\small, \large etc (heurística simples)
      if (key === 'font') {
        if (value.includes('\\small')) out.fontSize = 10
        if (value.includes('\\large')) out.fontSize = 16
      }
    }

    return out
  }

  static _normalizeColor(token) {
    if (!token) return '#000000'
    if (!token.startsWith('#') && /^[a-zA-Z]+$/.test(token)) {
      return token
    }
    if (token.startsWith('#')) return token
    return `#${token}`
  }
}

export default CodeParser
