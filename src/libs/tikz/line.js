import { elementRegistry } from '../elementRegistry.js';

const line = {
  id: 'tikz:line',
  library: 'tikz',
  type: 'elemento',
  label: 'Line',
  category: 'shape',
  defaults: {
  "x1": 0,
  "y1": 0,
  "x2": 2,
  "y2": 2,
  "stroke": "#000",
  "strokeWidth": 0.05
},
  propertySchema: {
  "label": "Line",
  "positioning": {
    "label": "Posi\u00e7\u00e3o"
  },
  "shape": {
    "label": "Forma"
  },
  "appearance": {
    "label": "Appearance",
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
  },
  "start": {
    "label": "Start",
    "x1": {
      "type": "number",
      "label": "X1",
      "min": -10,
      "max": 10
    },
    "y1": {
      "type": "number",
      "label": "Y1",
      "min": -10,
      "max": 10
    }
  },
  "end": {
    "label": "End",
    "x2": {
      "type": "number",
      "label": "X2",
      "min": -10,
      "max": 10
    },
    "y2": {
      "type": "number",
      "label": "Y2",
      "min": -10,
      "max": 10
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
      tag: 'line',
      x1: element.x1 * zoom,
      y1: element.y1 * zoom,
      x2: element.x2 * zoom,
      y2: element.y2 * zoom,
      stroke,
      strokeWidth: strokeWidth * 1.5,
      className: isSelected ? 'element-selected' : 'element-normal'
    };
  },
    codeGenerator(element) {
    const stroke = element.stroke ? `stroke=${element.stroke}` : '';
    const fill = element.fill ? `fill=${element.fill}` : 'fill=none';
    return `\\draw[${stroke}${stroke && fill ? ',' : ''}${fill}] (${element.x1},${element.y1}) -- (${element.x2},${element.y2});`;
  }
};

elementRegistry.register(line);
console.log("✅ line registrado");


export default line;