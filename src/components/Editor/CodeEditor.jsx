/**
 * CodeEditor - Sync automático Canvas ↔ Code
 * 
 * Features:
 * - Canvas → Code: automático (300ms debounce)
 * - Code → Canvas: botão "Apply Code"
 * - Tabs: Code / Pretty
 * - Validação visual com erros
 */

import React, { useState, useRef, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import CodeParser from "../../services/code/codeParser";
import "./CodeEditor.css";
import "./EditorToolbar.css";

function PrettyView({ elements }) {
  if (!elements?.length) {
    return (
      <div className="pretty-empty">
        Nenhum elemento. Insira pelo canvas ou painel Insert.
      </div>
    );
  }

  return (
    <div className="pretty-list">
      {elements.map((el) => (
        <div key={el.id} className="pretty-card">
          <div className="pretty-header">
            <span className="pretty-title">
              {el.type} · {el.id}
            </span>
          </div>
          <div className="pretty-body">
            {"x" in el && "y" in el && (
              <div className="pretty-row">
                <span>Posição</span>
                <span>
                  ({el.x?.toFixed?.(2) ?? el.x}, {el.y?.toFixed?.(2) ?? el.y})
                </span>
              </div>
            )}
            {"radius" in el && (
              <div className="pretty-row">
                <span>Raio</span>
                <span>{el.radius}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CodeEditor() {
  const elements = useAppStore((state) => state.elements);
  const codeEditorValue = useAppStore((state) => state.codeEditorValue);
  const setCodeEditorValue = useAppStore((state) => state.setCodeEditorValue);
  const clearElements = useAppStore((state) => state.clearElements);
  const addElements = useAppStore((state) => state.addElements);

  const [activeTab, setActiveTab] = useState("code");
  const [error, setError] = useState(null);

  // 🔥 PROTEÇÃO bidirecional contra loops
  const isCanvasUpdatingCode = useRef(false);
  const isCodeUpdatingCanvas = useRef(false);
  const lastElementsHash = useRef("");
  const lastCodeHash = useRef("");

  console.log("[CodeEditor] render", {
    elementsCount: elements.length,
    codeLen: codeEditorValue?.length ?? 0,
    activeTab,
  });

  // 🔥 INSTANTÂNEO: Canvas → Code
  useEffect(() => {
    if (isCodeUpdatingCanvas.current) return;

    const elementsHash = JSON.stringify(
      elements.map((e) => ({ id: e.id, type: e.type, x: e.x, y: e.y, radius: e.radius }))
    );

    if (elementsHash === lastElementsHash.current) return;

    console.log("[CodeEditor] Canvas→Code INSTANT");
    
    try {
      isCanvasUpdatingCode.current = true;
      const code = CodeParser.generateCode(elements);
      lastElementsHash.current = elementsHash;
      lastCodeHash.current = code;
      setCodeEditorValue(code);
      setError(null);
    } catch (err) {
      console.error("[CodeEditor] Canvas→Code error:", err);
      setError("Erro ao gerar código");
    } finally {
      isCanvasUpdatingCode.current = false;
    }
  }, [elements, setCodeEditorValue]);

  // 🔥 INSTANTÂNEO: Code → Canvas
  useEffect(() => {
    if (isCanvasUpdatingCode.current) return;
    if (codeEditorValue === lastCodeHash.current) return;

    console.log("[CodeEditor] Code→Canvas INSTANT");

    try {
      isCodeUpdatingCanvas.current = true;
      
      // Validação rápida
      const { valid, errors } = CodeParser.validateCode(codeEditorValue);
      if (!valid) {
        setError(errors.join(" · "));
        return;
      }

      // Parse e aplicar
      const parsedElements = CodeParser.parseCode(codeEditorValue);
      
      clearElements();
      if (parsedElements?.length > 0) {
        addElements(parsedElements);
        lastElementsHash.current = JSON.stringify(
          parsedElements.map((e) => ({ id: e.id, type: e.type, x: e.x, y: e.y, radius: e.radius }))
        );
      }
      
      lastCodeHash.current = codeEditorValue;
      setError(null);
      console.log("[CodeEditor] Code→Canvas applied", parsedElements?.length || 0);
    } catch (err) {
      console.error("[CodeEditor] Code→Canvas error:", err);
      setError("Erro ao aplicar código");
    } finally {
      isCodeUpdatingCanvas.current = false;
    }
  }, [codeEditorValue, clearElements, addElements]);

  const handleCodeChange = (e) => {
    setCodeEditorValue(e.target.value);
  };

  return (
    <div className="code-panel">
      <div className="panel-tabs">
        <button
          type="button"
          className={
            "panel-tab" + (activeTab === "code" ? " panel-tab-active" : "")
          }
          onClick={() => setActiveTab("code")}
        >
          Code
        </button>
        <button
          type="button"
          className={
            "panel-tab" + (activeTab === "pretty" ? " panel-tab-active" : "")
          }
          onClick={() => setActiveTab("pretty")}
        >
          Pretty
        </button>
      </div>

      {activeTab === "code" && (
        <div className="code-editor-wrapper">
          <textarea
            className="code-editor-textarea"
            value={codeEditorValue || ""}
            onChange={handleCodeChange}
            spellCheck={false}
            placeholder="% Digite TikZ/CircuitTikZ - atualiza instantaneamente!"
            rows={20}
          />
          {error && (
            <div className="code-error">
              ⚠️ {error}
            </div>
          )}
          <div style={{ 
            padding: '4px 8px', 
            fontSize: '11px', 
            color: '#6b7280',
            borderTop: '1px solid #e5e7eb'
          }}>
            ✨ Sync automático ativado - Canvas ↔ Code instantâneo
          </div>
        </div>
      )}

      {activeTab === "pretty" && <PrettyView elements={elements} />}
    </div>
  );
}

export default CodeEditor;
