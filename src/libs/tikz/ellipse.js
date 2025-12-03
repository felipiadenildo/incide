import { elementRegistry } from '../elementRegistry.js';

const ellipse = {
  id: 'tikz:ellipse',
  library: 'tikz',
  type: 'elemento',
  label: 'Ellipse',
  category: 'shape',
  defaults: {
  "x": 1,
  "y": 1,
  "rx": 0.8,
  "ry": 0.5,
  "fill": "none",
  "stroke": "#000"
},
  propertySchema: {
  "label": "Ellipse",
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
    "rx": {
      "type": "number",
      "label": "Rx",
      "min": 0.1,
      "max": 5
    },
    "ry": {
      "type": "number",
      "label": "Ry",
      "min": 0.1,
      "max": 5
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
      tag: 'ellipse',
      cx: element.x * zoom,
      cy: element.y * zoom,
      rx: element.rx * zoom,
      ry: element.ry * zoom,
      fill: element.fill || 'none',
      stroke,
      strokeWidth,
      className: isSelected ? 'element-selected' : 'element-normal'
    };
  },
  codeGenerator(element) {
    const stroke = element.stroke ? `stroke=${element.stroke}` : '';
    const fill = element.fill ? `fill=${element.fill}` : 'fill=none';
    return `\\draw[${stroke}${stroke && fill ? ',' : ''}${fill}] (${element.x},${element.y}) ellipse (${element.rx} and ${element.ry});`;
  }
};

elementRegistry.register(ellipse);
console.log("✅ ellipse registrado");


export default ellipse;
