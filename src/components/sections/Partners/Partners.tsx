import { features } from "@/config/features";

export interface Partner {
  name: string;
  /** URL pública confirmada. */
  href?: string;
}

interface PartnersProps {
  /**
   * Parceiros reais e confirmados. Não há parceiros cadastrados por padrão:
   * a seção só renderiza com a flag ligada E ao menos um parceiro informado.
   */
  partners?: readonly Partner[];
}

export function Partners({ partners = [] }: PartnersProps) {
  if (!features.partnersSectionEnabled || partners.length === 0) return null;

  return (
    <section
      id="parceiros"
      aria-labelledby="partners-title"
      className="section-shell bg-off-white text-carbon-black"
    >
      <div className="section-wrap">
        <p className="eyebrow flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
          <span>Parceiros</span>
        </p>
        <h2 id="partners-title" className="title-lg reveal mt-5">
          WORKING <span className="accent-on-light">TOGETHER.</span>
        </h2>
        <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
          {partners.map((partner) => (
            <li key={partner.name} className="title-md">
              {partner.href ? (
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-link !text-[inherit]"
                >
                  {partner.name}
                </a>
              ) : (
                partner.name
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
