import "./SVGRenderer.css";
import { useAppStore } from "../../store/useAppStore.js";
import { TIKZ_ELEMENTS, CIRCUITIKZ_ELEMENTS } from "../../store/tikzStore.js";

const GRID_SIZE = 20;
const SCALE = 40; // pixels por unidade TikZ

function SVGRenderer() {
  const projects = useAppStore((s) => s.projects || []);
  const activeProjectId = useAppStore((s) => s.activeProjectId);
  const selectedId = useAppStore((s) => s.selectedElementId);
  const selectElement = useAppStore((s) => s.selectElement);
  const updateDiagramObject = useAppStore((s) => s.updateDiagramObject);

  if (!projects || projects.length === 0) {
    return (
      <svg width="800" height="600" style={{ background: "#fafafa" }}>
        <text x="400" y="300" textAnchor="middle" fill="#999" fontSize="14">
          Nenhum projeto
        </text>
      </svg>
    );
  }

  const activeProject = projects.find((p) => p.id === activeProjectId);

  if (!activeProject) {
    return (
      <svg width="800" height="600" style={{ background: "#fafafa" }}>
        <text x="400" y="300" textAnchor="middle" fill="#999" fontSize="14">
          Projeto não encontrado
        </text>
      </svg>
    );
  }

  const objects = activeProject.objects || [];
  const sortedObjects = [...objects].sort((a, b) => (a.layer || 0) - (b.layer || 0));

  // ===== GRID =====
  const gridLines = [];
  for (let i = 0; i <= 800; i += GRID_SIZE) {
    gridLines.push(
      <line
        key={`vline-${i}`}
        x1={i}
        y1="0"
        x2={i}
        y2="600"
        stroke="#e5e7eb"
        strokeWidth="0.5"
        pointerEvents="none"
      />
    );
  }
  for (let j = 0; j <= 600; j += GRID_SIZE) {
    gridLines.push(
      <line
        key={`hline-${j}`}
        x1="0"
        y1={j}
        x2="800"
        y2={j}
        stroke="#e5e7eb"
        strokeWidth="0.5"
        pointerEvents="none"
      />
    );
  }

  // ===== AXIS =====
  const centerX = 400;
  const centerY = 300;

  return (
    <svg
      width="800"
      height="600"
      viewBox="0 0 800 600"
      style={{
        background: "#fafafa",
        border: "1px solid #e5e7eb",
      }}
    >
      {/* Grid */}
      <defs>
        <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
          <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="800" height="600" fill="url(#grid)" pointerEvents="none" />

      {/* Axis */}
      <line
        x1="0"
        y1={centerY}
        x2="800"
        y2={centerY}
        stroke="#d1d5db"
        strokeWidth="1"
        strokeDasharray="5,5"
        pointerEvents="none"
      />
      <line
        x1={centerX}
        y1="0"
        x2={centerX}
        y2="600"
        stroke="#d1d5db"
        strokeWidth="1"
        strokeDasharray="5,5"
        pointerEvents="none"
      />

      {/* Elements Container (translates to center) */}
      <g transform={`translate(${centerX}, ${centerY}) scale(${SCALE})`}>
        {sortedObjects.map((obj) => (
          <SVGElement
            key={obj.id}
            obj={obj}
            isSelected={selectedId === obj.id}
            onSelect={() => selectElement(obj.id)}
            onUpdate={(updates) => updateDiagramObject(obj.id, updates)}
            projectType={activeProject.type}
          />
        ))}
      </g>

      {/* Info Panel */}
      <g>
        <text x="10" y="20" fontSize="12" fill="#6b7280">
          Projeto: {activeProject.name} ({activeProject.type})
        </text>
        <text x="10" y="40" fontSize="12" fill="#6b7280">
          Elementos: {objects.length}
        </text>
        <text x="10" y="60" fontSize="11" fill="#9ca3af">
          Ctrl+Scroll para zoom | Clique direito para pan
        </text>
      </g>
    </svg>
  );
}

/**
 * Renderiza um elemento individual
 */
function SVGElement({ obj, isSelected, onSelect, onUpdate, projectType }) {
  const isTikZ = projectType === "tikz";
  const elements = isTikZ ? TIKZ_ELEMENTS : CIRCUITIKZ_ELEMENTS;

  // Buscar definição do elemento
  let elementDef = null;
  for (const category of Object.values(elements)) {
    if (category[obj.type]) {
      elementDef = category[obj.type];
      break;
    }
  }

  if (!elementDef) {
    return (
      <g onClick={onSelect}>
        <circle cx={obj.x || 0} cy={obj.y || 0} r="0.15" fill="#ef4444" opacity="0.5" />
        <text
          x={obj.x || 0}
          y={(obj.y || 0) + 0.3}
          fontSize="0.15"
          fill="#ef4444"
          textAnchor="middle"
        >
          ?
        </text>
      </g>
    );
  }

  // ===== TIKZ SHAPES =====
  if (obj.type === "circle") {
    const strokeColor = isSelected ? "#2563eb" : (obj.stroke || "#000000");
    const strokeW = isSelected ? 0.05 : (obj.strokeWidth ? obj.strokeWidth / 40 : 0.02);

    return (
      <g onClick={onSelect} style={{ cursor: "pointer" }}>
        <circle
          cx={obj.x || 0}
          cy={obj.y || 0}
          r={obj.radius || 0.5}
          fill={obj.fill || "#ffffff"}
          stroke={strokeColor}
          strokeWidth={strokeW}
        />
        {isSelected && (
          <>
            <circle
              cx={obj.x || 0}
              cy={obj.y || 0}
              r={(obj.radius || 0.5) + 0.15}
              fill="none"
              stroke="#2563eb"
              strokeWidth="0.03"
              strokeDasharray="0.1,0.1"
            />
            {/* Selection handles */}
            <circle cx={obj.x || 0} cy={(obj.y || 0) - (obj.radius || 0.5)} r="0.08" fill="#2563eb" />
            <circle cx={(obj.x || 0) + (obj.radius || 0.5)} cy={obj.y || 0} r="0.08" fill="#2563eb" />
            <circle cx={obj.x || 0} cy={(obj.y || 0) + (obj.radius || 0.5)} r="0.08" fill="#2563eb" />
            <circle cx={(obj.x || 0) - (obj.radius || 0.5)} cy={obj.y || 0} r="0.08" fill="#2563eb" />
          </>
        )}
      </g>
    );
  }

  if (obj.type === "rectangle") {
    const strokeColor = isSelected ? "#2563eb" : (obj.stroke || "#000000");
    const strokeW = isSelected ? 0.05 : (obj.strokeWidth ? obj.strokeWidth / 40 : 0.02);

    return (
      <g onClick={onSelect} style={{ cursor: "pointer" }}>
        <rect
          x={(obj.x || 0) - (obj.width || 1) / 2}
          y={(obj.y || 0) - (obj.height || 0.5) / 2}
          width={obj.width || 1}
          height={obj.height || 0.5}
          fill={obj.fill || "#ffffff"}
          stroke={strokeColor}
          strokeWidth={strokeW}
        />
        {isSelected && (
          <>
            <rect
              x={(obj.x || 0) - (obj.width || 1) / 2 - 0.15}
              y={(obj.y || 0) - (obj.height || 0.5) / 2 - 0.15}
              width={(obj.width || 1) + 0.3}
              height={(obj.height || 0.5) + 0.3}
              fill="none"
              stroke="#2563eb"
              strokeWidth="0.03"
              strokeDasharray="0.1,0.1"
            />
          </>
        )}
      </g>
    );
  }

  if (obj.type === "ellipse") {
    const strokeColor = isSelected ? "#2563eb" : (obj.stroke || "#000000");
    const strokeW = isSelected ? 0.05 : (obj.strokeWidth ? obj.strokeWidth / 40 : 0.02);

    return (
      <g onClick={onSelect} style={{ cursor: "pointer" }}>
        <ellipse
          cx={obj.x || 0}
          cy={obj.y || 0}
          rx={obj.xRadius || 0.75}
          ry={obj.yRadius || 0.5}
          fill={obj.fill || "#ffffff"}
          stroke={strokeColor}
          strokeWidth={strokeW}
        />
        {isSelected && (
          <ellipse
            cx={obj.x || 0}
            cy={obj.y || 0}
            rx={(obj.xRadius || 0.75) + 0.15}
            ry={(obj.yRadius || 0.5) + 0.15}
            fill="none"
            stroke="#2563eb"
            strokeWidth="0.03"
            strokeDasharray="0.1,0.1"
          />
        )}
      </g>
    );
  }

  if (obj.type === "triangle") {
    const size = obj.size || 0.5;
    const points = `0,${-size} ${size},${size} ${-size},${size}`;
    const strokeColor = isSelected ? "#2563eb" : (obj.stroke || "#000000");

    return (
      <g transform={`translate(${obj.x || 0}, ${obj.y || 0})`} onClick={onSelect} style={{ cursor: "pointer" }}>
        <polygon
          points={points}
          fill={obj.fill || "#ffffff"}
          stroke={strokeColor}
          strokeWidth={isSelected ? 0.05 : 0.02}
        />
        {isSelected && (
          <polygon
            points={points}
            fill="none"
            stroke="#2563eb"
            strokeWidth="0.03"
            strokeDasharray="0.1,0.1"
            transform={`scale(1.2)`}
          />
        )}
      </g>
    );
  }

  // ===== LINES & CONNECTORS =====
  if (obj.type === "line") {
    const strokeColor = isSelected ? "#2563eb" : (obj.stroke || "#000000");
    const strokeW = isSelected ? 0.05 : (obj.strokeWidth ? obj.strokeWidth / 40 : 0.02);

    return (
      <g onClick={onSelect} style={{ cursor: "pointer" }}>
        <line
          x1={obj.x1 || 0}
          y1={obj.y1 || 0}
          x2={obj.x2 || 1}
          y2={obj.y2 || 0}
          stroke={strokeColor}
          strokeWidth={strokeW}
        />
        {isSelected && (
          <>
            <line
              x1={obj.x1 || 0}
              y1={obj.y1 || 0}
              x2={obj.x2 || 1}
              y2={obj.y2 || 0}
              stroke="none"
              strokeWidth="0.15"
              opacity="0"
              pointerEvents="stroke"
            />
            <circle cx={obj.x1 || 0} cy={obj.y1 || 0} r="0.08" fill="#2563eb" />
            <circle cx={obj.x2 || 1} cy={obj.y2 || 0} r="0.08" fill="#2563eb" />
          </>
        )}
      </g>
    );
  }

  if (obj.type === "arrow") {
    const strokeColor = isSelected ? "#2563eb" : (obj.stroke || "#000000");

    return (
      <g onClick={onSelect} style={{ cursor: "pointer" }}>
        <defs>
          <marker
            id={`arrowhead-${obj.id}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill={strokeColor} />
          </marker>
        </defs>
        <line
          x1={obj.x1 || 0}
          y1={obj.y1 || 0}
          x2={obj.x2 || 1}
          y2={obj.y2 || 0}
          stroke={strokeColor}
          strokeWidth={isSelected ? 0.05 : 0.02}
          markerEnd={`url(#arrowhead-${obj.id})`}
        />
        {isSelected && (
          <>
            <circle cx={obj.x1 || 0} cy={obj.y1 || 0} r="0.08" fill="#2563eb" />
            <circle cx={obj.x2 || 1} cy={obj.y2 || 0} r="0.08" fill="#2563eb" />
          </>
        )}
      </g>
    );
  }

  if (obj.type === "curve") {
    const bend = obj.bend || 45;
    const cp1x = (obj.x1 || 0) + bend / 100;
    const cp1y = (obj.y1 || 0) + 0.5;
    const cp2x = (obj.x2 || 1) - bend / 100;
    const cp2y = (obj.y2 || 0) + 0.5;
    const strokeColor = isSelected ? "#2563eb" : (obj.stroke || "#000000");

    return (
      <g onClick={onSelect} style={{ cursor: "pointer" }}>
        <path
          d={`M ${obj.x1 || 0} ${obj.y1 || 0} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${obj.x2 || 1} ${obj.y2 || 0}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth={isSelected ? 0.05 : 0.02}
        />
      </g>
    );
  }

  // ===== NODES & TEXT =====
  if (obj.type === "text") {
    const fontSize = obj.fontSize ? obj.fontSize / 40 : 0.3;
    const color = isSelected ? "#2563eb" : (obj.color || "#000000");

    return (
      <g onClick={onSelect} style={{ cursor: "pointer" }}>
        <text
          x={obj.x || 0}
          y={obj.y || 0}
          fontSize={fontSize}
          fill={color}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {obj.content || "Texto"}
        </text>
        {isSelected && (
          <rect
            x={(obj.x || 0) - 0.3}
            y={(obj.y || 0) - fontSize / 2 - 0.1}
            width="0.6"
            height={fontSize + 0.2}
            fill="none"
            stroke="#2563eb"
            strokeWidth="0.03"
            strokeDasharray="0.1,0.1"
          />
        )}
      </g>
    );
  }

  // ===== CIRCUIT ELEMENTS =====
  if (obj.type === "resistor") {
    return (
      <g onClick={onSelect} style={{ cursor: "pointer" }}>
        <line x1={obj.x1 || 0} y1={obj.y1 || 0} x2={(obj.x1 || 0) + 0.3} y2={obj.y1 || 0} stroke="#000" strokeWidth="0.02" />
        <rect
          x={(obj.x1 || 0) + 0.3}
          y={(obj.y1 || 0) - 0.15}
          width="0.6"
          height="0.3"
          fill="none"
          stroke={isSelected ? "#2563eb" : "#000"}
          strokeWidth={isSelected ? 0.03 : 0.02}
        />
        <line x1={(obj.x1 || 0) + 0.9} y1={obj.y1 || 0} x2={obj.x2 || 2} y2={obj.y2 || 0} stroke="#000" strokeWidth="0.02" />
        <text x={(obj.x1 + obj.x2) / 2 || 1} y={(obj.y1 + obj.y2) / 2 - 0.3 || -0.3} fontSize="0.15" textAnchor="middle">
          {obj.label || "R"}
        </text>
      </g>
    );
  }

  if (obj.type === "capacitor") {
    return (
      <g onClick={onSelect} style={{ cursor: "pointer" }}>
        <line x1={obj.x1 || 0} y1={obj.y1 || 0} x2={(obj.x1 || 0) + 0.3} y2={obj.y1 || 0} stroke="#000" strokeWidth="0.02" />
        <line x1={(obj.x1 || 0) + 0.3} y1={(obj.y1 || 0) - 0.2} x2={(obj.x1 || 0) + 0.3} y2={(obj.y1 || 0) + 0.2} stroke="#000" strokeWidth="0.02" />
        <line x1={(obj.x1 || 0) + 0.4} y1={(obj.y1 || 0) - 0.2} x2={(obj.x1 || 0) + 0.4} y2={(obj.y1 || 0) + 0.2} stroke={isSelected ? "#2563eb" : "#000"} strokeWidth={isSelected ? 0.03 : 0.02} />
        <line x1={(obj.x1 || 0) + 0.4} y1={obj.y1 || 0} x2={obj.x2 || 2} y2={obj.y2 || 0} stroke="#000" strokeWidth="0.02" />
        <text x={(obj.x1 + obj.x2) / 2 || 1} y={(obj.y1 + obj.y2) / 2 - 0.3 || -0.3} fontSize="0.15" textAnchor="middle">
          {obj.label || "C"}
        </text>
      </g>
    );
  }

  if (obj.type === "voltage") {
    const circleColor = isSelected ? "#2563eb" : "#000";
    return (
      <g onClick={onSelect} style={{ cursor: "pointer" }}>
        <line x1={obj.x1 || 0} y1={obj.y1 || 0} x2={obj.x2 || 0} y2={(obj.y1 || 0) + 0.5} stroke="#000" strokeWidth="0.02" />
        <circle cx={obj.x2 || 0} cy={(obj.y1 || 0) + 0.8} r="0.25" fill="none" stroke={circleColor} strokeWidth={isSelected ? 0.03 : 0.02} />
        <text x={obj.x2 || 0} y={(obj.y1 || 0) + 0.85} fontSize="0.2" textAnchor="middle" dominantBaseline="middle">
          +
        </text>
        <line x1={obj.x2 || 0} y1={(obj.y1 || 0) + 1.05} x2={obj.x2 || 0} y2={obj.y2 || 2} stroke="#000" strokeWidth="0.02" />
        <text x={(obj.x2 || 0) + 0.4} y={(obj.y1 || 0) + 0.8} fontSize="0.15">
          {obj.label || "V"}
        </text>
      </g>
    );
  }

  if (obj.type === "ground") {
    return (
      <g onClick={onSelect} style={{ cursor: "pointer" }}>
        <circle cx={obj.x || 0} cy={obj.y || 0} r="0.05" fill={isSelected ? "#2563eb" : "#000"} />
        <line x1={obj.x || 0} y1={obj.y || 0} x2={obj.x || 0} y2={(obj.y || 0) + 0.3} stroke="#000" strokeWidth="0.02" />
        <line x1={(obj.x || 0) - 0.2} y1={(obj.y || 0) + 0.3} x2={(obj.x || 0) + 0.2} y2={(obj.y || 0) + 0.3} stroke="#000" strokeWidth="0.02" />
        <line x1={(obj.x || 0) - 0.15} y1={(obj.y || 0) + 0.4} x2={(obj.x || 0) + 0.15} y2={(obj.y || 0) + 0.4} stroke="#000" strokeWidth="0.02" />
        <line x1={(obj.x || 0) - 0.1} y1={(obj.y || 0) + 0.5} x2={(obj.x || 0) + 0.1} y2={(obj.y || 0) + 0.5} stroke="#000" strokeWidth="0.02" />
      </g>
    );
  }

  return null;
}

export default SVGRenderer;