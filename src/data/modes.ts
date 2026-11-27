/**
 * Modos de trabalho — alinhados ao brief (Development / Creative).
 */
export interface WorkMode {
  id: "development" | "creative";
  title: string;
  tagline: string;
  items: readonly string[];
}

export const workModes: readonly WorkMode[] = [
  {
    id: "development",
    title: "DEVELOPMENT MODE",
    tagline: "Código, sistemas e inteligência aplicados ao negócio.",
    items: [
      "Desenvolvimento Full Stack",
      "Aplicações Web",
      "Plataformas SaaS",
      "Inteligência Artificial",
      "APIs e integrações",
      "Automação",
    ],
  },
  {
    id: "creative",
    title: "CREATIVE MODE",
    tagline: "Design, motion e experiências digitais memoráveis.",
    items: [
      "Web Design",
      "UI/UX Design",
      "Identidade visual digital",
      "Motion Design",
      "Experiências interativas",
      "Creative Development",
    ],
  },
];
