import "./LayersPanel.css";
import { useAppStore } from "../../store/useAppStore.js";
import { ChevronDown, ChevronRight, Eye, Trash2 } from "lucide-react";
import { useState } from "react";

function LayersPanel() {
  const projects = useAppStore((s) => s.projects || []);
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const selectedElementId = useAppStore((s) => s.selectedElementId);
  const selectElement = useAppStore((s) => s.selectElement);
  const switchProject = useAppStore((s) => s.switchProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const removeDiagramObject = useAppStore((s) => s.removeDiagramObject);

  const [expandedProjects, setExpandedProjects] = useState(new Set([activeProjectId]));

  if (!projects || projects.length === 0) {
    return (
      <div className="LayersPanel-root">
        <div className="LayersPanel-empty">
          <p>Nenhum projeto</p>
        </div>
      </div>
    );
  }

  const toggleExpand = (projectId) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const activeProject = projects.find((p) => p.id === activeProjectId);
  const sortedObjects = activeProject
    ? [...(activeProject.objects || [])].sort((a, b) => (a.layer || 0) - (b.layer || 0))
    : [];

  return (
    <div className="LayersPanel-root">
      <div className="LayersPanel-content">
        {projects.map((project) => {
          const isActive = activeProjectId === project.id;
          const isExpanded = expandedProjects.has(project.id);

          return (
            <div key={project.id} className="LayersPanel-project">
              {/* Project Header */}
              <div
                className={`LayersPanel-project-header ${isActive ? "active" : ""}`}
                onClick={() => switchProject(project.id)}
              >
                <button
                  className="LayersPanel-expand-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleExpand(project.id);
                  }}
                  title="Toggle expand"
                >
                  {isExpanded ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                </button>

                <div className="LayersPanel-project-info">
                  <span className="LayersPanel-project-type">{project.type}</span>
                  <span className="LayersPanel-project-name">{project.name}</span>
                </div>

                {projects.length > 1 && (
                  <button
                    className="LayersPanel-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                    title="Delete project"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>

              {/* Objects - Nested */}
              {isActive && isExpanded && (
                <div className="LayersPanel-objects">
                  {sortedObjects.length > 0 ? (
                    sortedObjects.map((obj) => (
                      <div
                        key={obj.id}
                        className={`LayersPanel-object ${
                          selectedElementId === obj.id ? "selected" : ""
                        }`}
                        onClick={() => selectElement(obj.id)}
                        title={`${obj.type} (Layer ${obj.layer})`}
                      >
                        <Eye size={12} className="LayersPanel-eye" />
                        <span className="LayersPanel-object-type">{obj.type}</span>
                        <span className="LayersPanel-object-layer">{obj.layer}</span>

                        <button
                          className="LayersPanel-object-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeDiagramObject(obj.id);
                          }}
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="LayersPanel-empty-objects">
                      <span>Nenhum elemento</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default LayersPanel;
