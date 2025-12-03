import { elementRegistry } from '../elementRegistry.js';

const node = {
  id: 'tikz:node',
  library: 'tikz',
  label: 'Node',
  category: 'shape',
  defaults: {
  "x": 1,
  "y": 1,
  "text": "text",
  "fontSize": 0.3
},
  propertySchema: {
  "label": "Node",
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
    "label": "Forma"
  },
  "appearance": {
    "label": "Apar\u00eancia"
  },
  "content": {
    "label": "Content",
    "text": {
      "type": "text",
      "label": "Text"
    }
  },
  "style": {
    "label": "Style",
    "fontSize": {
      "type": "number",
      "label": "Fontsize",
      "min": 0.1,
      "max": 1
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
      tag: 'g',
      children: [[
        {
          tag: 'rect',
          x: (element.x - 0.8) * zoom,
          y: (element.y - 0.2) * zoom,
          width: 1.6 * zoom,
          height: 0.4 * zoom,
          rx: 0.05 * zoom,
          fill: '#f3f4f6',
          stroke: stroke,
          strokeWidth
        },
        {
          tag: 'text',
          x: element.x * zoom,
          y: element.y * zoom,
          textAnchor: 'middle',
          dominantBaseline: 'middle',
          fontSize: (element.fontSize || 0.3) * zoom * 0.8,
          fill: stroke,
          content: element.text || 'text'
        }
      ]]
    };
  },
codeGenerator(element) {
    const stroke = element.stroke ? `stroke=${element.stroke}` : '';
    const fill = element.fill ? `fill=${element.fill}` : 'fill=none';
    return `\\draw[${stroke}${stroke && fill ? ',' : ''}${fill}] (${element.x1},${element.y1}) node (${element.x2},${element.y2});`;
  }
};

elementRegistry.register('tikz:node', node);

export default node;
