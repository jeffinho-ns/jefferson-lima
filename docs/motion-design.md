# Motion Design

Como o movimento é construído e controlado no site. Descreve o **código atual**; o comportamento da referência visual (outro site, usado só como estudo de ritmo) está em [`visual-reference.md`](visual-reference.md) e **não** é uma especificação a copiar.

## 1. Princípios

- **Um sistema de movimento só**: durações, easings e stagger vêm de tokens (`src/config/theme.ts`) e são reutilizados por GSAP (`src/lib/motion.ts`) e CSS (`src/app/globals.css`).
- **Nunca bloquear o usuário**: preloader com timeouts, transição de página sem animação de saída, scroll nativo em touch.
- **Reduced motion é caminho de primeira classe**, não exceção (seção 8).
- Animação em transform/opacity/clip-path; estado de alta frequência (ponteiro) fora do React.

## 2. Tokens de movimento (`src/config/theme.ts`)

```ts
duration: { instant: 0.15, fast: 0.3, base: 0.6, slow: 0.9, slower: 1.4 }   // segundos
easing:   { standard: [0.4, 0, 0.2, 1],
            outExpo:  [0.16, 1, 0.3, 1],
            inOutExpo:[0.87, 0, 0.13, 1],
            outQuart: [0.25, 1, 0.5, 1] }
stagger:  { tight: 0.04, base: 0.08, relaxed: 0.14 }
breakpoints: { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 }          // px
```

Paleta relacionada (`theme.colors`): `neonLime #D2FF00`, `carbonBlack #080808`, `offWhite #F8F8F5`, `graphite #252525`, `lightGray #E7E7E2`, `pureWhite #FFFFFF`.

No CSS (`@theme` / `:root` em `globals.css`):

- `--ease-cinematic: cubic-bezier(0.65, 0.05, 0, 1)` e `--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)`
- `--duration-default: 0.75s`

Em `src/lib/motion.ts`, o objeto `MOTION` expõe `duration` e `stagger` (do tema) e os nomes de easing GSAP: `cinematic` (CustomEase `0.65, 0.05, 0, 1`), `power3.out`, `power3.inOut`, `expo.out`, `none`. `applyGsapDefaults()` registra o `CustomEase`, define `duration = base (0.6 s)` e `ease = power3.out` como padrão global e é idempotente/client-only.

> Manutenção: `theme.ts` e `globals.css` guardam valores em paralelo. `ease-cinematic` está nos dois; os easings `standard/outExpo/inOutExpo/outQuart` existem só em `theme.ts`. Ao alterar um valor compartilhado, atualize os dois lados.

## 3. GSAP (`src/lib/gsap.ts`)

- `registerGsap()` registra **ScrollTrigger** e **SplitText** uma única vez, apenas no browser.
- Exporta `gsap`, `ScrollTrigger`, `SplitText`, `prefersReducedMotion()` e as media queries `REDUCED_MOTION_QUERY` e `FINE_POINTER_QUERY` (`(hover: hover) and (pointer: fine)`).
- Utilitários de `lib/motion.ts`: `getDuration(s)` (retorna `0` com reduced motion), `clamp`, `damp` (amortecimento exponencial independente de framerate).
- Eventos globais definidos em `MOTION_EVENTS`: `jt:scroll-lock` e `jt:preloader-done`. Estado atual verificado no código: `setScrollLocked()` existe para disparar `jt:scroll-lock`, e o `DigitalIdentity` escuta `jt:preloader-done` — **mas não há, hoje, quem dispare `jt:preloader-done` nem quem escute `jt:scroll-lock`**. A coordenação efetiva ocorre por `AppReadyContext`, pela classe `preloader-active` no `<body>` e pela prop `paused` do `SmoothScroll`.

## 4. Scroll suave (Lenis) — `SmoothScroll`

- Instancia o Lenis com `lerp: 0.1`, `smoothWheel: true`, `syncTouch: false` (**scroll nativo em touch**), `autoRaf: false`.
- Sincroniza com o GSAP: `lenis.on("scroll", ScrollTrigger.update)` e `gsap.ticker.add(raf)`; `lagSmoothing(0)`.
- **Pausado** (`lenis.stop()`) enquanto o menu está aberto ou o preloader não terminou (`paused = isOpen || !ready` em `AppProviders`).
- Expõe `useSmoothScroll().scrollTo(target, { offset, immediate, duration })`; sem Lenis, cai para `window.scrollTo` (`smooth` ou `auto`).
- **Desmontado com `prefers-reduced-motion: reduce`** (e remontado se a preferência mudar).
- A flag `features.smoothScrollEnabled` existe, mas **ainda não é consultada** por este componente (ver `architecture.md`).

## 5. Preloader — `Preloader`

- Tela cheia (`z-[100]`), fundo `carbon` (padrão) ou `offwhite`; monograma JT, barra de progresso (`role="progressbar"`), contador `000–100%` e mensagens de estado: `INITIALIZING EXPERIENCE` → `LOADING DIGITAL IDENTITY` (≥ 45%) → `SYSTEM READY` (100%).
- **Progresso real, não fake**: considera `document.fonts.ready`, o monograma e imagens marcadas como essenciais (`img[data-essential]` ou `fetchpriority="high"` ainda não carregadas). Cada recurso tem timeout (`resourceTimeout`, padrão **4000 ms**) e há um limite total (`maxDuration`, padrão **6000 ms**) — recurso lento ou com erro **não bloqueia**.
- **Uma vez por sessão** (`sessionStorage["jt:preloader-seen"]`): em visitas repetidas na sessão o componente apenas libera (`finish` imediato).
- Saída: conteúdo sobe 12% e some (0.35 s) e a tela é recortada por `clipPath` de baixo para cima (0.7 s, `power4.inOut`). Com reduced motion: apenas fade de 0.2 s e progresso sem tween.
- Ao terminar: remove `body.preloader-active`, chama `onComplete` → `AppReadyContext = true` → libera Lenis e os `TextReveal`.
- Sem JS: um `<noscript><style>` oculta o preloader para não prender o usuário.
- A referência visual usa lime em tela cheia e máscara de glifo; **o preloader do site é outro** (carbon + barra + contador) — decisão autoral já implementada.

## 6. Cursor customizado — `CustomCursor`

- Círculo que segue o mouse com `gsap.quickTo` (0.35 s, `power3.out`); estados definidos em `STATE_CONFIG`: `default` (12 px), `hover` (44 px), `link` (56 px), `view-project` (112 px, rótulo "VIEW PROJECT") e `decode` (96 px, rótulo "DECODE").
- Uso: `data-cursor="hover | link | view-project | decode"`. Links/botões/inputs sem `data-cursor` recebem `link` automaticamente. O retrato do hero usa `decode`.
- **Só ativa com ponteiro fino e sem reduced motion** (`FINE_POINTER_QUERY` e `!REDUCED_MOTION_QUERY`); reavalia quando as preferências mudam. Ignora eventos que não são `pointerType: "mouse"`.
- Reavalia o alvo durante o scroll (conteúdo se move sob o cursor parado).
- `aria-hidden`, `pointer-events: none`, `z-[9999]`; adiciona `body.has-custom-cursor` enquanto ativo.
- Nota: está sempre montado em `AppProviders`; a flag `features.customCursorEnabled = false` **não** o desliga hoje.
- Complemento: `MagneticButton` (atração leve, `strength` 0.35, `quickTo` com `elastic.out(1, 0.5)`), também desativado em touch e com reduced motion.

## 7. Transições de página — `PageTransition`

- Renderiza o `<main id="main-content" tabIndex={-1}>` e reage a mudanças de `usePathname()` (ignora a primeira renderização).
- Entrada: `opacity 0→1` e `y 16→0` em 0.6 s (`power3.out`, com `clearProps` para não criar containing block de `position: fixed`) + barra superior neon lime de 3 px que cresce (`scaleX`, 0.5 s) e some (0.25 s).
- **Sem animação de saída**: não atrasa a navegação; histórico e scroll restoration continuam do Next.
- Acessibilidade: move o foco para o `<main>` (exceto navegação por âncora/hash) e anuncia `Página carregada: <título>` numa região `aria-live="polite"` após 150 ms.
- Com reduced motion: apenas foco + anúncio.
- A flag `features.pageTransitionsEnabled` existe, mas **não é consultada** hoje.

## 8. Reveals de texto — `TextReveal`

- Revela texto linha a linha (SplitText + máscara + `translateY`) quando entra na viewport (`ScrollTrigger`, padrão `start: "top 88%"`, `once: true`).
- Espera o preloader (`useAppReady`) e as fontes antes de dividir; refaz o split no resize; mantém o texto acessível (`aria-label`).
- Oculta o elemento com `useLayoutEffect` antes da pintura para evitar flash do texto completo (exceto com reduced motion).
- Padrões: `duration: 1`, `stagger: 0.08`.

## 9. Hero e WebGL

O efeito "rosto → código" do retrato é descrito em [`digital-identity.md`](digital-identity.md). Pontos de movimento relevantes:

- `frameloop="demand"`: só renderiza durante decode/demonstração.
- Toque: `touch-action: pan-y` (scroll vertical nativo); demo automática **uma vez por sessão** (`sessionStorage["jt:digital-identity-demo"]`) em `pointer: coarse`, com o retrato ≥ 50% visível e após o preloader.
- Tiers gráficos (`low` / `medium` / `high`) reduzem custo em dispositivos modestos.

## 10. Header e tema

`Header` troca a cor do texto (carbon ↔ off-white) conforme a seção atrás dele (`.section-dark`, `.section-graphite` ou `[data-header-tone='dark']`), avaliando em `requestAnimationFrame` no scroll/resize. Transição de cor de 300 ms (CSS). Com menu aberto, `html[data-menu-open="true"]` força `--header-fg` claro.

## 11. Movimento reduzido (`prefers-reduced-motion: reduce`)

| Recurso | Comportamento |
| --- | --- |
| Lenis | Não é inicializado (scroll nativo) |
| Preloader | Fade curto (0.2 s), sem tween de progresso |
| PageTransition | Sem animação; mantém foco e anúncio |
| TextReveal | Texto aparece sem animação |
| CustomCursor / MagneticButton | Desativados |
| Hero WebGL | Apenas `<img>` estático; **three não é baixado** |
| CSS | Há blocos `@media (prefers-reduced-motion: reduce)` em `globals.css` e `sections.css` que neutralizam `scroll-behavior` e transições |

Como testar: DevTools → Rendering → *Emulate CSS media feature prefers-reduced-motion: reduce* → recarregar.

## 12. Estado de validação

- Typecheck, lint, build e 3 testes unitários passam (apenas validação de contato). **Não há testes automatizados de movimento.**
- Comparação visual com a referência e QA manual de motion em dispositivos reais: **pendentes** — ver [`quality-assurance.md`](quality-assurance.md).
- Nenhuma métrica de performance (FPS, Lighthouse, Web Vitals) foi medida e registrada neste repositório.
