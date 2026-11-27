import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Contact } from "@/components/sections/Contact/Contact";
import { Process } from "@/components/sections/Process/Process";
import { Services } from "@/components/sections/Services/Services";
import { PageIntro } from "@/components/sections/shared/PageIntro";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Web design, landing pages, desenvolvimento full stack, sistemas, SaaS, IA, UI/UX, e-commerce, integrações e automação.",
  alternates: { canonical: "/servicos" },
};

export default function ServicosPage() {
  return (
    <>
      <PageIntro
        eyebrow="Serviços"
        title="LET’S BUILD SOMETHING DIFFERENT."
        description="Do design ao código, sob medida para o contexto do seu projeto."
      >
        <Link href="/contato" className="pill pill-dark">
          Solicitar orçamento
          <ArrowUpRight aria-hidden="true" className="arrow-shift size-4" />
        </Link>
      </PageIntro>
      <Services standalone />
      <Process />
      <Contact />
    </>
  );
}
