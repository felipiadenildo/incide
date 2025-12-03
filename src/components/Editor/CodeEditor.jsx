/**
 * CodeEditor - Painel de código (Code / Pretty)
 *
 * Tabs:
 * - Code: editor de texto TikZ/CircuitTikZ
 * - Pretty: lista de elementos (stub v1)
 */

import React, { useState /*, useEffect*/ } from "react";
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
                  ({el.x?.toFixed?.(2) ?? el.x},{" "}
                  {el.y?.toFixed?.(2) ?? el.y})
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
  // const addElements = useAppStore((state) => state.addElements);   // DESATIVADO por enquanto
  // const clearElements = useAppStore((state) => state.clearElements); // DESATIVADO por enquanto

  const [activeTab, setActiveTab] = useState("code"); // 'code' | 'pretty'
  const [error, setError] = useState(null);

  console.log("[CodeEditor] render", {
    elementsCount: elements.length,
    codeLen: codeEditorValue?.length ?? 0,
    activeTab,
  });

  // Sync canvas → code (geração automática simples)
  // ATENÇÃO: isso pode criar loop se também fizer parse do código para elementos.
  // Por enquanto deixado comentado para evitar "Maximum update depth exceeded".
  //
  // useEffect(() => {
  //   console.log("[CodeEditor] useEffect sync elements->code");
  //   const code = CodeParser.generateCode(elements);
  //   setCodeEditorValue(code);
  // }, [elements, setCodeEditorValue]);

  const handleCodeChange = (e) => {
    const nextCode = e.target.value;
    console.log("[CodeEditor] handleCodeChange", {
      prevLen: codeEditorValue?.length ?? 0,
      nextLen: nextCode.length,
    });

    // Atualiza apenas o valor do editor na store
    setCodeEditorValue(nextCode);

    // VALIDAÇÃO SIMPLES (mantida)
    const { valid, errors } = CodeParser.validateCode(nextCode);
    if (!valid) {
      console.log("[CodeEditor] code invalid", errors);
      setError(errors.join(" · "));
    } else {
      console.log("[CodeEditor] code valid");
      setError(null);

      // IMPORTANTE: parsing → elementos está desativado por enquanto
      // para evitar ciclo elements -> code -> elements.
      //
      // const parsedElements = CodeParser.parseCode(nextCode);
      // console.log("[CodeEditor] parsedElements", parsedElements.length);
      // if (parsedElements && parsedElements.length > 0) {
      //   clearElements();
      //   addElements(parsedElements);
      // }
    }
  };

  return (
    <div className="code-panel">
      <div className="panel-tabs">
        <button
          type="button"
          className={
            "panel-tab" + (activeTab === "code" ? " panel-tab-active" : "")
          }
          onClick={() => {
            console.log("[CodeEditor] switch tab -> code");
            setActiveTab("code");
          }}
        >
          Code
        </button>
        <button
          type="button"
          className={
            "panel-tab" + (activeTab === "pretty" ? " panel-tab-active" : "")
          }
          onClick={() => {
            console.log("[CodeEditor] switch tab -> pretty");
            setActiveTab("pretty");
          }}
        >
          Pretty
        </button>
      </div>

      {activeTab === "code" && (
        <div className="code-editor-wrapper">
          <textarea
            className="code-editor-textarea"
            value={codeEditorValue}
            onChange={handleCodeChange}
            spellCheck={false}
            placeholder="% TikZ / CircuitTikZ code aqui..."
          />
          {error && <div className="code-error">{error}</div>}
        </div>
      )}

      {activeTab === "pretty" && <PrettyView elements={elements} />}
    </div>
  );
}

export default CodeEditor;
