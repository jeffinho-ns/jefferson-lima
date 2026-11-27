import { philosophy } from "@/data/philosophy";
import { HeaderThemeZone } from "@/components/layout/HeaderThemeZone/HeaderThemeZone";

export function Philosophy() {
  return (
    <HeaderThemeZone
      id="filosofia"
      aria-labelledby="philosophy-title"
      className="section-shell bg-grain-dark overflow-hidden text-off-white"
    >
      <div className="section-wrap">
        <p className="eyebrow flex items-center gap-3">
          <span>01</span>
          <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
          <span>Filosofia</span>
        </p>

        <h2 id="philosophy-title" className="title-xl reveal mt-6">
          <span className="block">DESIGN IS MY LANGUAGE.</span>
          <span className="accent-lime block">CODE IS MY SUPERPOWER.</span>
        </h2>

        <div className="mt-[clamp(3rem,9vh,6rem)] max-w-3xl">
          <p className="reveal text-lg leading-relaxed opacity-80 sm:text-xl">
            {philosophy.statement}
          </p>
        </div>
      </div>
    </HeaderThemeZone>
  );
}
