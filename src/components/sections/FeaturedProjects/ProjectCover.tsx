import Image from "next/image";
import type { Project } from "@/types";

interface ProjectCoverProps {
  project: Project;
  index: number;
  className?: string;
}

/**
 * Capa do projeto — screenshot real com overlay tipográfico no hover.
 */
export function ProjectCover({ project, index, className = "" }: ProjectCoverProps) {
  return (
    <div
      className={`relative overflow-hidden bg-graphite ${className}`}
      aria-hidden="true"
    >
      <Image
        src={project.cover}
        alt=""
        fill
        sizes="(min-width: 1024px) 42vw, 100vw"
        className="object-cover object-top transition-transform duration-700 ease-[var(--ease-cinematic)] group-hover:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon-black/55 via-transparent to-carbon-black/20" />
      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-off-white/85 sm:p-5">
        <span>{String(index + 1).padStart(2, "0")}</span>
        <span className="max-w-[60%] truncate text-right">{project.category}</span>
      </div>
    </div>
  );
}
