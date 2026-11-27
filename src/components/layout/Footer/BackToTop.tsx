"use client";

import { ArrowUp } from "lucide-react";
import { useSmoothScroll } from "@/components/motion/SmoothScroll/SmoothScroll";

export function BackToTop() {
  const { scrollTo } = useSmoothScroll();

  return (
    <button
      type="button"
      onClick={() => scrollTo(0, { duration: 1.4 })}
      className="group inline-flex items-center gap-3 font-[family-name:var(--font-condensed)] text-sm font-bold uppercase tracking-[0.12em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-lime"
    >
      Voltar ao topo
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-off-white/30 transition-colors group-hover:border-neon-lime group-hover:bg-neon-lime group-hover:text-carbon-black">
        <ArrowUp size={18} strokeWidth={2.25} aria-hidden="true" />
      </span>
    </button>
  );
}
