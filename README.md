# Jefferson Teixeira — Site / Portfólio

Site institucional e portfólio de **Jefferson Teixeira**, Creative Developer & Web Designer. Experiência de rolagem cinematográfica, preloader, menu em tela cheia e um retrato interativo em WebGL ("DigitalIdentity") que decodifica o rosto em código ao redor do cursor.

> **Referência × implementação.** O *comportamento*, a proporção e o ritmo da home tomam como referência o site `landonorris.com` (levantamento em [`docs/visual-reference.md`](docs/visual-reference.md)). A implementação — código, shaders, textura de código, identidade visual, textos e estrutura de dados — é **autoral**. Nada foi copiado de código de terceiros.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Framework | Next.js 16.4.6 (App Router) + React 19.3 + TypeScript 5 |
| Estilo | Tailwind CSS 4.3 (via `@tailwindcss/turbopack`) + CSS próprio (`globals.css`, `sections.css`) |
| Motion | GSAP 3 (`ScrollTrigger`, `SplitText`, `CustomEase`) + Lenis (scroll suave) |
| WebGL | three 0.187 + `@react-three/fiber` 9 + `@react-three/drei`, shaders GLSL próprios |
| Formulário | react-hook-form + zod 4 (`@hookform/resolvers`) |
| E-mail | Resend (rota `POST /api/contact`) |
| Testes | Vitest 3 (unitário) + Playwright (E2E, Chromium) |
| Qualidade | ESLint 9 (`eslint-config-next`), Prettier (+ plugin Tailwind) |

> `AGENTS.md` alerta que este Next.js tem mudanças em relação às versões anteriores. Antes de alterar convenções do framework, consulte `node_modules/next/dist/docs/`.

## Scripts

| Script | Comando | Descrição |
| --- | --- | --- |
| `dev` | `next dev` | Servidor de desenvolvimento em `http://localhost:3000` |
| `build` | `next build` | Build de produção |
| `start` | `next start` | Serve o build de produção (também usado pelo Playwright) |
| `lint` | `eslint .` | Lint de todo o projeto |
| `typecheck` | `tsc --noEmit` | Checagem de tipos |
| `test` | `vitest run` | Testes unitários (`tests/unit/**`) |
| `test:watch` | `vitest` | Vitest em modo watch |
| `test:e2e` | `playwright test` | Testes E2E (`tests/e2e/**`); sobe `npm run start` automaticamente |
| `format` | `prettier --write .` | Formata o projeto |

## Como rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha o que for necessário (veja abaixo)
npm run dev                  # http://localhost:3000
```

Para validar como em produção e rodar o E2E:

```bash
npm run build
npm run test:e2e             # sobe `next start` em 127.0.0.1:3000 (reaproveita se já estiver rodando)
```

Na primeira execução do Playwright, instale o navegador: `npx playwright install chromium`.

## Variáveis de ambiente (`.env.example`)

Todas são opcionais para o site renderizar: o que não estiver configurado é **ocultado** (e-mail, WhatsApp, redes) ou degrada de forma explícita (formulário → HTTP 503). Variáveis `NEXT_PUBLIC_*` ficam expostas no bundle; as demais são somente servidor.

| Variável | Escopo | Uso real no código |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | público | URL canônica: `metadataBase`, Open Graph, sitemap, robots, JSON-LD. Padrão `http://localhost:3000` |
| `NEXT_PUBLIC_EMAIL` | público | E-mail exibido no site; também é o destinatário padrão do formulário |
| `NEXT_PUBLIC_WHATSAPP` | público | Somente dígitos com DDI (ex.: `5511999999999`); gera o link `wa.me` |
| `NEXT_PUBLIC_GITHUB_URL` / `NEXT_PUBLIC_LINKEDIN_URL` / `NEXT_PUBLIC_INSTAGRAM_URL` | público | Vazio = link oculto (`src/data/social-links.ts`) |
| `RESEND_API_KEY` | servidor | Chave Resend. Ausente → `/api/contact` responde `503 EMAIL_NOT_CONFIGURED` |
| `CONTACT_TO_EMAIL` | servidor | Destinatário das mensagens (fallback: `NEXT_PUBLIC_EMAIL`) |
| `CONTACT_FROM_EMAIL` | servidor | Remetente verificado no Resend (fallback: `onboarding@resend.dev`, apenas para testes) |
| `RATE_LIMIT`, `RATE_LIMIT_WINDOW_SECONDS` | servidor | Limite da rota `/api/contact` (padrão: 5 req / 60 s por IP, em memória) |
| `NEXT_PUBLIC_ANALYTICS_ID` | público | **Ainda não consumida.** Analytics está desligado (`features.analyticsEnabled = false`) |

## Estrutura (resumo)

```
src/app/          rotas (home, /sobre, /projetos, /servicos, /contato, /privacidade), API, sitemap, robots
src/components/   ui, layout, hero (WebGL), motion, sections, forms, providers, brand
src/data/         conteúdo tipado (projetos, serviços, tecnologias, navegação…)
src/config/       site, features (flags), theme (tokens)
src/lib/          gsap, motion, contact-schema, code-snippets, utils
src/shaders/      portrait.vert / portrait.frag / decode.frag
tests/            unit (Vitest) e e2e (Playwright)
docs/             documentação (ver abaixo)
```

## Documentação

| Documento | Conteúdo |
| --- | --- |
| [`docs/visual-reference.md`](docs/visual-reference.md) | Engenharia visual da referência (comportamento, proporção, ritmo) |
| [`docs/architecture.md`](docs/architecture.md) | Estrutura, Server × Client, ownership por frente, data layer, API |
| [`docs/motion-design.md`](docs/motion-design.md) | Lenis, GSAP, Preloader, cursor, reveal, tokens, reduced motion |
| [`docs/digital-identity.md`](docs/digital-identity.md) | Decode facial (R3F + shaders + textura de código) |
| [`docs/deployment.md`](docs/deployment.md) | Vercel, variáveis, checklist pré-publicação |
| [`docs/quality-assurance.md`](docs/quality-assurance.md) | O que foi testado e limitações conhecidas |

## Deploy (Vercel)

Projeto Next.js padrão: importe o repositório na Vercel, mantenha o preset *Next.js* (`npm run build`), cadastre as variáveis de ambiente e publique. Detalhes e checklist em [`docs/deployment.md`](docs/deployment.md).

## Assets e pendências

| Item | Estado | Ação necessária |
| --- | --- | --- |
| Retrato (cutout) | **Provisório.** `jefferson-cutout.png` é um recorte automático (rembg) a partir de foto provisória (ver `public/images/portrait/ASSET_STATUS.md`) | Substituir por cutout profissional (fundo transparente; óculos e boné preservados), mantendo o nome/caminho ou ajustando `portrait-assets.ts` |
| Mockup aprovado da home | **Não encontrado no disco** (registrado em `public/images/portrait/ASSET_STATUS.md`) | Localizar/anexar o mockup e comparar com a implementação |
| Capas de projeto | **Tipográficas (placeholder)** via `ProjectCover`; `public/images/projects/` está vazio e as imagens citadas em `data/projects.ts` não existem | Adicionar imagens reais e trocar para `next/image` |
| Resend | **Não configurado** por padrão | Criar conta, verificar domínio, definir `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` |
| Contatos e redes | Vazios no `.env.example` — **dependem de configuração pelo usuário** | Preencher e-mail, WhatsApp e URLs sociais |
| Lighthouse | **Não medido** | Rodar em build de produção publicado/preview (ver `docs/quality-assurance.md`) |

## Conclusão técnica × prontidão comercial

São estados diferentes e **não devem ser confundidos**:

- **Conclusão técnica** — o código compila e passa nas verificações automatizadas: `build`, `tsc`, `lint` (0 erros) e `vitest` (3 testes). O Playwright da home passa no teste de rotas, mas o teste principal falha por um texto desatualizado no spec (`LET'S BUILD SOMETHING DIFFERENT`; ver `docs/quality-assurance.md`). Isso indica que a base de engenharia está funcional, com uma correção de teste pendente.
- **Prontidão comercial** — o site pode ser divulgado/vendido: depende de **conteúdo e assets finais**, não só de código. Hoje faltam o cutout definitivo, o mockup de referência para validação visual, imagens reais de projetos, o Resend configurado (sem ele o formulário **não envia**), contatos reais e a medição de performance.

Enquanto os itens da tabela de pendências estiverem abertos, trate o projeto como **tecnicamente concluído, mas ainda não pronto para publicação comercial**.
