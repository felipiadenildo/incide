/**
 * ElementRegistry - Factory Pattern para gerenciar elementos
 * Versão: 1.0
 */

class ElementRegistry {
  constructor() {
    this.elements = new Map()
    this.log = []
  }

  register(id, descriptor) {
    if (!id || !descriptor) {
      console.error(`[ElementRegistry] ID e descriptor são obrigatórios`)
      return false
    }
    
    if (this.elements.has(id)) {
      console.warn(`[ElementRegistry] Elemento ${id} já registrado, substituindo`)
    }
    
    this.elements.set(id, descriptor)
    this.log.push({ action: 'register', id, timestamp: new Date().toISOString() })
    return true
  }

  get(id) {
    if (!this.elements.has(id)) {
      console.warn(`[ElementRegistry] Elemento ${id} não encontrado`)
      return null
    }
    return this.elements.get(id)
  }

  getAll() {
    return Array.from(this.elements.values())
  }

  getByLibrary(library) {
    return Array.from(this.elements.values())
      .filter(e => e.library === library)
  }

  getByCategory(category) {
    return Array.from(this.elements.values())
      .filter(e => e.category === category)
  }

  unregister(id) {
    const result = this.elements.delete(id)
    if (result) {
      this.log.push({ action: 'unregister', id, timestamp: new Date().toISOString() })
    }
    return result
  }

  getStatistics() {
    return {
      total: this.elements.size,
      byLibrary: {
        tikz: this.getByLibrary('tikz').length,
        circuitikz: this.getByLibrary('circuitikz').length
      },
      operations: this.log.length
    }
  }
}

export const elementRegistry = new ElementRegistry()
