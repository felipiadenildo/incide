import { elementRegistry } from '../elementRegistry.js';

        const ground = {
        id: 'circuittikz:ground',
        library: 'circuittikz',
        type: 'elemento',
  label: 'Ground',
        category: 'bipole',
        defaults: {
  "x": 1,
  "y": 2
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
        
    return {
      tag: "g",
      transform: `translate(${element.x*zoom},${element.y*zoom}) scale(${zoom})`,
      children: [
        { tag: "line", x1: -0.4, y1: 0.4, x2: 0.4, y2: 0.4, stroke: stroke, strokeWidth },
        { tag: "line", x1: -0.6, y1: 0.6, x2: 0.6, y2: 0.6, stroke: stroke, strokeWidth: strokeWidth*0.8 },
        { tag: "path", d: "M -0.5 0.8 L 0 1 L 0.5 0.8", stroke: stroke, strokeWidth: strokeWidth*0.6, fill: "none" }
      ]
    };
        },
        codeGenerator(element) {
            return `\\draw (${element.x1},${element.y1}) to[ground, l=${element.value || ''} ${element.label ? ',label=' + element.label : ''}] (${element.x2},${element.y2});`;
        }
        };

        elementRegistry.register(ground);
console.log("✅ ground registrado");


        export default ground;
