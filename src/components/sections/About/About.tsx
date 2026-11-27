import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { aboutCopy } from "@/data/philosophy";
import { siteConfig } from "@/config/site";
import { HeaderThemeZone } from "@/components/layout/HeaderThemeZone/HeaderThemeZone";

interface AboutProps {
  /** Em /sobre o título (h1) vem da página e o link "conhecer mais" some. */
  standalone?: boolean;
}

export function About({ standalone = false }: AboutProps) {
  return (
    <HeaderThemeZone
      id="sobre"
      aria-labelledby={standalone ? undefined : "about-title"}
      aria-label={standalone ? "Sobre Jefferson Teixeira" : undefined}
      className="section-shell bg-grain-dark relative overflow-hidden text-off-white"
    >
      <div className="section-wrap relative grid items-center gap-14 lg:grid-cols-12">
        <div className="reveal lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-md">
            <div
              aria-hidden="true"
              className="absolute inset-x-[8%] bottom-0 top-[18%] bg-graphite"
            />
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[8%] h-3 w-[84%] bg-neon-lime"
            />
            <Image
              src="/images/portrait/jefferson-cutout.png"
              alt="Retrato de Jefferson Teixeira"
              width={800}
              height={800}
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="relative h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="lg:col-span-7">
          <p className="eyebrow flex items-center gap-3">
            <span>06</span>
            <span aria-hidden="true" className="h-px w-10 bg-current opacity-60" />
            <span>{aboutCopy.eyebrow}</span>
          </p>
          {standalone ? (
            <p className="title-lg reveal mt-5">{aboutCopy.headline}</p>
          ) : (
            <h2 id="about-title" className="title-lg reveal mt-5">
              {aboutCopy.headline}
            </h2>
          )}

          <div className="mt-8 max-w-2xl space-y-5 text-lg leading-relaxed">
            {aboutCopy.paragraphs.map((paragraph) => (
              <p key={paragraph} className="reveal opacity-85">
                {paragraph}
              </p>
            ))}
          </div>

          <ul className="mt-10 max-w-2xl">
            {aboutCopy.highlights.map((highlight, i) => (
              <li
                key={highlight}
                className="reveal flex items-baseline gap-4 border-t border-off-white/20 py-3.5 font-condensed text-lg font-semibold uppercase tracking-wide last:border-b sm:text-xl"
              >
                <span className="eyebrow w-6 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {highlight}
              </li>
            ))}
          </ul>

          <div className="reveal mt-10 flex flex-wrap items-center gap-6">
            {!standalone && (
              <Link href="/sobre" className="cta-link">
                Conhecer mais
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            )}
            <p className="eyebrow">{siteConfig.availability}</p>
          </div>
        </div>
      </div>
    </HeaderThemeZone>
  );
}
