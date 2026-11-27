import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { SectionHeader } from "../shared/SectionHeader";
import { ProjectCover } from "./ProjectCover";

interface FeaturedProjectsProps {
  /** Em páginas internas o título (h1) vem da página; oculta cabeçalho e link "ver todos". */
  standalone?: boolean;
}

export function FeaturedProjects({ standalone = false }: FeaturedProjectsProps) {
  return (
    <section
      id="projetos"
      aria-labelledby={standalone ? undefined : "projects-title"}
      aria-label={standalone ? "Lista de projetos" : undefined}
      className="section-shell bg-off-white text-carbon-black"
    >
      <div className="section-wrap">
        {!standalone && (
          <SectionHeader
            id="projects-title"
            index="03"
            eyebrow="Projetos"
            title="SELECTED WORKS."
            aside={
              <p className="max-w-xs text-base leading-relaxed opacity-75">
                Aplicações web e mobile desenvolvidas de ponta a ponta, do
                design ao código.
              </p>
            }
          />
        )}

        <ul className={standalone ? "" : "mt-[clamp(3rem,9vh,6rem)]"}>
          {projects.map((project, i) => (
            <li
              key={project.slug}
              className="reveal border-t border-carbon-black/20 last:border-b"
            >
              <Link
                href={`/projetos/${project.slug}`}
                data-cursor="view-project"
                className="row-link group grid items-center gap-8 py-8 sm:py-10 lg:grid-cols-12 lg:gap-12"
              >
                <div className="lg:col-span-7">
                  <p className="eyebrow flex items-center gap-3">
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <span aria-hidden="true" className="h-px w-8 bg-current opacity-60" />
                    <span>{project.category}</span>
                  </p>
                  <h3 className="title-lg mt-4 flex items-start gap-4 transition-transform duration-700 ease-[var(--ease-cinematic)] group-hover:translate-x-2">
                    <span>{project.title}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="arrow-shift mt-1 size-[0.55em] shrink-0"
                      strokeWidth={2.5}
                    />
                  </h3>
                  <p className="mt-5 max-w-xl text-base leading-relaxed opacity-75">
                    {project.summary}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tecnologias">
                    {project.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-carbon-black/30 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] opacity-80"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
                <ProjectCover
                  project={project}
                  index={i}
                  className="aspect-[16/10] w-full lg:col-span-5"
                />
              </Link>
            </li>
          ))}
        </ul>

        {!standalone && (
          <div className="reveal mt-12 flex justify-end">
            <Link href="/projetos" className="cta-link">
              Ver todos os projetos
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
