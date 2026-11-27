"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Monogram } from "@/components/brand/Monogram";
import { NAVIGATION_ID } from "@/components/layout/Navigation/Navigation";
import { MagneticButton } from "@/components/motion/MagneticButton/MagneticButton";
import { useNavigation } from "@/components/providers/NavigationContext";
import { cn } from "@/lib/utils";

const DARK_SELECTOR =
  ".section-dark, .section-graphite, .bg-grain-dark, [data-header-tone='dark']";

export function Header() {
  const { isOpen, toggle } = useNavigation();
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    let raf = 0;

    const check = () => {
      raf = 0;
      const header = headerRef.current;
      if (!header) return;
      const y = Math.min(36, header.offsetHeight / 2);
      const stack = document.elementsFromPoint(window.innerWidth / 2, y);
      const behind = stack.find((el) => !header.contains(el));
      setOnDark(Boolean(behind?.closest(DARK_SELECTOR)));
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(check);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-500 ease-[var(--ease-cinematic)]",
        onDark ? "text-off-white" : "text-carbon-black",
      )}
      style={{ padding: "var(--gutter)" }}
    >
      <div
        className="relative flex items-center justify-between"
        style={{ height: "var(--header-btn)" }}
      >
        {/* Esquerda: lockup tipográfico + ponto lime */}
        <Link
          href="/"
          className="group relative z-10 font-[family-name:var(--font-condensed)] font-bold uppercase leading-[0.88] tracking-[-0.02em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-lime max-md:hidden"
          style={{ fontSize: "clamp(1.05rem, 1.55vw, 1.55rem)" }}
        >
          <span className="block">Jefferson</span>
          <span className="inline-flex items-end gap-[0.18em]">
            Teixeira
            <span
              aria-hidden
              className="mb-[0.12em] inline-block size-[0.28em] shrink-0 rounded-full bg-neon-lime"
            />
          </span>
        </Link>

        {/* Centro: monograma JT */}
        <Link
          href="/"
          aria-label="Jefferson Teixeira — página inicial"
          className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-lime"
        >
          <Monogram
            title=""
            className="h-[calc(var(--header-btn)*0.62)] w-[calc(var(--header-btn)*0.62)]"
          />
        </Link>

        {/* Direita: SERVIÇOS + menu quadrado com borda */}
        <div className="relative z-10 flex items-center gap-[0.55rem]">
          <MagneticButton className="max-sm:hidden">
            <Link
              href="/servicos"
              className={cn(
                "inline-flex h-[var(--header-btn)] items-center gap-2 px-[1.15em]",
                "bg-neon-lime text-carbon-black",
                "font-[family-name:var(--font-condensed)] text-[0.95rem] font-bold uppercase tracking-[0.08em]",
                "rounded-[0.45rem] transition-transform duration-500 ease-[var(--ease-cinematic)]",
                "hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-carbon-black",
              )}
            >
              Serviços
              <ArrowUpRight aria-hidden className="size-[1em] stroke-[2.25]" />
            </Link>
          </MagneticButton>

          <button
            type="button"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-controls={NAVIGATION_ID}
            aria-haspopup="dialog"
            aria-label={isOpen ? "Fechar menu" : "Abrir menu"}
            className={cn(
              "group flex size-[var(--header-btn)] flex-col items-center justify-center gap-[7px]",
              "rounded-[0.45rem] border-[1.5px] border-current bg-transparent",
              "transition-[background-color,color,border-color] duration-500 ease-[var(--ease-cinematic)]",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-lime",
              onDark && "border-off-white/80",
            )}
          >
            <span
              className={cn(
                "block h-[2px] bg-current transition-[width,transform] duration-500 ease-[var(--ease-cinematic)]",
                isOpen ? "w-5 translate-y-[4.5px] rotate-45" : "w-6 group-hover:w-4",
              )}
            />
            <span
              className={cn(
                "block h-[2px] bg-current transition-[width,transform,opacity] duration-500 ease-[var(--ease-cinematic)]",
                isOpen
                  ? "w-5 -translate-y-[4.5px] -rotate-45"
                  : "w-3.5 group-hover:w-6",
              )}
            />
          </button>
        </div>
      </div>
    </header>
  );
}
