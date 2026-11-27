import {
  CanvasTexture,
  LinearMipmapLinearFilter,
  LinearFilter,
  NoColorSpace,
  RepeatWrapping,
} from "three";

import { siteConfig } from "@/config/site";
import { technologies } from "@/data/technologies";
import { services } from "@/data/services";

/** Tamanho da célula de caractere em px dentro da textura (grade fixa). */
const CELL_W = 16;
const CELL_H = 32;
const FONT_SIZE = 24;
const FONT_FAMILY =
  '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace';

export interface CodeTextureOptions {
  /** Lado da textura (px). Deve ser múltiplo de CELL_H e potência de 2 p/ repeat em WebGL1. */
  size?: number;
  /** Semente do gerador pseudo-aleatório (determinístico). */
  seed?: number;
  /** Máx. de anisotropia desejada. */
  anisotropy?: number;
}

export interface CodeTextureResult {
  texture: CanvasTexture;
  /** Colunas x linhas de caracteres na textura (alinhadas à grade). */
  grid: { cols: number; rows: number };
  dispose: () => void;
}

/** Linhas de código (JS/TS/React) sobre Jefferson — somente dados já presentes no site. */
export function buildCodeLines(): string[] {
  const stack = technologies.map((t) => `"${t.name}"`).join(", ");
  const serviceSlugs = services.map((s) => `"${s.slug}"`).join(", ");

  return [
    `import { useEffect, useState } from "react";`,
    `import type { Metadata } from "next";`,
    ``,
    `interface Developer {`,
    `  name: string;`,
    `  role: string;`,
    `  stack: readonly string[];`,
    `  available: boolean;`,
    `}`,
    ``,
    `const jefferson: Developer = {`,
    `  name: "${siteConfig.name}",`,
    `  role: "${siteConfig.role}",`,
    `  stack: [${stack}],`,
    `  available: true,`,
    `};`,
    ``,
    `const services = [${serviceSlugs}] as const;`,
    ``,
    `export async function decode(identity: Developer) {`,
    `  const { name, role } = identity;`,
    `  // design autoral + código sólido`,
    `  return \`\${name} — \${role}\`;`,
    `}`,
    ``,
    `export default function Hero() {`,
    `  const [decoded, setDecoded] = useState(false);`,
    ``,
    `  useEffect(() => {`,
    `    const id = requestAnimationFrame(() => setDecoded(true));`,
    `    return () => cancelAnimationFrame(id);`,
    `  }, []);`,
    ``,
    `  return (`,
    `    <section data-cursor="decode" aria-label={jefferson.name}>`,
    `      <Portrait decoded={decoded} />`,
    `      <Availability items={services} />`,
    `    </section>`,
    `  );`,
    `}`,
    ``,
    `export const metadata: Metadata = {`,
    `  title: "${siteConfig.title}",`,
    `  description: "Sites, aplicações web e experiências digitais.",`,
    `};`,
    ``,
    `function build<T extends Developer>(dev: T): T {`,
    `  if (!dev.available) throw new Error("indisponível");`,
    `  return Object.freeze({ ...dev });`,
    `}`,
    ``,
    `const ship = (idea: string) => idea.trim().toLowerCase();`,
    `type Layer = "design" | "frontend" | "backend" | "deploy";`,
    `for (const layer of ["design", "frontend", "backend"] as Layer[]) {`,
    `  console.log(\`building \${layer}...\`);`,
    `}`,
  ];
}

// ---------------------------------------------------------------------------
// Tokenização mínima só para variar a intensidade de cada trecho
// ---------------------------------------------------------------------------

const KEYWORDS = new Set([
  "import",
  "export",
  "default",
  "from",
  "const",
  "function",
  "async",
  "await",
  "return",
  "if",
  "throw",
  "new",
  "for",
  "of",
  "type",
  "interface",
  "as",
  "extends",
]);

const TOKEN_RE =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|([A-Za-z_$][\w$]*)|(\d+)|(\s+)|(.)/g;

interface Token {
  text: string;
  intensity: number;
}

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  for (const match of line.matchAll(TOKEN_RE)) {
    const [text, comment, str, word, num] = match;
    let intensity = 0.62;
    if (comment) intensity = 0.38;
    else if (str) intensity = 0.82;
    else if (word) intensity = KEYWORDS.has(word) ? 1 : 0.7;
    else if (num) intensity = 0.9;
    tokens.push({ text, intensity });
  }
  return tokens;
}

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Desenha o código num canvas 2D (fundo preto, glifos em tons de cinza).
 * O canal R é lido pelo shader como intensidade do glifo.
 * Cada caractere ocupa exatamente uma célula CELL_W x CELL_H (grade monoespaçada),
 * o que permite ao shader embaralhar/assentar caracteres célula a célula.
 */
export function drawCodeCanvas(
  size: number,
  seed: number,
): { canvas: HTMLCanvasElement; cols: number; rows: number } {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D indisponível");

  const cols = Math.floor(size / CELL_W);
  const rows = Math.floor(size / CELL_H);

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.font = `500 ${FONT_SIZE}px ${FONT_FAMILY}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const rand = mulberry32(seed);
  const lines = buildCodeLines();
  const separator = "   ";
  let lineIndex = Math.floor(rand() * lines.length);

  for (let row = 0; row < rows; row++) {
    // Preenche a linha concatenando trechos até completar as colunas (textura densa).
    let content = "";
    while (content.length < cols) {
      const next = lines[lineIndex % lines.length];
      lineIndex++;
      if (next.trim() === "") continue;
      content += (content ? separator : "") + next;
    }

    let col = 0;
    for (const token of tokenize(content)) {
      for (const char of token.text) {
        if (col >= cols) break;
        if (char.trim() !== "") {
          const jitter = 0.88 + rand() * 0.12;
          const value = Math.round(255 * Math.min(1, token.intensity * jitter));
          ctx.fillStyle = `rgb(${value},${value},${value})`;
          ctx.fillText(
            char,
            col * CELL_W + CELL_W / 2,
            row * CELL_H + CELL_H / 2 + 1,
          );
        }
        col++;
      }
    }
  }

  return { canvas, cols, rows };
}

/** Gera a `CanvasTexture` de código pronta para o `uCodeTexture`. */
export function createCodeTexture(
  options: CodeTextureOptions = {},
): CodeTextureResult {
  const { size = 2048, seed = 20261126, anisotropy = 4 } = options;
  const { canvas, cols, rows } = drawCodeCanvas(size, seed);

  const texture = new CanvasTexture(canvas);
  texture.colorSpace = NoColorSpace; // valores crus, lidos como máscara
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;

  return {
    texture,
    grid: { cols, rows },
    dispose: () => texture.dispose(),
  };
}

export default createCodeTexture;
