import { technologies } from "@/data/technologies";
import type { Technology, TechnologyCategory } from "@/types";
import { SectionHeader } from "../shared/SectionHeader";

const categoryOrder: readonly TechnologyCategory[] = [
  "frontend",
  "linguagens",
  "estilos",
  "backend",
  "dados",
  "ferramentas",
];

const categoryLabels: Record<TechnologyCategory, string> = {
  frontend: "Front-end",
  linguagens: "Linguagens",
  estilos: "Estilos",
  backend: "Back-end",
  dados: "Dados",
  ferramentas: "Ferramentas",
};

function groupByCategory(items: readonly Technology[]) {
  return categoryOrder
    .map((category) => ({
      category,
      items: items.filter((item) => item.category === category),
    }))
    .filter((group) => group.items.length > 0);
}

export function Technologies() {
  const groups = groupByCategory(technologies);

  return (
    <section
      id="tecnologias"
      aria-labelledby="technologies-title"
      className="section-shell overflow-hidden bg-light-gray text-carbon-black"
    >
      <div className="section-wrap">
        <SectionHeader
          id="technologies-title"
          index="05"
          eyebrow="Tecnologias"
          title={
            <>
              MY DIGITAL <span className="accent-on-light">TOOLBOX.</span>
            </>
          }
          aside={
            <p className="max-w-xs text-base leading-relaxed opacity-75">
              As ferramentas que uso para transformar design em produto.
            </p>
          }
        />

        <dl className="mt-[clamp(3rem,9vh,6rem)]">
          {groups.map((group) => (
            <div
              key={group.category}
              className="reveal grid gap-4 border-t border-carbon-black/20 py-7 last:border-b md:grid-cols-12 md:gap-8"
            >
              <dt className="eyebrow pt-2 md:col-span-3">
                {categoryLabels[group.category]}
              </dt>
              <dd className="md:col-span-9">
                <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
                  {group.items.map((tech, i) => (
                    <li key={tech.slug} className="flex items-baseline gap-5">
                      <span className="tech-name title-lg !leading-[1.05]">
                        {tech.name}
                      </span>
                      {i < group.items.length - 1 && (
                        <span
                          aria-hidden="true"
                          className="font-condensed text-3xl font-light opacity-30"
                        >
                          /
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
