import "./MainLayout.css";
import { useState } from "react";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import TopBar from "./TopBar.jsx";
import CodeEditor from "../Editor/CodeEditor.jsx";
import StackedPanels from "../StackedPanels/StackedPanels.jsx";
import Canvas from "../Canvas/Canvas.jsx";

const EDITOR_PANEL_KEY = "editorPanelSize";
const EDITOR_MIN = 30;
const EDITOR_MAX = 80;
const EDITOR_DEFAULT = 60;

function MainLayout() {
  const [editorSize, setEditorSize] = useState(() => {
    const saved = localStorage.getItem(EDITOR_PANEL_KEY);
    return saved ? parseFloat(saved) : EDITOR_DEFAULT;
  });

  const handleVerticalLayout = (sizes) => {
    const newEditor = sizes[0];
    if (newEditor >= EDITOR_MIN && newEditor <= EDITOR_MAX) {
      setEditorSize(newEditor);
      localStorage.setItem(EDITOR_PANEL_KEY, newEditor.toString());
      console.log("📐 Editor panel:", newEditor.toFixed(1), "%");
    }
  };

  return (
    <div className="MainLayout-root">
      <TopBar />

      {/* Horizontal: Left Column | Canvas */}
      <PanelGroup
        direction="horizontal"
        className="MainLayout-horizontal"
      >
        {/* LEFT COLUMN: Editor + StackedPanels (Vertical) */}
        <Panel defaultSize={40} minSize={20} maxSize={60}>
          <PanelGroup
            direction="vertical"
            onLayout={handleVerticalLayout}
            className="MainLayout-vertical"
          >
            {/* Editor */}
            <Panel defaultSize={editorSize} minSize={EDITOR_MIN} maxSize={EDITOR_MAX}>
              <CodeEditor />
            </Panel>

            <PanelResizeHandle className="MainLayout-handle" />

            {/* StackedPanels */}
            <Panel defaultSize={100 - editorSize} minSize={EDITOR_MIN}>
              <StackedPanels />
            </Panel>
          </PanelGroup>
        </Panel>

        <PanelResizeHandle className="MainLayout-handle" />

        {/* RIGHT COLUMN: Canvas */}
        <Panel defaultSize={60} minSize={20}>
          <Canvas />
        </Panel>
      </PanelGroup>
    </div>
  );
}

export default MainLayout;
