"use client";

import { useSyncExternalStore } from "react";

/** Ano usado no prerender; o cliente atualiza para o ano real após hidratar. */
const FALLBACK_YEAR = 2026;

const subscribe = () => () => {};
const getClientYear = () => new Date().getFullYear();
// Evita ler a data durante o prerender (cacheComponents).
const getServerYear = () => FALLBACK_YEAR;

export function CurrentYear() {
  const year = useSyncExternalStore(subscribe, getClientYear, getServerYear);
  return <>{year}</>;
}
