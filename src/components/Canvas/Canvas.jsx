import React, { useRef, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore.js";
import SVGRenderer from "./SVGRenderer.jsx";
import "./Canvas.css";

export function Canvas() {
  const canvasRef = useRef(null);
  const addZoom = useAppStore((state) => state.addZoom);
  const resetView = useAppStore((state) => state.resetView);

  useEffect(() => {
    const handleWheel = (e) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        addZoom(delta);
      }
    };

    const el = canvasRef.current;
    if (!el) return;

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [addZoom]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Home") resetView();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetView]);

  return (
    <div ref={canvasRef} className="canvas-container">
      <SVGRenderer />
    </div>
  );
}

export default Canvas;
