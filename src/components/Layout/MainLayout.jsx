import React from "react";
import TopBar from "../TopBar/TopBar.jsx";
import { Canvas } from "../Canvas/Canvas.jsx";
import { CanvasToolbar } from "../Canvas/Toolbar/CanvasToolbar.jsx";
import { CanvasTabs } from "../Canvas/Tabs/CanvasTabs.jsx";
import { LayersPanel } from "../Panels/LayersPanel.jsx";
import { InsertPanel } from "../Panels/InsertPanel.jsx";
import { PropertiesPanel } from "../Panels/PropertiesPanel.jsx";
import { CodeEditor } from "../Editor/CodeEditor.jsx";
import { useResizableLeft, useResizableRight } from "../../hooks/useResizable.js";
import "./StackedPanels.css";


export function MainLayout() {
  // Painéis resizáveis
  const leftPanel = useResizableLeft(280, 200, 500);
  const rightPanel = useResizableRight(280, 200, 500);

  return (
    <div className="app-root">
      <TopBar />

      <div className="stacked-panel">
        {/* LEFT PANEL: CodeEditor (trocado) */}
        <div className="left-panel" style={{ width: `${leftPanel.size}px` }}>
          <CodeEditor />
        </div>

        {/* Resize handle esquerdo */}
        <div
          className="resize-handle"
          onMouseDown={leftPanel.handleMouseDown}
        />

        {/* CENTER PANEL: Canvas (mantido) */}
        <div className="center-panel">
          <CanvasToolbar />
          <div className="center-canvas">
            <Canvas />
          </div>
          <CanvasTabs />
        </div>

        {/* Resize handle direito */}
        <div
          className="resize-handle"
          onMouseDown={rightPanel.handleMouseDown}
        />

        {/* RIGHT PANEL: Layers + Insert + Properties (trocado) */}
        <div className="right-panel" style={{ width: `${rightPanel.size}px` }}>
          <LayersPanel />
          <InsertPanel />
          <PropertiesPanel />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
