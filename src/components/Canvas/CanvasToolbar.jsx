import "./CanvasToolbar.css";
import { useState } from "react";
import { Grid2x2, ZoomIn, ZoomOut, Eye, Settings2 } from "lucide-react";

function CanvasToolbar({ zoom, setZoom }) {
  const [gridEnabled, setGridEnabled] = useState(true);

  const handleGridToggle = () => {
    setGridEnabled(!gridEnabled);
    console.log("📐 Grid:", !gridEnabled ? "ON" : "OFF");
  };

  const handleZoomIn = () => {
    setZoom(Math.min(zoom * 1.2, 5));
  };

  const handleZoomOut = () => {
    setZoom(Math.max(zoom / 1.2, 0.1));
  };

  const handleZoomReset = () => {
    setZoom(1);
  };

  return (
    <div className="CanvasToolbar-root">
      <button
        className={`CanvasToolbar-btn ${gridEnabled ? "active" : ""}`}
        onClick={handleGridToggle}
        title="Toggle Grid"
      >
        <Grid2x2 size={14} />
        <span>Grade</span>
      </button>

      <div className="CanvasToolbar-group">
        <button
          className="CanvasToolbar-btn"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>

        <button
          className="CanvasToolbar-btn-zoom"
          onClick={handleZoomReset}
          title="Reset Zoom"
        >
          {(zoom * 100).toFixed(0)}%
        </button>

        <button
          className="CanvasToolbar-btn"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
      </div>

      <div className="CanvasToolbar-separator" />

      <button className="CanvasToolbar-btn" title="View Options">
        <Eye size={14} />
        <span>Visualização</span>
      </button>

      <button className="CanvasToolbar-btn" title="Canvas Settings">
        <Settings2 size={14} />
        <span>Opções</span>
      </button>
    </div>
  );
}

export default CanvasToolbar;
