/**
 * ElementFactory - Cria elementos novos
 */

import { elementRegistry } from '../../libs/elementRegistry'
import { v4 as uuidv4 } from 'uuid'

export class ElementFactory {
  /**
   * Cria novo elemento do tipo especificado
   */
  static create(type, overrides = {}) {
    const descriptor = elementRegistry.get(type)
    const id = `${type}-${uuidv4()}`

    const element = {
      id,
      type,
      ...descriptor.defaults,
      ...overrides,
    }

    // Validar
    const errors = descriptor.validate(element)
    if (errors.length > 0) {
      console.warn(`Elemento ${type} inválido:`, errors)
    }

    return element
  }

  /**
   * Cria múltiplos elementos
   */
  static createMany(type, count = 1, spacing = { x: 1, y: 0 }) {
    const elements = []
    for (let i = 0; i < count; i++) {
      elements.push(
        this.create(type, {
          x: i * spacing.x,
          y: i * spacing.y,
        })
      )
    }
    return elements
  }

  /**
   * Clona elemento
   */
  static clone(element, offset = { x: 0.5, y: 0.5 }) {
    return {
      ...element,
      id: `${element.type}-${uuidv4()}`,
      x: element.x + offset.x,
      y: element.y + offset.y,
    }
  }

  /**
   * Lista elementos de uma categoria
   */
  static getCategory(category) {
    return elementRegistry.getByCategory(category)
  }

  /**
   * Lista elementos de uma biblioteca
   */
  static getLibrary(library) {
    return elementRegistry.getByLibrary(library)
  }
}

export default ElementFactory
