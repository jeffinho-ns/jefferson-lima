import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { SectionHeader } from "../shared/SectionHeader";
import { ServicesList } from "./ServicesList";
import { HeaderThemeZone } from "@/components/layout/HeaderThemeZone/HeaderThemeZone";

interface ServicesProps {
  /** Em páginas internas o título (h1) vem da página. */
  standalone?: boolean;
}

export function Services({ standalone = false }: ServicesProps) {
  return (
    <HeaderThemeZone
      id="servicos"
      aria-labelledby={standalone ? undefined : "services-title"}
      aria-label={standalone ? "Lista de serviços" : undefined}
      className="section-shell bg-grain-dark text-off-white"
    >
      <div className="section-wrap">
        {!standalone && (
          <SectionHeader
            id="services-title"
            index="04"
            eyebrow="Serviços"
            title={
              <>
                LET&rsquo;S BUILD <br />
                SOMETHING <span className="accent-lime">DIFFERENT.</span>
              </>
            }
            aside={
              <div className="flex flex-col items-start gap-6">
                <p className="max-w-xs text-base leading-relaxed opacity-75">
                  Do design ao código, sob medida para o contexto do seu
                  projeto.
                </p>
                <Link href="/contato" className="pill pill-outline">
                  Solicitar orçamento
                  <ArrowUpRight aria-hidden="true" className="arrow-shift size-4" />
                </Link>
              </div>
            }
          />
        )}

        <div className={standalone ? "" : "mt-[clamp(3rem,9vh,6rem)]"}>
          <ServicesList services={services} tone="dark" />
        </div>
      </div>
    </HeaderThemeZone>
  );
}
