import { elementRegistry } from '../elementRegistry.js';

        const zener = {
  label: "Zener",
  type: "zener",
        id: 'circuittikz:zener',
        library: 'circuittikz',
        type: 'elemento',
  label: 'Zener Diode',
        category: 'bipole',
        defaults: {
  "x1": 0,
  "y1": 0,
  "x2": 1.8,
  "y2": 0,
  "value": "5.1V",
  "label": "Dz1"
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
            return `\\draw (${element.x1},${element.y1}) to[Dz, l=${element.value || ''} ${element.label ? ',label=' + element.label : ''}] (${element.x2},${element.y2});`;
        }
        };

        console.log('✅ ${{window.location.pathname.includes("tikz") ? "tikz" : "circuittikz"}}:${os.path.basename(filepath).replace(".js", "")} registrado');
elementRegistry.register(zener.type, zener);
console.log("✅ zener registrado");


        export default zener;
