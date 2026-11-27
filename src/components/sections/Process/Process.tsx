import { processSteps } from "@/data/process";
import { SectionHeader } from "../shared/SectionHeader";

export function Process() {
  return (
    <section
      id="processo"
      aria-labelledby="process-title"
      className="section-shell bg-off-white text-carbon-black"
    >
      <div className="section-wrap">
        <SectionHeader
          id="process-title"
          index="07"
          eyebrow="Processo"
          title={
            <>
              FROM IDEA TO <span className="accent-on-light">LAUNCH.</span>
            </>
          }
          aside={
            <p className="max-w-xs text-base leading-relaxed opacity-75">
              Seis etapas claras, da primeira conversa à evolução contínua do
              projeto.
            </p>
          }
        />

        <ol className="mt-[clamp(3rem,9vh,6rem)]">
          {processSteps.map((step) => (
            <li
              key={step.slug}
              className="reveal group grid grid-cols-[3.5rem_1fr] gap-x-4 border-t border-carbon-black/20 py-8 last:border-b md:grid-cols-12 md:gap-x-8 md:py-10"
            >
              <span className="font-condensed text-4xl font-bold leading-none md:col-span-2 md:text-6xl">
                {step.index}
              </span>
              <div className="md:col-span-4">
                <h3 className="title-md">{step.title}</h3>
                <p className="eyebrow mt-2">{step.label}</p>
              </div>
              <p className="col-start-2 mt-4 max-w-xl text-base leading-relaxed opacity-75 md:col-span-6 md:col-start-7 md:mt-0">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
