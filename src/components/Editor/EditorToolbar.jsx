import "./EditorToolbar.css";
import { Save, Code2, Download } from "lucide-react";

function EditorToolbar() {
  const handleSaveDraft = () => {
    console.log("💾 Save draft");
  };

  const handleFormat = () => {
    console.log("✨ Format code");
  };

  const handleExport = () => {
    console.log("📥 Export");
  };

  return (
    <div className="EditorToolbar-root">
      <button
        className="EditorToolbar-btn"
        onClick={handleSaveDraft}
        title="Save Draft"
      >
        <Save size={14} />
        <span>Salvar</span>
      </button>

      <button
        className="EditorToolbar-btn"
        onClick={handleFormat}
        title="Format Code"
      >
        <Code2 size={14} />
        <span>Formatar</span>
      </button>

      <div className="EditorToolbar-separator" />

      <button
        className="EditorToolbar-btn"
        onClick={handleExport}
        title="Export"
      >
        <Download size={14} />
        <span>Exportar</span>
      </button>
    </div>
  );
}

export default EditorToolbar;
