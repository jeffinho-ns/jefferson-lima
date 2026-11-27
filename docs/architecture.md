# Arquitetura

Next.js 16 (App Router) + React 19 + TypeScript. Conteúdo estático tipado em `src/data`, interação em ilhas Client Components, e uma única rota de API (`/api/contact`).

## Estrutura de `src/`

```
src/
├── app/                      # App Router
│   ├── layout.tsx            # fontes, metadata, JSON-LD (Person), <AppProviders>, Header/Footer
│   ├── page.tsx              # home: Hero + seções
│   ├── sobre/ projetos/ servicos/ contato/ privacidade/
│   ├── projetos/[slug]/      # SSG via generateStaticParams (dados em data/projects.ts)
│   ├── servicos/[slug]/      # SSG via generateStaticParams (dados em data/services.ts)
│   ├── api/contact/route.ts  # POST — formulário de contato (runtime nodejs)
│   ├── sitemap.ts · robots.ts · not-found.tsx
│   └── globals.css · sections.css   # tokens (@theme), tipografia, componentes CSS
├── middleware.ts             # headers de segurança + CSP (build o lista como "Proxy (Middleware)")
├── components/
│   ├── ui/                   # primitivos (Button)
│   ├── layout/               # Header, Navigation (menu fullscreen), Footer, HeaderThemeZone
│   ├── hero/                 # HeroSection, PortraitCanvas, DigitalIdentity (R3F), AvailabilityBadge
│   ├── motion/               # SmoothScroll, Preloader, CustomCursor, TextReveal, MagneticButton, PageTransition
│   ├── sections/             # About, Contact, FeaturedProjects, Modes, Partners, Philosophy, Process, Services, Technologies, shared
│   ├── forms/ContactForm/    # react-hook-form + zod
│   ├── providers/            # AppProviders, NavigationContext, AppReadyContext
│   └── brand/Monogram.tsx
├── data/                     # conteúdo tipado (projects, services, technologies, process, modes, philosophy, navigation, social-links)
├── config/                   # site.ts (identidade/env), features.ts (flags), theme.ts (tokens JS)
├── lib/                      # gsap.ts, motion.ts, contact-schema.ts, code-snippets.ts, code-texture.ts, load-texture.ts, organic.ts, utils.ts
├── hooks/                    # usePrefersReducedMotion, useWebGLSupport (+ tier), usePointerPosition, useIsTouchDevice
├── shaders/                  # portrait.vert, portrait.frag, decode.frag (GLSL importado como string)
└── types/                    # tipos de domínio e declaração de módulos .vert/.frag
```

Fora de `src/`: `loaders/glsl-loader.cjs` (importa GLSL como string; configurado em `next.config.ts` para Turbopack **e** webpack), `tests/`, `public/`, `docs/`.

## Server × Client Components

Regra adotada: **tudo é Server Component, exceto o que precisa de estado, efeitos, APIs do browser, GSAP, Lenis ou WebGL.** Todas as `page.tsx`, `layout.tsx` e a maioria das seções de conteúdo (ex.: `Contact`, `About`) são Server Components.

Client Components (`"use client"`):

| Grupo | Arquivos | Motivo |
| --- | --- | --- |
| Providers | `AppProviders`, `NavigationContext`, `AppReadyContext` | Estado global de menu e "app pronto" |
| Motion | `SmoothScroll`, `Preloader`, `CustomCursor`, `MagneticButton`, `TextReveal`, `PageTransition`, `lib/gsap.ts` | GSAP/Lenis/DOM |
| Layout | `Header`, `Navigation`, `HeaderThemeZone`, `BackToTop`, `CurrentYear` | Estado, scroll, foco |
| Hero/WebGL | `PortraitCanvas`, `DigitalIdentity`, `FallbackPortrait`, `PortraitScene` | R3F/Three; carregados com `next/dynamic({ ssr: false })` |
| Formulário | `ContactForm` | react-hook-form |
| Outros | `ServicesList`, `NotFoundScene`, hooks em `src/hooks` | Interatividade |

Pontos de atenção:

- `layout.tsx` (server) renderiza `<AppProviders>` (client) como fronteira; `children` continuam sendo server por composição.
- `three`/R3F/shaders ficam **fora do bundle inicial**: `PortraitCanvas` e `DigitalIdentity` usam `dynamic(..., { ssr: false })`, e o SSR entrega um `<img>` (LCP/acessibilidade).
- `next.config.ts` mantém `cacheComponents: false` (callbacks de client providers quebram o prerender com `cacheComponents`).
- A revelação de seções (`.reveal`) é **CSS puro** (`animation-timeline: view()`, com `@supports`), sem JS.

## Ownership por frente

Divisão de responsabilidade de pastas (adote-a para evitar conflitos entre frentes):

| Frente | Pastas / arquivos | Escopo |
| --- | --- | --- |
| **UI / UX** | `components/ui`, `components/layout`, `components/sections`, `components/brand`, `components/forms` (apresentação), `app/globals.css`, `app/sections.css`, `config/theme.ts`, `data/*` (conteúdo) | Layout, tipografia, cores, responsividade, copy, acessibilidade visual |
| **Motion / WebGL** | `components/motion`, `components/hero`, `components/providers`, `shaders/`, `loaders/`, `lib/gsap.ts`, `lib/motion.ts`, `lib/code-*.ts`, `lib/load-texture.ts`, `lib/organic.ts`, `hooks/` | Lenis/GSAP, preloader, cursor, DigitalIdentity, performance de animação, reduced motion |
| **Backend / SEO** | `app/api/**`, `middleware.ts`, `lib/contact-schema.ts`, `config/site.ts`, `config/features.ts`, `app/layout.tsx` (metadata/JSON-LD), `app/sitemap.ts`, `app/robots.ts`, `next.config.ts`, env, testes | API de contato, validação, headers/CSP, metadata, sitemap/robots, deploy |

Arquivos de fronteira (combine antes de editar): `app/layout.tsx`, `app/page.tsx`, `components/providers/AppProviders.tsx`, `components/forms/ContactForm` (UI × contrato com a API).

## Data layer

Não há banco nem CMS. O conteúdo vive em módulos TypeScript tipados (`src/types/index.ts`) em `src/data`:

| Módulo | Consumidores |
| --- | --- |
| `projects.ts` | `FeaturedProjects`, `/projetos`, `/projetos/[slug]`, `sitemap.ts` |
| `services.ts` | `Services`, `/servicos`, `/servicos/[slug]`, `sitemap.ts` |
| `technologies.ts` | `Technologies` e `lib/code-snippets.ts` (textura de código do hero) |
| `navigation.ts`, `process.ts`, `modes.ts`, `philosophy.ts` | Menu e seções da home |
| `social-links.ts` | Lê `NEXT_PUBLIC_*_URL`; exporta `activeSocialLinks` (só os configurados). Usado em Footer, Contact e JSON-LD |

Configuração:

- `config/site.ts` — nome, título, descrição, `url` (de `NEXT_PUBLIC_SITE_URL`), locale `pt-BR`, e-mail e WhatsApp (de env; vazio = não configurado).
- `config/features.ts` — flags: `partnersSectionEnabled: false`, `analyticsEnabled: false`, `contactFormEnabled: true`, `smoothScrollEnabled: true`, `pageTransitionsEnabled: true`, `customCursorEnabled: false`, `testimonialsSectionEnabled: false`, `blogEnabled: false`. **Hoje apenas `partnersSectionEnabled`, `analyticsEnabled` e `contactFormEnabled` são consumidas no código**; as demais ainda não controlam nada (o smooth scroll, as transições e o cursor são montados em `AppProviders` e se auto-desativam por *reduced motion* / ponteiro).
- `config/theme.ts` — cores, durações, curvas e breakpoints em JS (espelha os tokens CSS; ver `docs/motion-design.md`).

Regra de conteúdo: descrições factuais, **sem métricas, clientes ou resultados não confirmados**. `href` de projeto só com URL pública confirmada.

## API de contato — `POST /api/contact`

Arquivo: `src/app/api/contact/route.ts` (`runtime = "nodejs"`).

Fluxo:

1. **Rate limit** por IP (`x-forwarded-for` → `x-real-ip`): 5 requisições por 60 s → `429`. Implementação em `Map` **em memória** — não é compartilhada entre instâncias serverless e é reiniciada a cada cold start. Serve como freio básico, não como proteção robusta (considere Upstash/Vercel KV/WAF).
2. **JSON inválido** → `400`.
3. **Validação** com `contactSchema` (zod) → `400` com `issues` (`flatten()`).
4. **Honeypot** (`website`): se preenchido, responde `200 { ok: true }` silenciosamente, sem enviar nada.
5. **Configuração**: sem `RESEND_API_KEY` ou destinatário (`CONTACT_TO_EMAIL` ou `NEXT_PUBLIC_EMAIL`) → `503` com `code: "EMAIL_NOT_CONFIGURED"`.
6. **Envio** via Resend (`from` = `CONTACT_FROM_EMAIL` ou `onboarding@resend.dev`; `replyTo` = e-mail do remetente; corpo em texto, inclui consentimento LGPD e IP). Falha do Resend → `502`.
7. Sucesso → `200 { ok: true }`.

Schema (`lib/contact-schema.ts`): `name` (2–120), `company?`, `email` (válido), `whatsapp` (8–30), `projectType` (enum de 9 opções), `budget?`, `timeline?`, `message` (10–4000), `consent` (deve ser `true`), `website` (honeypot, deve ser vazio). O mesmo schema valida no cliente (`ContactForm`) e no servidor.

Observação: o honeypot é rejeitado pelo schema (`z.string().max(0)`) — portanto, na prática, um `website` preenchido retorna `400` na etapa 3; o ramo de "sucesso silencioso" da etapa 4 só é alcançado se o schema deixar de rejeitá-lo.

## SEO e segurança

- `app/layout.tsx`: `metadataBase`, `title.template`, Open Graph, Twitter card, ícones, JSON-LD `Person` (inclui só contatos/redes configurados).
- `sitemap.ts` (rotas fixas + projetos + serviços) e `robots.ts` (`allow: /`, aponta para o sitemap).
- `middleware.ts`: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` e CSP (`'unsafe-inline'`/`'unsafe-eval'` em `script-src` por compatibilidade com Next.js; endurecer com nonces é uma melhoria futura). O `matcher` exclui `_next/static`, `_next/image`, favicon e imagens/SVG.
- Imagem OG dedicada: **não existe** ainda (metadata sem `openGraph.images`).
