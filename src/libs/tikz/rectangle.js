import { elementRegistry } from '../elementRegistry.js';

const rectangle = {
  label: "Rectangle",
  type: "rectangle",
  id: 'tikz:rectangle',
  library: 'tikz',
  type: 'rectangle', // nome do tipo usado no registry
  label: 'Rectangle',
  category: 'shape',
  defaults: {
    x: 1,
    y: 1,
    width: 1,
    height: 0.5,
    fill: 'none',
    stroke: '#000',
    strokeWidth: 0.05,
  },
  propertySchema: {
    label: 'Rectangle',
    positioning: {
      label: 'Positioning',
      x: {
        type: 'number',
        label: 'X',
        min: -10,
        max: 10,
      },
      y: {
        type: 'number',
        label: 'Y',
        min: -10,
        max: 10,
      },
    },
    shape: {
      label: 'Shape',
      width: {
        type: 'number',
        label: 'Width',
        min: 0.1,
        max: 5,
      },
      height: {
        type: 'number',
        label: 'Height',
        min: 0.1,
        max: 5,
      },
    },
    appearance: {
      label: 'Appearance',
      fill: {
        type: 'color',
        label: 'Fill',
      },
      stroke: {
        type: 'color',
        label: 'Stroke',
      },
      strokeWidth: {
        type: 'number',
        label: 'Strokewidth',
        min: 0.01,
        max: 0.5,
      },
    },
  },
  validate(element) {
    return { valid: true };
  },
  svgRender(element, isSelected, zoom) {
    const stroke = isSelected ? '#3b82f6' : (element.stroke || '#000');
    const strokeWidth = (element.strokeWidth || 0.05) * zoom;

    return {
      tag: 'rect',
      x: element.x * zoom,
      y: element.y * zoom,
      width: element.width * zoom,
      height: element.height * zoom,
      fill: element.fill || 'none',
      stroke,
      strokeWidth,
      className: isSelected ? 'element-selected' : 'element-normal',
    };
  },
  codeGenerator(element) {
    const options = [
      element.stroke ? `stroke=${element.stroke}` : '',
      element.fill ? `fill=${element.fill}` : 'fill=none',
    ]
      .filter((opt) => opt)
      .join(',');
    return `\\draw[${options}] (${element.x},${element.y}) rectangle (${element.x + element.width},${element.y + element.height});`;
  },
};

// ✅ CORREÇÃO: passa (type: string, descriptor: objeto)
elementRegistry.register(rectangle.type, rectangle);
console.log('✅ rectangle registrado:', rectangle.type);

export default rectangle;
