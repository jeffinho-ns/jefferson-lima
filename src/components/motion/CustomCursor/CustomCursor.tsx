"use client";

import { useEffect, useRef } from "react";
import {
  FINE_POINTER_QUERY,
  gsap,
  REDUCED_MOTION_QUERY,
} from "@/lib/gsap";

export type CursorState =
  | "default"
  | "hover"
  | "link"
  | "view-project"
  | "decode";

/**
 * Como usar nos componentes:
 *   data-cursor="hover" | "link" | "view-project" | "decode"
 * Links e botões sem data-cursor usam o estado "link" automaticamente.
 */
const STATE_CONFIG: Record<
  CursorState,
  {
    size: number;
    bg: string;
    border: string;
    color: string;
    label: string | null;
  }
> = {
  default: {
    size: 12,
    bg: "#080808",
    border: "#F8F8F5",
    color: "#080808",
    label: null,
  },
  hover: {
    size: 44,
    bg: "rgba(210,255,0,0.35)",
    border: "#080808",
    color: "#080808",
    label: null,
  },
  link: {
    size: 56,
    bg: "#D2FF00",
    border: "#080808",
    color: "#080808",
    label: null,
  },
  "view-project": {
    size: 112,
    bg: "#D2FF00",
    border: "#080808",
    color: "#080808",
    label: "VIEW PROJECT",
  },
  decode: {
    size: 96,
    bg: "#080808",
    border: "#D2FF00",
    color: "#D2FF00",
    label: "DECODE",
  },
};

const INTERACTIVE_SELECTOR =
  'a[href], button, [role="button"], summary, label[for], input, textarea, select';

function resolveState(target: EventTarget | null): CursorState {
  if (!(target instanceof Element)) return "default";

  const marked = target.closest<HTMLElement>("[data-cursor]");
  const value = marked?.dataset.cursor as CursorState | undefined;
  if (value && value in STATE_CONFIG) return value;

  if (target.closest(INTERACTIVE_SELECTOR)) return "link";
  return "default";
}

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const circle = circleRef.current;
    const label = labelRef.current;
    if (!root || !circle || !label) return;

    const fine = window.matchMedia(FINE_POINTER_QUERY);
    const reduced = window.matchMedia(REDUCED_MOTION_QUERY);

    let cleanup: (() => void) | null = null;

    const enable = () => {
      if (cleanup) return;

      document.body.classList.add("has-custom-cursor");

      const xTo = gsap.quickTo(root, "x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(root, "y", { duration: 0.35, ease: "power3.out" });

      let current: CursorState = "default";
      let visible = false;
      let pressed = false;

      const apply = (next: CursorState) => {
        current = next;
        const cfg = STATE_CONFIG[next];
        gsap.to(circle, {
          width: cfg.size,
          height: cfg.size,
          backgroundColor: cfg.bg,
          borderColor: cfg.border,
          scale: pressed ? 0.9 : 1,
          duration: 0.4,
          ease: "power3.out",
          overwrite: "auto",
        });
        if (cfg.label) {
          label.textContent = cfg.label;
          label.style.color = cfg.color;
        }
        gsap.to(label, {
          autoAlpha: cfg.label ? 1 : 0,
          duration: cfg.label ? 0.25 : 0.12,
          delay: cfg.label ? 0.08 : 0,
          overwrite: "auto",
        });
      };

      const show = (visibleNow: boolean) => {
        if (visible === visibleNow) return;
        visible = visibleNow;
        gsap.to(root, {
          autoAlpha: visibleNow ? 1 : 0,
          duration: 0.2,
          overwrite: "auto",
        });
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        if (!visible) {
          gsap.set(root, { x: e.clientX, y: e.clientY });
          show(true);
        }
        xTo(e.clientX);
        yTo(e.clientY);
      };

      const onOver = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const next = resolveState(e.target);
        if (next !== current) apply(next);
      };

      const onDown = () => {
        pressed = true;
        gsap.to(circle, { scale: 0.9, duration: 0.15, overwrite: "auto" });
      };
      const onUp = () => {
        pressed = false;
        gsap.to(circle, { scale: 1, duration: 0.3, overwrite: "auto" });
      };
      const onLeave = () => show(false);
      const onEnter = () => show(true);
      let scrollRaf = 0;
      const onScrollReset = () => {
        if (scrollRaf) return;
        scrollRaf = requestAnimationFrame(() => {
          scrollRaf = 0;
          if (!visible) return;
          // Conteúdo se move sob o cursor parado; reavalia o alvo.
          const el = document.elementFromPoint(
            gsap.getProperty(root, "x") as number,
            gsap.getProperty(root, "y") as number,
          );
          const next = resolveState(el);
          if (next !== current) apply(next);
        });
      };

      gsap.set(circle, {
        width: STATE_CONFIG.default.size,
        height: STATE_CONFIG.default.size,
        backgroundColor: STATE_CONFIG.default.bg,
        borderColor: STATE_CONFIG.default.border,
        xPercent: -50,
        yPercent: -50,
      });

      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerover", onOver, { passive: true });
      window.addEventListener("pointerdown", onDown, { passive: true });
      window.addEventListener("pointerup", onUp, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
      document.documentElement.addEventListener("mouseenter", onEnter);
      window.addEventListener("scroll", onScrollReset, { passive: true });

      cleanup = () => {
        window.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerover", onOver);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointerup", onUp);
        document.documentElement.removeEventListener("mouseleave", onLeave);
        document.documentElement.removeEventListener("mouseenter", onEnter);
        window.removeEventListener("scroll", onScrollReset);
        if (scrollRaf) cancelAnimationFrame(scrollRaf);
        gsap.killTweensOf([root, circle, label]);
        gsap.set(root, { autoAlpha: 0 });
        document.body.classList.remove("has-custom-cursor");
        cleanup = null;
      };
    };

    const sync = () => {
      // Desativa em touch / sem ponteiro fino e com movimento reduzido.
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
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] opacity-0"
      style={{ visibility: "hidden" }}
    >
      <div
        ref={circleRef}
        className="flex items-center justify-center rounded-full border"
        style={{ width: 12, height: 12 }}
      >
        <span
          ref={labelRef}
          className="px-2 text-center font-[family-name:var(--font-condensed)] text-[0.7rem] font-bold uppercase leading-none tracking-[0.1em] whitespace-nowrap opacity-0"
          style={{ visibility: "hidden" }}
        />
      </div>
    </div>
  );
}
