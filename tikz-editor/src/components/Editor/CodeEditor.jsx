import "./CodeEditor.css";
import { useEffect, useState } from "react";
import { useAppStore } from "../../store/useAppStore.js";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts.js";
import EditorToolbar from "./EditorToolbar.jsx";

function CodeEditor() {
  useKeyboardShortcuts();

  const projects = useAppStore((s) => s.projects || []);
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const setCode = useAppStore((s) => s.setCode);

  const code = (() => {
    if (!projects || projects.length === 0) return "";
    const project = projects.find((p) => p.id === activeProjectId);
    return project?.code || "";
  })();

  const [editorCode, setEditorCode] = useState(code);

  useEffect(() => {
    setEditorCode(code);
  }, [code, activeProjectId]);

  const handleChange = (e) => {
    const value = e.target.value;
    setEditorCode(value);
    setCode(value);
  };

  return (
    <div className="CodeEditor-root">
      <EditorToolbar />
      <textarea
        className="CodeEditor-textarea"
        value={editorCode}
        onChange={handleChange}
        placeholder="Enter TikZ code..."
        spellCheck="false"
      />
    </div>
  );
}

export default CodeEditor;
