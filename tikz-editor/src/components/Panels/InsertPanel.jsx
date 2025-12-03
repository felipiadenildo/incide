import "./InsertPanel.css";
import { useState } from "react";
import { useAppStore } from "../../store/useAppStore.js";

const LIBRARY_TYPES = {
  tikz: "TikZ",
  circuitikz: "CircuitTikZ",
  "tikz-blocks": "TikZ Blocks",
  pgfplots: "PGFPlots",
};

const LIBRARY_ELEMENTS = {
  tikz: {
    "Formas Básicas": ["circle", "rectangle", "triangle", "ellipse"],
    Linhas: ["line", "curve", "arc", "grid"],
    Texto: ["text", "label", "node"],
  },
  circuitikz: {
    Componentes: ["resistor", "capacitor", "inductor", "diode"],
    Fontes: ["voltage source", "current source"],
    Instrumentos: ["ammeter", "voltmeter"],
  },
  "tikz-blocks": {
    Blocos: ["decision", "process", "terminal", "document"],
    Conectores: ["arrow", "line", "connector"],
  },
  pgfplots: {
    Gráficos: ["line plot", "scatter", "bar chart", "histogram"],
    Eixos: ["axis", "grid", "legend"],
  },
};

function InsertPanel() {
  const [selectedType, setSelectedType] = useState("tikz");

  const handleAddElement = (element) => {
    console.log(`➕ Add ${element} from ${selectedType}`);
  };

  return (
    <div className="InsertPanel-root">
      {/* Type Selector - Fixed Top */}
      <div className="InsertPanel-type-selector">
        <div className="InsertPanel-type-buttons">
          {Object.entries(LIBRARY_TYPES).map(([key, label]) => (
            <button
              key={key}
              className={`InsertPanel-type-btn ${
                selectedType === key ? "active" : ""
              }`}
              onClick={() => setSelectedType(key)}
              title={label}
            >
              {label.substring(0, 3).toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Elements - Scrollable */}
      <div className="InsertPanel-elements">
        {Object.entries(LIBRARY_ELEMENTS[selectedType] || {}).map(
          ([group, elements]) => (
            <div key={group} className="InsertPanel-group">
              <h5>{group}</h5>
              <div className="InsertPanel-items">
                {elements.map((element) => (
                  <button
                    key={element}
                    className="InsertPanel-item"
                    onClick={() => handleAddElement(element)}
                    title={element}
                  >
                    {element}
                  </button>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default InsertPanel;
