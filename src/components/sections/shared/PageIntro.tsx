import type { ReactNode } from "react";
import { HeaderThemeZone } from "@/components/layout/HeaderThemeZone/HeaderThemeZone";

interface PageIntroProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  /** Conteúdo extra abaixo da descrição (ex.: CTAs). */
  children?: ReactNode;
  tone?: "light" | "dark";
}

/** Abertura das páginas internas. Reserva espaço para o header fixo. */
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
  tone = "light",
}: PageIntroProps) {
  const dark = tone === "dark";
  return (
    <HeaderThemeZone
      as="header"
      enabled={dark}
      className={`relative overflow-hidden pt-[calc(var(--header-h)+clamp(3rem,9vh,6rem))] pb-[clamp(3rem,8vh,5.5rem)] ${
        dark ? "bg-grain-dark text-off-white" : "surface-organic text-carbon-black"
      }`}
    >
      {!dark && <div className="surface-topo absolute inset-0" aria-hidden="true" />}
      <div className="section-wrap relative">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="title-xl mt-5 max-w-[18ch]">{title}</h1>
        {description ? (
          <p className="mt-8 max-w-2xl text-lg leading-relaxed opacity-80">
            {description}
          </p>
        ) : null}
        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </HeaderThemeZone>
  );
}
