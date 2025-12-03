import "./SelectionContextBar.css";
import { useAppStore } from "../../store/useAppStore.js";
import { Copy, Trash2, ChevronUp, ChevronDown, Zap } from "lucide-react";

function SelectionContextBar() {
  const selectedId = useAppStore((s) => s.selectedElementId);
  const selectedIds = useAppStore((s) => s.selectedIds);
  const bringToFront = useAppStore((s) => s.bringToFront);
  const sendToBack = useAppStore((s) => s.sendToBack);
  const removeDiagramObject = useAppStore((s) => s.removeDiagramObject);

  if (!selectedId && selectedIds.length === 0) {
    return null;
  }

  const handleDelete = () => {
    if (selectedId) {
      removeDiagramObject(selectedId);
    }
  };

  const handleBringForward = () => {
    if (selectedId) {
      bringToFront(selectedId);
    }
  };

  const handleSendBack = () => {
    if (selectedId) {
      sendToBack(selectedId);
    }
  };

  const selectionCount = selectedIds.length > 0 ? selectedIds.length : 1;

  return (
    <div className="SelectionContextBar-root">
      <div className="SelectionContextBar-header">
        <div className="SelectionContextBar-title">
          <span>Operações</span>
          {selectionCount > 1 && (
            <span className="SelectionContextBar-badge">{selectionCount}</span>
          )}
        </div>
      </div>

      <div className="SelectionContextBar-content">
        <button
          className="SelectionContextBar-btn"
          onClick={handleBringForward}
          title="Bring to front"
        >
          <ChevronUp size={14} />
          <span>Trazer à frente</span>
        </button>

        <button
          className="SelectionContextBar-btn"
          onClick={handleSendBack}
          title="Send to back"
        >
          <ChevronDown size={14} />
          <span>Enviar para trás</span>
        </button>

        <div className="SelectionContextBar-separator" />

        <button
          className="SelectionContextBar-btn"
          title="Duplicate element"
        >
          <Copy size={14} />
          <span>Duplicar</span>
        </button>

        <button
          className="SelectionContextBar-btn danger"
          onClick={handleDelete}
          title="Delete element"
        >
          <Trash2 size={14} />
          <span>Deletar</span>
        </button>
      </div>
    </div>
  );
}

export default SelectionContextBar;
