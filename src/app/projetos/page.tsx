import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact/Contact";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects/FeaturedProjects";
import { PageIntro } from "@/components/sections/shared/PageIntro";

export const metadata: Metadata = {
  title: "Projetos",
  description:
    "Projetos de Jefferson Teixeira: AgilizaiApp, AgilizaiTickets, Grupo Ideiaum, Seu Justino, High Line, Frigelar e mais.",
  alternates: { canonical: "/projetos" },
};

export default function ProjetosPage() {
  return (
    <>
      <PageIntro
        tone="dark"
        eyebrow="Projetos"
        title="SELECTED WORKS."
        description="Aplicações web e mobile desenvolvidas de ponta a ponta, do design ao código."
      />
      <FeaturedProjects standalone />
      <Contact />
    </>
  );
}
