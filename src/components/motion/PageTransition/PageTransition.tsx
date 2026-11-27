"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Renderiza o `<main id="main-content">` e aplica uma entrada sutil
 * (fade + deslocamento curto + barra lime no topo) a cada mudança de rota.
 *
 * Acessibilidade / histórico:
 * - Não bloqueia nem atrasa a navegação (sem animação de saída).
 * - Não remonta a árvore; back/forward e scroll restoration continuam do Next.
 * - Move o foco para o <main> e anuncia o título da página em uma região live.
 * - Com movimento reduzido, apenas foco + anúncio (sem animação).
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();
  const mainRef = useRef<HTMLElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const announceRef = useRef<HTMLDivElement>(null);
  const previousPath = useRef(pathname);

  useLayoutEffect(() => {
    if (previousPath.current === pathname) return; // primeira renderização
    previousPath.current = pathname;

    const main = mainRef.current;
    const bar = barRef.current;
    if (!main) return;

    const reduced = prefersReducedMotion();
    const tweens: gsap.core.Animation[] = [];

    if (!reduced) {
      tweens.push(
        gsap.fromTo(
          main,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power3.out",
            // Remove transform para não criar containing block de `fixed`.
            clearProps: "transform,opacity",
          },
        ),
      );
      if (bar) {
        tweens.push(
          gsap
            .timeline()
            .fromTo(
              bar,
              { scaleX: 0, autoAlpha: 1, transformOrigin: "0% 50%" },
              { scaleX: 1, duration: 0.5, ease: "power3.inOut" },
            )
            .to(bar, { autoAlpha: 0, duration: 0.25 }),
        );
      }
    }

    // Foco e anúncio para leitores de tela (exceto navegação por âncora).
    if (!window.location.hash) {
      main.focus({ preventScroll: true });
    }
    const timer = window.setTimeout(() => {
      if (announceRef.current) {
        announceRef.current.textContent = document.title
          ? `Página carregada: ${document.title}`
          : "Página carregada";
      }
    }, 150);

    return () => {
      window.clearTimeout(timer);
      tweens.forEach((t) => t.kill());
    };
  }, [pathname]);

  return (
    <>
      <div
        ref={barRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[3px] bg-neon-lime"
        style={{ visibility: "hidden", transform: "scaleX(0)" }}
      />
      <div
        ref={announceRef}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />
      <main
        ref={mainRef}
        id="main-content"
        tabIndex={-1}
        className={className ?? "flex flex-1 flex-col outline-none"}
      >
        {children}
      </main>
    </>
  );
}
