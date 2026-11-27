"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import type { Service } from "@/types";

interface ServicesListProps {
  services: readonly Service[];
  /** Tom do fundo onde a lista é renderizada. */
  tone?: "light" | "dark";
}

/**
 * Lista editorial interativa: hover (mouse), foco ou toque abre o detalhe da linha.
 * Cada linha mantém link real para /servicos/[slug].
 */
export function ServicesList({ services, tone = "light" }: ServicesListProps) {
  const baseId = useId();
  const [activeSlug, setActiveSlug] = useState<string | null>(
    services[0]?.slug ?? null,
  );
  const dark = tone === "dark";

  return (
    <ul>
      {services.map((service, i) => {
        const open = activeSlug === service.slug;
        const panelId = `${baseId}-${service.slug}`;
        return (
          <li
            key={service.slug}
            data-active={open}
            className={`border-t last:border-b ${
              dark ? "border-off-white/20" : "border-carbon-black/20"
            }`}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setActiveSlug(service.slug);
            }}
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setActiveSlug(open ? null : service.slug)}
              onFocus={() => setActiveSlug(service.slug)}
              className="group flex w-full items-center gap-4 py-5 text-left sm:gap-8 sm:py-6"
            >
              <span className="eyebrow w-8 shrink-0 sm:w-12">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`title-lg flex-1 transition-[transform,color] duration-700 ease-[var(--ease-cinematic)] ${
                  open ? "translate-x-2 sm:translate-x-4" : ""
                }`}
              >
                <span className={open && !dark ? "accent-on-light" : ""}>
                  {service.title}
                </span>
              </span>
              <span
                aria-hidden="true"
                className={`grid size-10 shrink-0 place-items-center rounded-full border transition-[transform,background-color] duration-500 ${
                  dark ? "border-off-white/40" : "border-carbon-black/40"
                } ${open ? "rotate-45 !bg-neon-lime !text-carbon-black !border-neon-lime" : ""}`}
              >
                <Plus className="size-4" strokeWidth={2.5} />
              </span>
            </button>

            <div id={panelId} className="expand" data-open={open} role="region" aria-label={service.title}>
              <div>
                <div className="grid gap-8 pb-10 pl-12 sm:pl-20 lg:grid-cols-12 lg:gap-12">
                  <div className="lg:col-span-5">
                    <p className="text-base leading-relaxed opacity-80">
                      {service.description}
                    </p>
                    <p className="eyebrow mt-6">Para quem</p>
                    <p className="mt-2 text-sm leading-relaxed opacity-80">
                      {service.audience}
                    </p>
                  </div>
                  <ul className="space-y-2.5 lg:col-span-4">
                    {service.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex gap-3 text-sm leading-relaxed"
                      >
                        <span
                          aria-hidden="true"
                          className={`mt-[0.55em] h-px w-5 shrink-0 ${
                            dark ? "bg-neon-lime" : "bg-carbon-black"
                          }`}
                        />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-col items-start gap-4 lg:col-span-3 lg:items-end">
                    <Link
                      href={`/servicos/${service.slug}`}
                      tabIndex={open ? 0 : -1}
                      className="cta-link"
                    >
                      Ver serviço
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </Link>
                    <Link
                      href="/contato"
                      tabIndex={open ? 0 : -1}
                      className={`pill ${dark ? "pill-outline" : "pill-dark"}`}
                    >
                      {service.cta}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
