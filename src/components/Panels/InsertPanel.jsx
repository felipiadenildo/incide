import React from "react";
import { ElementPalette } from "../Shared/ElementPalette.jsx";
import { useAppStore } from "../../store/useAppStore.js";
import ElementFactory from "../../services/elements/elementFactory.js";
import "./InsertPanel.css";

export function InsertPanel() {
  const addElement = useAppStore((state) => state.addElement);

  const handleInsert = (type) => {
    const element = ElementFactory.create(type, { x: 0, y: 0 });
    addElement(element);
  };

  return (
    <div className="insert-panel">
      <div className="insert-panel-header">
        <span className="insert-panel-title">Insert</span>
      </div>
      <ElementPalette onInsert={handleInsert} />
    </div>
  );
}

export default InsertPanel;
