import { workModes } from "@/data/modes";
import { HeaderThemeZone } from "@/components/layout/HeaderThemeZone/HeaderThemeZone";

export function CreativeDevelopmentModes() {
  return (
    <HeaderThemeZone
      id="modos"
      aria-labelledby="modes-title"
      className="bg-off-white text-carbon-black"
    >
      <h2 id="modes-title" className="sr-only">
        Development Mode e Creative Mode
      </h2>
      <div className="modes-split flex flex-col md:min-h-[44rem] md:flex-row">
        {workModes.map((mode, i) => {
          const dark = mode.id === "development";
          const [first, ...rest] = mode.title.split(" ");
          return (
            <article
              key={mode.id}
              className={`mode-panel relative flex flex-col justify-between gap-16 px-[clamp(1.25rem,3.2vw,3.5rem)] py-[clamp(3.5rem,10vh,6.5rem)] ${
                dark
                  ? "bg-carbon-black text-off-white"
                  : "bg-neon-lime text-carbon-black"
              }`}
            >
              <div>
                <p className="eyebrow flex items-center gap-3">
                  <span>{`0${i + 1}`}</span>
                  <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
                  <span>{dark ? "Engenharia" : "Direção"}</span>
                </p>
                <h3 className="title-lg reveal mt-5" aria-label={mode.title}>
                  <span className={`block ${dark ? "accent-lime" : ""}`}>
                    {first}
                  </span>
                  <span className="block">{rest.join(" ")}</span>
                </h3>
                <p className="mt-6 max-w-sm text-base leading-relaxed opacity-75">
                  {mode.tagline}
                </p>
              </div>

              <ul>
                {mode.items.map((item, n) => (
                  <li
                    key={item}
                    className={`flex items-baseline gap-4 border-t py-3.5 font-condensed text-lg font-semibold uppercase tracking-wide last:border-b sm:text-xl ${
                      dark ? "border-off-white/20" : "border-carbon-black/25"
                    }`}
                  >
                    <span className="eyebrow w-6 shrink-0">
                      {String(n + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </HeaderThemeZone>
  );
}
