import "./Canvas.css";
import { useState, useRef, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore.js";
import CanvasTabs from "./CanvasTabs.jsx";
import CanvasToolbar from "./CanvasToolbar.jsx";
import SelectionContextBar from "./SelectionContextBar.jsx";
import SVGRenderer from "./SVGRenderer.jsx";

function Canvas() {
  const selectedId = useAppStore((s) => s.selectedElementId);
  const selectedIds = useAppStore((s) => s.selectedIds);

  const svgRef = useRef(null);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    if (e.button === 2 || e.ctrlKey) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      setZoom((prev) => Math.max(0.1, Math.min(prev * delta, 5)));
    }
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart]);

  return (
    <div className="Canvas-root">
      {/* Project Tabs */}
      <CanvasTabs />

      {/* Toolbar */}
      <CanvasToolbar zoom={zoom} setZoom={setZoom} />

      {/* Main Container */}
      <div className="Canvas-main">
        {/* SVG Canvas */}
        <div
          className="Canvas-body"
          onMouseDown={handleMouseDown}
          onWheel={handleWheel}
          ref={svgRef}
          style={{
            cursor: isDragging ? "grabbing" : "grab",
          }}
        >
          <div
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transformOrigin: "0 0",
              transition: isDragging ? "none" : "transform 0.1s",
            }}
          >
            <SVGRenderer />
          </div>
        </div>

        {/* Selection Context Bar */}
        {(selectedId || selectedIds.length > 0) && (
          <div className="Canvas-sidebar">
            <SelectionContextBar />
          </div>
        )}
      </div>
    </div>
  );
}

export default Canvas;
