import type { Technology } from "@/types";

export const technologies: readonly Technology[] = [
  { slug: "react", name: "React", category: "frontend" },
  { slug: "nextjs", name: "Next.js", category: "frontend" },
  { slug: "javascript", name: "JavaScript", category: "linguagens" },
  { slug: "typescript", name: "TypeScript", category: "linguagens" },
  { slug: "html", name: "HTML", category: "frontend" },
  { slug: "css", name: "CSS", category: "estilos" },
  { slug: "sass", name: "SASS", category: "estilos" },
  { slug: "less", name: "LESS", category: "estilos" },
  { slug: "nodejs", name: "Node.js", category: "backend" },
  { slug: "bancos-de-dados", name: "Bancos de dados", category: "dados" },
  { slug: "apis-rest", name: "APIs REST", category: "backend" },
  { slug: "git", name: "Git", category: "ferramentas" },
  { slug: "github", name: "GitHub", category: "ferramentas" },
];
