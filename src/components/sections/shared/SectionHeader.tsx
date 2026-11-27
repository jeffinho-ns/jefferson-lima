import type { ReactNode } from "react";

interface SectionHeaderProps {
  id?: string;
  /** Número da seção (ex.: "03"). */
  index?: string;
  eyebrow: string;
  title: ReactNode;
  /** Texto de apoio à direita do título em telas largas. */
  aside?: ReactNode;
  titleClassName?: string;
}

export function SectionHeader({
  id,
  index,
  eyebrow,
  title,
  aside,
  titleClassName = "title-xl",
}: SectionHeaderProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8">
        <p className="eyebrow flex items-center gap-3">
          {index ? <span>{index}</span> : null}
          <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
          <span>{eyebrow}</span>
        </p>
        <h2 id={id} className={`${titleClassName} reveal mt-5`}>
          {title}
        </h2>
      </div>
      {aside ? (
        <div className="reveal lg:col-span-4 lg:pb-3">{aside}</div>
      ) : null}
    </div>
  );
}
