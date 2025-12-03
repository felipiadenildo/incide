import { elementRegistry } from '../elementRegistry.js';

const circle = {
  id: 'tikz:circle',
  library: 'tikz',
  label: 'Circle',
  category: 'shape',
  defaults: {
  "x": 1,
  "y": 1,
  "radius": 0.5,
  "fill": "none",
  "stroke": "#000",
  "strokeWidth": 0.05
},
  propertySchema: {
  "label": "Circle",
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
    "radius": {
      "type": "number",
      "label": "Radius",
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
    },
    "strokeWidth": {
      "type": "number",
      "label": "Strokewidth",
      "min": 0.01,
      "max": 0.5
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
      tag: 'circle',
      cx: element.x * zoom,
      cy: element.y * zoom,
      r: element.radius * zoom,
      fill: element.fill || 'none',
      stroke,
      strokeWidth,
      className: isSelected ? 'element-selected' : 'element-normal'
    };
  },
  codeGenerator(element) {
    const options = [
      element.stroke ? `stroke=${element.stroke}` : '',
      element.fill ? `fill=${element.fill}` : 'fill=none'
    ].filter(opt => opt).join(',');
    return `\\draw[${options}] (${element.x},${element.y}) circle (${element.radius});`;
  }
};

elementRegistry.register('tikz:circle', circle);

export default circle;
