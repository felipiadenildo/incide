import "./TopBar.css";
import { useAppStore } from "../../store/useAppStore.js";
import { useDarkMode } from "../../hooks/useDarkMode.js";
import {
  Undo2,
  Redo2,
  RotateCcw,
  Grid2x2,
  Eye,
  Settings,
  Layers,
  Moon,
  Sun,
  Trash2,
} from "lucide-react";

function TopBar() {
  const { isDark, toggle } = useDarkMode();
  const selectedIds = useAppStore((s) => s.selectedIds);
  const selectedId = useAppStore((s) => s.selectedElementId);

  // Context detection
  const hasSelection = selectedId || selectedIds.length > 0;

  return (
    <div className="TopBar-root">
      {/* LEFT: Editor Actions */}
      <div className="TopBar-group">
        <button className="TopBar-btn" title="Desfazer (Ctrl+Z)">
          <Undo2 size={16} />
        </button>
        <button className="TopBar-btn" title="Refazer (Ctrl+Y)">
          <Redo2 size={16} />
        </button>
        <button className="TopBar-btn" title="Reset">
          <RotateCcw size={16} />
        </button>
      </div>

      {/* CENTER: Separator */}
      <div className="TopBar-separator" />

      {/* CENTER: Canvas Actions */}
      <div className="TopBar-group">
        <button className="TopBar-btn" title="Grid">
          <Grid2x2 size={16} />
        </button>
        <button className="TopBar-btn" title="Zoom">
          <Eye size={16} />
        </button>
      </div>

      {/* CENTER: Separator */}
      <div className="TopBar-separator" />

      {/* CENTER-RIGHT: Selection Info */}
      <div className="TopBar-info">
        {hasSelection && (
          <span className="TopBar-text">
            {selectedIds.length > 0
              ? `${selectedIds.length} elementos`
              : "1 elemento"}
          </span>
        )}
      </div>

      {/* RIGHT: Global Actions */}
      <div className="TopBar-group TopBar-right">
        <button
          className="TopBar-btn"
          onClick={toggle}
          title="Toggle dark mode"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </div>
  );
}

export default TopBar;
