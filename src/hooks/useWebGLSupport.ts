"use client";

import { useSyncExternalStore } from "react";

export type GraphicsTier = "high" | "medium" | "low";

let cachedSupport: boolean | null = null;

/** Testa criação de contexto WebGL (uma única vez; resultado em cache). */
export function detectWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (cachedSupport !== null) return cachedSupport;

  try {
    const canvas = document.createElement("canvas");
    const gl =
      (canvas.getContext("webgl2") as WebGL2RenderingContext | null) ??
      (canvas.getContext("webgl") as WebGLRenderingContext | null);
    cachedSupport = Boolean(gl);
    // Libera o contexto de teste imediatamente.
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
  } catch {
    cachedSupport = false;
  }
  return cachedSupport;
}

interface NavigatorHints {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
}

let cachedTier: GraphicsTier | null = null;

/** Heurística simples de capacidade: reduz complexidade em aparelhos modestos. */
export function getGraphicsTier(): GraphicsTier {
  if (typeof window === "undefined") return "medium";
  if (cachedTier) return cachedTier;

  const nav = navigator as Navigator & NavigatorHints;
  const cores = nav.hardwareConcurrency ?? 8;
  const memory = nav.deviceMemory ?? 8;
  const saveData = nav.connection?.saveData === true;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (saveData || cores <= 4 || memory <= 4) cachedTier = "low";
  else if (coarse) cachedTier = "medium";
  else cachedTier = "high";
  return cachedTier;
}

const subscribe = () => () => {};

/**
 * `null` enquanto desconhecido (SSR / antes da hidratação), depois `true | false`.
 * Não usa estado nem efeitos: lê o valor em cache via useSyncExternalStore.
 */
export function useWebGLSupport(): boolean | null {
  return useSyncExternalStore<boolean | null>(subscribe, detectWebGL, () => null);
}

export function useGraphicsTier(): GraphicsTier {
  return useSyncExternalStore<GraphicsTier>(subscribe, getGraphicsTier, () => "medium");
}
