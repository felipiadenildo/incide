import { elementRegistry } from '../elementRegistry.js';

        const usResistor = {
  label: "Usresistor",
  type: "usresistor",
        id: 'circuittikz:usresistor',
        library: 'circuittikz',
        type: 'elemento',
  label: 'US Resistor',
        category: 'bipole',
        defaults: {
  "x1": 0,
  "y1": 0,
  "x2": 2,
  "y2": 0,
  "value": "1k\u03a9"
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
            return `\\draw (${element.x1},${element.y1}) to[american resistor, l=${element.value || ''} ${element.label ? ',label=' + element.label : ''}] (${element.x2},${element.y2});`;
        }
        };

        elementRegistry.register(usResistor.type, usResistor);
console.log("✅ usResistor registrado");


        export default usResistor;
