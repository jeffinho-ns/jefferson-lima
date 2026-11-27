import { siteConfig } from "@/config/site";
import { technologies } from "@/data/technologies";

/**
 * Trechos de código que alimentam a textura do DigitalIdentity.
 * Conteúdo autoral e descritivo (stack/foco declarados no site) — sem
 * credenciais, clientes, anos de experiência ou qualquer dado inventado.
 *
 * Mantenha cada linha com no máximo ~54 caracteres (colunas da textura "low").
 */

export interface CodeSnippet {
  id: string;
  language: "ts" | "tsx" | "css" | "glsl" | "sh";
  lines: readonly string[];
}

const stack = technologies.map((t) => t.name);

function chunkStack(items: readonly string[], size: number): string[] {
  const rows: string[] = [];
  for (let i = 0; i < items.length; i += size) {
    const slice = items.slice(i, i + size).map((s) => `"${s}"`);
    rows.push(`    ${slice.join(", ")},`);
  }
  return rows;
}

export const codeSnippets: readonly CodeSnippet[] = [
  {
    id: "identity",
    language: "ts",
    lines: [
      "const jefferson = {",
      `  name: "${siteConfig.name}",`,
      `  role: "${siteConfig.role}",`,
      "  stack: [",
      ...chunkStack(stack, 3),
      "  ],",
      '  focus: ["web design", "motion", "webgl"],',
      "} as const;",
      "",
      "export const decode = (face: Portrait) =>",
      "  face.pixels.map(toCode).filter(Boolean);",
    ],
  },
  {
    id: "component",
    language: "tsx",
    lines: [
      "export function Hero() {",
      "  const [ready, setReady] = useState(false);",
      "  useEffect(() => { setReady(true); }, []);",
      "  return (",
      '    <section data-cursor="decode">',
      "      <DigitalIdentity onReady={setReady} />",
      "    </section>",
      "  );",
      "}",
    ],
  },
  {
    id: "motion",
    language: "ts",
    lines: [
      "const lenis = new Lenis({ autoRaf: false });",
      "gsap.ticker.add((t) => lenis.raf(t * 1000));",
      "lenis.on('scroll', ScrollTrigger.update);",
      "",
      "gsap.to('.hero', {",
      "  yPercent: -8, ease: 'none',",
      "  scrollTrigger: { scrub: true },",
      "});",
    ],
  },
  {
    id: "webgl",
    language: "glsl",
    lines: [
      "uniform vec2 uMouse;",
      "uniform float uProgress;",
      "float mask = 1.0 - smoothstep(r * .25, r, d);",
      "vec3 lime = vec3(0.824, 1.0, 0.0);",
      "col += lime * glyph * decode;",
      "gl_FragColor = vec4(col, alpha);",
    ],
  },
  {
    id: "api",
    language: "ts",
    lines: [
      "export async function POST(req: Request) {",
      "  const data = schema.parse(await req.json());",
      "  await mailer.send({ to: inbox, ...data });",
      "  return Response.json({ ok: true });",
      "}",
    ],
  },
  {
    id: "styles",
    language: "css",
    lines: [
      ":root {",
      "  --neon-lime: #d2ff00;",
      "  --carbon-black: #080808;",
      "  --ease: cubic-bezier(0.65, 0.05, 0, 1);",
      "}",
      "@media (prefers-reduced-motion: reduce) {",
      "  * { animation-duration: 0.01ms !important; }",
      "}",
    ],
  },
  {
    id: "git",
    language: "sh",
    lines: [
      "$ git checkout -b feat/digital-identity",
      "$ npm run build && npm run lint",
      "$ git commit -m 'ship: decode portrait'",
      "$ git push origin main",
    ],
  },
];

/** Todas as linhas, em ordem, separadas por linha em branco entre snippets. */
export function getCodeLines(): string[] {
  return codeSnippets.flatMap((s) => [...s.lines, ""]);
}

export type TokenKind = "plain" | "keyword" | "string" | "comment" | "number";

export interface CodeToken {
  text: string;
  kind: TokenKind;
}

const KEYWORDS = new Set([
  "const", "let", "var", "function", "return", "export", "import", "from",
  "async", "await", "new", "if", "else", "as", "type", "interface",
  "uniform", "float", "vec2", "vec3", "vec4", "git", "npm", "default",
]);

const TOKEN_RE =
  /(\/\/.*$|\/\*.*\*\/)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b\d+(?:\.\d+)?\b)|([A-Za-z_$][\w$]*)|(\s+|.)/g;

/** Tokenizador leve (suficiente para colorir a textura; não é um parser). */
export function tokenizeLine(line: string): CodeToken[] {
  const tokens: CodeToken[] = [];
  for (const m of line.matchAll(TOKEN_RE)) {
    const [text, comment, str, num, word] = m;
    if (comment) tokens.push({ text, kind: "comment" });
    else if (str) tokens.push({ text, kind: "string" });
    else if (num) tokens.push({ text, kind: "number" });
    else if (word && KEYWORDS.has(word)) tokens.push({ text, kind: "keyword" });
    else tokens.push({ text, kind: "plain" });
  }
  return tokens;
}
