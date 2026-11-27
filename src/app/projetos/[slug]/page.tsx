import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Contact } from "@/components/sections/Contact/Contact";
import { ProjectCover } from "@/components/sections/FeaturedProjects/ProjectCover";
import { HeaderThemeZone } from "@/components/layout/HeaderThemeZone/HeaderThemeZone";
import { projects } from "@/data/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projetos/${project.slug}` },
    openGraph: {
      title: project.title,
      description: project.summary,
      url: `/projetos/${project.slug}`,
    },
  };
}

export default async function ProjetoPage({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <HeaderThemeZone
        as="header"
        className="bg-grain-dark relative overflow-hidden pb-[clamp(3rem,8vh,5.5rem)] pt-[calc(var(--header-h)+clamp(2rem,6vh,4rem))] text-off-white"
      >
        <div className="section-wrap">
          <Link href="/projetos" className="cta-link">
            <ArrowLeft aria-hidden="true" className="size-4" />
            Todos os projetos
          </Link>
          <p className="eyebrow mt-12 flex items-center gap-3">
            <span>{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
            <span>{project.category}</span>
          </p>
          <h1 className="title-xl mt-5">{project.title}</h1>
        </div>
      </HeaderThemeZone>

      <section
        aria-label={`Sobre ${project.title}`}
        className="section-shell bg-off-white text-carbon-black"
      >
        <div className="section-wrap grid gap-12 lg:grid-cols-12">
          <ProjectCover
            project={project}
            index={index}
            className="group aspect-[16/10] w-full lg:col-span-7"
          />
          <div className="lg:col-span-5">
            <p className="eyebrow">Sobre o projeto</p>
            <p className="mt-4 text-xl leading-relaxed">{project.summary}</p>

            <p className="eyebrow mt-10">Tecnologias</p>
            <ul className="mt-4">
              {project.tags.map((tag) => (
                <li
                  key={tag}
                  className="border-t border-carbon-black/20 py-3 font-condensed text-xl font-semibold uppercase tracking-wide last:border-b"
                >
                  {tag}
                </li>
              ))}
            </ul>

            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="pill pill-dark mt-10"
              >
                Visitar projeto
                <ArrowUpRight aria-hidden="true" className="arrow-shift size-4" />
              </a>
            )}
          </div>
        </div>
      </section>

      <section
        aria-label="Próximo projeto"
        className="section-shell bg-light-gray text-carbon-black"
      >
        <div className="section-wrap">
          <p className="eyebrow">Próximo projeto</p>
          <Link
            href={`/projetos/${next.slug}`}
            data-cursor="view-project"
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
