# DigitalIdentity — rosto → código

Experiência de assinatura do hero: o retrato de Jefferson é renderizado por um
shader WebGL e, ao redor do mouse (ou do dedo), é **decodificado em código**
lime (`#D2FF00`). Ao sair, o efeito reverte. Shaders, mecânica e textura de
código são autorais — nenhuma parte é cópia de código de terceiros. A
referência é apenas de *comportamento* (hover que revela, ritmo de movimento),
inspirada no que se observa em `landonorris.com`; a técnica, o visual "rosto →
código" e o código são próprios.

**Estado atual:** funcional e integrado ao hero (`HeroSection` →
`PortraitCanvas` → `DigitalIdentity`). O retrato usado é **provisório** (ver
[Assets do retrato](#assets-do-retrato)); a qualidade final do efeito depende do
cutout definitivo.

## Arquivos

| Arquivo | Papel |
| --- | --- |
| `src/shaders/portrait.vert` | Quad em clip-space (ignora câmera) → alinhamento perfeito com o DOM |
| `src/shaders/portrait.frag` | Máscara orgânica, decode por célula, distorção, composição, ruído (**shader em uso**) |
| `src/shaders/decode.frag` | Rascunho alternativo com outros uniforms (`uCodeGrid`, `uCodeScale`); **não é importado** por nenhum componente |
| `src/components/hero/PortraitCanvas/PortraitCanvas.tsx` | Entrada usada pelo hero: `dynamic(..., { ssr: false })` + placeholder `<img>` |
| `src/components/hero/portrait-assets.ts` | Caminhos e `alt` do retrato |
| `src/components/hero/DigitalIdentity/DigitalIdentity.tsx` | Orquestra: fallback, lazy-load, pointer, demo mobile |
| `src/components/hero/DigitalIdentity/PortraitScene.tsx` | `<Canvas>` R3F, carrega texturas, anima uniforms |
| `src/components/hero/DigitalIdentity/CodeTexture.ts` | Gera a textura de código (canvas 2D → `CanvasTexture`) |
| `src/components/hero/DigitalIdentity/FallbackPortrait.tsx` | `<img>` estático (SSR, sem WebGL, reduced motion) |
| `src/lib/code-snippets.ts` | Trechos JS/TS/React/GLSL/CSS/git + tokenizador leve |
| `src/lib/motion.ts` | Defaults GSAP, easing `cinematic`, eventos, `damp`/`clamp` |
| `src/hooks/*` | `usePrefersReducedMotion`, `useWebGLSupport` (+ tier), `usePointerPosition` |
| `loaders/glsl-loader.cjs` + `next.config.ts` | Importa `.vert/.frag` como string (Turbopack e webpack) |

## A técnica

O efeito **não** é um overlay de texto nem uma troca de imagem: o mesmo
fragmento é recomposto matematicamente a partir de duas texturas.

1. **Espaço de tela.** `px = vUv * uResolution` (px CSS). O retrato é encaixado
   em `contain`, ancorado embaixo ao centro, igual ao `<img>` de fallback — o
   crossfade DOM→WebGL é invisível.
2. **Máscara orgânica.** `dist = |px − mouse| / altura`. A distância é
   deformada por *fbm* animado (`blob`) e por ruído fino, de modo que a borda
   "respira" como líquido: `mask = 1 − smoothstep(r·0.25, r, warped)`. O raio é
   `uDecodeRadius × uProgress`.
3. **Decode por célula.** O espaço é dividido na grade de caracteres. Cada
   célula tem um limiar aleatório (`hash21`); `decode = smoothstep(h·0.5,
   h·0.5+0.3, mask)`. No centro tudo é código; na borda só algumas células
   "viram" — decodificação progressiva, pixelada, e totalmente reversível
   porque depende só de `uProgress`.
4. **Distorção.** No anel de transição (`mask·(1−mask)`): deslocamento
   horizontal por linha (glitch), ondulação por fbm e, nos tiers médio/alto,
   separação cromática R/B. Escala com `uDistortion` e com a **velocidade** do
   mouse.
5. **Composição.** O retrato escurece sob a máscara (`base·0.14`), e os glifos
   (canal R da textura de código) entram aditivos em lime. Glifos de destaque
   (keywords/strings, canal G) clareiam. A visibilidade do código é maior nas
   **regiões escuras do rosto** (`vis = 0.45 + 0.55·(1−luma)`): lime sobre
   sombra tem mais contraste. Células na transição "embaralham" o glifo.
6. **Ruído.** Flicker por célula, scanlines e grão, tudo controlado por
   `uNoiseIntensity`. O alpha vem do retrato (recorte transparente), então o
   código só existe dentro da silhueta.

### Uniforms

`uTime`, `uMouse`, `uProgress`, `uResolution`, `uPortraitTexture`,
`uCodeTexture`, `uNoiseIntensity`, `uDistortion`, `uDecodeRadius` — mais
auxiliares: `uImageAspect`, `uCodeSpan`, `uCell`, `uLime`.

### Textura de código

`CodeTexture.ts` desenha cada caractere numa célula de tamanho exato, então a
textura é **periódica** (sem emenda com `RepeatWrapping`). Canal R = glifo,
canal G = destaque. O conteúdo vem de `code-snippets.ts` (stack lida de
`data/technologies.ts` e papel de `config/site.ts`) — só informação já
declarada no site, sem credenciais ou números inventados. Linhas curtas são
empacotadas para formar uma "parede" densa.

Valores por tier (`PortraitScene.tsx`):

| Tier | DPR | Oitavas fbm | Cromática | Textura de código | Colunas |
| --- | --- | --- | --- | --- | --- |
| `high` | 1–2 | 4 | sim | 2048 | 96 |
| `medium` | 1–1,5 | 3 | sim | 2048 | 72 |
| `low` | 1 | 2 | não | 1024 | 52 |

A animação roda em `useFrame` (fora do React): `uMouse` e `uProgress` são
suavizados por `damp` (entrada λ≈5,5, saída λ≈4,5), a velocidade do ponteiro
alimenta `uDistortion` (`distortion · (1 + speed)`) e, em toque/demo, o raio
recebe um *boost* de 1,3×.

## Fallbacks

| Situação | Resultado |
| --- | --- |
| SSR / antes da hidratação | `<img>` estático (`FallbackPortrait`) |
| Sem WebGL (`useWebGLSupport() === false`) | Somente retrato estático; three não é baixado |
| `prefers-reduced-motion: reduce` | Somente retrato estático; three não é baixado |
| Falha ao carregar o cutout PNG | Textura tenta o `jefferson-original.jpg`; se também falhar → estático |
| Erro na cena (error boundary) ou `webglcontextlost` | Volta ao retrato estático (`failed = true`) |
| `<img>` do cutout falha | `onError` troca para o JPG original |
| Cena pronta | Crossfade de 300 ms (`data-digital-identity="webgl"`); o `<img>` permanece no DOM |

## Mobile (demo e toque)

- `touch-action: pan-y`: scroll vertical nativo; arrasto horizontal decodifica.
- Ao soltar o dedo o efeito permanece ~0,9 s e some. Nunca há `preventDefault`.
- **Demo automática** (`autoDemo`, só em `pointer: coarse`): uma vez por
  sessão (`sessionStorage["jt:digital-identity-demo"]`), com o retrato ≥50%
  visível (IntersectionObserver), cena pronta e sem `body.preloader-active`.
  Dura 3,2 s, percorre o rosto em trajetória senoidal e é cancelada se o
  usuário tocar. Em reduced motion/sem WebGL não roda.
- Limitação conhecida: o componente escuta `jt:preloader-done`, mas o
  `Preloader` não dispara esse evento hoje; a demo depende de o
  IntersectionObserver/estado `ready` reavaliarem após o preloader. Se a demo
  não iniciar em um aparelho real, é o primeiro ponto a verificar.

## Assets do retrato

Pasta `public/images/portrait/` (estado em `ASSET_STATUS.md`):

| Arquivo | Uso | Estado |
| --- | --- | --- |
| `jefferson-cutout.png` (800×800 RGBA) | Retrato principal (`PORTRAIT_SRC`): textura do shader, `<img>` do hero e do `About` | **Provisório** — recorte por máscara elíptica; **trocar por cutout profissional** (fundo transparente, óculos e boné preservados) |
| `jefferson-original.jpg` (800×800, tons de cinza) | Fallback de erro e imagem do JSON-LD | Provisório (foto de teste) |
| `jefferson-transparent.png`, `jefferson-provisional.png` | Variantes de teste | **Não referenciadas** no código |

Requisitos para o asset definitivo: PNG/WebP com alpha limpo (o alpha define a
silhueta onde o código aparece), enquadramento com cabeça e ombros, base do
retrato encostada na borda inferior (o layout ancora embaixo ao centro) e
lado ≥ 1600 px para telas de alta densidade. Ao substituir, mantenha o nome ou
atualize `portrait-assets.ts` **e** `FallbackPortrait.tsx` (ambos definem
`PORTRAIT_SRC`).

O mockup aprovado da home **não foi encontrado no disco**; a validação visual
do hero contra o mockup ainda está pendente.

## Performance

- `next/dynamic` com `ssr: false` (dentro de um Client Component): three/R3F
  só são baixados se há WebGL **e** não há `prefers-reduced-motion`.
- `frameloop="demand"`: o loop só roda enquanto há decode/demonstração; parado,
  a GPU descansa.
- Estado do ponteiro fica fora do React (sem re-render por `mousemove`).
- Tiers (`useGraphicsTier`): `low` (≤4 núcleos / ≤4 GB / save-data → DPR 1,
  fbm 2 oitavas, sem cromática, textura 1024), `medium` (toque), `high`.
- Perda de contexto WebGL ou erro → volta ao retrato estático.

## Acessibilidade e mobile

- `prefers-reduced-motion` ou sem WebGL → somente `FallbackPortrait`.
- O `<img>` (com `alt`) permanece sempre no DOM; o canvas é `aria-hidden`.
- Toque: `touch-action: pan-y` — scroll vertical continua nativo; toque/arrasto
  horizontal decodifica; ao soltar o efeito some após ~0,9 s. Nunca usamos
  `preventDefault`.
- Demo automática **uma vez por sessão** em dispositivos `pointer: coarse`,
  quando o retrato está ≥50% visível e depois do preloader.

## Uso

```tsx
// Pai define o tamanho (o componente ocupa 100%).
<div className="relative aspect-square w-[min(100vw,100svh)]">
  <DigitalIdentity />
</div>
```

Props: `src`, `fallbackSrc`, `alt`, `decodeRadius` (0.27), `noiseIntensity`
(0.65), `distortion` (1), `autoDemo` (true), `priority` (true).

O wrapper expõe `data-cursor="decode"`: o `CustomCursor` entra no estado
*decode* sobre o retrato.

## Como testar

1. `npm run dev` e abra `/` (o hero consome `PortraitCanvas` → `DigitalIdentity`).
2. Passe o mouse sobre o rosto: o decode nasce sob o cursor, a borda ondula;
   tire o mouse: reverte.
3. Reduced motion: DevTools → Rendering → *Emulate prefers-reduced-motion* →
   recarregue; deve aparecer só a imagem estática (sem baixar three).
4. Sem WebGL: `chrome://flags` → desabilitar WebGL (ou bloquear no DevTools).
5. Mobile: DevTools device mode (toque) → a demo roda uma vez; limpe
   `sessionStorage` (`jt:digital-identity-demo`) para repetir. Confirme que o
   scroll vertical sobre o retrato continua funcionando.
6. Performance: Performance panel — com o mouse parado e sem decode, não deve
   haver frames de GPU contínuos.

## Ajustes finos

- Raio/forma: `decodeRadius`, e os fatores `0.62` (deformação) / `0.25`
  (suavidade da borda) em `portrait.frag`.
- Densidade/tamanho do código: `charPx` (7.5/9 px) em `PortraitScene.tsx` e
  `cols` por tier.
- Mais/menos "lime": multiplicador `1.55` dos glifos e brilho de borda `0.28`.
