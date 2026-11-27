"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, X } from "lucide-react";
import { Monogram } from "@/components/brand/Monogram";
import { useNavigation } from "@/components/providers/NavigationContext";
import { siteConfig } from "@/config/site";
import { navigation } from "@/data/navigation";
import { activeSocialLinks } from "@/data/social-links";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export const NAVIGATION_ID = "site-navigation";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"]), input, select, textarea';

export function Navigation() {
  const { isOpen, close } = useNavigation();
  const pathname = usePathname();

  const rootRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const mountedRef = useRef(false);

  /* ---------- Animações GSAP de abrir / fechar ---------- */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const items = root.querySelectorAll<HTMLElement>("[data-nav-item]");
    const fades = root.querySelectorAll<HTMLElement>("[data-nav-fade]");
    const reduced = prefersReducedMotion();
    const isFirst = !mountedRef.current;
    mountedRef.current = true;

    tlRef.current?.kill();

    if (isOpen) {
      restoreFocusRef.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      document.body.classList.add("menu-open");

      const tl = gsap.timeline({
        onComplete: () => closeRef.current?.focus({ preventScroll: true }),
      });
      tlRef.current = tl;

      if (reduced) {
        gsap.set([items, fades], { clearProps: "all" });
        gsap.set(root, { clipPath: "inset(0% 0% 0% 0%)" });
        tl.to(root, { autoAlpha: 1, duration: 0.2, ease: "none" });
        closeRef.current?.focus({ preventScroll: true });
      } else {
        gsap.set(root, { autoAlpha: 1, clipPath: "inset(0% 0% 100% 0%)" });
        gsap.set(items, { yPercent: 110, autoAlpha: 1 });
        gsap.set(fades, { autoAlpha: 0, y: 16 });
        tl.to(root, {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.8,
          ease: "power4.inOut",
        })
          .to(
            items,
            { yPercent: 0, duration: 0.9, ease: "power4.out", stagger: 0.06 },
            "-=0.4",
          )
          .to(
            fades,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.05,
            },
            "-=0.7",
          );
        // Foco imediato no botão fechar (não espera a timeline terminar).
        closeRef.current?.focus({ preventScroll: true });
      }
    } else {
      document.body.classList.remove("menu-open");
      if (isFirst) return; // estado inicial já é "fechado"

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(root, { autoAlpha: 0 });
        },
      });
      tlRef.current = tl;

      if (reduced) {
        tl.to(root, { autoAlpha: 0, duration: 0.2, ease: "none" });
      } else {
        tl.to([items, fades], {
          autoAlpha: 0,
          duration: 0.25,
          ease: "power2.in",
        }).to(
          root,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.65,
            ease: "power4.inOut",
          },
          "-=0.1",
        );
      }

      // Devolve o foco ao elemento que abriu o menu.
      const target = restoreFocusRef.current;
      restoreFocusRef.current = null;
      if (target && document.contains(target)) {
        target.focus({ preventScroll: true });
      }
    }
  }, [isOpen]);

  // Limpeza ao desmontar.
  useEffect(() => {
    return () => {
      tlRef.current?.kill();
      document.body.classList.remove("menu-open");
    };
  }, []);

  /* ---------- ESC + focus trap ---------- */
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;

      const root = rootRef.current;
      if (!root) return;
      const focusables = [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => !el.hasAttribute("disabled") && el.offsetParent !== null,
      );
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (!root.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, close]);

  const isActive = (href: string) => {
    if (href.includes("#")) return false;
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  };

  return (
    <div
      ref={rootRef}
      id={NAVIGATION_ID}
      role="dialog"
      aria-modal="true"
      aria-label="Menu principal"
      aria-hidden={!isOpen}
      inert={!isOpen}
      className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-carbon-black text-off-white"
      style={{ visibility: "hidden", clipPath: "inset(0% 0% 100% 0%)" }}
    >
      {/* Barra superior */}
      <div className="container-pad flex h-[var(--header-h)] shrink-0 items-center justify-between">
        <Link
          href="/"
          onClick={close}
          aria-label="Jefferson Teixeira — página inicial"
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-lime"
        >
          <Monogram size={40} />
        </Link>

        <button
          ref={closeRef}
          type="button"
          onClick={close}
          aria-label="Fechar menu"
          className="group flex items-center gap-3 font-[family-name:var(--font-condensed)] text-sm font-bold uppercase tracking-[0.12em] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-lime"
        >
          Fechar
          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-off-white/30 transition-colors group-hover:border-neon-lime group-hover:bg-neon-lime group-hover:text-carbon-black">
            <X size={18} strokeWidth={2.25} aria-hidden="true" />
          </span>
        </button>
      </div>

      {/* Conteúdo */}
      <div className="container-pad grid flex-1 content-between gap-12 py-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <nav aria-label="Principal">
          <ul className="flex flex-col">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="overflow-hidden border-t border-off-white/10 last:border-b">
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className="group flex items-baseline gap-4 py-2 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-neon-lime sm:gap-8"
                  >
                    <span
                      data-nav-item
                      className="block w-10 font-[family-name:var(--font-mono)] text-xs tracking-[0.14em] text-off-white/50 sm:w-14"
                    >
                      {item.index}—
                    </span>
                    <span
                      data-nav-item
                      className={cn(
                        "block font-[family-name:var(--font-condensed)] text-[clamp(2.5rem,8vh,6rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em] transition-[color,transform] duration-500 ease-[var(--ease-cinematic)] group-hover:translate-x-3 group-hover:text-neon-lime",
                        active && "text-neon-lime",
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex flex-col gap-8 lg:w-72 lg:pb-2">
          <p data-nav-fade className="text-eyebrow !text-neon-lime">
            {siteConfig.availability}
          </p>

          {activeSocialLinks.length > 0 && (
            <div data-nav-fade>
              <h2 className="text-eyebrow mb-3 !text-off-white/50">Redes</h2>
              <ul className="flex flex-col gap-1">
                {activeSocialLinks.map((link) => (
                  <li key={link.platform}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 py-1 font-[family-name:var(--font-condensed)] text-xl font-bold uppercase tracking-[0.04em] transition-colors hover:text-neon-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-lime"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={18}
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                      <span className="sr-only">(abre em nova aba)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p data-nav-fade className="text-eyebrow !text-off-white/50">
            {siteConfig.role}
          </p>
        </div>
      </div>
    </div>
  );
}
