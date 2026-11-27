import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { HeaderThemeZone } from "@/components/layout/HeaderThemeZone/HeaderThemeZone";
import { NotFoundScene } from "@/components/sections/shared/NotFoundScene";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <HeaderThemeZone aria-labelledby="not-found-title">
      <NotFoundScene>
        <p className="eyebrow">Erro 404</p>
        <h1 id="not-found-title" className="title-xl mt-5">
          PÁGINA <br />
          <span className="accent-lime">NÃO ENCONTRADA.</span>
        </h1>
        <p className="mt-8 max-w-md text-lg leading-relaxed opacity-75">
          O endereço que você tentou acessar não existe ou foi movido. Volte ao
          início ou veja os projetos.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link href="/" className="pill !border-neon-lime !bg-neon-lime !text-carbon-black">
            Voltar ao início
            <ArrowUpRight aria-hidden="true" className="arrow-shift size-4" />
          </Link>
          <Link href="/projetos" className="pill pill-outline">
            Ver projetos
          </Link>
        </div>
      </NotFoundScene>
    </HeaderThemeZone>
  );
}
