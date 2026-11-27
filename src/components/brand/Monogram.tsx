import { cn } from "@/lib/utils";

interface MonogramProps {
  /** Largura/altura em px. */
  size?: number;
  /**
   * `true`: mostra o tile carbon (#080808) com letras off-white.
   * `false`: apenas as letras (herdam `currentColor`) + barra lime.
   */
  tile?: boolean;
  className?: string;
  /** Texto acessível. Use `""` para marcar como decorativo. */
  title?: string;
}

/** Monograma JT — versão inline do `/images/brand/jt-monogram.svg`. */
export function Monogram({
  size = 40,
  tile = true,
  className,
  title = "JT",
}: MonogramProps) {
  const decorative = title === "";
  const stroke = tile ? "#F8F8F5" : "currentColor";
  const sizedByClass = Boolean(className?.includes("h-") || className?.includes("w-"));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={sizedByClass ? undefined : size}
      height={sizedByClass ? undefined : size}
      fill="none"
      className={cn("shrink-0", className)}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative ? true : undefined}
      focusable="false"
    >
      {tile && <rect width="64" height="64" rx="6" fill="#080808" />}
      <path
        d="M22 16V38.5C22 43.194 18.418 47 14 47"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="square"
      />
      <path
        d="M34 16H54M44 16V47"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="square"
      />
      <rect x="0" y="54" width="64" height="10" fill="#D2FF00" />
    </svg>
  );
}
