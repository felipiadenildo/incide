// src/services/svgRenderer.js - ADICIONE/CORRIJA

const SCALE = 60; // px por unidade
const OFFSET_X = 50;
const OFFSET_Y = 50;

export function tikzToSvgX(x) {
  return x * SCALE + OFFSET_X;
}

export function tikzToSvgY(y, canvasHeight) {
  return canvasHeight - y * SCALE - OFFSET_Y;
}

// NOVO: Gera código Tikz a partir dos objetos
export function generateTikzFromObjects(objects) {
  if (!objects || objects.length === 0) {
    return "% Nenhum objeto";
  }

  const lines = objects
    .map((obj) => {
      if (obj.type === "line") {
        return `\\draw (${obj.x1.toFixed(2)},${obj.y1.toFixed(2)}) -- (${obj.x2.toFixed(2)},${obj.y2.toFixed(2)});`;
      }
      if (obj.type === "circle") {
        return `\\draw (${obj.x.toFixed(2)},${obj.y.toFixed(2)}) circle (${obj.r.toFixed(2)});`;
      }
      if (obj.type === "text") {
        return `\\node at (${obj.x.toFixed(2)},${obj.y.toFixed(2)}) {${obj.text}};`;
      }
      return null;
    })
    .filter(Boolean);

  return `\\begin{tikzpicture}\n  ${lines.join("\n  ")}\n\\end{tikzpicture}`;
}
