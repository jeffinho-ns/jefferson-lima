import type { Service } from "@/types";

const defaultCta = "Solicitar orçamento";

export const services: readonly Service[] = [
  {
    slug: "web-design",
    title: "Web Design",
    description:
      "Direção visual e layouts digitais com identidade autoral, hierarquia clara e acabamento premium.",
    benefits: [
      "Identidade visual consistente",
      "Layouts prontos para desenvolvimento",
      "Atenção a tipografia, ritmo e detalhe",
    ],
    audience: "Marcas e negócios que querem se destacar visualmente online.",
    cta: defaultCta,
  },
  {
    slug: "landing-pages",
    title: "Landing Pages",
    description:
      "Páginas focadas em conversão, com narrativa visual, velocidade e chamada para ação clara.",
    benefits: [
      "Foco em uma única conversão",
      "Carregamento rápido",
      "Integração com formulário e WhatsApp",
    ],
    audience: "Campanhas, lançamentos e captação de leads.",
    cta: defaultCta,
  },
  {
    slug: "desenvolvimento-de-sites",
    title: "Desenvolvimento de Sites",
    description:
      "Sites institucionais e comerciais com performance, SEO técnico e experiência responsiva.",
    benefits: [
      "Presença digital profissional",
      "Estrutura pensada para SEO",
      "Manutenção e evolução facilitadas",
    ],
    audience: "Empresas e profissionais que precisam de presença online sólida.",
    cta: defaultCta,
  },
  {
    slug: "desenvolvimento-full-stack",
    title: "Desenvolvimento Full Stack",
    description:
      "Do front ao back: aplicações completas com React/Next.js, APIs e banco de dados.",
    benefits: [
      "Solução ponta a ponta",
      "Arquitetura tipada e organizada",
      "Pronto para escalar com o negócio",
    ],
    audience: "Produtos digitais e operações que precisam de sistema próprio.",
    cta: defaultCta,
  },
  {
    slug: "sistemas-personalizados",
    title: "Sistemas Personalizados",
    description:
      "Sistemas sob medida para processos internos, gestão e fluxos que o software genérico não resolve.",
    benefits: [
      "Adaptado ao seu processo",
      "Menos retrabalho operacional",
      "Integração com ferramentas existentes",
    ],
    audience: "Empresas com regras de negócio específicas.",
    cta: defaultCta,
  },
  {
    slug: "plataformas-saas",
    title: "Plataformas SaaS",
    description:
      "Produtos multi-tenant, painéis, autenticação e fluxos de assinatura pensados para escala.",
    benefits: [
      "Arquitetura orientada a produto",
      "Experiência de usuário clara",
      "Base para crescimento contínuo",
    ],
    audience: "Founders e times construindo software como serviço.",
    cta: defaultCta,
  },
  {
    slug: "inteligencia-artificial",
    title: "Inteligência Artificial",
    description:
      "Integração de IA em produtos e operações: atendimento, automação e experiências assistidas.",
    benefits: [
      "Automação inteligente de tarefas",
      "Atendimento e suporte assistidos",
      "Integração com fluxos reais do negócio",
    ],
    audience: "Negócios que querem ganhar eficiência com IA aplicada.",
    cta: defaultCta,
  },
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    description:
      "Pesquisa, fluxos e interfaces centradas no usuário, com clareza, usabilidade e estética.",
    benefits: [
      "Jornadas mais simples",
      "Interfaces consistentes",
      "Menos atrito na conversão",
    ],
    audience: "Produtos digitais que precisam de clareza e conversão.",
    cta: defaultCta,
  },
  {
    slug: "e-commerce",
    title: "E-commerce",
    description:
      "Lojas digitais com catálogo, checkout e experiência de compra alinhada à marca.",
    benefits: [
      "Jornada de compra clara",
      "Integração com pagamentos",
      "Design comercial e responsivo",
    ],
    audience: "Marcas e varejo que vendem online.",
    cta: defaultCta,
  },
  {
    slug: "integracoes-e-apis",
    title: "Integrações e APIs",
    description:
      "Conexão entre sistemas, webhooks e APIs REST para unificar dados e automatizar fluxos.",
    benefits: [
      "Sistemas conversando entre si",
      "Menos trabalho manual",
      "Dados consistentes",
    ],
    audience: "Operações com múltiplas ferramentas e fontes de dados.",
    cta: defaultCta,
  },
  {
    slug: "automacao-de-processos",
    title: "Automação de Processos",
    description:
      "Automação de tarefas repetitivas, notificações e fluxos operacionais com regras do negócio.",
    benefits: [
      "Redução de tarefas manuais",
      "Mais previsibilidade operacional",
      "Equipe focada no que importa",
    ],
    audience: "Times que perdem tempo com processos repetitivos.",
    cta: defaultCta,
  },
] as const;

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((service) => service.slug === slug);
}
