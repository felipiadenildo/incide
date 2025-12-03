import { useEffect } from "react";
import { useAppStore } from "../store/useAppStore.js";
import { generateTikzFromObjects } from "../services/svgRenderer.js";

export function useKeyboardShortcuts() {
  const selectedIds = useAppStore((s) => s.selectedIds);
  const selectedElementId = useAppStore((s) => s.selectedElementId);
  const diagramObjects = useAppStore((s) => s.diagramObjects);
  const setDiagramObjects = useAppStore((s) => s.setDiagramObjects);
  const setCode = useAppStore((s) => s.setCode);
  const setSelectedElementId = useAppStore((s) => s.setSelectedElementId);
  const setSelectedIds = useAppStore((s) => s.setSelectedIds);
  const pushHistory = useAppStore((s) => s.pushHistory);
  const undo = useAppStore((s) => s.undo);
  const redo = useAppStore((s) => s.redo);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignorar se está digitando em input
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      // Delete - remover elemento(s) selecionado(s)
      if (e.key === "Delete" || e.key === "Backspace") {
        e.preventDefault();

        const idsToDelete = selectedIds.length > 0 ? selectedIds : [selectedElementId];
        const filtered = idsToDelete.filter((id) => id != null);

        if (filtered.length > 0) {
          console.log("🗑️ Deleting elements:", filtered);

          // Salvar no history
          pushHistory();

          // Remover objetos
          const updated = diagramObjects.filter((obj) => !filtered.includes(obj.id));
          setDiagramObjects(updated);

          // Sincronizar código
          const newCode = generateTikzFromObjects(updated);
          setCode(newCode);

          // Limpar seleção
          setSelectedElementId(null);
          setSelectedIds([]);
        }
      }

      // Ctrl+Z - Undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        console.log("↶ Undo");
        undo();
      }

      // Ctrl+Y ou Ctrl+Shift+Z - Redo
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "y") ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "z")
      ) {
        e.preventDefault();
        console.log("↷ Redo");
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, selectedElementId, diagramObjects, pushHistory, undo, redo, setDiagramObjects, setCode, setSelectedElementId, setSelectedIds]);
}
