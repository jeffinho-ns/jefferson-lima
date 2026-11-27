import { Code, Globe, PenTool, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AvailabilityItem {
  label: string;
  icon: LucideIcon;
}

const items: readonly AvailabilityItem[] = [
  { label: "Desenvolvimento de Software", icon: Code },
  { label: "Web Design & UI/UX", icon: PenTool },
  { label: "Soluções Digitais", icon: Globe },
];

export interface AvailabilityBadgeProps {
  className?: string;
}

/**
 * Indicador compacto inferior-esquerdo (proporção ~NEXT RACE da referência).
 * Desktop: cartão vertical fino. Mobile: status em linha.
 */
export function AvailabilityBadge({ className }: AvailabilityBadgeProps) {
  return (
    <aside
      aria-label="Disponibilidade para projetos"
      className={cn(
        "pointer-events-none absolute bottom-[var(--pad-container)] left-[var(--pad-container)] z-20",
        className,
      )}
    >
      {/* Mobile */}
      <div className="flex items-center gap-2 border border-carbon-black/20 bg-off-white/75 px-3 py-2 backdrop-blur-sm md:hidden">
        <span aria-hidden className="relative inline-flex size-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-neon-lime opacity-70" />
          <span className="relative size-2 rounded-full bg-neon-lime" />
        </span>
        <p className="font-mono text-[0.58rem] font-medium tracking-[0.14em] text-carbon-black">
          DISPONÍVEL PARA PROJETOS
        </p>
      </div>

      {/* Desktop — ~6.9% da largura @1440 ≈ 99px; altura editorial */}
      <div
        className={cn(
          "relative hidden w-[clamp(5.8rem,6.9vw,7.2rem)] overflow-hidden",
          "border border-carbon-black/25 bg-off-white/55 backdrop-blur-[6px] md:block",
        )}
      >
        {/* Entalhe superior-esquerdo (inspirado no card da referência) */}
        <div className="border-b border-carbon-black/20 bg-off-white/80 px-2.5 py-2">
          <p className="flex items-center gap-1.5 font-mono text-[0.52rem] font-medium leading-tight tracking-[0.12em] text-carbon-black/70">
            <span aria-hidden className="relative inline-flex size-1.5 shrink-0">
              <span className="absolute inset-0 animate-ping rounded-full bg-neon-lime opacity-70" />
              <span className="relative size-1.5 rounded-full bg-neon-lime" />
            </span>
            DISPONÍVEL
            <br />
            PARA PROJETOS
          </p>
        </div>

        <ul className="flex flex-col">
          {items.map(({ label, icon: Icon }, index) => (
            <li
              key={label}
              className={cn(
                "flex flex-col gap-1.5 px-2.5 py-2.5",
                index < items.length - 1 && "border-b border-carbon-black/15",
              )}
            >
              <Icon
                aria-hidden
                strokeWidth={1.4}
                className="size-3.5 text-carbon-black/70"
              />
              <span className="text-[0.62rem] leading-[1.25] text-graphite">
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

export default AvailabilityBadge;
