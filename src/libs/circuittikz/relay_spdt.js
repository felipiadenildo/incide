import { elementRegistry } from '../elementRegistry.js';

        const relaySpdt = {
        id: 'circuittikz:relay_spdt',
        library: 'circuittikz',
        type: 'elemento',
  label: 'Relay SPDT',
        category: 'bipole',
        defaults: {
  "x1": 0,
  "y1": 0,
  "x2": 2,
  "y2": 0,
  "label": "K1"
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
            return `\\draw (${element.x1},${element.y1}) to[S, l=${element.value || ''} ${element.label ? ',label=' + element.label : ''}] (${element.x2},${element.y2});`;
        }
        };

        export default relaySpdt;

        elementRegistry.register(relaySpdt);
console.log("✅ relaySpdt registrado");

