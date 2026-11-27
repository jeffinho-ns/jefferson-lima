import type { Metadata } from "next";
import { HeroSection } from "@/components/hero/HeroSection/HeroSection";
import { About } from "@/components/sections/About/About";
import { Contact } from "@/components/sections/Contact/Contact";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects/FeaturedProjects";
import { CreativeDevelopmentModes } from "@/components/sections/Modes/CreativeDevelopmentModes";
import { Partners } from "@/components/sections/Partners/Partners";
import { Philosophy } from "@/components/sections/Philosophy/Philosophy";
import { Process } from "@/components/sections/Process/Process";
import { Services } from "@/components/sections/Services/Services";
import { Technologies } from "@/components/sections/Technologies/Technologies";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Philosophy />
      <CreativeDevelopmentModes />
      <FeaturedProjects />
      <Services />
      <Technologies />
      <About />
      <Partners />
      <Process />
      <Contact />
    </>
  );
}
