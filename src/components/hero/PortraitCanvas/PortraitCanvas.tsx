"use client";

import dynamic from "next/dynamic";

import { cn } from "@/lib/utils";

import {
  PORTRAIT_ALT,
  PORTRAIT_FALLBACK_SRC,
  PORTRAIT_SRC,
} from "../portrait-assets";

export interface PortraitCanvasProps {
  className?: string;
}

/** Placeholder renderizado no SSR e enquanto o chunk de R3F/Three carrega. */
function PortraitPlaceholder() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={PORTRAIT_SRC}
      alt={PORTRAIT_ALT}
      draggable={false}
      decoding="async"
      fetchPriority="high"
      onError={(event) => {
        const img = event.currentTarget;
        if (!img.src.endsWith(PORTRAIT_FALLBACK_SRC)) {
          img.src = PORTRAIT_FALLBACK_SRC;
        }
      }}
      data-cursor="decode"
      className="h-full w-full object-contain object-bottom"
    />
  );
}

/** R3F + Three + shaders só são baixados no cliente, fora do bundle inicial. */
const DigitalIdentity = dynamic(
  () => import("../DigitalIdentity/DigitalIdentity"),
  {
    ssr: false,
    loading: () => <PortraitPlaceholder />,
  },
);

export function PortraitCanvas({ className }: PortraitCanvasProps) {
  return (
    <div className={cn("relative h-full w-full", className)}>
      <DigitalIdentity />
    </div>
  );
}

export default PortraitCanvas;
