import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Contact } from "@/components/sections/Contact/Contact";
import { HeaderThemeZone } from "@/components/layout/HeaderThemeZone/HeaderThemeZone";
import { services } from "@/data/services";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);
  if (!service) return {};

  return {
    title: service.title,
    description: service.description,
    alternates: { canonical: `/servicos/${service.slug}` },
    openGraph: {
      title: service.title,
      description: service.description,
      url: `/servicos/${service.slug}`,
    },
  };
}

export default async function ServicoPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = services.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const service = services[index];
  const next = services[(index + 1) % services.length];

  return (
    <>
      <HeaderThemeZone
        as="header"
        className="bg-grain-dark relative overflow-hidden pb-[clamp(3rem,8vh,5.5rem)] pt-[calc(var(--header-h)+clamp(2rem,6vh,4rem))] text-off-white"
      >
        <div className="section-wrap">
          <Link href="/servicos" className="cta-link">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Todos os serviços
          </Link>
          <p className="eyebrow mt-12 flex items-center gap-3">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
            <span>Serviço</span>
          </p>
          <h1 className="title-xl mt-5 max-w-[16ch]">{service.title}</h1>
          <p className="mt-8 max-w-2xl text-lg leading-relaxed opacity-80">
            {service.description}
          </p>
        </div>
      </HeaderThemeZone>

      <section
        aria-label={`Detalhes de ${service.title}`}
        className="section-shell bg-off-white text-carbon-black"
      >
        <div className="section-wrap grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow">O que você ganha</p>
            <ul className="mt-5">
              {service.benefits.map((benefit, i) => (
                <li
                  key={benefit}
                  className="flex items-baseline gap-5 border-t border-carbon-black/20 py-5 last:border-b"
                >
                  <span className="eyebrow w-8 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="title-md">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <p className="eyebrow">Para quem</p>
            <p className="mt-4 text-xl leading-relaxed">{service.audience}</p>
            <Link href="/contato" className="pill pill-dark mt-10">
              {service.cta}
              <ArrowUpRight aria-hidden="true" className="arrow-shift size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section
        aria-label="Próximo serviço"
        className="section-shell bg-light-gray text-carbon-black"
      >
        <div className="section-wrap">
          <p className="eyebrow">Próximo serviço</p>
          <Link
            href={`/servicos/${next.slug}`}
            className="row-link group mt-5 flex items-center justify-between gap-6"
          >
            <span className="title-xl">{next.title}</span>
            <ArrowRight
              aria-hidden="true"
              className="arrow-shift size-[clamp(2rem,6vw,5rem)] shrink-0"
              strokeWidth={2}
            />
          </Link>
        </div>
      </section>

      <Contact />
    </>
  );
}
