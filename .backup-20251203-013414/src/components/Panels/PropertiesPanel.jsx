import "./PropertiesPanel.css";
import { useAppStore } from "../../store/useAppStore.js";

function PropertiesPanel() {
  const selectedId = useAppStore((s) => s.selectedElementId);
  const selectedIds = useAppStore((s) => s.selectedIds);
  const projects = useAppStore((s) => s.projects || []);
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const updateDiagramObject = useAppStore((s) => s.updateDiagramObject);

  if (!projects || projects.length === 0) {
    return (
      <div className="PropertiesPanel-root">
        <div className="PropertiesPanel-empty">
          <p>Nenhum projeto</p>
        </div>
      </div>
    );
  }

  const project = projects.find((p) => p.id === activeProjectId);
  const objects = project?.objects || [];

  if (!selectedId && selectedIds.length === 0) {
    return (
      <div className="PropertiesPanel-root">
        <div className="PropertiesPanel-empty">
          <p>Nenhum elemento selecionado</p>
        </div>
      </div>
    );
  }

  const activeId = selectedIds.length > 0 ? selectedIds[0] : selectedId;
  const obj = objects.find((o) => o.id === activeId);

  if (!obj) {
    return (
      <div className="PropertiesPanel-root">
        <div className="PropertiesPanel-empty">
          <p>Elemento não encontrado</p>
        </div>
      </div>
    );
  }

  const selectionCount = selectedIds.length > 0 ? selectedIds.length : 1;

  return (
    <div className="PropertiesPanel-root">
      {/* Header */}
      <div className="PropertiesPanel-header">
        <div className="PropertiesPanel-title">
          <span>{obj.type}</span>
          {selectionCount > 1 && (
            <span className="PropertiesPanel-badge">{selectionCount}</span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="PropertiesPanel-content">
        {/* Transform */}
        <div className="PropertiesPanel-section">
          <h4>Transformar</h4>
          <div className="PropertiesPanel-grid">
            <div className="PropertiesPanel-field">
              <label>X</label>
              <input
                type="number"
                step="0.1"
                value={obj.x || obj.x1 || 0}
                onChange={(e) =>
                  updateDiagramObject(obj.id, {
                    [obj.type === "voltage" || obj.type === "current" ? "x1" : "x"]: parseFloat(e.target.value),
                  })
                }
              />
            </div>
            <div className="PropertiesPanel-field">
              <label>Y</label>
              <input
                type="number"
                step="0.1"
                value={obj.y || obj.y1 || 0}
                onChange={(e) =>
                  updateDiagramObject(obj.id, {
                    [obj.type === "voltage" || obj.type === "current" ? "y1" : "y"]: parseFloat(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* Style */}
        {!["voltage", "current", "ammeter", "voltmeter"].includes(obj.type) && (
          <div className="PropertiesPanel-section">
            <h4>Estilo</h4>
            <div className="PropertiesPanel-field">
              <label>Cor</label>
              <input
                type="color"
                value={obj.stroke || obj.fill || "#111827"}
                onChange={(e) =>
                  updateDiagramObject(obj.id, {
                    stroke: e.target.value,
                  })
                }
              />
            </div>
            {obj.strokeWidth !== undefined && (
              <div className="PropertiesPanel-field">
                <label>Largura</label>
                <input
                  type="number"
                  step="0.5"
                  value={obj.strokeWidth || 2}
                  onChange={(e) =>
                    updateDiagramObject(obj.id, {
                      strokeWidth: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            )}
          </div>
        )}

        {/* Circuit Properties */}
        {["resistor", "capacitor", "inductor"].includes(obj.type) && (
          <div className="PropertiesPanel-section">
            <h4>Propriedades</h4>
            <div className="PropertiesPanel-field">
              <label>Rótulo</label>
              <input
                type="text"
                value={obj.label || ""}
                onChange={(e) =>
                  updateDiagramObject(obj.id, { label: e.target.value })
                }
              />
            </div>
            <div className="PropertiesPanel-field">
              <label>Valor</label>
              <input
                type="text"
                value={obj.value || ""}
                onChange={(e) =>
                  updateDiagramObject(obj.id, { value: e.target.value })
                }
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertiesPanel;
