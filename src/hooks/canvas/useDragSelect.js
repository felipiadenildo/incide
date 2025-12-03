import { useState, useRef, useCallback, useEffect } from "react";
import { useAppStore } from "../store/useAppStore";
import { generateTikzFromObjects } from "../services/svgRenderer";
import { snapToGrid, GRID_SIZE } from "./useSnapToGrid";

const SCALE = 60;

export function useDragSelect() {
  const [dragging, setDragging] = useState(null);
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);
  const startMousePos = useRef({ x: 0, y: 0 });
  const startObjPos = useRef({ x: 0, y: 0 });

  const objects = useAppStore((s) => s.diagramObjects);
  const updateDiagramObject = useAppStore((s) => s.updateDiagramObject);
  const setCode = useAppStore((s) => s.setCode);
  const selectedId = useAppStore((s) => s.selectedElementId);
  const setSelectedElementId = useAppStore((s) => s.setSelectedElementId);
  const selectedIds = useAppStore((s) => s.selectedIds);
  const setSelectedIds = useAppStore((s) => s.setSelectedIds);

  // Track Alt e Ctrl keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Alt") setIsAltPressed(true);
      if (e.key === "Control") setIsCtrlPressed(true);
    };
    const handleKeyUp = (e) => {
      if (e.key === "Alt") setIsAltPressed(false);
      if (e.key === "Control") setIsCtrlPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleMouseDown = useCallback(
    (e, objId) => {
      e.stopPropagation();

      const obj = objects.find((o) => o.id === objId);
      if (!obj) return;

      // Multi-select com Ctrl
      if (isCtrlPressed) {
        console.log("🔀 Multi-select: Ctrl+Click on", objId);
        if (selectedIds.includes(objId)) {
          setSelectedIds(selectedIds.filter((id) => id !== objId));
        } else {
          setSelectedIds([...selectedIds, objId]);
        }
        return;
      }

      // Single select (default)
      setSelectedElementId(objId);
      setSelectedIds([objId]);

      startMousePos.current = { x: e.clientX, y: e.clientY };

      if (obj.type === "line") {
        startObjPos.current = {
          x1: obj.x1,
          y1: obj.y1,
          x2: obj.x2,
          y2: obj.y2,
        };
      } else {
        startObjPos.current = { x: obj.x, y: obj.y };
      }

      setDragging(objId);
      console.log("🎬 Start drag:", objId);
    },
    [objects, isCtrlPressed, selectedIds, setSelectedElementId, setSelectedIds]
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!dragging) return;

      const obj = objects.find((o) => o.id === dragging);
      if (!obj) return;

      const dx = (e.clientX - startMousePos.current.x) / SCALE;
      const dy = -(e.clientY - startMousePos.current.y) / SCALE;

      // Apply snap-to-grid
      const snappedDx = snapToGrid(dx, GRID_SIZE / SCALE, isAltPressed);
      const snappedDy = snapToGrid(dy, GRID_SIZE / SCALE, isAltPressed);

      let updates = {};

      if (obj.type === "line") {
        updates = {
          x1: startObjPos.current.x1 + snappedDx,
          y1: startObjPos.current.y1 + snappedDy,
          x2: startObjPos.current.x2 + snappedDx,
          y2: startObjPos.current.y2 + snappedDy,
        };
      } else if (obj.type === "circle" || obj.type === "text") {
        updates = {
          x: startObjPos.current.x + snappedDx,
          y: startObjPos.current.y + snappedDy,
        };
      }

      updateDiagramObject(dragging, updates);
    },
    [dragging, objects, updateDiagramObject, isAltPressed]
  );

  const handleMouseUp = useCallback(() => {
    if (dragging) {
      const newCode = generateTikzFromObjects(objects);
      console.log("📍 End drag - sync code");
      setCode(newCode);
    }
    setDragging(null);
  }, [dragging, objects, setCode]);

  return {
    dragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    isAltPressed,
    isCtrlPressed,
  };
}
