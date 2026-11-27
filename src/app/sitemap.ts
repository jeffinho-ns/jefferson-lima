import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";
import { services } from "@/data/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;

  return [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/sobre"), changeFrequency: "yearly", priority: 0.7 },
    { url: url("/projetos"), changeFrequency: "monthly", priority: 0.9 },
    ...projects.map((project) => ({
      url: url(`/projetos/${project.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    { url: url("/servicos"), changeFrequency: "monthly", priority: 0.9 },
    ...services.map((service) => ({
      url: url(`/servicos/${service.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    { url: url("/contato"), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/privacidade"), changeFrequency: "yearly", priority: 0.2 },
  ];
}
