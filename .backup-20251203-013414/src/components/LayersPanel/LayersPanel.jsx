import "./LayersPanel.css";
import { useAppStore } from "../../store/useAppStore.js";

function LayersPanel() {
  const objects = useAppStore((s) => s.diagramObjects);
  const selectedId = useAppStore((s) => s.selectedElementId);
  const setSelectedElementId = useAppStore((s) => s.setSelectedElementId);

  return (
    <div className="LayersPanel-root">
      {objects.length === 0 ? (
        <div className="LayersPanel-empty">
          <p>Nenhuma camada</p>
        </div>
      ) : (
        <ul className="LayersPanel-list">
          {objects.map((obj) => (
            <li
              key={obj.id}
              className={`LayersPanel-item ${obj.id === selectedId ? "active" : ""}`}
              onClick={() => setSelectedElementId(obj.id)}
            >
              <span className="LayersPanel-icon">
                {obj.type === "line" && "—"}
                {obj.type === "circle" && "◯"}
                {obj.type === "text" && "T"}
              </span>
              <span className="LayersPanel-label">
                {obj.type} {obj.id.split("_")[1]}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LayersPanel;
