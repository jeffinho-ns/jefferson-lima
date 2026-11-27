import {
  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  NoColorSpace,
  RepeatWrapping,
} from "three";
import { getCodeLines, tokenizeLine, type TokenKind } from "@/lib/code-snippets";

/**
 * Textura de código para o shader do DigitalIdentity.
 *
 * RGB = cor visual do token (syntax highlight estilo VS Code Dark+ / JS).
 * Preto = célula vazia. O shader usa max(R,G,B) como intensidade do glifo.
 *
 * A grade é perfeitamente periódica (cada caractere é desenhado em uma célula
 * de tamanho exato), então `RepeatWrapping` não gera emendas.
 */

export interface CodeTextureOptions {
  /** Lado da textura em px (potência de 2). */
  size?: number;
  /** Colunas de caracteres por linha. */
  cols?: number;
  anisotropy?: number;
}

export interface CodeTextureResult {
  texture: CanvasTexture;
  cols: number;
  rows: number;
  dispose: () => void;
}

const FONT_STACK =
  '"JetBrains Mono", "SF Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

/** Cores estilo editor (VS Code Dark+ / JavaScript). */
const TOKEN_COLORS: Record<TokenKind, string> = {
  plain: "rgb(212, 212, 212)", // #D4D4D4 — texto / pontuação
  keyword: "rgb(86, 156, 214)", // #569CD6 — const, return, export…
  string: "rgb(206, 145, 120)", // #CE9178 — "strings"
  number: "rgb(181, 206, 168)", // #B5CEA8 — números
  comment: "rgb(106, 153, 85)", // #6A9955 — // comentários
};

interface Glyph {
  char: string;
  kind: TokenKind;
}

function lineToGlyphs(line: string): Glyph[] {
  const out: Glyph[] = [];
  for (const token of tokenizeLine(line)) {
    for (const char of token.text) out.push({ char, kind: token.kind });
  }
  return out;
}

/**
 * Empacota várias linhas curtas em cada linha da textura (separadas por 3
 * espaços) para formar uma "parede" densa de código sem áreas vazias.
 */
function packRows(lines: string[], cols: number, rows: number): Glyph[][] {
  const gap: Glyph[] = Array.from({ length: 3 }, () => ({ char: " ", kind: "plain" as const }));
  const glyphLines = lines.map(lineToGlyphs).filter((g) => g.length > 0);
  const packed: Glyph[][] = [];
  let cursor = 0;

  for (let r = 0; r < rows; r++) {
    let row: Glyph[] = [];
    let guard = 0;
    while (guard++ < glyphLines.length) {
      const next = glyphLines[cursor % glyphLines.length];
      const needed = (row.length ? gap.length : 0) + next.length;
      if (row.length + needed > cols) {
        if (row.length === 0) {
          row = next.slice(0, cols);
          cursor++;
        }
        break;
      }
      row = row.length ? [...row, ...gap, ...next] : [...next];
      cursor++;
    }
    packed.push(row);
  }
  return packed;
}

export function createCodeTexture(options: CodeTextureOptions = {}): CodeTextureResult {
  const { size = 2048, cols = 96, anisotropy = 4 } = options;

  const cellW = size / cols;
  const fontSize = cellW / 0.6;
  const rows = Math.max(8, Math.floor(size / (fontSize * 1.55)));
  const cellH = size / rows;

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");

  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.font = `500 ${fontSize}px ${FONT_STACK}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const grid = packRows(getCodeLines(), cols, rows);
  grid.forEach((row, r) => {
    row.forEach((glyph, c) => {
      if (glyph.char === " ") return;
      ctx.fillStyle = TOKEN_COLORS[glyph.kind];
      ctx.fillText(glyph.char, c * cellW + cellW / 2, r * cellH + cellH / 2);
    });
  });

  const texture = new CanvasTexture(canvas);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  texture.colorSpace = NoColorSpace;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.generateMipmaps = true;
  texture.anisotropy = anisotropy;
  texture.needsUpdate = true;

  return { texture, cols, rows, dispose: () => texture.dispose() };
}
