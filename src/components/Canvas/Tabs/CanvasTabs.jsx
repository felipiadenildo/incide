import React, { useState } from 'react';
import { useAppStore } from '../../../store/useAppStore';
import './CanvasTabs.css';

export function CanvasTabs() {
  const projectType = useAppStore((state) => state.project.type);
  const setProjectType = useAppStore((state) => state.setProjectType);
  const [showDropdown, setShowDropdown] = useState(false);

  const types = [
    { id: 'sandbox', label: 'Sandbox (todos)' },
    { id: 'tikz', label: 'TikZ' },
    { id: 'circuitikz', label: 'Circuitikz' }
  ];

  const currentType = types.find(t => t.id === projectType) || types[0];

  return (
    <div className="canvas-tabs">
      <div className="canvas-tab-group">
        {/* Tipo atual com dropdown */}
        <div className="canvas-tab-dropdown">
          <button
            className="canvas-tab canvas-tab-active"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            {currentType.label} ▼
          </button>
          
          {showDropdown && (
            <div className="dropdown-menu">
              {types.map((type) => (
                <button
                  key={type.id}
                  className="dropdown-item"
                  onClick={() => {
                    setProjectType(type.id);
                    setShowDropdown(false);
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CanvasTabs;
