# Quality Assurance

Registro **factual** do que foi verificado e do que ainda falta. Nenhuma métrica de performance (Lighthouse, Web Vitals, FPS) foi medida; por isso nenhuma é reportada aqui.

Última verificação dos comandos abaixo: 26/11/2026, ambiente local de desenvolvimento.

## 1. Resumo

| Verificação | Comando | Resultado |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | **Passou** |
| Lint | `npm run lint` | **Passou** (sem erros) |
| Build de produção | `npm run build` | **Passou** |
| Testes unitários | `npm test` | **Passou — 1 arquivo, 3 testes** |
| E2E (Playwright) | `npm run test:e2e` | **Passou — 2/2** (Chromium) |
| Lighthouse / Web Vitals | — | **Não medido** |
| Comparação visual com mockup aprovado | — | **PENDENTE** (mockup não encontrado no filesystem) |

> "Tecnicamente funcional" **não** significa "pronto para publicar": ver pendências na seção 6 e critérios na seção 7.

## 2. Testes unitários (Vitest)

- Config: `vitest.config.ts` (ambiente `node`, inclui `tests/unit/**/*.{test,spec}.{ts,tsx}`, alias `@` → `src`).
- Arquivo: `tests/unit/contact-schema.test.ts` — valida `contactSchema` (`src/lib/contact-schema.ts`):
  1. aceita um payload válido;
  2. rejeita sem consentimento (`consent: false`);
  3. aceita honeypot preenchido no schema (o silenciamento fica na API).
- Escopo: **somente o schema de contato**. Não há testes unitários para a rota `/api/contact` (rate limit, 503, Resend), para componentes React, hooks ou utilitários de motion.

## 3. Testes E2E (Playwright)

- **Localização:** `tests/e2e/home.spec.ts` · **Config:** `playwright.config.ts`.
- Projeto único: **Chromium** (`Desktop Chrome`). `baseURL` = `PLAYWRIGHT_BASE_URL` ou `http://127.0.0.1:3000`.
- O `webServer` executa `npm run start`: **é preciso rodar `npm run build` antes**. Na primeira vez, instalar o navegador: `npx playwright install chromium`.
- Artefatos locais da execução (ex.: `.last-run.json`, contexto de erro) são gravados em `test-results/`; a pasta **não está** no `.gitignore` atual — considere adicioná-la.

Casos existentes:

| Teste | O que verifica |
| --- | --- |
| `Home › carrega hero, navegação e seções principais` | h1 presente, `#hero`/`#inicio` visível, abertura do menu (`role="dialog"`) e fechamento com `Escape`, textos "DESIGN IS MY LANGUAGE", "SELECTED WORKS" e "LET'S BUILD SOMETHING DIFFERENT", e ausência de `pageerror` |
| `Home › rotas internas respondem` | `/sobre`, `/projetos`, `/servicos`, `/contato`, `/privacidade` retornam `ok` |

**Resultado da execução mais recente: 2 passou, 0 falhou.**

- ✅ `carrega hero, navegação e seções principais` — hero, menu (abrir/ESC), seções principais.
- ✅ `rotas internas respondem` — `/sobre`, `/projetos`, `/servicos`, `/contato`, `/privacidade`.

## 4. Validação manual e comparação visual

Referência de comportamento: `docs/visual-reference.md` (levantamento de outro site, usado apenas como estudo de ritmo e proporção — não é critério de cópia). Capturas em `docs/reference-screenshots/`.

Observações para a comparação visual:

- **Mockup aprovado da home: PENDENTE** — não foi encontrado no filesystem. Sem ele **não existe baseline autoral** para comparação pixel/layout; qualquer "aprovação visual" depende de localizá-lo.
- A referência usa lime `#d2ff00` como acento; o site usa `neonLime #D2FF00` (`src/config/theme.ts`). O próprio `visual-reference.md` (seção 15) recomenda **acento próprio, não esse lime**. Esta é uma **decisão de identidade a validar com o dono do site** (manter ou trocar).
- O preloader do site (carbon + barra + contador) e o efeito do retrato (rosto → código) **diferem de propósito** do preloader/efeito de capacete da referência.
- A referência foi medida em 6 viewports (1920×1080, 1440×900, 1280×720, 1024×768, 768×1024, 390×844). **Não há capturas equivalentes do site** salvas no repositório; a comparação lado a lado ainda precisa ser feita e registrada.
- Limitações da própria referência (input real bloqueado, WebGL opaco, etc.) estão listadas na seção 14 de `visual-reference.md`.

## 5. Como reproduzir as verificações

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e        # requer build prévio e `npx playwright install chromium`
```

Checklist manual sugerido (não executado de forma sistemática até aqui):

1. `/`: preloader → hero → todas as seções; menu abre/fecha (botão, `Escape`, foco).
2. Hero: hover decodifica o retrato; sem WebGL / com reduced motion mostra só a imagem (ver `digital-identity.md`).
3. `prefers-reduced-motion`: sem Lenis, sem cursor, sem transição animada.
4. Formulário em `/contato`: validação, consentimento, honeypot, estado `503` sem Resend, envio real com Resend configurado.
5. `/projetos/[slug]` e `/servicos/[slug]` para todos os slugs de `src/data`.
6. `/sitemap.xml`, `/robots.txt`, `not-found`.
7. Mobile real: scroll vertical sobre o retrato continua nativo; toque decodifica.
8. Teclado e leitor de tela: skip-link, foco no `<main>` após navegação, `aria-live` do preloader.

## 6. Pendências de QA

| Item | Estado |
| --- | --- |
| Corrigir e reexecutar o teste E2E da home (asserção desatualizada) | Pendente |
| Mockup aprovado da home | **PENDENTE** — não encontrado no filesystem |
| Comparação visual (site × mockup/referência) em 6 viewports | Pendente |
| Lighthouse e Web Vitals (build publicado/preview) | Não medido |
| Teste em dispositivos móveis reais (iOS Safari, Android Chrome) | Pendente |
| Testes de acessibilidade (teclado, leitor de tela, contraste) | Parcial/não registrado |
| Teste de envio real pelo Resend | Pendente — exige `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, `CONTACT_FROM_EMAIL` |
| Testes unitários/integração da rota `/api/contact` | Inexistentes |
| Rate limit configurável (`RATE_LIMIT*`) e robusto | Variáveis declaradas e **não lidas**; limite atual em memória |
| Flags `smoothScrollEnabled`, `pageTransitionsEnabled`, `customCursorEnabled` não controlam nada | Pendente (ligar ou remover) |
| Retrato definitivo (cutout profissional) | **Provisório** (rembg) |
| Capas reais de projetos e imagem OG | Pendentes |
| E-mail, WhatsApp e redes sociais reais | **Precisam de configuração pelo usuário** |
| Revisão jurídica/LGPD de `/privacidade` | Pendente |
| Teste cross-browser (Firefox, Safari) | Pendente (Playwright só tem Chromium) |

## 7. Critérios de aceite — status

| Critério | Status |
| --- | --- |
| O projeto compila e passa typecheck e lint | ✅ Atendido |
| Build de produção conclui | ✅ Atendido |
| Testes unitários passam | ✅ Atendido (3/3, escopo restrito ao schema de contato) |
| Todas as rotas respondem (`/`, `/sobre`, `/projetos`, `/servicos`, `/contato`, `/privacidade`) | ✅ Verificado pelo E2E (`rotas internas respondem`) |
| E2E da home verde | ❌ **Não atendido** (1 falha por asserção desatualizada) |
| Contatos e redes só aparecem se configurados | ✅ Implementado (`social-links.ts`, `site.ts`); ⚠️ valores reais **pendentes** |
| Formulário degrada com clareza sem Resend (503) | ✅ Implementado; envio real **não testado** |
| Reduced motion respeitado (Lenis, cursor, transições, WebGL) | ✅ Implementado no código; **sem teste automatizado** |
| WebGL carregado sob demanda, com fallback estático | ✅ Implementado (`next/dynamic`, `ssr: false`); sem medição de bundle registrada |
| Retrato definitivo | ❌ Provisório |
| Mockup aprovado da home e comparação visual | ❌ **PENDENTE** (mockup não encontrado) |
| Capas de projetos reais | ❌ Pendente |
| Performance (Lighthouse) | ❌ Não medida — sem meta numérica definida/validada |
| Configuração de produção (domínio, Resend, contatos) | ❌ Pendente |

**Leitura geral:** base técnica funcional e verificada nos itens marcados; o projeto **ainda não está pronto para publicação comercial** enquanto houver itens ❌ acima.
