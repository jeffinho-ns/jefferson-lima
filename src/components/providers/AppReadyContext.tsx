"use client";

import { createContext, useContext } from "react";

/**
 * `true` quando o preloader terminou (ou foi ignorado).
 * Componentes de animação de entrada (ex.: TextReveal) aguardam este sinal.
 */
export const AppReadyContext = createContext<boolean>(true);

export function useAppReady(): boolean {
  return useContext(AppReadyContext);
}
