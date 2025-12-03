import React from 'react'
import TopBar from '../TopBar/TopBar'
import { Canvas } from '../Canvas/Canvas'
import { CanvasToolbar } from '../Canvas/Toolbar/CanvasToolbar'
import { CanvasTabs } from '../Canvas/Tabs/CanvasTabs'
import { LayersPanel } from '../Panels/LayersPanel'
import { InsertPanel } from '../Panels/InsertPanel'
import { PropertiesPanel } from '../Panels/PropertiesPanel'
import { CodeEditor } from '../Editor/CodeEditor'
import './StackedPanels.css'

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
  )
}

export default MainLayout
