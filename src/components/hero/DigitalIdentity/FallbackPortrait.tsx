"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  PORTRAIT_ALT,
  PORTRAIT_FALLBACK_SRC,
  PORTRAIT_SRC,
} from "../portrait-assets";

export { PORTRAIT_SRC, PORTRAIT_FALLBACK_SRC };

interface FallbackPortraitProps {
  src?: string;
  fallbackSrc?: string;
  alt?: string;
  className?: string;
  priority?: boolean;
}

/**
 * Retrato estático (SSR / reduced-motion / placeholder até WebGL).
 * Enquadramento idêntico ao shader: contain + bottom-center.
 */
export function FallbackPortrait({
  src = PORTRAIT_SRC,
  fallbackSrc = PORTRAIT_FALLBACK_SRC,
  alt = PORTRAIT_ALT,
  className,
  priority = true,
}: FallbackPortraitProps) {
  const [currentSrc, setCurrentSrc] = useState(src);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      draggable={false}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
      className={cn(
        "absolute inset-0 h-full w-full select-none object-contain object-bottom",
        className,
      )}
    />
  );
}
