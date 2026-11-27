import type { Project } from "@/types";

/**
 * Descrições factuais. Sem métricas, clientes ou resultados não confirmados.
 * `href` só deve ser preenchido com URLs públicas confirmadas.
 */
export const projects: readonly Project[] = [
  {
    slug: "agilizaiapp",
    title: "AgilizaiApp",
    category: "Plataforma digital",
    summary:
      "Sistema completo de gestão para estabelecimentos: reservas, cardápio digital, check-in, eventos e operação integrada.",
    tags: ["React", "Next.js", "TypeScript", "Node.js", "IA", "WhatsApp"],
    cover: "/images/projects/agilizaiapp-cover.jpg",
  },
  {
    slug: "agilizaiapp-mobile",
    title: "Agilizai App",
    category: "App mobile",
    summary:
      "Aplicativo mobile para eventos, reservas, cardápios e experiência do cliente em estabelecimentos.",
    tags: ["Flutter", "Dart", "Firebase", "Google Maps"],
    cover: "/images/projects/agilizaiapp-mobile-cover.jpg",
  },
  {
    slug: "giro-certo",
    title: "Giro Certo",
    category: "App mobile",
    summary:
      "App para motociclistas com comunidade, controlo de manutenção por quilometragem e ranking de peças.",
    tags: ["Flutter", "Dart", "Firebase", "Maps"],
    cover: "/images/projects/giro-certo-cover.jpg",
  },
  {
    slug: "agilizai-tickets",
    title: "AgilizaiTickets",
    category: "Plataforma web",
    summary:
      "Ticketeria 360°: venda de ingressos, controle de acesso e carteira de consumo no mesmo fluxo do evento.",
    tags: ["Next.js", "TypeScript", "Node.js", "Pagamentos"],
    cover: "/images/projects/agilizai-tickets-cover.jpg",
  },
  {
    slug: "grupo-ideiaum",
    title: "Grupo Ideiaum",
    category: "Site institucional",
    summary:
      "Presença digital do grupo: gestão estratégica, operação de marcas e ecossistema de negócios de hospitalidade.",
    tags: ["Next.js", "TypeScript", "UI/UX"],
    cover: "/images/projects/grupo-ideiaum-cover.jpg",
  },
  {
    slug: "seu-justino",
    title: "Seu Justino",
    category: "Site comercial",
    summary:
      "Site do bar e restaurante com narrativa de marca, cardápio, reservas, eventos e presença em Vila Madalena.",
    tags: ["WordPress", "PHP", "UI/UX"],
    cover: "/images/projects/seu-justino-cover.jpg",
  },
  {
    slug: "pracinha-seu-justino",
    title: "Pracinha do Seu Justino",
    category: "Site comercial",
    summary:
      "Site da unidade Pracinha: agenda, menu, reservas e experiência visual alinhada à identidade do local.",
    tags: ["WordPress", "PHP", "UI/UX"],
    cover: "/images/projects/pracinha-seu-justino-cover.jpg",
  },
  {
    slug: "high-line",
    title: "High Line",
    category: "Site comercial",
    summary:
      "Site do High Line Bar com menu, agenda, eventos e linguagem visual urbana alinhada à marca.",
    tags: ["WordPress", "PHP", "UI/UX"],
    cover: "/images/projects/high-line-cover.jpg",
  },
  {
    slug: "reserva-rooftop",
    title: "Reserva Rooftop",
    category: "Site comercial",
    summary:
      "Site do rooftop com experiência de marca, galeria, cardápio e conversão para reservas.",
    tags: ["WordPress", "PHP", "UI/UX"],
    cover: "/images/projects/reserva-rooftop-cover.jpg",
  },
  {
    slug: "belas-artes",
    title: "Belas Artes",
    category: "Site institucional",
    summary:
      "Site institucional da Belas Artes com oferta de cursos, narrativa de marca e captação de inscrições.",
    tags: ["WordPress", "PHP", "UI/UX"],
    cover: "/images/projects/belas-artes-cover.jpg",
  },
  {
    slug: "frigelar",
    title: "Frigelar",
    category: "E-commerce",
    summary:
      "Experiência digital de e-commerce para varejo de climatização e eletrodomésticos, com vitrine e campanhas.",
    tags: ["OCC", "OSF", "Oracle Commerce Cloud"],
    cover: "/images/projects/frigelar-cover.jpg",
  },
  {
    slug: "oh-fregues",
    title: "Oh Freguês",
    category: "Site comercial",
    summary:
      "Site do bar e rooftop com reservas, aniversários, benefícios e narrativa de marca da Freguesia do Ó.",
    tags: ["React", "JavaScript", "UI/UX"],
    cover: "/images/projects/oh-fregues-cover.jpg",
  },
];

