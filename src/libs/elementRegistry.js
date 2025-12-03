/**
 * elementRegistry.js - Registro central de tipos de elementos
 * Define todos os tipos de elementos e suas propriedades de renderização
 */

class ElementRegistry {
  constructor() {
    this.elements = new Map();
  }

  /**
   * Registra um novo tipo de elemento
   * @param {string} type - Tipo do elemento (ex: 'resistor', 'capacitor')
   * @param {object} descriptor - Descritor com svgRender, tikzCode, etc
   */
  register(type, descriptor) {
    if (!type || typeof type !== 'string') {
      throw new Error('Type deve ser uma string válida');
    }
    if (!descriptor || typeof descriptor !== 'object') {
      throw new Error('Descriptor deve ser um objeto válido');
    }
    this.elements.set(type, descriptor);
  }

  /**
   * Obtém o descritor de um tipo de elemento
   * @param {string} type - Tipo do elemento
   * @returns {object|undefined} Descritor do elemento ou undefined
   */
  get(type) {
    return this.elements.get(type);
  }

  /**
   * Verifica se um tipo existe
   * @param {string} type - Tipo do elemento
   * @returns {boolean}
   */
  has(type) {
    return this.elements.has(type);
  }

  /**
   * Lista todos os tipos registrados
   * @returns {Array<string>}
   */
  listTypes() {
    return Array.from(this.elements.keys());
  }

  /**
   * Remove um tipo de elemento
   * @param {string} type - Tipo do elemento
   * @returns {boolean} true se removido, false se não existia
   */
  unregister(type) {
    return this.elements.delete(type);
  }

  /**
   * Limpa todos os elementos registrados
   */
  clear() {
    this.elements.clear();
  }

  // ✅ ADICIONE ESTES MÉTODOS NO FINAL do elementRegistry.js

/**
 * Retorna TODOS os elementos registrados (para ElementPalette)
 * @returns {Array} Array de descritores
 */
getAll() {
  return Array.from(this.elements.values());
}

/**
 * Retorna elementos por categoria
 * @param {string} category - 'shape', 'circuit', etc.
 * @returns {Array} Elementos da categoria
 */
getByCategory(category) {
  return Array.from(this.elements.values()).filter(el => el.category === category);
}

/**
 * Conta total de elementos registrados
 * @returns {number}
 */
size() {
  return this.elements.size;
}

get(type) {
    return this.elements.get(type);
  }

  // ✅ NOVOS MÉTODOS
  getAll() {
    return Array.from(this.elements.values());
  }
  
  getByCategory(category) {
    return Array.from(this.elements.values()).filter(el => el.category === category);
  }
  
  size() {
    return this.elements.size;
  }

}

// Instância singleton
export const elementRegistry = new ElementRegistry();

// Registrar elementos básicos
elementRegistry.register('resistor', {

  svgRender: (elem, isSelected, zoom) => ({
    tag: 'g',
    children: [
      {
        tag: 'rect',
        x: elem.x * zoom - 0.5,
        y: elem.y * zoom - 0.15,
        width: 1,
        height: 0.3,
        fill: 'none',
        stroke: isSelected ? '#3b82f6' : '#000',
        strokeWidth: isSelected ? 0.04 : 0.02,
      },
      {
        tag: 'line',
        x1: elem.x * zoom - 0.75,
        y1: elem.y * zoom,
        x2: elem.x * zoom - 0.5,
        y2: elem.y * zoom,
        stroke: '#000',
        strokeWidth: 0.02,
      },
      {
        tag: 'line',
        x1: elem.x * zoom + 0.5,
        y1: elem.y * zoom,
        x2: elem.x * zoom + 0.75,
        y2: elem.y * zoom,
        stroke: '#000',
        strokeWidth: 0.02,
      },
    ],
  }),
  tikzCode: (elem) => `\\draw (${elem.x},${elem.y}) to[R] ++(2,0);`,
});

elementRegistry.register('capacitor', {

  svgRender: (elem, isSelected, zoom) => ({
    tag: 'g',
    children: [
      {
        tag: 'line',
        x1: elem.x * zoom,
        y1: elem.y * zoom - 0.3,
        x2: elem.x * zoom,
        y2: elem.y * zoom + 0.3,
        stroke: isSelected ? '#3b82f6' : '#000',
        strokeWidth: isSelected ? 0.04 : 0.02,
      },
      {
        tag: 'line',
        x1: elem.x * zoom + 0.1,
        y1: elem.y * zoom - 0.3,
        x2: elem.x * zoom + 0.1,
        y2: elem.y * zoom + 0.3,
        stroke: isSelected ? '#3b82f6' : '#000',
        strokeWidth: isSelected ? 0.04 : 0.02,
      },
    ],
  }),
  tikzCode: (elem) => `\\draw (${elem.x},${elem.y}) to[C] ++(2,0);`,
});

elementRegistry.register('wire', {

  svgRender: (elem, isSelected, zoom) => ({
    tag: 'line',
    x1: elem.x1 * zoom,
    y1: elem.y1 * zoom,
    x2: elem.x2 * zoom,
    y2: elem.y2 * zoom,
    stroke: isSelected ? '#3b82f6' : '#000',
    strokeWidth: isSelected ? 0.04 : 0.02,
  }),
  tikzCode: (elem) => `\\draw (${elem.x1},${elem.y1}) -- (${elem.x2},${elem.y2});`,
});



export default elementRegistry;
