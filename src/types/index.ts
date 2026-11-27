/**
 * Tipos compartilhados do site.
 */

export interface NavigationItem {
  /** Número exibido no menu (ex.: "01"). */
  index: string;
  label: string;
  href: string;
}

export type SocialPlatform = "github" | "linkedin" | "instagram" | "whatsapp";

export interface SocialLink {
  platform: SocialPlatform;
  label: string;
  /** URL configurável via env. `null` quando não configurada. */
  href: string | null;
}

export interface Project {
  slug: string;
  title: string;
  /** Categoria curta exibida como eyebrow (ex.: "App mobile"). */
  category: string;
  summary: string;
  tags: readonly string[];
  /** Caminho em /public para a capa do projeto. */
  cover: string;
  /** Link externo opcional. Só preencher com URL confirmada. */
  href?: string;
}

export interface Service {
  slug: string;
  title: string;
  description: string;
  benefits: readonly string[];
  audience: string;
  cta: string;
}

export type TechnologyCategory =
  | "frontend"
  | "linguagens"
  | "estilos"
  | "backend"
  | "dados"
  | "ferramentas";

export interface Technology {
  slug: string;
  name: string;
  category: TechnologyCategory;
}

export interface ProcessStep {
  index: string;
  slug: string;
  /** Nome da etapa em inglês, conforme o brief (Discovery → Evolution). */
  title: string;
  /** Rótulo em português. */
  label: string;
  description: string;
}

export interface PhilosophyPrinciple {
  title: string;
  description: string;
}

export interface Philosophy {
  headline: string;
  statement: string;
  principles: readonly PhilosophyPrinciple[];
}

export interface AboutCopy {
  eyebrow: string;
  headline: string;
  paragraphs: readonly string[];
  highlights: readonly string[];
}
