/**
 * MainLayout - Layout principal com InsertPanel integrado aos workspaces
 * CanvasTabs controlam activeWorkspaceId → InsertPanel → ElementPalette
 */

import React, { useState } from "react"
import TopBar from "../TopBar/TopBar.jsx"
import { Canvas } from "../Canvas/Canvas.jsx"
import { CanvasToolbar } from "../Canvas/Toolbar/CanvasToolbar.jsx"
import { CanvasTabs } from "../Canvas/Tabs/CanvasTabs.jsx"
import { LayersPanel } from "../Panels/LayersPanel.jsx"
import { InsertPanel } from "../Panels/InsertPanel.jsx"
import { PropertiesPanel } from "../Panels/PropertiesPanel.jsx"
import { CodeEditor } from "../Editor/CodeEditor.jsx"
import { useAppStore } from "../../store/useAppStore.js"
import { useResizableLeft, useResizableRight } from "../../hooks/useResizable.js"
import "./StackedPanels.css"

export function MainLayout() {
  // ✅ activeWorkspaceId do store global
  const activeWorkspaceId = useAppStore(state => state.activeWorkspaceId)

  // Painéis resizáveis
  const leftPanel = useResizableLeft(280, 200, 500)
  const rightPanel = useResizableRight(280, 200, 500)

  return (
    <div className="app-root">
      <TopBar />

      <div className="stacked-panel">
        {/* LEFT PANEL: CodeEditor */}
        <div className="left-panel" style={{ width: `${leftPanel.size}px` }}>
          <CodeEditor />
        </div>

        {/* Resize handle esquerdo */}
        <div
          className="resize-handle"
          onMouseDown={leftPanel.handleMouseDown}
        />

        {/* CENTER PANEL: Canvas + Tabs */}
        <div className="center-panel">
          <CanvasToolbar />
          <div className="center-canvas">
            <Canvas />
          </div>
          
          {/* ✅ CanvasTabs controla workspaces */}
          <CanvasTabs />
        </div>

        {/* Resize handle direito */}
        <div
          className="resize-handle"
          onMouseDown={rightPanel.handleMouseDown}
        />

        {/* RIGHT PANEL: Layers + InsertPanel + Properties */}
        <div className="right-panel" style={{ width: `${rightPanel.size}px` }}>
          <LayersPanel />
          
          {/* ✅ InsertPanel RECEBE activeWorkspaceId do store */}
          <InsertPanel activeWorkspaceId={activeWorkspaceId} />
          
          <PropertiesPanel />
        </div>
      </div>
    </div>
  )
}

export default MainLayout
