"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ElementType,
  type ReactNode,
} from "react";
import {
  gsap,
  prefersReducedMotion,
  registerGsap,
  SplitText,
} from "@/lib/gsap";
import { useAppReady } from "@/components/providers/AppReadyContext";

interface TextRevealProps {
  /** Prefira texto simples: o DOM é dividido em linhas pelo SplitText. */
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Atraso inicial em segundos. */
  delay?: number;
  duration?: number;
  /** Atraso entre linhas em segundos. */
  stagger?: number;
  /** Posição do ScrollTrigger (padrão: topo do elemento a 88% da viewport). */
  start?: string;
  /** Anima apenas uma vez. */
  once?: boolean;
}

/**
 * Revela texto linha a linha (máscara + translateY) ao entrar na viewport.
 * - Aguarda o preloader terminar e as fontes carregarem antes de dividir.
 * - SplitText mantém o texto acessível (aria-label) e refaz o split no resize.
 * - Com movimento reduzido, o texto simplesmente aparece.
 */
export function TextReveal({
  children,
  as = "div",
  className,
  delay = 0,
  duration = 1,
  stagger = 0.08,
  start = "top 88%",
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const ready = useAppReady();

  // Evita o flash do texto completo antes da animação (antes da pintura).
  useLayoutEffect(() => {
    const el = ref.current;
    if (el && !prefersReducedMotion()) el.style.visibility = "hidden";
    return () => {
      if (el) el.style.visibility = "";
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !ready) return;

    if (prefersReducedMotion()) {
      el.style.visibility = "";
      return;
    }

    registerGsap();
    let cancelled = false;
    const ctx = gsap.context(() => {}, el);

    const run = async () => {
      try {
        await document.fonts?.ready;
      } catch {
        /* segue sem aguardar fontes */
      }
      if (cancelled) return;

      ctx.add(() => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          linesClass: "text-reveal-line",
          autoSplit: true,
          onSplit: (self) => {
            gsap.set(el, { visibility: "visible" });
            return gsap.from(self.lines, {
              yPercent: 110,
              duration,
              delay,
              stagger,
              ease: "power4.out",
              scrollTrigger: {
                trigger: el,
                start,
                once,
                toggleActions: "play none none none",
              },
            });
          },
        });
      });
    };

    run();

    return () => {
      cancelled = true;
      ctx.revert();
      el.style.visibility = "hidden";
    };
  }, [ready, delay, duration, stagger, start, once]);

  const Tag = as;
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
