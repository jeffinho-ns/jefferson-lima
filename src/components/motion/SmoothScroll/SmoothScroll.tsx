"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import {
  gsap,
  prefersReducedMotion,
  registerGsap,
  ScrollTrigger,
} from "@/lib/gsap";

interface ScrollToOptions {
  offset?: number;
  immediate?: boolean;
  duration?: number;
}

interface SmoothScrollContextValue {
  scrollTo: (
    target: number | string | HTMLElement,
    options?: ScrollToOptions,
  ) => void;
}

const SmoothScrollContext = createContext<SmoothScrollContextValue>({
  scrollTo: (target, options) => {
    if (typeof target === "number") {
      window.scrollTo({ top: target + (options?.offset ?? 0), behavior: "auto" });
    }
  },
});

export function useSmoothScroll(): SmoothScrollContextValue {
  return useContext(SmoothScrollContext);
}

interface SmoothScrollProps {
  children: ReactNode;
  /** Pausa o scroll (menu aberto, preloader ativo). */
  paused?: boolean;
}

/**
 * Lenis sincronizado com o ticker do GSAP / ScrollTrigger.
 * Não é inicializado quando o usuário prefere movimento reduzido.
 */
export function SmoothScroll({ children, paused = false }: SmoothScrollProps) {
  const lenisRef = useRef<Lenis | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (paused) lenis.stop();
    else lenis.start();
  }, [paused]);

  useEffect(() => {
    registerGsap();

    let lenis: Lenis | null = null;
    let tick: ((time: number) => void) | null = null;

    const setup = () => {
      if (lenis) return;
      lenis = new Lenis({
        autoRaf: false,
        lerp: 0.1,
        smoothWheel: true,
        // Mantém o scroll nativo em touch (melhor UX e a11y).
        syncTouch: false,
      });
      lenisRef.current = lenis;
      if (pausedRef.current) lenis.stop();

      lenis.on("scroll", ScrollTrigger.update);
      const instance = lenis;
      tick = (time: number) => instance.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    };

    const teardown = () => {
      if (tick) gsap.ticker.remove(tick);
      tick = null;
      lenis?.destroy();
      lenis = null;
      lenisRef.current = null;
    };

    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (mql.matches) teardown();
      else setup();
    };
    sync();
    mql.addEventListener("change", sync);

    return () => {
      mql.removeEventListener("change", sync);
      teardown();
    };
  }, []);

  const scrollTo = useCallback<SmoothScrollContextValue["scrollTo"]>(
    (target, options = {}) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, {
          offset: options.offset,
          immediate: options.immediate,
          duration: options.duration,
        });
        return;
      }

      let top = 0;
      if (typeof target === "number") top = target;
      else {
        const el =
          typeof target === "string"
            ? document.querySelector<HTMLElement>(target)
            : target;
        if (el) top = el.getBoundingClientRect().top + window.scrollY;
      }
      window.scrollTo({
        top: top + (options.offset ?? 0),
        behavior: prefersReducedMotion() || options.immediate ? "auto" : "smooth",
      });
    },
    [],
  );

  const value = useMemo(() => ({ scrollTo }), [scrollTo]);

  return (
    <SmoothScrollContext.Provider value={value}>
      {children}
    </SmoothScrollContext.Provider>
  );
}
