"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useState, type ReactNode } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { useGraphicsTier, useWebGLSupport } from "@/hooks/useWebGLSupport";
import { usePointerPosition } from "@/hooks/usePointerPosition";
import { MOTION_EVENTS } from "@/lib/motion";
import { cn } from "@/lib/utils";
import {
  FallbackPortrait,
  PORTRAIT_FALLBACK_SRC,
  PORTRAIT_SRC,
} from "./FallbackPortrait";

/** three/R3F ficam fora do bundle inicial: só baixam se WebGL + movimento permitidos. */
const PortraitScene = dynamic(() => import("./PortraitScene"), {
  ssr: false,
  loading: () => null,
});

const DEMO_STORAGE_KEY = "jt:digital-identity-demo";

export interface DigitalIdentityProps {
  className?: string;
  src?: string;
  fallbackSrc?: string;
  alt?: string;
  /** Raio do decode, normalizado pela altura do container. */
  decodeRadius?: number;
  /** 0..1 — grão, flicker de glifos, scanlines. */
  noiseIntensity?: number;
  /** 0..~2 — glitch por linha e ondulação na borda. */
  distortion?: number;
  /** Demo automática única em dispositivos de toque. */
  autoDemo?: boolean;
  /** Retrato é o LCP da página? */
  priority?: boolean;
}

class SceneBoundary extends Component<
  { onError: () => void; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Retrato interativo: rosto → código decodificado ao redor do mouse/toque.
 *
 * - SSR e fallback: `<img>` estático (FallbackPortrait), sempre presente (a11y/LCP).
 * - WebGL disponível e sem prefers-reduced-motion: Canvas R3F carregado sob demanda
 *   e crossfade quando o primeiro frame está pronto.
 * - O container ocupa 100% do pai: dê dimensões via `className`.
 */
export function DigitalIdentity({
  className,
  src = PORTRAIT_SRC,
  fallbackSrc = PORTRAIT_FALLBACK_SRC,
  alt = "Retrato de Jefferson Teixeira",
  decodeRadius = 0.3,
  noiseIntensity = 0.58,
  distortion = 1.05,
  autoDemo = true,
  priority = true,
}: DigitalIdentityProps) {
  const reducedMotion = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const tier = useGraphicsTier();
  const { ref: containerRef, pointer } = usePointerPosition<HTMLDivElement>();

  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [demo, setDemo] = useState(false);

  const useGL = webgl === true && !reducedMotion && !failed;

  const handleReady = useCallback(() => setReady(true), []);
  const handleError = useCallback(() => setFailed(true), []);

  // Demo automática única em toque: quando visível e após o preloader.
  useEffect(() => {
    if (!useGL || !autoDemo) return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    try {
      if (sessionStorage.getItem(DEMO_STORAGE_KEY)) return;
    } catch {
      /* storage indisponível: segue sem persistir */
    }

    const el = containerRef.current;
    if (!el) return;

    let visible = false;
    let started = false;
    const tryStart = () => {
      if (started || !visible || !ready) return;
      if (document.body.classList.contains("preloader-active")) return;
      started = true;
      setDemo(true);
      try {
        sessionStorage.setItem(DEMO_STORAGE_KEY, "1");
      } catch {
        /* noop */
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        tryStart();
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    window.addEventListener(MOTION_EVENTS.preloaderDone, tryStart);
    tryStart();

    return () => {
      io.disconnect();
      window.removeEventListener(MOTION_EVENTS.preloaderDone, tryStart);
    };
  }, [useGL, autoDemo, ready, containerRef]);

  return (
    <div
      ref={containerRef}
      data-cursor="decode"
      data-cursor-label="DECODE"
      data-digital-identity={ready ? "webgl" : "static"}
      // pan-y: o scroll vertical da página continua nativo; arrasto horizontal vira decode.
      style={{ touchAction: "pan-y" }}
      className={cn("relative isolate h-full w-full overflow-hidden", className)}
    >
      <FallbackPortrait
        src={src}
        fallbackSrc={fallbackSrc}
        alt={alt}
        priority={priority}
        className={cn(
          "transition-opacity duration-300",
          useGL && ready ? "opacity-0" : "opacity-100",
        )}
      />
      {useGL ? (
        <SceneBoundary onError={handleError}>
          <PortraitScene
            pointer={pointer}
            tier={tier}
            src={src}
            fallbackSrc={fallbackSrc}
            decodeRadius={decodeRadius}
            noiseIntensity={noiseIntensity}
            distortion={distortion}
            demo={demo}
            onReady={handleReady}
            onError={handleError}
          />
        </SceneBoundary>
      ) : null}
    </div>
  );
}

export default DigitalIdentity;
