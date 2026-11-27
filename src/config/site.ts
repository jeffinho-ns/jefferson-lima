const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteConfig = {
  name: "Jefferson Teixeira",
  title: "Jefferson Teixeira | Creative Developer & Web Designer",
  titleTemplate: "%s | Jefferson Teixeira",
  description:
    "Sites, aplicações web e experiências digitais com design autoral e código sólido. Jefferson Teixeira é Creative Developer & Web Designer.",
  url: (rawSiteUrl && rawSiteUrl.length > 0
    ? rawSiteUrl
    : "http://localhost:3000"
  ).replace(/\/+$/, ""),
  locale: "pt-BR",
  ogLocale: "pt_BR",
  role: "Creative Developer & Web Designer",
  availability: "Disponível para novos projetos",
  /** Contatos vêm do ambiente; string vazia = não configurado. */
  email: process.env.NEXT_PUBLIC_EMAIL?.trim() ?? "",
  /** Somente dígitos com DDI (ex.: 5511999999999). */
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP?.replace(/\D/g, "") ?? "",
} as const;

export type SiteConfig = typeof siteConfig;
