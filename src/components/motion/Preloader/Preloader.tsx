"use client";

import { useEffect, useRef, useState } from "react";
import { Monogram } from "@/components/brand/Monogram";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

const SESSION_KEY = "jt:preloader-seen";
const MONOGRAM_SRC = "/images/brand/jt-monogram.svg";

const MESSAGES = {
  start: "INITIALIZING EXPERIENCE",
  middle: "LOADING DIGITAL IDENTITY",
  end: "SYSTEM READY",
} as const;

interface PreloaderProps {
  /** Chamado quando o preloader terminou (ou foi ignorado). */
  onComplete?: () => void;
  /** Cor de fundo. */
  variant?: "carbon" | "offwhite";
  /** Imagens essenciais adicionais (acima da dobra). */
  images?: readonly string[];
  /** Tempo máximo por recurso (ms). Recursos lentos/falhos não bloqueiam. */
  resourceTimeout?: number;
  /** Tempo máximo total (ms). */
  maxDuration?: number;
  /** Mostra apenas na primeira visita da sessão. */
  oncePerSession?: boolean;
}

/** Resolve sempre — sucesso, erro ou timeout — para nunca bloquear o site. */
function settle(promise: Promise<unknown>, timeout: number): Promise<void> {
  return new Promise((resolve) => {
    const timer = window.setTimeout(resolve, timeout);
    promise.then(
      () => {
        window.clearTimeout(timer);
        resolve();
      },
      () => {
        window.clearTimeout(timer);
        resolve();
      },
    );
  });
}

function loadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

function collectEssentialImages(extra: readonly string[]): string[] {
  const urls = new Set<string>([MONOGRAM_SRC, ...extra]);
  document
    .querySelectorAll<HTMLImageElement>(
      'img[data-essential], img[fetchpriority="high"]',
    )
    .forEach((img) => {
      const src = img.currentSrc || img.src;
      if (src && !img.complete) urls.add(src);
    });
  return [...urls];
}

export function Preloader({
  onComplete,
  variant = "carbon",
  images = [],
  resourceTimeout = 4000,
  maxDuration = 6000,
  oncePerSession = true,
}: PreloaderProps) {
  const [visible, setVisible] = useState(true);

  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const messageRef = useRef<HTMLSpanElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let cancelled = false;
    let finished = false;
    const timeouts: number[] = [];
    const reduced = prefersReducedMotion();
    const state = { value: 0 };
    let exitTween: gsap.core.Tween | gsap.core.Timeline | null = null;
    let progressTween: gsap.core.Tween | null = null;
    let lastStage: keyof typeof MESSAGES | null = null;

    const finish = () => {
      if (cancelled || finished) return;
      finished = true;
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* storage indisponível — ignora */
      }
      document.body.classList.remove("preloader-active");
      setVisible(false);
      onCompleteRef.current?.();
    };

    const exit = () => {
      if (cancelled) return;
      if (reduced) {
        exitTween = gsap.to(root, {
          autoAlpha: 0,
          duration: 0.2,
          ease: "none",
          onComplete: finish,
        });
        return;
      }
      exitTween = gsap
        .timeline({ onComplete: finish })
        .to(contentRef.current, {
          yPercent: -12,
          autoAlpha: 0,
          duration: 0.35,
          ease: "power2.in",
        })
        .to(
          root,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.7,
            ease: "power4.inOut",
          },
          "-=0.15",
        );
    };

    const render = () => {
      const pct = Math.round(state.value);
      if (counterRef.current) {
        counterRef.current.textContent = String(pct).padStart(3, "0");
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${state.value / 100})`;
      }
      if (progressRef.current) {
        progressRef.current.setAttribute("aria-valuenow", String(pct));
      }
      const stage: keyof typeof MESSAGES =
        pct >= 100 ? "end" : pct >= 45 ? "middle" : "start";
      if (stage !== lastStage && messageRef.current) {
        lastStage = stage;
        messageRef.current.textContent = MESSAGES[stage];
      }
    };

    const setTarget = (target: number) => {
      progressTween?.kill();
      progressTween = gsap.to(state, {
        value: target,
        duration: reduced ? 0 : 0.35,
        ease: "power1.out",
        onUpdate: render,
        onComplete: () => {
          render();
          if (target >= 100) {
            timeouts.push(window.setTimeout(exit, reduced ? 0 : 280));
          }
        },
      });
    };

    // Visita repetida na sessão: não bloqueia, só libera.
    let seen = false;
    if (oncePerSession) {
      try {
        seen = sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        seen = false;
      }
    }
    if (seen) {
      timeouts.push(window.setTimeout(finish, 0));
      return () => {
        cancelled = true;
        timeouts.forEach((t) => window.clearTimeout(t));
      };
    }

    document.body.classList.add("preloader-active");
    render();

    const essentialImages = collectEssentialImages(images);
    const tasks: Promise<void>[] = [
      settle(document.fonts?.ready ?? Promise.resolve(), resourceTimeout),
      ...essentialImages.map((src) =>
        settle(loadImage(src), resourceTimeout),
      ),
    ];

    let done = 0;
    tasks.forEach((task) => {
      task.then(() => {
        if (cancelled) return;
        done += 1;
        setTarget((done / tasks.length) * 100);
      });
    });

    // Rede de segurança: nunca prende o usuário no preloader.
    timeouts.push(
      window.setTimeout(() => {
        if (cancelled || finished || state.value >= 100) return;
        setTarget(100);
      }, maxDuration),
    );

    return () => {
      cancelled = true;
      timeouts.forEach((t) => window.clearTimeout(t));
      progressTween?.kill();
      exitTween?.kill();
      document.body.classList.remove("preloader-active");
    };
    // Props de configuração são estáticas por design (executa uma vez).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  const isCarbon = variant === "carbon";

  return (
    <div
      ref={rootRef}
      aria-label="Carregando"
      className={cn(
        "preloader fixed inset-0 z-[100] flex flex-col justify-between container-pad py-6",
        isCarbon
          ? "bg-carbon-black text-off-white"
          : "bg-off-white text-carbon-black",
      )}
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
    >
      {/* Sem JS o preloader nunca sai — esconde. */}
      <noscript>
        <style>{`.preloader{display:none!important}`}</style>
      </noscript>

      <div
        ref={contentRef}
        className="flex flex-1 flex-col justify-between"
      >
        <div className="flex items-start justify-between">
          <span className="text-eyebrow !text-current opacity-70">
            Jefferson Teixeira
          </span>
          <span className="text-eyebrow !text-current opacity-70">
            Portfólio
          </span>
        </div>

        <div className="flex flex-col items-center gap-8">
          <Monogram size={96} title="" />
          <div
            ref={progressRef}
            role="progressbar"
            aria-label="Progresso do carregamento"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={0}
            className="h-[3px] w-[min(18rem,60vw)] overflow-hidden bg-current/15"
          >
            <div
              ref={barRef}
              className={cn(
                "h-full origin-left",
                isCarbon ? "bg-neon-lime" : "bg-carbon-black",
              )}
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>

        <div className="flex items-end justify-between gap-6">
          <span
            ref={messageRef}
            role="status"
            aria-live="polite"
            className="text-eyebrow !text-current"
          >
            {MESSAGES.start}
          </span>
          <span className="font-[family-name:var(--font-condensed)] text-[clamp(3rem,10vw,7rem)] font-bold leading-[0.85] tabular-nums">
            <span ref={counterRef}>000</span>
            <span aria-hidden className="text-[0.4em] opacity-60">
              %
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
