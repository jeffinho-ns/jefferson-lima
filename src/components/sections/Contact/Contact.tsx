import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { siteConfig } from "@/config/site";
import { activeSocialLinks } from "@/data/social-links";

export function Contact() {
  const whatsappHref = siteConfig.whatsapp
    ? `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(
        "Olá, Jefferson! Vim pelo seu site e gostaria de conversar sobre um projeto.",
      )}`
    : null;
  const emailHref = siteConfig.email ? `mailto:${siteConfig.email}` : null;
  const networks = activeSocialLinks.filter(
    (link) => link.platform === "linkedin" || link.platform === "github",
  );

  return (
    <section
      id="contato"
      aria-labelledby="contact-title"
      className="section-shell bg-neon-lime text-carbon-black"
    >
      <div className="section-wrap">
        <p className="eyebrow flex items-center gap-3">
          <span>08</span>
          <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
          <span>Contato</span>
        </p>
        <h2 id="contact-title" className="title-xl reveal mt-6">
          HAVE AN IDEA? <br />
          LET&rsquo;S MAKE IT REAL.
        </h2>

        <div className="reveal mt-[clamp(2.5rem,7vh,4.5rem)] flex flex-wrap items-center gap-4">
          <Link href="/contato" className="pill pill-dark !px-7 !py-4 !text-lg">
            Solicitar orçamento
            <ArrowUpRight aria-hidden="true" className="arrow-shift size-5" />
          </Link>
          {whatsappHref && (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="pill !px-7 !py-4 !text-lg hover:bg-carbon-black hover:text-off-white"
            >
              WhatsApp
              <ArrowUpRight aria-hidden="true" className="arrow-shift size-5" />
            </a>
          )}
        </div>

        {(emailHref || networks.length > 0) && (
          <ul className="reveal mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-carbon-black/30 pt-6">
            {emailHref && (
              <li>
                <a href={emailHref} className="cta-link">
                  {siteConfig.email}
                </a>
              </li>
            )}
            {networks.map((link) => (
              <li key={link.platform}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-link"
                >
                  {link.label}
                  <ArrowUpRight aria-hidden="true" className="arrow-shift size-4" />
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
