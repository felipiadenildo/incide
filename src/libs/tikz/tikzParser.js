// Parser simples de um subconjunto de Tikz:
// - \draw (x1,y1) -- (x2,y2);
// - \draw (x,y) circle (r);
// - \node at (x,y) {Text};

let idCounter = 0;
const nextId = () => `obj_${idCounter++}`;

export function parseTikzCode(code) {
  const lines = code.split("\n").map((l) => l.trim());
  const objects = [];

  for (const line of lines) {
    if (!line || line.startsWith("%")) continue;

    // \draw (0,0) -- (1,1);
    const lineMatch = line.match(
      /\\draw\s*\(([-\d.]+),([-\d.]+)\)\s*--\s*\(([-\d.]+),([-\d.]+)\)/
    );
    if (lineMatch) {
      objects.push({
        id: nextId(),
        type: "line",
        x1: parseFloat(lineMatch[1]),
        y1: parseFloat(lineMatch[2]),
        x2: parseFloat(lineMatch[3]),
        y2: parseFloat(lineMatch[4]),
        stroke: "#111827",
        strokeWidth: 2,
      });
      continue;
    }

    // \draw (0,0) circle (0.5);
    const circleMatch = line.match(
      /\\draw\s*\(([-\d.]+),([-\d.]+)\)\s*circle\s*\(([-\d.]+)\)/
    );
    if (circleMatch) {
      objects.push({
        id: nextId(),
        type: "circle",
        x: parseFloat(circleMatch[1]),
        y: parseFloat(circleMatch[2]),
        r: parseFloat(circleMatch[3]),
        stroke: "#111827",
        strokeWidth: 2,
        fill: "none",
      });
      continue;
    }

    // \node at (x,y) {Text};
    const nodeMatch = line.match(
      /\\node\s+at\s*\(([-\d.]+),([-\d.]+)\)\s*\{([^}]*)\}/
    );
    if (nodeMatch) {
      objects.push({
        id: nextId(),
        type: "text",
        x: parseFloat(nodeMatch[1]),
        y: parseFloat(nodeMatch[2]),
        text: nodeMatch[3].trim(),
      });
      continue;
    }
  }

  return objects;
}
