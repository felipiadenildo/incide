import { elementRegistry } from '../elementRegistry.js';

        const opamp = {
  label: "Opamp",
  type: "opamp",
        id: 'circuittikz:opamp',
        library: 'circuittikz',
        type: 'elemento',
  label: 'Op-Amp',
        category: 'bipole',
        defaults: {
  "x1": 0,
  "y1": 0,
  "x2": 2.5,
  "y2": 0,
  "label": "U1"
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
        
        },
        codeGenerator(element) {
            return `\\draw (${element.x1},${element.y1}) to[op amp, l=${element.value || ''} ${element.label ? ',label=' + element.label : ''}] (${element.x2},${element.y2});`;
        }
        };

        export default opamp;

        elementRegistry.register(opamp.type, opamp);
console.log("✅ opamp registrado");

