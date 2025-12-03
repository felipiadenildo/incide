import "./CanvasTabs.css";
import { useAppStore } from "../../store/useAppStore.js";
import { X, Plus } from "lucide-react";

function CanvasTabs() {
  const projects = useAppStore((s) => s.projects);
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const switchProject = useAppStore((s) => s.switchProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const createProject = useAppStore((s) => s.createProject);

  const handleCreateNew = () => {
    createProject("tikz", `Novo Projeto ${projects.length + 1}`);
  };

  return (
    <div className="CanvasTabs-root">
      <div className="CanvasTabs-list">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`CanvasTabs-tab ${
              activeProjectId === project.id ? "active" : ""
            }`}
          >
            <button
              className="CanvasTabs-tab-button"
              onClick={() => switchProject(project.id)}
              title={project.name}
            >
              <span className="CanvasTabs-tab-type">{project.type}</span>
              <span className="CanvasTabs-tab-name">{project.name}</span>
            </button>

            {projects.length > 1 && (
              <button
                className="CanvasTabs-tab-close"
                onClick={() => deleteProject(project.id)}
                title="Delete project"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add New Project */}
      <button className="CanvasTabs-add" onClick={handleCreateNew} title="New Project">
        <Plus size={14} />
      </button>
    </div>
  );
}

export default CanvasTabs;
