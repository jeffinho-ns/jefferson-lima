import { gsap } from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { theme } from "@/config/theme";

/**
 * Configurações compartilhadas de movimento (GSAP + utilitários).
 * Mantém duração/easing alinhados com `config/theme.ts` e `globals.css`.
 */

export const MOTION = {
  duration: theme.motion.duration,
  stagger: theme.motion.stagger,
  ease: {
    /** cubic-bezier(0.65, 0.05, 0, 1) — registrado como CustomEase "cinematic". */
    cinematic: "cinematic",
    out: "power3.out",
    inOut: "power3.inOut",
    expoOut: "expo.out",
    linear: "none",
  },
} as const;

/** Eventos globais (window) usados para coordenar Preloader, scroll e animações. */
export const MOTION_EVENTS = {
  scrollLock: "jt:scroll-lock",
  preloaderDone: "jt:preloader-done",
} as const;

export interface ScrollLockDetail {
  locked: boolean;
}

let configured = false;

/** Registra plugins/easings e aplica defaults globais do GSAP (idempotente, client-only). */
export function applyGsapDefaults(): void {
  if (configured || typeof window === "undefined") return;
  configured = true;

  gsap.registerPlugin(CustomEase);
  CustomEase.create("cinematic", "0.65, 0.05, 0, 1");

  gsap.defaults({
    duration: MOTION.duration.base,
    ease: MOTION.ease.out,
  });
  gsap.config({ nullTargetWarn: false });
}

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

/** Retorna 0 quando o usuário prefere menos movimento; caso contrário a duração informada. */
export function getDuration(seconds: number): number {
  return prefersReducedMotion() ? 0 : seconds;
}

export function setScrollLocked(locked: boolean): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<ScrollLockDetail>(MOTION_EVENTS.scrollLock, {
      detail: { locked },
    }),
  );
}

export function clamp(value: number, min = 0, max = 1): number {
  return Math.min(max, Math.max(min, value));
}

/** Amortecimento exponencial independente de framerate (lambda maior = mais rápido). */
export function damp(current: number, target: number, lambda: number, dt: number): number {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}
