import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ContactForm } from "@/components/forms/ContactForm/ContactForm";
import { PageIntro } from "@/components/sections/shared/PageIntro";
import { features } from "@/config/features";
import { siteConfig } from "@/config/site";
import { activeSocialLinks } from "@/data/social-links";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Solicite um orçamento ou conte sua ideia. Resposta direta, sem intermediários.",
  alternates: { canonical: "/contato" },
};

export default function ContatoPage() {
  const whatsapp = activeSocialLinks.find((link) => link.platform === "whatsapp");
  const channels = [
    ...(siteConfig.email
      ? [{ label: "E-mail", value: siteConfig.email, href: `mailto:${siteConfig.email}` }]
      : []),
    ...(whatsapp ? [{ label: "WhatsApp", value: "Conversar agora", href: whatsapp.href }] : []),
    ...activeSocialLinks
      .filter((link) => link.platform === "linkedin" || link.platform === "github")
      .map((link) => ({ label: link.label, value: link.label, href: link.href })),
  ];

  return (
    <>
      <PageIntro
        eyebrow="Contato"
        title={
          <>
            HAVE AN IDEA? <br />
            LET&rsquo;S MAKE IT REAL.
          </>
        }
        description="Conte um pouco sobre o projeto. Retorno com os próximos passos e uma proposta alinhada ao seu contexto."
      />

      <section
        aria-label="Formulário de contato"
        className="section-shell bg-off-white text-carbon-black"
      >
        <div className="section-wrap grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-8">
            {features.contactFormEnabled ? (
              <ContactForm fallbackEmail={siteConfig.email || undefined} />
            ) : (
              <p className="text-lg leading-relaxed">
                O formulário está temporariamente indisponível. Use um dos canais
                ao lado para falar comigo.
              </p>
            )}
          </div>

          <aside aria-label="Outros canais" className="lg:col-span-4">
            <p className="eyebrow">Outros canais</p>
            {channels.length > 0 ? (
              <ul className="mt-5">
                {channels.map((channel) => (
                  <li
                    key={channel.label}
                    className="border-t border-carbon-black/20 last:border-b"
                  >
                    <a
                      href={channel.href}
                      target={channel.href.startsWith("mailto:") ? undefined : "_blank"}
                      rel={channel.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                      className="row-link group flex items-center justify-between gap-4 py-4"
                    >
                      <span>
                        <span className="eyebrow block">{channel.label}</span>
                        <span className="font-condensed text-xl font-semibold uppercase tracking-wide break-all">
                          {channel.value}
                        </span>
                      </span>
                      <ArrowUpRight aria-hidden="true" className="arrow-shift size-5 shrink-0" />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 text-base leading-relaxed opacity-75">
                Use o formulário para entrar em contato.
              </p>
            )}
            <p className="eyebrow mt-8">{siteConfig.availability}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
