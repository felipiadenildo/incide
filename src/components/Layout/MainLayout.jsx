import React from "react";
import TopBar from "../TopBar/TopBar.jsx";
import { Canvas } from "../Canvas/Canvas.jsx";
import { CanvasToolbar } from "../Canvas/Toolbar/CanvasToolbar.jsx";
import { CanvasTabs } from "../Canvas/Tabs/CanvasTabs.jsx";
import { LayersPanel } from "../Panels/LayersPanel.jsx";
import { InsertPanel } from "../Panels/InsertPanel.jsx";
import { PropertiesPanel } from "../Panels/PropertiesPanel.jsx";
import { CodeEditor } from "../Editor/CodeEditor.jsx";
import "./StackedPanels.css";

export function MainLayout() {
  return (
    <div className="app-root">
      <TopBar />

      <div className="stacked-panel">
        <div className="left-panel">
          <LayersPanel />
          <InsertPanel />
        </div>

        <div className="center-panel">
          <CanvasToolbar />
          <div className="center-canvas">
            <Canvas />
          </div>
          <CanvasTabs />
        </div>

        <div className="right-panel">
          <PropertiesPanel />
          <CodeEditor />
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
