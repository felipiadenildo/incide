/**
 * elementRegistry.js
 * Registro central de elementos (TikZ / CircuitikZ / Sandbox)
 *
 * ✅ Carrega dinamicamente TODOS os arquivos:
 *    - src/libs/tikz/*.js
 *    - src/libs/circuittikz/*.js
 *
 * ✅ Cada arquivo deve exportar:
 *    export const descriptor = {
 *      type: 'resistor',
 *      library: 'circuittikz',     // 'tikz' | 'circuittikz' | 'sandbox'
 *      category: 'bipoles',        // usado na aba Insert/ElementPalette
 *      label: 'Resistor',
 *      svgRender: (elem, isSelected, zoom) => ({ ... }),
 *      tikzCode?: (elem) => '...'
 *    }
 */

class ElementRegistry {
  constructor() {
    /** @type {Map<string, any>} */
    this.elements = new Map()
    /** @type {Map<string, Set<string>>} library -> Set<type> */
    this.libraries = new Map()
  }

  /**
   * Registra um novo tipo de elemento.
   * @param {string} type
   * @param {object} descriptor
   */
  register(type, descriptor) {
    if (!type || typeof type !== "string") {
      throw new Error("ElementRegistry.register: type deve ser string")
    }
    if (!descriptor || typeof descriptor !== "object") {
      throw new Error("ElementRegistry.register: descriptor deve ser objeto")
    }

    // Defaults seguros
    const normalized = {
      type,
      label: descriptor.label || type,
      library: descriptor.library || "sandbox",
      category: descriptor.category || "outros",
      svgRender: descriptor.svgRender || (() => null),
      tikzCode: descriptor.tikzCode || null,
      // repassa quaisquer outros campos (icon, defaults, etc.)
      ...descriptor,
    }

    this.elements.set(type, normalized)

    // Atualiza índice de libraries
    if (!this.libraries.has(normalized.library)) {
      this.libraries.set(normalized.library, new Set())
    }
    this.libraries.get(normalized.library).add(type)

    if (import.meta.env.DEV) {
      // Log leve em dev
      console.debug(
        `[elementRegistry] registrado: ${normalized.library}/${normalized.category}/${type}`
      )
    }
  }

  /**
   * Obtém descritor por type.
   * @param {string} type
   */
  get(type) {
    return this.elements.get(type)
  }

  /**
   * Todos os descritores.
   * Usado pela ElementPalette.
   */
  getAll() {
    return Array.from(this.elements.values())
  }

  /**
   * Elementos por categoria.
   * @param {string} category
   */
  getByCategory(category) {
    return Array.from(this.elements.values()).filter(
      (el) => el.category === category
    )
  }

  /**
   * Elementos por library (tikz, circuittikz, sandbox...).
   * @param {string} library
   */
  getByLibrary(library) {
    const types = this.libraries.get(library)
    if (!types) return []
    return Array.from(types)
      .map((t) => this.elements.get(t))
      .filter(Boolean)
  }

  /**
   * Lista de categorias disponíveis (ordenadas).
   */
  getCategories() {
    const cats = new Set()
    for (const el of this.elements.values()) {
      if (el.category) cats.add(el.category)
    }
    return Array.from(cats).sort((a, b) => a.localeCompare(b))
  }

  /**
   * Lista de libraries disponíveis (ordenadas).
   */
  getLibraries() {
    return Array.from(this.libraries.keys()).sort()
  }

  /**
   * Tipos registrados (ids).
   */
  listTypes() {
    return Array.from(this.elements.keys())
  }

  has(type) {
    return this.elements.has(type)
  }

  unregister(type) {
    const desc = this.elements.get(type)
    if (desc) {
      const libSet = this.libraries.get(desc.library)
      if (libSet) {
        libSet.delete(type)
        if (libSet.size === 0) this.libraries.delete(desc.library)
      }
    }
    return this.elements.delete(type)
  }

  clear() {
    this.elements.clear()
    this.libraries.clear()
  }

  size() {
    return this.elements.size
  }
}

// Singleton
export const elementRegistry = new ElementRegistry()

// =====================================
// CARREGAMENTO DINÂMICO (Vite glob)
// =====================================

// Todos arquivos em src/libs/tikz/*.js
const tikzModules = import.meta.glob("./tikz/*.js", { eager: true })
// Todos arquivos em src/libs/circuittikz/*.js
const circuittikzModules = import.meta.glob("./circuittikz/*.js", {
  eager: true,
})

/**
 * Registra todos os módulos que exportam `descriptor`.
 * Suporta:
 *   export const descriptor = {...}
 *   export default { type, svgRender, ... }
 */
function registerFromModules(modRecord, forcedLibrary) {
  Object.entries(modRecord).forEach(([path, mod]) => {
    try {
      let desc = null

      if (mod.descriptor) {
        desc = mod.descriptor
      } else if (mod.default && typeof mod.default === "object") {
        desc = mod.default
      }

      if (!desc) {
        if (import.meta.env.DEV) {
          console.warn(
            `[elementRegistry] módulo ignorado (sem descriptor): ${path}`
          )
        }
        return
      }

      // Define type default se não vier
      const fileName = path.split("/").pop() || ""
      const inferredType = fileName.replace(/\.js$/i, "")
      const type = desc.type || inferredType

      elementRegistry.register(type, {
        ...desc,
        type,
        library: desc.library || forcedLibrary, // garante library correta
      })
    } catch (err) {
      console.error(
        `[elementRegistry] erro ao registrar módulo: ${path}`,
        err
      )
    }
  })
}

// Registra TikZ e CircuitikZ
registerFromModules(tikzModules, "tikz")
registerFromModules(circuittikzModules, "circuittikz")

if (import.meta.env.DEV) {
  console.info(
    `[elementRegistry] pronto: ${elementRegistry.size()} elementos | libs: ${elementRegistry
      .getLibraries()
      .join(", ")}`
  )
}

export default elementRegistry
