"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

/** Zonas escuras atualmente sob o header (faixa superior da viewport). */
const activeZones = new Set<Element>();

function syncHeaderTheme() {
  const root = document.documentElement;
  if (activeZones.size > 0) {
    root.dataset.headerTheme = "dark";
  } else {
    delete root.dataset.headerTheme;
  }
}

type HeaderThemeZoneProps = ComponentPropsWithoutRef<"section"> & {
  as?: "section" | "header";
  /** Quando `false`, não altera o tema do header (seção clara). */
  enabled?: boolean;
};

/**
 * Wrapper de seção escura: enquanto ela estiver sob o header fixo,
 * marca `<html data-header-theme="dark">` para o header usar texto claro.
 */
export function HeaderThemeZone({
  as: Tag = "section",
  enabled = true,
  children,
  ...props
}: HeaderThemeZoneProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !enabled) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) activeZones.add(element);
        else activeZones.delete(element);
        syncHeaderTheme();
      },
      // Observa apenas a faixa superior (altura do header) da viewport.
      { rootMargin: "0px 0px -88% 0px" },
    );

    observer.observe(element);
    return () => {
      observer.disconnect();
      activeZones.delete(element);
      syncHeaderTheme();
    };
  }, [enabled]);

  return (
    <Tag ref={ref as never} {...props}>
      {children}
    </Tag>
  );
}
