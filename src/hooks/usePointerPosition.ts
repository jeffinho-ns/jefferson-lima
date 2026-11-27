"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

export interface PointerState {
  /** 0..1 relativo ao elemento, origem no canto inferior esquerdo (convenção UV/GLSL). */
  x: number;
  y: number;
  /** Ponteiro sobre o elemento (mouse hover, ou toque ativo / recém-liberado). */
  inside: boolean;
  pointerType: "mouse" | "touch" | "pen";
  /** `performance.now()` do último movimento. */
  lastMove: number;
}

/**
 * Fonte de estado do ponteiro. `state` é mutável e lido em useFrame/rAF
 * (não causa re-render); `subscribe` notifica a cada mudança (útil para
 * `invalidate()` em frameloop="demand").
 */
export class PointerSource {
  readonly state: PointerState = {
    x: 0.5,
    y: 0.5,
    inside: false,
    pointerType: "mouse",
    lastMove: 0,
  };
  private listeners = new Set<() => void>();

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  notify = (): void => {
    this.listeners.forEach((fn) => fn());
  };
}

interface Options {
  /** Quanto tempo o decode permanece após levantar o dedo (ms). */
  touchReleaseMs?: number;
}

/**
 * Rastreia o ponteiro relativo a um elemento SEM re-renderizar o React.
 * - Mouse: hover/move/leave.
 * - Toque: pointerdown/move; vertical scroll nativo continua funcionando
 *   (o navegador dispara `pointercancel` e liberamos o estado). Nunca chama
 *   preventDefault — combine com `touch-action: pan-y` no elemento.
 */
export function usePointerPosition<T extends HTMLElement = HTMLDivElement>(
  options: Options = {},
): { ref: RefObject<T | null>; pointer: PointerSource } {
  const { touchReleaseMs = 900 } = options;
  const ref = useRef<T>(null);
  const [pointer] = useState(() => new PointerSource());

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let releaseTimer: ReturnType<typeof setTimeout> | undefined;
    const { state, notify } = pointer;

    const update = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      state.x = (e.clientX - rect.left) / rect.width;
      state.y = 1 - (e.clientY - rect.top) / rect.height;
      state.pointerType = (e.pointerType as PointerState["pointerType"]) || "mouse";
      state.lastMove = performance.now();
    };

    const enter = (e: PointerEvent) => {
      clearTimeout(releaseTimer);
      update(e);
      state.inside = true;
      notify();
    };

    const move = (e: PointerEvent) => {
      clearTimeout(releaseTimer);
      if (e.pointerType !== "mouse") state.inside = true;
      update(e);
      notify();
    };

    const leave = () => {
      clearTimeout(releaseTimer);
      state.inside = false;
      notify();
    };

    // Em toque, `pointerleave` dispara logo após o `pointerup`; a liberação fica a cargo do timer.
    const leaveMouse = (e: PointerEvent) => {
      if (e.pointerType === "mouse") leave();
    };

    const up = (e: PointerEvent) => {
      if (e.pointerType === "mouse") return;
      clearTimeout(releaseTimer);
      releaseTimer = setTimeout(leave, touchReleaseMs);
    };

    const opts: AddEventListenerOptions = { passive: true };
    el.addEventListener("pointerenter", enter, opts);
    el.addEventListener("pointerdown", enter, opts);
    el.addEventListener("pointermove", move, opts);
    el.addEventListener("pointerleave", leaveMouse, opts);
    el.addEventListener("pointerup", up, opts);
    el.addEventListener("pointercancel", leave, opts);
    window.addEventListener("blur", leave);

    return () => {
      clearTimeout(releaseTimer);
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointerdown", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leaveMouse);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", leave);
      window.removeEventListener("blur", leave);
    };
  }, [pointer, touchReleaseMs]);

  return { ref, pointer };
}
