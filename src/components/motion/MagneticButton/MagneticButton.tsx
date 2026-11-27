"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { FINE_POINTER_QUERY, gsap, REDUCED_MOTION_QUERY } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  /** O elemento interativo real (Link, button, a). A semântica fica nele. */
  children: ReactNode;
  className?: string;
  /** Intensidade da atração (0–1). */
  strength?: number;
  /** Raio de ativação como múltiplo do maior lado do elemento. */
  radius?: number;
}

/**
 * Envolve um elemento interativo e o "puxa" levemente em direção ao cursor.
 * Não altera a semântica nem a ordem de foco; desativado em touch e com
 * movimento reduzido.
 */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
  radius = 1,
}: MagneticButtonProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia(FINE_POINTER_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);
    let cleanup: (() => void) | null = null;

    const enable = () => {
      if (cleanup) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "elastic.out(1, 0.5)" });
      let active = false;

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const rect = el.getBoundingClientRect();
        const offsetX = gsap.getProperty(el, "x") as number;
        const offsetY = gsap.getProperty(el, "y") as number;
        const cx = rect.left - offsetX + rect.width / 2;
        const cy = rect.top - offsetY + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const limit = Math.max(rect.width, rect.height) * radius;

        if (Math.hypot(dx, dy) < limit) {
          active = true;
          xTo(dx * strength);
          yTo(dy * strength);
        } else if (active) {
          active = false;
          xTo(0);
          yTo(0);
        }
      };

      const reset = () => {
        active = false;
        xTo(0);
        yTo(0);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", reset);

      cleanup = () => {
        window.removeEventListener("pointermove", onMove);
        document.documentElement.removeEventListener("mouseleave", reset);
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: "transform" });
        cleanup = null;
      };
    };

    const sync = () => {
      if (fine.matches && !reduced.matches) enable();
      else cleanup?.();
    };

    sync();
    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);

    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
      cleanup?.();
    };
  }, [strength, radius]);

  return (
    <span ref={ref} className={cn("inline-flex will-change-transform", className)}>
      {children}
    </span>
  );
}
