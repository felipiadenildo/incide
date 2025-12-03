/**
 * Biblioteca de elementos TikZ e CircuitTikZ com metadata
 */

export const TIKZ_ELEMENTS = {
  // Formas Básicas
  shapes: {
    circle: {
      name: "circle",
      label: "Círculo",
      category: "Formas Básicas",
      type: "shape",
      params: {
        x: { type: "number", default: 0, label: "X" },
        y: { type: "number", default: 0, label: "Y" },
        radius: { type: "number", default: 1, label: "Raio" },
        fill: { type: "color", default: "#ffffff", label: "Preenchimento" },
        stroke: { type: "color", default: "#000000", label: "Borda" },
        strokeWidth: { type: "number", default: 1, label: "Largura da Borda" },
      },
      tikzCode: (p) =>
        `\\draw[fill=${p.fill}, draw=${p.stroke}, line width=${p.strokeWidth}pt] (${p.x},${p.y}) circle (${p.radius});`,
    },

    rectangle: {
      name: "rectangle",
      label: "Retângulo",
      category: "Formas Básicas",
      type: "shape",
      params: {
        x: { type: "number", default: 0, label: "X" },
        y: { type: "number", default: 0, label: "Y" },
        width: { type: "number", default: 2, label: "Largura" },
        height: { type: "number", default: 1, label: "Altura" },
        fill: { type: "color", default: "#ffffff", label: "Preenchimento" },
        stroke: { type: "color", default: "#000000", label: "Borda" },
        strokeWidth: { type: "number", default: 1, label: "Largura da Borda" },
      },
      tikzCode: (p) =>
        `\\draw[fill=${p.fill}, draw=${p.stroke}, line width=${p.strokeWidth}pt] (${p.x},${p.y}) rectangle (${p.x + p.width},${p.y + p.height});`,
    },

    ellipse: {
      name: "ellipse",
      label: "Elipse",
      category: "Formas Básicas",
      type: "shape",
      params: {
        x: { type: "number", default: 0, label: "X" },
        y: { type: "number", default: 0, label: "Y" },
        xRadius: { type: "number", default: 1.5, label: "Raio X" },
        yRadius: { type: "number", default: 1, label: "Raio Y" },
        fill: { type: "color", default: "#ffffff", label: "Preenchimento" },
        stroke: { type: "color", default: "#000000", label: "Borda" },
      },
      tikzCode: (p) =>
        `\\draw[fill=${p.fill}, draw=${p.stroke}] (${p.x},${p.y}) ellipse (${p.xRadius} and ${p.yRadius});`,
    },

    triangle: {
      name: "triangle",
      label: "Triângulo",
      category: "Formas Básicas",
      type: "shape",
      params: {
        x: { type: "number", default: 0, label: "X" },
        y: { type: "number", default: 0, label: "Y" },
        size: { type: "number", default: 1, label: "Tamanho" },
        fill: { type: "color", default: "#ffffff", label: "Preenchimento" },
        stroke: { type: "color", default: "#000000", label: "Borda" },
      },
      tikzCode: (p) =>
        `\\draw[fill=${p.fill}, draw=${p.stroke}] (${p.x},${p.y}) -- (${p.x + p.size},${p.y - p.size}) -- (${p.x - p.size},${p.y - p.size}) -- cycle;`,
    },
  },

  // Linhas e Conectores
  lines: {
    line: {
      name: "line",
      label: "Linha",
      category: "Linhas",
      type: "connector",
      params: {
        x1: { type: "number", default: 0, label: "X1" },
        y1: { type: "number", default: 0, label: "Y1" },
        x2: { type: "number", default: 2, label: "X2" },
        y2: { type: "number", default: 0, label: "Y2" },
        stroke: { type: "color", default: "#000000", label: "Cor" },
        strokeWidth: { type: "number", default: 1, label: "Largura" },
      },
      tikzCode: (p) =>
        `\\draw[draw=${p.stroke}, line width=${p.strokeWidth}pt] (${p.x1},${p.y1}) -- (${p.x2},${p.y2});`,
    },

    arrow: {
      name: "arrow",
      label: "Seta",
      category: "Linhas",
      type: "connector",
      params: {
        x1: { type: "number", default: 0, label: "X1" },
        y1: { type: "number", default: 0, label: "Y1" },
        x2: { type: "number", default: 2, label: "X2" },
        y2: { type: "number", default: 0, label: "Y2" },
        stroke: { type: "color", default: "#000000", label: "Cor" },
      },
      tikzCode: (p) =>
        `\\draw[->, draw=${p.stroke}] (${p.x1},${p.y1}) -- (${p.x2},${p.y2});`,
    },

    curve: {
      name: "curve",
      label: "Curva",
      category: "Linhas",
      type: "connector",
      params: {
        x1: { type: "number", default: 0, label: "X1" },
        y1: { type: "number", default: 0, label: "Y1" },
        x2: { type: "number", default: 2, label: "X2" },
        y2: { type: "number", default: 0, label: "Y2" },
        bend: { type: "number", default: 45, label: "Curvatura" },
        stroke: { type: "color", default: "#000000", label: "Cor" },
      },
      tikzCode: (p) =>
        `\\draw[draw=${p.stroke}] (${p.x1},${p.y1}) .. controls ++(${p.bend}:1) and ++(-${p.bend}:1) .. (${p.x2},${p.y2});`,
    },
  },

  // Nós e Textos
  nodes: {
    text: {
      name: "text",
      label: "Texto",
      category: "Texto",
      type: "node",
      params: {
        x: { type: "number", default: 0, label: "X" },
        y: { type: "number", default: 0, label: "Y" },
        content: { type: "string", default: "Texto", label: "Conteúdo" },
        fontSize: { type: "number", default: 12, label: "Tamanho" },
        color: { type: "color", default: "#000000", label: "Cor" },
      },
      tikzCode: (p) =>
        `\\node[text=${p.color}, font=\\fontsize{${p.fontSize}}{${p.fontSize + 2}}\\selectfont] at (${p.x},${p.y}) {${p.content}};`,
    },
  },
};

export const CIRCUITIKZ_ELEMENTS = {
  // Resistores
  resistors: {
    resistor: {
      name: "resistor",
      label: "Resistor",
      category: "Componentes Passivos",
      type: "bipole",
      params: {
        x1: { type: "number", default: 0, label: "X1" },
        y1: { type: "number", default: 0, label: "Y1" },
        x2: { type: "number", default: 2, label: "X2" },
        y2: { type: "number", default: 0, label: "Y2" },
        label: { type: "string", default: "R", label: "Rótulo" },
        value: { type: "string", default: "1k", label: "Valor" },
      },
      tikzCode: (p) =>
        `\\draw (${p.x1},${p.y1}) to[R, l=$${p.label}_{${p.value}}$] (${p.x2},${p.y2});`,
    },

    capacitor: {
      name: "capacitor",
      label: "Capacitor",
      category: "Componentes Passivos",
      type: "bipole",
      params: {
        x1: { type: "number", default: 0, label: "X1" },
        y1: { type: "number", default: 0, label: "Y1" },
        x2: { type: "number", default: 2, label: "X2" },
        y2: { type: "number", default: 0, label: "Y2" },
        label: { type: "string", default: "C", label: "Rótulo" },
        value: { type: "string", default: "10n", label: "Valor" },
      },
      tikzCode: (p) =>
        `\\draw (${p.x1},${p.y1}) to[C, l=$${p.label}_{${p.value}}$] (${p.x2},${p.y2});`,
    },

    inductor: {
      name: "inductor",
      label: "Indutor",
      category: "Componentes Passivos",
      type: "bipole",
      params: {
        x1: { type: "number", default: 0, label: "X1" },
        y1: { type: "number", default: 0, label: "Y1" },
        x2: { type: "number", default: 2, label: "X2" },
        y2: { type: "number", default: 0, label: "Y2" },
        label: { type: "string", default: "L", label: "Rótulo" },
        value: { type: "string", default: "1u", label: "Valor" },
      },
      tikzCode: (p) =>
        `\\draw (${p.x1},${p.y1}) to[L, l=$${p.label}_{${p.value}}$] (${p.x2},${p.y2});`,
    },
  },

  // Fontes
  sources: {
    voltage: {
      name: "voltage",
      label: "Fonte de Tensão",
      category: "Fontes",
      type: "bipole",
      params: {
        x1: { type: "number", default: 0, label: "X1" },
        y1: { type: "number", default: 0, label: "Y1" },
        x2: { type: "number", default: 0, label: "X2" },
        y2: { type: "number", default: 2, label: "Y2" },
        label: { type: "string", default: "V", label: "Rótulo" },
        value: { type: "string", default: "5V", label: "Valor" },
      },
      tikzCode: (p) =>
        `\\draw (${p.x1},${p.y1}) to[V, l=$${p.label}_{${p.value}}$] (${p.x2},${p.y2});`,
    },

    current: {
      name: "current",
      label: "Fonte de Corrente",
      category: "Fontes",
      type: "bipole",
      params: {
        x1: { type: "number", default: 0, label: "X1" },
        y1: { type: "number", default: 0, label: "Y1" },
        x2: { type: "number", default: 0, label: "X2" },
        y2: { type: "number", default: 2, label: "Y2" },
        label: { type: "string", default: "I", label: "Rótulo" },
        value: { type: "string", default: "1A", label: "Valor" },
      },
      tikzCode: (p) =>
        `\\draw (${p.x1},${p.y1}) to[I, l=$${p.label}_{${p.value}}$] (${p.x2},${p.y2});`,
    },
  },

  // Instrumentos
  meters: {
    ammeter: {
      name: "ammeter",
      label: "Amperímetro",
      category: "Instrumentos",
      type: "bipole",
      params: {
        x1: { type: "number", default: 0, label: "X1" },
        y1: { type: "number", default: 0, label: "Y1" },
        x2: { type: "number", default: 2, label: "X2" },
        y2: { type: "number", default: 0, label: "Y2" },
      },
      tikzCode: (p) =>
        `\\draw (${p.x1},${p.y1}) to[A] (${p.x2},${p.y2});`,
    },

    voltmeter: {
      name: "voltmeter",
      label: "Voltímetro",
      category: "Instrumentos",
      type: "bipole",
      params: {
        x1: { type: "number", default: 0, label: "X1" },
        y1: { type: "number", default: 0, label: "Y1" },
        x2: { type: "number", default: 0, label: "X2" },
        y2: { type: "number", default: 2, label: "Y2" },
      },
      tikzCode: (p) =>
        `\\draw (${p.x1},${p.y1}) to[V] (${p.x2},${p.y2});`,
    },
  },

  // Nós e Terminais
  terminals: {
    node: {
      name: "node",
      label: "Nó",
      category: "Terminais",
      type: "monopole",
      params: {
        x: { type: "number", default: 0, label: "X" },
        y: { type: "number", default: 0, label: "Y" },
      },
      tikzCode: (p) => `\\node[circ] at (${p.x},${p.y}) {};`,
    },

    ground: {
      name: "ground",
      label: "Terra",
      category: "Terminais",
      type: "monopole",
      params: {
        x: { type: "number", default: 0, label: "X" },
        y: { type: "number", default: 0, label: "Y" },
      },
      tikzCode: (p) => `\\node[ground] at (${p.x},${p.y}) {};`,
    },
  },
};

// Exemplo inicial completo
export const EXAMPLE_TIKZ_CODE = `\\begin{tikzpicture}[scale=1.5]
  % Título
  \\node[font=\\Large\\bfseries] at (2, 4.5) {Exemplo TikZ};
  
  % Shapes
  \\filldraw[fill=blue!20, draw=blue, line width=2pt] (0,3) circle (0.5);
  \\filldraw[fill=red!20, draw=red, line width=2pt] (1.5,3) rectangle (2.5,3.8);
  \\filldraw[fill=green!20, draw=green, line width=2pt] (3.5,3) ellipse (0.5 and 0.3);
  
  % Lines and arrows
  \\draw[->, line width=1.5pt] (0.5,2.5) -- (1.5,2.5);
  \\draw[<->, line width=1.5pt] (2.5,2.5) -- (3.5,2.5);
  
  % Curve
  \\draw[blue, line width=2pt] (0,1.5) .. controls (1,2) and (2,2) .. (3,1.5);
  
  % Grid
  \\draw[gray, very thin] (0,0) grid (4,1);
  \\node at (2, 0.5) {Grid};
  
  % Labels
  \\node[below=0.2cm of (0,3)] {Circle};
  \\node[below=0.2cm of (2,3.4)] {Rectangle};
  \\node[below=0.2cm of (3.5,3)] {Ellipse};
\\end{tikzpicture}`;

export const EXAMPLE_CIRCUIT_CODE = `\\begin{circuitikz}
  \\draw (0,0)
    to[V=$V_{in}$] (0,2)
    to[R=$R_1$] (2,2)
    to[C=$C_1$] (2,0)
    -- (0,0);
  
  \\draw (2,2)
    to[R=$R_2$] (4,2)
    to[L=$L_1$] (4,0)
    -- (2,0);
  
  \\node[ground] at (0,0) {};
  \\node[ground] at (4,0) {};
\\end{circuitikz}`;
