import "./PropertyPanel.css";
import { useAppStore } from "../../store/useAppStore.js";

function PropertyPanel() {
  const selectedId = useAppStore((s) => s.selectedElementId);
  const objects = useAppStore((s) => s.diagramObjects);
  const updateDiagramObject = useAppStore((s) => s.updateDiagramObject);

  if (!selectedId) {
    return (
      <div className="PropertyPanel-root">
        <div className="PropertyPanel-empty">
          <p>Selecione um elemento</p>
        </div>
      </div>
    );
  }

  const obj = objects.find((o) => o.id === selectedId);
  if (!obj) return null;

  const handleChange = (key, value) => {
    updateDiagramObject(obj.id, { [key]: value });
  };

  const handleNumberChange = (key, e) => {
    const value = parseFloat(e.target.value) || 0;
    handleChange(key, value);
  };

  return (
    <div className="PropertyPanel-root">
      <div className="PropertyPanel-content">
        {/* Type */}
        <div className="PropertyPanel-section">
          <label>Tipo</label>
          <input type="text" value={obj.type} disabled />
        </div>

        {/* Position */}
        <div className="PropertyPanel-row">
          <div className="PropertyPanel-section">
            <label>X</label>
            <input
              type="number"
              step="0.1"
              value={obj.x || obj.x1 || 0}
              onChange={(e) =>
                obj.type === "line"
                  ? handleNumberChange("x1", e)
                  : handleNumberChange("x", e)
              }
            />
          </div>
          <div className="PropertyPanel-section">
            <label>Y</label>
            <input
              type="number"
              step="0.1"
              value={obj.y || obj.y1 || 0}
              onChange={(e) =>
                obj.type === "line"
                  ? handleNumberChange("y1", e)
                  : handleNumberChange("y", e)
              }
            />
          </div>
        </div>

        {/* Stroke Color */}
        {obj.type !== "text" && (
          <div className="PropertyPanel-section">
            <label>Cor</label>
            <input
              type="color"
              value={obj.stroke || "#111827"}
              onChange={(e) => handleChange("stroke", e.target.value)}
            />
          </div>
        )}

        {/* Stroke Width */}
        {obj.type !== "text" && (
          <div className="PropertyPanel-section">
            <label>Largura</label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              value={obj.strokeWidth || 2}
              onChange={(e) => handleNumberChange("strokeWidth", e)}
            />
          </div>
        )}

        {/* Circle Radius */}
        {obj.type === "circle" && (
          <div className="PropertyPanel-section">
            <label>Raio</label>
            <input
              type="number"
              step="0.1"
              min="0.1"
              value={obj.r || 0.5}
              onChange={(e) => handleNumberChange("r", e)}
            />
          </div>
        )}

        {/* Text */}
        {obj.type === "text" && (
          <div className="PropertyPanel-section">
            <label>Texto</label>
            <input
              type="text"
              value={obj.text || ""}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyPanel;
