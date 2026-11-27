"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";
import { Monogram } from "@/components/brand/Monogram";

/**
 * Cena da 404: monograma e numeral reagem ao ponteiro (parallax).
 * Sem ponteiro fino ou com movimento reduzido, permanece estática.
 */
export function NotFoundScene({ children }: { children: ReactNode }) {
  const sceneRef = useRef<HTMLDivElement>(null);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const scene = sceneRef.current;
    if (!scene || event.pointerType !== "mouse") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = scene.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    scene.style.setProperty("--mx", x.toFixed(3));
    scene.style.setProperty("--my", y.toFixed(3));
  }

  function handlePointerLeave() {
    sceneRef.current?.style.setProperty("--mx", "0");
    sceneRef.current?.style.setProperty("--my", "0");
  }

  return (
    <div
      ref={sceneRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="nf-scene bg-grain-dark relative flex min-h-dvh flex-col justify-center overflow-hidden pb-16 pt-[calc(var(--header-h)+2rem)] text-off-white"
    >
      <p
        aria-hidden="true"
        className="nf-layer font-condensed pointer-events-none absolute -right-[4vw] top-1/2 select-none text-[clamp(14rem,48vw,46rem)] font-bold leading-none text-off-white/[0.06]"
        style={{
          transform:
            "translate3d(calc(var(--mx) * -3rem), calc(-50% + var(--my) * -2rem), 0)",
        }}
      >
        404
      </p>

      <div className="section-wrap relative">
        <div
          className="nf-layer mb-10 w-[clamp(5rem,12vw,9rem)] text-neon-lime"
          style={{
            transform:
              "translate3d(calc(var(--mx) * 2.5rem), calc(var(--my) * 2.5rem), 0) rotate(calc(var(--mx) * 14deg))",
          }}
        >
          <Monogram size={144} tile={false} title="" className="h-auto w-full" />
        </div>
        {children}
      </div>
    </div>
  );
}
