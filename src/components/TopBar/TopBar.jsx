// src/components/TopBar/TopBar.jsx

import React from "react";
import { useAppStore } from "../../store/useAppStore";
import "./TopBar.css";

export function TopBar() {
  // Selects simples, só leitura
  const project = useAppStore((state) => state.project);
  const elementsCount = useAppStore((state) => state.elements.length);

  console.log("[TopBar] render", {
    name: project.name,
    type: project.type,
    elementsCount,
  });

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-logo">
          <span className="logo-icon">📐</span>
          <span className="logo-text">TikZ Editor</span>
        </div>
      </div>

      <div className="topbar-center">
        <span className="project-name">{project.name}</span>
      </div>

      <div className="topbar-right">
        <span className="info-label">
          {project.type === "tikz" ? "🎨 TikZ" : "⚡ CircuitTikZ"}
        </span>
        <span className="info-label info-muted">
          Elements: {elementsCount}
        </span>
        <span className="info-label info-version">v2.2</span>
      </div>
    </header>
  );
}

export default TopBar;
