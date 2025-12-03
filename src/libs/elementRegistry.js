/**
 * ElementRegistry - Registro centralizado de elementos
 */

class ElementRegistry {
  constructor() {
    this.elements = new Map()
    this.categories = new Map()
  }

  register(id, descriptor) {
    this._validateDescriptor(id, descriptor)
    this.elements.set(id, descriptor)

    const category = descriptor.category
    if (!this.categories.has(category)) {
      this.categories.set(category, [])
    }
    this.categories.get(category).push(id)
  }

  get(id) {
    if (!this.elements.has(id)) {
      throw new Error(`Elemento '${id}' não registrado`)
    }
    return this.elements.get(id)
  }

  getAll() {
    return Array.from(this.elements.values())
  }

  getByCategory(category) {
    const ids = this.categories.get(category) || []
    return ids.map(id => this.elements.get(id))
  }

  getByLibrary(library) {
    return this.getAll().filter(elem => elem.library === library)
  }

  getCategories() {
    return Array.from(this.categories.keys())
  }

  _validateDescriptor(id, descriptor) {
    const required = [
      'id', 'type', 'library', 'label', 'category',
      'svgRender', 'propertySchema', 'defaults',
      'codeGenerator', 'validate'
    ]

    for (const field of required) {
      if (!(field in descriptor)) {
        throw new Error(`Descriptor '${id}' falta campo: '${field}'`)
      }
    }
  }

  clear() {
    this.elements.clear()
    this.categories.clear()
  }

  debug() {
    console.log('=== ElementRegistry ===')
    console.log(`Total: ${this.elements.size}`)
    for (const [cat, ids] of this.categories) {
      console.log(`  ${cat}: ${ids.join(', ')}`)
    }
  }
}

export const elementRegistry = new ElementRegistry()
export { ElementRegistry }
