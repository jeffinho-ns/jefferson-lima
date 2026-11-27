import { siteConfig } from "@/config/site";

import AvailabilityBadge from "../AvailabilityBadge/AvailabilityBadge";
import OrganicBackground from "../OrganicBackground/OrganicBackground";
import PortraitCanvas from "../PortraitCanvas/PortraitCanvas";

/**
 * Hero pixel-oriented: 100svh, retrato bottom-center (~40–65% largura),
 * header overlay (layout), badge inferior esquerdo, fundo orgânico.
 */
export function HeroSection() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative h-svh min-h-[34rem] w-full overflow-hidden"
    >
      <OrganicBackground />

      <h1 id="hero-title" className="sr-only">
        {siteConfig.name} — {siteConfig.role}
      </h1>

      {/*
        Escala alinhada à referência @1440:
        cabeça ≈ 40% vw; ombros ≈ 60–65% vw; topo da cabeça ≈ 11–12% vh.
        Mobile: quase full-bleed, peito ancorado embaixo.
      */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex justify-center">
        <div
          className={[
            "relative w-[min(100vw,96svh)]",
            "max-md:aspect-[4/5] max-md:max-h-[90svh]",
            /* Desktop: ombros ~60–65% vw; cabeça sobe perto de 11–12% vh */
            "md:aspect-[819/756] md:w-[min(68vw,98svh)]",
            "xl:w-[min(64vw,96svh)]",
          ].join(" ")}
        >
          <PortraitCanvas />
        </div>
      </div>

      <AvailabilityBadge />

      <p
        aria-hidden
        className="text-eyebrow pointer-events-none absolute right-[var(--pad-container)] bottom-[var(--pad-container)] z-20 hidden text-right text-carbon-black/45 md:block"
      >
        <span className="hidden [@media(hover:hover)]:inline">
          Passe o cursor para decodificar
        </span>
        <span className="[@media(hover:hover)]:hidden">
          Toque para decodificar
        </span>
      </p>
    </section>
  );
}

export default HeroSection;
