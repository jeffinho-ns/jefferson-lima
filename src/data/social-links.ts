import { siteConfig } from "@/config/site";
import type { SocialLink } from "@/types";

const clean = (value: string | undefined): string | null => {
  const v = value?.trim();
  return v ? v : null;
};

export const socialLinks: readonly SocialLink[] = [
  {
    platform: "github",
    label: "GitHub",
    href: clean(process.env.NEXT_PUBLIC_GITHUB_URL),
  },
  {
    platform: "linkedin",
    label: "LinkedIn",
    href: clean(process.env.NEXT_PUBLIC_LINKEDIN_URL),
  },
  {
    platform: "instagram",
    label: "Instagram",
    href: clean(process.env.NEXT_PUBLIC_INSTAGRAM_URL),
  },
  {
    platform: "whatsapp",
    label: "WhatsApp",
    href: siteConfig.whatsapp ? `https://wa.me/${siteConfig.whatsapp}` : null,
  },
];

/** Apenas redes com URL configurada — use na UI para não renderizar links vazios. */
export const activeSocialLinks = socialLinks.filter(
  (link): link is SocialLink & { href: string } => link.href !== null,
);
