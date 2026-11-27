/**
 * Geradores determinísticos de formas orgânicas (sem Math.random: seguro para SSR).
 */

interface Point {
  x: number;
  y: number;
}

const round = (value: number): number => Math.round(value * 10) / 10;

/** Pontos de um contorno irregular em volta de (cx, cy). */
function blobPoints(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
  count: number,
): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count;
    const radius =
      1 +
      0.2 * Math.sin(3 * angle + seed) +
      0.11 * Math.sin(5 * angle + seed * 1.7) +
      0.06 * Math.sin(2 * angle + seed * 0.6);
    points.push({
      x: cx + rx * radius * Math.cos(angle),
      y: cy + ry * radius * Math.sin(angle),
    });
  }
  return points;
}

/** Spline Catmull-Rom fechada convertida em curvas de Bézier cúbicas. */
function closedSpline(points: readonly Point[]): string {
  const n = points.length;
  const first = points[0];
  let d = `M${round(first.x)} ${round(first.y)}`;

  for (let i = 0; i < n; i += 1) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];

    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;

    d += `C${round(c1x)} ${round(c1y)} ${round(c2x)} ${round(c2y)} ${round(p2.x)} ${round(p2.y)}`;
  }

  return `${d}Z`;
}

/** Path SVG de uma mancha orgânica fechada. */
export function blobPath(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
  count = 14,
): string {
  return closedSpline(blobPoints(cx, cy, rx, ry, seed, count));
}

/** Anéis concêntricos irregulares (linhas de contorno / topográficas). */
export function contourPaths(
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  seed: number,
  rings: number,
  step = 0.2,
): string[] {
  return Array.from({ length: rings }, (_, k) =>
    blobPath(
      cx,
      cy,
      rx * (1 + k * step),
      ry * (1 + k * step),
      seed + k * 0.35,
      16,
    ),
  );
}
