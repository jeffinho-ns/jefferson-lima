import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Monogram } from "@/components/brand/Monogram";
import { siteConfig } from "@/config/site";
import { navigation } from "@/data/navigation";
import { activeSocialLinks } from "@/data/social-links";
import { BackToTop } from "./BackToTop";
import { CurrentYear } from "./CurrentYear";

const linkClass =
  "inline-block py-1 transition-colors hover:text-neon-lime focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-lime";

export function Footer() {
  return (
    <footer className="section-dark container-pad pb-8 pt-20 sm:pt-28">
      {/* Topo: monograma + papel */}
      <div className="flex flex-wrap items-start justify-between gap-8">
        <Link
          href="/"
          aria-label="Jefferson Teixeira — página inicial"
          className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-lime"
        >
          <Monogram size={64} title="" />
        </Link>
        <p className="text-eyebrow max-w-xs !text-off-white/60 sm:text-right">
          {siteConfig.role}
          <br />
          {siteConfig.availability}
        </p>
      </div>

      {/* Nome em destaque */}
      <p
        aria-hidden="true"
        className="text-impact my-16 !text-[clamp(3rem,13vw,13rem)] sm:my-24"
      >
        Jefferson
        <br />
        Teixeira<span className="text-neon-lime">.</span>
      </p>

      {/* Navegação + redes */}
      <div className="grid gap-12 border-t border-off-white/15 pt-10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <nav aria-label="Rodapé">
          <h2 className="text-eyebrow mb-4 !text-off-white/50">Navegação</h2>
          <ul className="font-[family-name:var(--font-condensed)] text-2xl font-bold uppercase tracking-[0.02em]">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  <span className="mr-3 font-[family-name:var(--font-mono)] text-xs font-normal tracking-[0.14em] text-off-white/40">
                    {item.index}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {activeSocialLinks.length > 0 && (
          <div>
            <h2 className="text-eyebrow mb-4 !text-off-white/50">Redes</h2>
            <ul className="font-[family-name:var(--font-condensed)] text-2xl font-bold uppercase tracking-[0.02em]">
              {activeSocialLinks.map((link) => (
                <li key={link.platform}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkClass} group inline-flex items-center gap-2`}
                  >
                    {link.label}
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                    <span className="sr-only">(abre em nova aba)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {siteConfig.email && (
          <div>
            <h2 className="text-eyebrow mb-4 !text-off-white/50">Contato</h2>
            <a
              href={`mailto:${siteConfig.email}`}
              className={`${linkClass} break-all font-[family-name:var(--font-condensed)] text-2xl font-bold tracking-[0.02em]`}
            >
              {siteConfig.email}
            </a>
          </div>
        )}

        <div className="lg:justify-self-end lg:self-end">
          <BackToTop />
        </div>
      </div>

      {/* Rodapé legal */}
      <div className="text-eyebrow mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-off-white/15 pt-6 !text-off-white/50">
        <p>
          © <CurrentYear /> {siteConfig.name}. Todos os direitos reservados.
        </p>
        <Link href="/privacidade" className={linkClass}>
          Política de privacidade
        </Link>
      </div>
    </footer>
  );
}
