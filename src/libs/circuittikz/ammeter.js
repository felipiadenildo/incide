import { elementRegistry } from '../elementRegistry.js';

        const ammeter = {
        id: 'circuittikz:ammeter',
        library: 'circuittikz',
        type: 'elemento',
  label: 'Ammeter',
        category: 'bipole',
        defaults: {
  "x1": 0,
  "y1": 0,
  "x2": 1.5,
  "y2": 0,
  "label": "A"
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
            return `\\draw (${element.x1},${element.y1}) to[ameter, l=${element.value || ''} ${element.label ? ',label=' + element.label : ''}] (${element.x2},${element.y2});`;
        }
        };

        elementRegistry.register(ammeter);
console.log("✅ ammeter registrado");


        export default ammeter;
