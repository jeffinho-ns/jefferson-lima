import type { Metadata } from "next";
import { About } from "@/components/sections/About/About";
import { Contact } from "@/components/sections/Contact/Contact";
import { Philosophy } from "@/components/sections/Philosophy/Philosophy";
import { Process } from "@/components/sections/Process/Process";
import { PageIntro } from "@/components/sections/shared/PageIntro";
import { Technologies } from "@/components/sections/Technologies/Technologies";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Sobre",
  description: `Conheça ${siteConfig.name}, ${siteConfig.role}: design autoral e desenvolvimento sólido no mesmo fluxo.`,
  alternates: { canonical: "/sobre" },
};

export default function SobrePage() {
  return (
    <>
      <PageIntro
        eyebrow="Sobre"
        title="DESIGN E CÓDIGO, NO MESMO FLUXO."
        description={siteConfig.availability}
      />
      <About standalone />
      <Technologies />
      <Philosophy />
      <Process />
      <Contact />
    </>
  );
}
