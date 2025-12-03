/**
 * ElementFactory - cria elementos a partir do elementRegistry
 */

import { elementRegistry } from "../../libs/elementRegistry";
import { v4 as uuidv4 } from "uuid";

export class ElementFactory {
  static create(type, overrides = {}) {
    const descriptor = elementRegistry.get(type);
    const id = `${type}-${uuidv4()}`;

    const element = {
      id,
      type,
      library: descriptor.library,
      ...descriptor.defaults,
      ...overrides,
    };

    const errors = descriptor.validate(element);
    if (errors?.length) {
      console.warn(`Elemento ${type} inválido:`, errors);
    }

    return element;
  }
}

export default ElementFactory;
