import { elementRegistry } from '../elementRegistry.js';

        const resistor = {
        id: 'circuittikz:resistor',
        library: 'circuittikz',
        label: 'Resistor',
        category: 'bipole',
        defaults: {
  "x1": 0,
  "y1": 0,
  "x2": 2,
  "y2": 0,
  "value": "1k\u03a9",
  "label": "R1"
},
        propertySchema: {
  "label": {
    "label": {
      "type": "text"
    }
  },
  "connection": {
    "label": "Conex\u00f5es",
    "x1": {
      "type": "number"
    },
    "y1": {
      "type": "number"
    },
    "x2": {
      "type": "number"
    },
    "y2": {
      "type": "number"
    }
  },
  "value": {
    "label": "Valor",
    "value": {
      "type": "text"
    }
  }
},
        validate(element) {
            return { valid: true };
        },
        svgRender(element, isSelected, zoom) {
            const stroke = isSelected ? '#3b82f6' : (element.stroke || '#000');
            const strokeWidth = (element.strokeWidth || 0.05) * zoom;
        
    // Zigzag resistor
    const midX = (element.x1 + element.x2) / 2 * zoom;
    return {
      tag: "g",
      children: [
        { tag: "line", x1: element.x1*zoom, y1: element.y1*zoom, x2: midX-0.3*zoom, y2: element.y1*zoom, stroke, strokeWidth },
        { tag: "path", d: `M ${midX-0.3*zoom} ${element.y1*zoom} L ${midX} ${element.y1*zoom-0.2*zoom} L ${midX+0.3*zoom} ${element.y1*zoom} L ${midX+0.6*zoom} ${element.y1*zoom-0.2*zoom} L ${midX+0.9*zoom} ${element.y1*zoom}`, stroke, strokeWidth, fill: "none" },
        { tag: "line", x1: midX+0.3*zoom, y1: element.y1*zoom, x2: element.x2*zoom, y2: element.y2*zoom, stroke, strokeWidth }
      ]
    };
        },
        codeGenerator(element) {
            return `\\draw (${element.x1},${element.y1}) to[R, l=${element.value || ''} ${element.label ? ',label=' + element.label : ''}] (${element.x2},${element.y2});`;
        }
        };

        elementRegistry.register(resistor.id, resistor);

        export default resistor;
