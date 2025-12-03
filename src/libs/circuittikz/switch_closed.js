import { elementRegistry } from '../elementRegistry.js';

const switchClosed = {
  id: 'circuittikz:switch_closed',
  library: 'circuittikz',
  type: 'switch_closed',
  label: 'Switch Closed',
  category: 'bipole',
  defaults: { x1: 0, y1: 0, x2: 1.5, y2: 0 },
  propertySchema: {
    connection: { label: 'Conexões', x1: { type: 'number' }, y1: { type: 'number' }, x2: { type: 'number' }, y2: { type: 'number' } }
  },
  validate: () => ({ valid: true }),
  svgRender(element, isSelected, zoom) {
    const stroke = isSelected ? '#3b82f6' : '#000';
    return {
      tag: 'line',
      x1: element.x1 * zoom, y1: element.y1 * zoom,
      x2: element.x2 * zoom, y2: element.y2 * zoom,
      stroke, strokeWidth: 0.05 * zoom
    };
  },
  codeGenerator(element) {
    return `\\draw (${element.x1},${element.y1}) to[Sclosed] (${element.x2},${element.y2});`;
  }
};

elementRegistry.register(switchClosed);
console.log("✅ circuittikz:switch_closed registrado");
export default switchClosed;
