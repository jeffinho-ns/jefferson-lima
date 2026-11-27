import type { ProcessStep } from "@/types";

export const processSteps: readonly ProcessStep[] = [
  {
    index: "01",
    slug: "discovery",
    title: "Discovery",
    label: "Descoberta",
    description:
      "Entendimento do negócio, do público e dos objetivos do projeto antes de qualquer linha de código ou pixel.",
  },
  {
    index: "02",
    slug: "strategy",
    title: "Strategy",
    label: "Estratégia",
    description:
      "Definição de escopo, prioridades, estrutura de conteúdo e caminho técnico mais adequado para o contexto.",
  },
  {
    index: "03",
    slug: "design",
    title: "Design",
    label: "Design",
    description:
      "Direção visual, layout e interações pensados para comunicar a marca com clareza e identidade própria.",
  },
  {
    index: "04",
    slug: "development",
    title: "Development",
    label: "Desenvolvimento",
    description:
      "Implementação com código organizado, responsivo e preparado para performance e acessibilidade.",
  },
  {
    index: "05",
    slug: "launch",
    title: "Launch",
    label: "Lançamento",
    description:
      "Revisão final, testes, configuração de publicação e entrega do projeto no ar.",
  },
  {
    index: "06",
    slug: "evolution",
    title: "Evolution",
    label: "Evolução",
    description:
      "Ajustes, melhorias contínuas e novas funcionalidades conforme o projeto e o negócio crescem.",
  },
];
