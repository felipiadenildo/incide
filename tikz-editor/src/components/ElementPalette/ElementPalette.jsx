import "./ElementPalette.css";
import { useState } from "react";
import { useAppStore } from "../../store/useAppStore.js";
import { generateTikzFromObjects } from "../../services/svgRenderer.js";
import { X, Minus, Circle, Type } from "lucide-react";

const ELEMENT_TYPES = [
  {
    id: "line",
    name: "Linha",
    icon: Minus,
    create: () => ({
      type: "line",
      x1: 0,
      y1: 0,
      x2: 2,
      y2: 2,
      stroke: "#111827",
      strokeWidth: 2,
    }),
  },
  {
    id: "circle",
    name: "Círculo",
    icon: Circle,
    create: () => ({
      type: "circle",
      x: 1,
      y: 1,
      r: 0.5,
      stroke: "#111827",
      strokeWidth: 2,
      fill: "none",
    }),
  },
  {
    id: "text",
    name: "Texto",
    icon: Type,
    create: () => ({
      type: "text",
      x: 0,
      y: 0,
      text: "Texto",
    }),
  },
];

function ElementPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const diagramObjects = useAppStore((s) => s.diagramObjects);
  const setDiagramObjects = useAppStore((s) => s.setDiagramObjects);
  const setCode = useAppStore((s) => s.setCode);

  const handleAddElement = (elementType) => {
    // Criar novo elemento com ID único
    let idCounter = diagramObjects.length;
    const newObj = {
      id: `obj_${idCounter}`,
      ...elementType.create(),
    };

    console.log("➕ Adding element:", newObj);

    // Adicionar ao array
    const updated = [...diagramObjects, newObj];
    setDiagramObjects(updated);

    // Sincronizar código
    const newCode = generateTikzFromObjects(updated);
    setCode(newCode);

    // Fechar palette
    setIsOpen(false);
  };

  return (
    <>
      {/* Botão flutuante */}
      <button
        className="ElementPalette-btn-float"
        onClick={() => setIsOpen(!isOpen)}
        title="Adicionar elemento"
      >
        +
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="ElementPalette-overlay" onClick={() => setIsOpen(false)}>
          <div className="ElementPalette-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="ElementPalette-header">
              <h3>Adicionar Elemento</h3>
              <button
                className="ElementPalette-close"
                onClick={() => setIsOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="ElementPalette-items">
              {ELEMENT_TYPES.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    className="ElementPalette-item"
                    onClick={() => handleAddElement(type)}
                  >
                    <IconComponent size={24} />
                    <span>{type.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ElementPalette;
