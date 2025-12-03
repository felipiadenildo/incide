import { elementRegistry } from '../elementRegistry.js';

const capacitor = {
  label: "Capacitor",
  type: "capacitor",
    id: 'circuittikz:capacitor',
    library: 'circuittikz',
    type: 'elemento',
  label: 'Capacitor',
    category: 'bipole',
    defaults: {
        "x1": 0,
        "y1": 0,
        "x2": 2,
        "y2": 0,
        "value": "10\u00b5F",
        "label": "C1"
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
        return `\\draw (${element.x1},${element.y1}) to[C, l=${element.value || ''} ${element.label ? ',label=' + element.label : ''}] (${element.x2},${element.y2});`;
    }
};

elementRegistry.register(capacitor.type, capacitor);
console.log("✅ capacitor registrado");


export default capacitor;
