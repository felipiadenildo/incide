// src/services/elements/elementFactory.js

/**
 * ElementFactory - cria elementos a partir do elementRegistry
 * Resiliente: defaults opcionais, validate opcional.
 */

import { elementRegistry } from "../../libs/elementRegistry"
import { v4 as uuidv4 } from "uuid"

export class ElementFactory {
  static create(type, overrides = {}) {
    const descriptor = elementRegistry.get(type)

    if (!descriptor) {
      console.warn(`[ElementFactory] descriptor não encontrado para type="${type}"`)
      const id = `${type}-${uuidv4()}`
      return {
        id,
        type,
        library: "unknown",
        ...overrides,
      }
    }

    const id = `${type}-${uuidv4()}`

    const element = {
      id,
      type,
      library: descriptor.library || "sandbox",
      ...(descriptor.defaults || {}),
      ...overrides,
    }

    // validate opcional
    if (typeof descriptor.validate === "function") {
      const errors = descriptor.validate(element)
      if (errors && errors.length) {
        console.warn(`Elemento ${type} inválido:`, errors)
      }
    }

    return element
  }
}

export default ElementFactory
