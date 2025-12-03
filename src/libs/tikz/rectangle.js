import { elementRegistry } from '../elementRegistry.js';

const rectangle = {
  id: 'tikz:rectangle',
  library: 'tikz',
  label: 'Rectangle',
  category: 'shape',
  defaults: {
  "x": 1,
  "y": 1,
  "width": 1.5,
  "height": 1,
  "fill": "none",
  "stroke": "#000"
},
  propertySchema: {
  "label": "Rectangle",
  "positioning": {
    "label": "Positioning",
    "x": {
      "type": "number",
      "label": "X",
      "min": -10,
      "max": 10
    },
    "y": {
      "type": "number",
      "label": "Y",
      "min": -10,
      "max": 10
    }
  },
  "shape": {
    "label": "Shape",
    "width": {
      "type": "number",
      "label": "Width",
      "min": 0.1,
      "max": 10
    },
    "height": {
      "type": "number",
      "label": "Height",
      "min": 0.1,
      "max": 10
    }
  },
  "appearance": {
    "label": "Appearance",
    "fill": {
      "type": "color",
      "label": "Fill"
    },
    "stroke": {
      "type": "color",
      "label": "Stroke"
    }
  }
},
  validate(element) {
    // Validações específicas
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
      rx: 0.05 * zoom,
      fill: element.fill || 'none',
      stroke,
      strokeWidth,
      className: isSelected ? 'element-selected' : 'element-normal'
    };
  },
codeGenerator(element) {
    const stroke = element.stroke ? `stroke=${element.stroke}` : '';
    const fill = element.fill ? `fill=${element.fill}` : 'fill=none';
    return `\\draw[${stroke}${stroke && fill ? ',' : ''}${fill}] (${element.x1},${element.y1}) rectangle (${element.x2},${element.y2});`;
  }
};

elementRegistry.register('tikz:rectangle', rectangle);
export default rectangle;

