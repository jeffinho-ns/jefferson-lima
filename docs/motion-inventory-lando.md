# Inventário de animações — landonorris.com (observado)

Data: 26/11/2026 · Viewport 1440×900 · Ferramentas: browser MCP + CDP  
Objetivo: mapear comportamentos públicos para portar (de forma autoral) ao site Jefferson Teixeira.

## Stack observada

| Tecnologia | Evidência |
|---|---|
| Three.js r174 | `window.__THREE__`, canvas `.gl` 1440×900 |
| Lenis | `html.lenis`, `lerp: 0.1` |
| GSAP / ScrollTrigger | sticky tracks + cenas pinadas |
| Rive | canvases pequenos (botões / preloader) |
| Taxi.js | wrapper `.taxi-w` (transições de página) |
| Easing global | `cubic-bezier(0.65, 0.05, 0, 1)` · `0.75s` |
| Lime | `#d2ff00` |

## Sequência de cenas (home)

1. **Preloader** — fullscreen lime `#d2ff00`, rótulo "LOAD NORRIS", glifo animado; transição cinematográfica revelando o hero.
2. **Hero pinado** (track 2×vh) — retrato + WebGL capacete em fatias orgânicas reativas ao ponteiro; card NEXT RACE canto inferior esquerdo; fundo off-white + blobs + linhas topográficas.
3. **Hero → mensagem** (2ª metade do pin) — fundo vira verde-escuro; foto vira "cartão"; marquee / mensagem.
4. **Statement** — fundo `#282c20`; tipografia mista sans+serif; palavras-chave em lime; reveal por linhas.
5. **Horizontal track** — scroll vertical vira trilha horizontal de fotos/citações.
6. **ON TRACK / OFF TRACK** — duas portas espelhadas (capacete vs perfil); tipografia serif+sans; setas lime.
7. **Helmets Hall of Fame** — fundo preto; grade de cards com canto entalhado.
8. **Store / Champion** — collage de produtos.
9. **Partners** — marquee de logos + assinatura lime.
10. **Socials** — leque de cards.
11. **Footer** — painel escuro + transição para lime.

## Animações-chave (comportamento)

### A. Capacete / máscara WebGL (hero)
- Duas camadas: foto real + textura de capacete.
- Revelação em **fatias orgânicas** (não círculo) ao redor do ponteiro.
- Borda irregular / “shatter”; reversível ao tirar o mouse.
- **Portar para JT:** DigitalIdentity (rosto → código lime), já iniciado; reforçar fatias + face mask.

### B. Sticky / pin + troca de fundo
- Hero e OTOT usam sticky tracks.
- Fundo e tema do header mudam por seção (claro ↔ `#282c20` ↔ preto ↔ creme).
- **Portar:** ritmo editorial já existe; reforçar pin/transitions entre seções.

### C. Text reveal
- Títulos grandes, split por linha/caractere, palavras serifadas lime.
- **Portar:** TextReveal GSAP nas seções Philosophy / Contact / Modes.

### D. Menu fullscreen
- Overlay `#282c20`; grade 2×2 de fotos duotone; links ~70px; item ativo com squiggle lime; ESC / botão X; scroll lock.
- **Portar:** Navigation já existe; alinhar tipografia, hover e grid fotográfico.

### E. Scroll suave
- Lenis lerp 0.1 + sync ScrollTrigger.
- **Portar:** SmoothScroll já usa Lenis 0.1.

### F. Dual universe (On/Off Track)
- Composição simétrica, duas CTAs, tipografia de impacto.
- **Portar:** DEVELOPMENT / CREATIVE MODE — reforçar simetria e hover das portas.

### G. Cards com canto entalhado
- Helmets e Next Race usam clip/entalhe.
- **Portar:** AvailabilityBadge + cards de projetos.

### H. Horizontal scroll
- Trilha pinada com collage.
- **Portar (opcional):** Featured projects ou process em horizontal no desktop.

## Prioridade de aplicação no site JT

1. Hero DigitalIdentity mais “fatiado”/orgânico (paridade com capacete).
2. Statement tipográfico (Philosophy) com reveal + palavras lime.
3. Menu fullscreen: tipografia grande + hover lime + fotos.
4. Modes (Dev/Creative) espelhando OTOT.
5. Transições de fundo / header theme por seção.
6. (Opcional) horizontal scroll e marquee.

## Limitações desta inspeção

- Input real de mouse limitado (eventos sintéticos).
- Timing exato de cada tween não medido com frame-by-frame.
- Código proprietário não foi lido — apenas comportamento público.
