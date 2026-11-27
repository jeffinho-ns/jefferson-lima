"use client";

import { useEffect, useRef } from "react";
import { blobPath, contourPaths } from "@/lib/organic";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

interface OrganicBackgroundProps {
  className?: string;
}

const BLOBS = [
  { d: blobPath(18, 28, 42, 34, 1.1, 16), fill: "#E8E8E4" },
  { d: blobPath(82, 22, 38, 30, 2.4, 15), fill: "#F0F0EC" },
  { d: blobPath(70, 78, 48, 36, 3.7, 17), fill: "#E3E3DE" },
  { d: blobPath(28, 86, 34, 28, 0.8, 14), fill: "#ECECE8" },
  { d: blobPath(52, 48, 26, 22, 4.2, 13), fill: "#EDEDEA" },
] as const;

const CONTOURS = [
  ...contourPaths(22, 30, 48, 40, 1.2, 5, 0.16),
  ...contourPaths(78, 70, 44, 36, 2.8, 4, 0.18),
  ...contourPaths(55, 20, 36, 28, 3.5, 3, 0.2),
];

/**
 * Fundo editorial da hero: blobs cinza-claro + linhas topográficas.
 * Parallax sutil no ponteiro (desativado com reduced-motion / touch).
 */
export function OrganicBackground({ className }: OrganicBackgroundProps) {
  const layerA = useRef<SVGGElement>(null);
  const layerB = useRef<SVGGElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const a = layerA.current;
    const b = layerB.current;
    if (!a || !b) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;

    const onMove = (event: PointerEvent) => {
      const nx = (event.clientX / window.innerWidth - 0.5) * 2;
      const ny = (event.clientY / window.innerHeight - 0.5) * 2;
      tx = nx;
      ty = ny;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      raf = 0;
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      a.setAttribute("transform", `translate(${cx * 12} ${cy * 8})`);
      b.setAttribute("transform", `translate(${cx * -8} ${cy * -6})`);
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden bg-off-white",
        className,
      )}
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g ref={layerA}>
          {BLOBS.map((blob) => (
            <path key={blob.d.slice(0, 24)} d={blob.d} fill={blob.fill} opacity="0.9" />
          ))}
        </g>
        <g ref={layerB} fill="none" stroke="#D6D6D1" strokeWidth="0.12">
          {CONTOURS.map((d) => (
            <path key={d.slice(0, 28)} d={d} />
          ))}
        </g>
      </svg>
    </div>
  );
}

export default OrganicBackground;
