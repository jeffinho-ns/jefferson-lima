# Referência Visual — Home de `landonorris.com`

> **Agente 01 — Creative Direction / UI/UX**
> **Objetivo:** engenharia visual da HOME como referência de *comportamento, proporção e ritmo* para um site **autoral** (Jefferson Teixeira). **Não** é um guia para copiar código, marca, fotos, logotipos, textos ou assets.
> **Data da análise:** 26/11/2026 · **URL:** https://landonorris.com/ · **Ferramentas:** `cursor-ide-browser` (navegação, snapshot de acessibilidade, screenshots, CDP `Runtime.evaluate` / `Emulation.setDeviceMetricsOverride`).

## 0. Convenções de confiança

Cada afirmação carrega (explícita ou implicitamente) um nível:

| Marca | Significado |
|---|---|
| **[MEDIDO]** | Lido do DOM/CSS computado (`getBoundingClientRect`, `getComputedStyle`, variáveis CSS, `window.*`). Valor numérico confiável para o viewport indicado. |
| **[VISTO]** | Observado em screenshot, sem número exato no DOM. Valores em % ou px são **estimativas visuais**. |
| **[INFERIDO]** | Dedução a partir de nomes de classe, rótulos ou comportamento. Pode estar errada. |
| **[NÃO VERIFICADO]** | Não foi possível inspecionar. Listado na seção 14. |

Medidas em px são em **CSS px** no viewport indicado. Posições `y` de seção são em coordenadas de documento (scroll Y = 0 no topo).

---

## 1. Resumo executivo (o que realmente define essa home)

1. **Hero editorial de rosto central sobre fundo quase branco.** Foto recortada (cabeça + ombros) centralizada, fundo `#fcfcf8` com formas orgânicas cinza-esverdeadas e linhas topográficas finas. Header mínimo: marca à esquerda, mini-glifo central, CTA lime + botão de menu à direita.
2. **Um único acento cromático (lime `#d2ff00`)** sobre uma base verde-escura (`#282c20`), off-white (`#f4f4ed`) e preto quente (`#111112`). Todo o resto é neutro.
3. **Tipografia de contraste:** grotesca pesada condensada-ish (Mona Sans Variable, 700, caixa-alta, tracking negativo) **misturada** com serifa display de alto contraste (Brier, 700) para a palavra-chave de cada título ("Redefining", "ON", "OFF", "Champion", "Hall of Fame"…).
4. **Página = sequência de "cenas" pinadas (sticky) + rolagem suave.** Smooth scroll via Lenis, animação via GSAP/ScrollTrigger, 3D/shader via Three.js (WebGL em canvas fixo atrás do conteúdo), animações vetoriais via Rive. Cada cena tem fundo próprio (claro → verde-escuro → cinza → creme → preto → creme → verde-escuro) e o fundo **transiciona** entre elas.
5. **Efeito de capacete (hero):** o rosto é "fatiado" por um efeito de deslocamento em WebGL que revela o capacete sobre o rosto em faixas orgânicas; reage a ponteiro (confirmado com eventos sintéticos) e parece também evoluir sozinho. Em toque, vira modo "tap to lock / swipe".
6. **Elemento fixo de contexto no canto inferior esquerdo:** cartão "NEXT RACE" (circuito + nome do GP + selo "McLaren F1 since 2019") com canto superior-esquerdo entalhado. É `position:absolute` dentro do hero pinado (não `fixed` de verdade), então permanece no canto inferior esquerdo durante toda a cena do hero e some depois.
7. **Responsivo por tokens fluidos:** `rem` do `<html>` escala com a largura da viewport (≈ `vw/1728*16` entre 992–1920 px), então **todas** as proporções do desktop se mantêm. Abaixo de 992 px muda o layout (tablet/mobile).

---

## 2. Stack observada (apenas para entender o comportamento)

**[MEDIDO]** via globais/scripts:

| Item | Valor |
|---|---|
| Plataforma | Webflow (`window.Webflow`, `w-mod-js`, CDN `website-files.com`), jQuery 3.5.1 |
| Scripts custom | `lando.itsoffbrand.io/dev-js/lando-by-OFF+BRAND.05.js` + 2 bundles `lando-offbrand.*.js` (agência: OFF+BRAND) |
| Smooth scroll | **Lenis 1.1.20** (`html.lenis`; `lerp: 0.1`, `smoothWheel: true`, `syncTouch: true` em mobile) |
| Animação | **GSAP 3.13.0** (+ `themeScrollTriggers` exposto) |
| 3D / shader | **Three.js r174** (`window.__THREE__ = "174"`), canvas `.gl` 1:1 do viewport |
| Vetor animado | **Rive** (canvas `.transition-rive`, `.mob-landscape-rive`, botões `btn-rive-w`) |
| Split de texto | classes `line` / `char` (SplitType-like) → reveal por linha/caractere |
| Navegação entre páginas | Wrapper `.taxi-w` **[INFERIDO]**: Taxi.js (transições de página) |
| Fontes | `Brier` 700 (serifa display) e `Mona Sans Variable` 200–900 (grotesca) |

> A estrutura sugere que **todo o fundo, o hero com capacete, o card do portfólio e as assinaturas "script" são renderizados em WebGL**, não em DOM — por isso o texto do marquee gigante e a assinatura lime **não aparecem no DOM/snapshot** (ver seção 14).

---

## 3. Design tokens (variáveis CSS `:root`) **[MEDIDO]**

### 3.1 Cores

| Token | Hex | Uso observado |
|---|---|---|
| `--color--lime` | `#d2ff00` | CTA, preloader, ícones, sublinhados, assinatura |
| `--color--lime-off` | `#b2c73a` | Palavras serifadas destacadas em fundo escuro (Redefining, Hall of Fame, Bringing the fight) |
| `--color--dark-green` | `#282c20` | Fundo escuro principal, texto sobre claro, menu overlay |
| `--color--black` | `#111112` | Seção "Helmets", textos sobre claro |
| `--color--white` | `#f4f4ed` | Fundo creme (On/Off Track, Store, Socials, Footer), texto sobre escuro |
| `--color--cream` | `#efefe5` | Auxiliar |
| `--color--green-light` / `grey-1` | `#ebeee0` | Auxiliar |
| `--color--green-off-white-1` | `#dde1d2` | Texto grande sobre verde-escuro, links do menu |
| `--color--green-off-white-2` | `#b4b8a5` | Eyebrows/legendas sobre escuro, link "atual" no menu |
| `--color--grey-on-track` | `#b9bbad` | Fundo cinza da seção horizontal; parágrafo sobre preto |
| `--color--grey-2` | `#c8cbbd` | Auxiliar |
| `--color--dark-green-tint-1` | `#3b3c38` | — |
| `--color--dark-green-tint-2` | `#535450` | Borda dos cards de capacete; eyebrow "Next race" |
| `--color--orange` | `#ff6b00` | Definido, **não** visto na home |

**[MEDIDO por pixel, hero 1440]:** fundo `#fcfcf8`; manchas orgânicas `#e8e8e4` / `#f4f4f0`; linhas topográficas ≈ `#e3e3e1` (1px).

### 3.2 Espaçamento, raio, easing

| Token | Valor | Em 1440 px (rem≈13.33) |
|---|---|---|
| `--padding--container` / `--gap` | `1.25rem` | ≈ 16.7 px (margem lateral do header, do card Next Race, etc.) |
| `--padding--mini / small / med / large / xlarge` | 1 / 2 / 3 / 4 / 5 rem | — |
| `--radius--small / med / large` | 1 / 3 / 6.25 rem | — |
| `--grid-col` | `25.4375rem` | **339 px** (= largura do card de capacete) |
| `--grid-spacer` | `31.51vh` | — |
| `--oval-side-offset` | `3rem` | Curva elíptica nas bordas de seção |
| `--cubic-default` | `cubic-bezier(0.65, 0.05, 0, 1)` | Easing global ("expo in-out" suave) |
| `--duration-default` | `0.75s` | Duração global de UI |
| `--min-width` / `--max-width` / `--design-width` | `992px` / `1920px` / `1728` | Faixa fluida; **design em 1728** |
| `--fluid-font` | `calc(clamp(992px,100vw,1920px) / 1728 * 16px)` | Escala fluida |

### 3.3 Escala tipográfica (tokens)

| Token | rem | Observação |
|---|---|---|
| `--text--impact` | 7.9375 | Título gigante (ON/OFF TRACK) — efetivo ≈ 117 px @1728 |
| `--text--h1` / `h2` / `h3` / `h4` / `h5` / `h6` | 4 / 4.5 / 2 / 1.5 / 1.2 / 1 | — |
| `--text--med` / `reg` | 2.76 / 1.6 | — |
| `--text--btn-nav` / `primary` / `footer` | 1.25 / 1 / 1.875 | — |
| `--text--eyebrow` | 0.578125 | Legenda mínima (≈ 8.3 px @1440) |

---

## 4. Estrutura da página (HOME) e mapa de seções

Containers: `.page-w > main.main-w > .taxi-w > [seções]`. Fixos fora do fluxo: `.nav`, `.nav-menu-w`, `.scroll-indicator`, `.transition-w` (preloader), `.gl-wrap` + `.gl-background` (WebGL, `z-index:-1`).

### 4.1 Altura total da página por viewport **[MEDIDO]**

| Viewport | `scrollHeight` | Altura do track do hero |
|---|---|---|
| 1920×1080 | 17 156 px | 2160 (= 2×vh) |
| 1440×900 | 13 578 px | 1800 (= 2×vh) |
| 1280×720 | 11 439 px | 1440 |
| 1024×768 | 10 662 px | 1536 |
| 768×1024 | 15 024 px | 2048 |
| 390×844 | 10 080 px | 1688 |

### 4.2 Seções @1440×900 **[MEDIDO]** (y de documento · altura)

| # | Seção (classe) | y | Alt. | Fundo | Resumo |
|---|---|---|---|---|---|
| 0 | `.home-title-w` | 0 | 0 | — | `H1` "Lando Norris" + `H2` "2025 McLaren Formula 1 Driver" **só para leitores de tela** (1×1 px, `screen-reader`) |
| 1 | `.sticky-track.home-hero` | 0 | **1800** | claro `#fcfcf8` → escuro | **Hero pinado.** `.sticky-item` de 900 px (100vh) fica `position:sticky`. Primeira metade = rosto + capacete; segunda = foto vira "cartão" cinza sobre verde-escuro com **marquee gigante** + "Message from Lando" + assinatura |
| 2 | `section.s` (statement) | 1800 | 1029 | verde-escuro `#282c20` | Eyebrow "McLaren F1 since 2019" + **declaração em 7 linhas** 105.8 px |
| 3 | `section.s.is-horizontal-track` | 2829 | **3143** | verde-escuro → cinza `#b9bbad` | **Scroll horizontal pinado**: trilha de 4583 px com ~10 fotos "collage" + 2 citações |
| 4 | `.sticky-track.is-home-otot` | 5972 | **1800** | creme `#f4f4ed` | **ON TRACK / OFF TRACK** (duas portas), fotos de capacete (esq.) e perfil (dir.) |
| 4b | `.s.is-otot-end` | 6872 | 900 | foto | Foto full-bleed de transição |
| 5 | `.s-group.bg-black` → `.home-helmets` | 7772 | 1696 | preto `#111112` | **"Helmets / Hall of Fame"**: grade 4 colunas de cards de capacete |
| 5b | `.s` (CTA helmets) | 9468 | 476 | preto → creme (borda elíptica) | Ícone + título (reveal) + botão lime "View on track" |
| 6 | `.s.is-lando-exe` | 9944 | 907 | creme | **Loja:** "World Drivers' Champion" + collage de produtos |
| 7 | `.s.is-home-collabs` | 10851 | 795 | creme | **"Partners & Campaigns"** + faixa de logos em marquee + assinatura lime |
| 8 | `.s.is-callout-socials` | 11646 | 965 | creme | **"What's up on socials"** + leque de 7 cartões |
| 9 | `.s.is-footer` | 12612 | 967 | creme → lime (gradiente) | Painel verde-escuro arredondado com entalhe, "Always bringing the fight.", links, logos, CTA |

### 4.3 Mapa mobile 390×844 **[MEDIDO]**

hero 0–1688 · statement 1688–2211 · horizontal 2211–4103 (1892) · on/off track 4104–5454 (1350) · helmets 5454–7583 · store 7583–8110 · partners 8110–8540 · socials 8540–9284 · footer 9284–10081.

---

## 5. Hero — composição fotográfica **[VISTO]** (+ medidas)

Referência: `home-1440x900-hero.png`.

- **Sujeito:** retrato frontal, cabeça + ombros, **centralizado horizontalmente** (centro do rosto ≈ **50–51 % da largura**, ~730 px em 1440).
- **Enquadramento vertical:** topo do cabelo ≈ **11–12 % da altura** (≈ 100 px); queixo ≈ **70 %**; ombros/camisa **sangram para fora do rodapé**. Cabeça ocupa ≈ 55–60 % da altura do viewport; largura do conjunto cabeça+capacete ≈ **40 %** da largura (≈ 575 px em 1440); ombros na base ≈ **60–65 %** da largura.
- **Olhar:** direto para a câmera, olhos ≈ 33–36 % da altura (linha dos olhos no terço superior).
- **Fundo:** `#fcfcf8` quase branco (alto key, sem sombras duras) + manchas orgânicas `#e8e8e4`/`#f4f4f0` + **linhas topográficas** de 1 px. O fundo **se move** (muda de forma entre capturas).
- **Capacete (camada 3D):** cúpula translúcida/"wireframe" sobre a cabeça; faixas de textura amarelo/preto + faixa branca "visor espelhado" + logos de patrocinadores, em **fatias orgânicas** (bordas curvas, não retas).
- **Header minimalista:** 83 px de altura, **sem fundo** (transparente), nada além de 4 elementos (logo, glifo, CTA, menu). Todo o resto da tela é imagem.
- **Cartão "NEXT RACE"** no canto inferior esquerdo (seção 9).
- **Responsivo da composição:**
  - Desktop (≥ 992): sujeito centrado, margens laterais grandes e vazias → respiro editorial.
  - Tablet 768×1024: retrato **maior** (cabeça ≈ 50 % da largura; ombros sangram nas duas laterais), logo centralizado **acima** do rosto (lockup + tagline "McLaren F1 since 2019"), Store à **esquerda**, menu à direita.
  - Mobile 390×844: rosto ocupa **100 % da largura**; topo do cabelo ≈ 25 % da altura; ombros/camisa preenchem o terço inferior; sem card Next Race.

---

## 6. Elementos fixos / UI persistente

### 6.1 Header (`.nav`) — `position: fixed`, `z-index` alto, fundo transparente **[MEDIDO]**

| Viewport | Altura nav | Logo (x,y,w,h) | Mini-glifo central | Botão Store | Botão menu |
|---|---|---|---|---|---|
| 1920×1080 | 111 | 22,22 · 175×80 | 49×49 @ x=936,y=31 | 157×80 @ x=1648 | 80×80 @ x=1818 |
| 1440×900 | 83 | 17,17 · 131×60 | 37×37 @ x=702,y=23 | 118×60 @ x=1235 | 60×60 @ x=1363 |
| 1280×720 | 74 | 15,15 · 117×53 | 33×33 @ x=624,y=21 | 105×53 @ x=1098 | 53×53 @ x=1212 |
| 1024×768 | 59 | 12,12 · 94×43 | 26×26 @ x=499,y=17 | 85×43 @ x=878 | 43×43 @ x=970 |
| 768×1024 | 56 | **oculto** (`display:none`; lockup vai para o corpo do hero) | 24×24 @ x=372,y=47 | 66×33 @ x=11,y=11 (**esquerda**) | 33×33 @ x=724,y=11 |
| 390×844 | 78 | **oculto** | 27×27 @ x=181,y=63 | 84×51 @ x=13.5,y=13.5 (**esquerda**) | 51×51 @ x=325.5 |

Regras que emergem:
- **Margem do header = `1.25rem`** (≈ 1.16 % da largura). Altura do botão = 4.17 % da largura (60/1440); botão menu é **quadrado** (60×60) com raio ≈ 9.9 px e **borda 1.5 px** (outline) no hero.
- **Store:** fundo `#d2ff00`, raio **7.2 px**, borda 1 px lime, texto "STORE" 700 caixa-alta + ícone sacola; largura ≈ 2× a altura.
- **Logo (SVG inline, `.nav-brand`):** lockup empilhado de 2 linhas — "LANDO" em serifa fina de alto contraste, "NORRIS" em grotesca bold. **[MEDIDO]** no topo da página o logo e o grupo de botões têm `transform: scale(1.2)`; **[VISTO]** ao rolar eles encolhem para 1.0 (logo 131→≈110 px; Store 116→≈98 px).
- **Troca de tema do header por seção** (`hero-nav-theme is-1/is-2`, `themeScrollTriggers`): logo/ícones mudam de `#282c20` → `#f4f4ed` sobre fundos escuros; o botão de menu passa de *outline escuro* para **preenchido off-white** com glifo escuro; Store permanece lime. Transição de cor `0.75s` com o easing global.
- **Glifo central (`.nav-middle`)**: link para home, visível **só no estado hero** (some ao rolar).

### 6.2 Cartão "NEXT RACE" (canto inferior esquerdo) — o "indicador de disponibilidade/próxima corrida"

> Na verdade **não é "availability"**: o conteúdo é **próxima corrida** (circuito + GP). Registre isso para não usar o rótulo errado.

**[MEDIDO]** (`.home-hero-next-race-w`, `position:absolute; z-index:10` dentro do `.sticky-item` do hero):

| Viewport | x,y | Largura × Altura | Folga p/ borda inferior |
|---|---|---|---|
| 1920×1080 | 22, 787 | 132 × 271 | 22 |
| 1440×900 | 17, 680 | **99 × 203** | 17 |
| 1280×720 | 15, 525 | 88 × 181 | 15 |
| 1024×768 | 12, 612 | 70.5 × 145 | 12 |
| 768×1024 | 11, 877 | 66 × 136 | 11 |
| 390×844 | — | **`display:none`** | — |

- Proporção estável **≈ 0.49 (L/A)** e **largura ≈ 6.9 % da viewport** no desktop; encostado em `1.25rem` da esquerda e de baixo.
- **Anatomia [VISTO]:** contorno de 1 px com **canto superior-esquerdo entalhado** (o rótulo "NEXT RACE" ocupa o entalhe) → ícone/canvas animado do **traçado do circuito** (muda de forma entre capturas — animado) → divisor → "LUSAIL GP" → laurel + ícone de capacete → "MCLAREN F1 SINCE 2019" (2 linhas). Tipografia: eyebrow **8.33 px @1440**, 400, caixa-alta, cor `#535450`.
- **Comportamento [MEDIDO + VISTO]:** transição `clip-path 0.75s cubic-bezier(0.65,0.05,0,1)`. Ao rolar para fora do hero, o card **colapsa por clip-path** (a 450 px de scroll já é só uma linha) e o selo "McLaren F1 since 2019" aparece, **como parte da cena seguinte**, no centro da tela (screenshot `scroll-1300`).
- É clicável (link "Lusail gp", `#e5` no snapshot) **[MEDIDO: elemento `a` existe]**; destino não testado.

### 6.3 Indicador de scroll custom (`.scroll-indicator`) — `fixed`, borda direita

- **[MEDIDO]** 6 px de largura, altura = **80 % do viewport** (720 px em 900), `top: 90 px` (≈ 10 % do viewport) e encosta a 0 px da borda direita (x=1434); a barra interna (`scroll-indicator-bar`) tem **72 px** (10 % do trilho), `rgba(255,255,255,0.75)`.
- **[VISTO]** aparece em seções escuras como barra cinza fina; substitui a scrollbar nativa.

### 6.4 Overlay do preloader / transição (`.transition-w`)

`position: fixed; inset:0; z-index: 9999; pointer-events: none;` com canvas Rive 100 %×100 % e um rótulo-botão lime "Load Norris" (`.transition-btn`, `opacity 0`, `transition: opacity .3s`). Ver seção 8.

---

## 7. Tipografia e hierarquia **[MEDIDO @1440×900]**

### 7.1 Famílias

- **Mona Sans Variable** (200–900): corpo, rótulos, títulos de impacto em *sans*. Títulos sempre **700, `text-transform: uppercase`, letter-spacing negativo** (−2.9 a −3.3 px nos 93–97 px; −1.67 px nos 60 px; −0.83 px nos 106 px da declaração).
- **Brier** (700): serifa display de alto contraste, usada **dentro do mesmo título** para a palavra-chave. Também em **corpo de citação** (20 px regular, cor `#b4b8a5`, com palavras-chave em `#dde1d2`).
- Relação: o par *Brier + Mona* aparece em duas linhas ("ON" serifa / "TRACK" sans; "WORLD DRIVERS'" sans / "CHAMPION" serifa; "WHAT'S UP" sans / "ON SOCIALS" serifa) ou inline ("**Redefining** limits," – palavra serifa lime, resto sans).

### 7.2 Escala efetiva (px)

| Papel | Fonte | Tamanho / line-height / tracking | Cor | Onde |
|---|---|---|---|---|
| Declaração | Mona 400 + Brier 700 (destaques) | **105.8 / 95.25 / −0.83**; destaque 110 / 91.3 / −2.5 | `#dde1d2`; destaque `#b2c73a` | Seção 2 |
| Impacto (ON / OFF) | Brier 700 | **97.5 / 78.98 / −2.92** | `#282c20` | Seção 4 |
| Impacto (TRACK) | Mona 700 | **93.3 / 79.3 / −3.33** | `#282c20` | Seção 4 |
| Título loja (WORLD DRIVERS' CHAMPION) | Mona + Brier 700 | **93.3 / 75.6 / −3.33** | `#282c20` | Seção 6 |
| Título seção (HELMETS, WHAT'S UP) | Mona 700 | **60 / 53.2 / −1.67** | `#f4f4ed` / `#111112` | Seções 5, 8 |
| Título seção serifa (HALL OF FAME, &CAMPAIGNS) | Brier 700 | **62.5 / 55.4 / 0** (e −1.67) | `#b2c73a` / `#282c20` | Seções 5, 7 |
| Footer slogan | Brier 700 lime-off + Mona | **72.5 / 62.06 / −1.67** | `#b2c73a` / `#f4f4ed` | Footer |
| Link do menu | Mona 400, caixa-alta | **70 / 65.8 / normal** | `#dde1d2` (atual `#b4b8a5`) | Menu |
| Parágrafo | Mona 400 | **16.67 / 20.8** | `#282c20` (claro) / `#b9bbad` (escuro) | Seções 5–7 |
| Citação | Brier 400 | **20 / 19** | `#b4b8a5` + `#dde1d2` | Seção 3 |
| Label de card | Mona 600 | **12 / 15**; ano 700 lime | `#f4f4ed`; ano `#d2ff00` | Helmets |
| Eyebrow / legenda | Mona 400, caixa-alta | **8.33 / 8.33** | varia | Tudo |
| Legal (rodapé) | Mona 600/800 | 10 / 12.5; botões 13.3 / 13.3 | `#282c20` | Footer |
| Base | Mona | 14 / 20 | — | UI |

### 7.3 Hierarquia / regras de ritmo

- Apenas **3 camadas**: (1) título de impacto (60–110 px) → (2) parágrafo 16–20 px → (3) eyebrow 8–12 px. Não há tamanhos intermediários.
- **Linha apertada:** line-height 0.82–0.90 × o tamanho nos títulos grandes (empilhamento quase colado).
- Eyebrow é o *menor* possível (≈ 8 px @1440) e sempre em caixa-alta — vira um "detalhe técnico", como etiqueta.
- A hierarquia semântica (`h1`, `h2`) existe **somente via `screen-reader`** no topo; os títulos visuais são `h2` e `h3`.

### 7.4 Escala por viewport (título de impacto "ON") **[MEDIDO]**

| Viewport | 1920 | 1440 | 1280 | 1024 | 768 | 390 |
|---|---|---|---|---|---|---|
| `font-size` | 130 | 97.5 | 86.7 | 69.3 | 65 | 43.3 |
| `<html>` font-size | — | ≈ 13.33 | 11.85 | 9.48 | 8.89 | 10.83 |

**Fórmula observada:** no intervalo fluido (992–1920 px) `html font-size = vw/1728·16`; o impacto vale **≈ 117 px @1728** (design). Tablet e mobile usam bases próprias (768 → 8.89 px; 390 → 10.83 px).

---

## 8. Preloader / intro **[VISTO + MEDIDO]**

Screenshots: `home-1440x900-preloader.png`, `home-1024x768-preloader-exit-logo-mask.png`.

1. **Tela cheia lime `#d2ff00`** (cobre o hero inteiro, z 9999).
2. **Centro:** glifo "L7" (marca da casa) **animado em Rive** (se desenha/morfa; ~55–60 px @1440).
3. **Rodapé central:** rótulo "LOAD NORRIS" (caixa-alta, bold, ~8 px @1440), ≈ 4 % acima da borda inferior.
4. **Saída (desktop) [VISTO]:** o glifo "cresce" como **máscara** — o rosto do hero aparece *dentro* da forma do glifo enquanto ela se amplia até preencher a tela (frame 1024×768).
5. **Saída (mobile) [VISTO]:** painéis lime **inclinados (paralelogramos)** deslizam para fora, revelando o hero (frame 390×844).
6. **Duração:** `DOMContentLoaded` ≈ 4.3 s no 1º carregamento **a frio**; a saída completa levou **~8–25 s neste ambiente** (conexão/CPU de teste e peso de assets WebGL). **[NÃO VERIFICADO]** a duração mínima "de design".
7. O mesmo overlay (`.transition-w` + canvas Rive) é provavelmente reutilizado para **transições entre páginas** **[INFERIDO]**.
8. Lenis só entra depois (`html.lenis` ausente nas primeiras leituras; aparece ~ao fim do preloader).

---

## 9. Animações de entrada, scroll e reveals

### 9.1 Scroll
- **Smooth scroll** Lenis (`lerp: 0.1`) — inércia leve, sem "snap".
- **Seções pinadas** com `position: sticky` (`.sticky-track` > `.sticky-item`): hero (2×vh), horizontal (3143 px @1440), On/Off Track (2×vh).
- **Scroll → fundo:** a cor do fundo faz crossfade entre cenas (claro → `#282c20` entre 0 e ~900 px; `#282c20` → `#b9bbad` durante a faixa horizontal; cinza → creme no On/Off Track; creme → preto; preto → creme com **borda elíptica** convexa (`--oval-side-offset`)).
- **Hero → cartão:** entre 0 e ~900 px o retrato **encolhe** (de tela cheia para um cartão ~**472×305 @1440**, ≈ 33 % da largura, proporção ≈ 1.55) e muda para **monocromático/dessaturado**, enquanto o fundo vira verde-escuro. O cartão fica centrado sob o marquee. **[MEDIDO]** alvo = `.marquee-gl-target` 472×305 @ x=484.
- **Marquee gigante (cena "Message from Lando")**: duas linhas — a de cima em **serifa lime-off**, a de baixo em **sans off-white**, ambas cortadas pelas bordas e com deslocamento horizontal diferente entre as duas linhas (comparando `scroll-0900` e `scroll-1300`); direção/velocidade exatas **[NÃO VERIFICADO]**. O texto é renderizado em WebGL → só trechos legíveis: "…HOME WE D…", "…A BRITISH G… / …WEEKEND I WILL R…", "…WE DID IT A…" (frase completa **[NÃO VERIFICADO]**). Assinatura em script lime (traço desenhado) cruza o cartão.
- **Declaração (seção 2)**: texto em 7 linhas centralizadas, revelado **linha a linha por faixas lime** que "limpam" (bloco lime cobre a linha → desaparece mostrando o texto) **[VISTO em `scroll-1300`]**. Linhas: `x` crescente/decrescente → forma de "ampulheta" (linhas curtas no topo e no fim, longas no meio: 593→986→1063→1067→799→353 px de largura).
- **Horizontal (seção 3)**: `.horizontal-track` de **4583 px** transladada em X (`translateX −2171 px` medido com `scrollY=4100`); fotos têm **paralaxe individual** (`transform: translateX` próprios, ex. +52 px, +4 px). Legendas (eyebrow) com **tarja lime** que se retrai revelando o texto. Algumas fotos em **P&B/duotone** (FIA Prize Giving, High Performance Gala, Qatar) e outras coloridas. Citações em serifa 20 px com assinatura vetorial lime embaixo.
- **Helmets**: cartões entram escalonados; **imagens carregam sob demanda** (alguns cards vazios até entrarem na tela — `scroll-8300`).
- **Loja / Partners / Socials**: títulos com **reveal em faixas lime/escuras** (blocos cinza-escuros "tampando" o texto durante a entrada — `scroll-9500`, `scroll-11150`); logos em **marquee horizontal contínuo**; assinatura "Collab" lime gigante sobreposta; cartões sociais em **leque** (rotação ± ~25°, raio ≈ 3rem).
- **Texto**: todos os textos usam SplitType (`line`/`char`) → reveal por linha/caractere (ex.: eyebrow letra a letra).

### 9.2 Easing e tempos globais **[MEDIDO]**
`cubic-bezier(0.65, 0.05, 0, 1)` · `0.75 s` para: troca de cor do header, clip-path do card, bordas do botão de menu. Fade de rótulos 0.3 s.

### 9.3 Mouse / ponteiro **[MEDIDO + VISTO — limitado]**
- Foram disparados `pointermove`/`mousemove` **sintéticos** (a API de input real é bloqueada nesta ferramenta). O hero **reagiu**: o capacete aparece em **manchas orgânicas** seguindo a trajetória do ponteiro (rastro) e o rosto reaparece nas áreas não visitadas (`home-1440x900-hero-mouse-reveal.png`).
- Sem mover o mouse, o estado do capacete **continuou mudando** entre capturas (3 frames: `hero-idle-a/b/c`) → há **animação autônoma** (loop/idle) **ou** resíduo de um ponteiro real sobre o webview — **[NÃO VERIFICADO]** qual dos dois.
- Cursor customizado, hover de botões/links, efeito magnético: **[NÃO VERIFICADO]** (ver seção 14).

---

## 10. Menu **[MEDIDO + VISTO]**

Screenshot: `home-1440x900-menu-open.png`.

- **Gatilho:** botão `.nav-ham` 60×60 (1440). `aria-label` muda: "Open navigation menu" ↔ "Close menu"; `aria-expanded` true/false.
- **Estado aberto:** botão vira **quadrado lime** com "×" (permanece acima do overlay); Store continua visível.
- **Overlay `.nav-menu-w`**: `position: fixed; inset:0` (1440×900), `z-index: 25`, fundo `#282c20`, com linhas topográficas lime muito sutis ao fundo.
- **Scroll travado:** `html` recebe `lenis-stopped`.
- **Layout (desktop, 2 colunas):**
  - **Esquerda:** grade **2×2** de fotos (307×333 cada; gaps ≈ 49–50 px; origem x=47, y=95), todas em **duotone verde/P&B** (sem cor).
  - **Direita (centrada em x≈1135 = 78.8 %):** 4 links empilhados **HOME / ON TRACK / OFF TRACK / CALENDAR** em Mona 400, **70 px / 65.8 px**, caixa-alta, cor `#dde1d2`; o item **atual** (HOME) em `#b4b8a5` com **sublinhado "squiggle" lime desenhado à mão** (SVG).
  - Abaixo dos links: selo laurel + capacete + "McLaren F1 since 2019".
  - Rodapé do menu: "BUSINESS ENQUIRIES" + TIKTOK · INSTAGRAM · YOUTUBE · TWITCH (≈ 10–12 px, bold, caixa-alta).
- **Animação:** links com SplitType por caractere (entrada por letra) **[VISTO: estrutura `char`]**; tempos/easing da abertura não cronometrados.
- **Mobile (390):** o link "Store" fica à esquerda, o menu à direita; layout do overlay mobile **não capturado** **[NÃO VERIFICADO]**.

---

## 11. Seções — detalhamento visual (desktop 1440×900)

### 11.1 Statement (1800–2829)
Centro da tela, 7 linhas empilhadas; texto: *"Redefining limits, fighting for wins, bringing it all in all ways. Defining a legacy in Formula 1 on and off the track."* Palavras-chave **Redefining / wins / legacy** em **serifa lime-off 110 px**; resto em **Mona 105.8 px caixa-alta** `#dde1d2`. Acima, o selo laurel+capacete e eyebrow "McLaren F1 since 2019". Fundo verde-escuro com linhas topográficas verde-oliva.

### 11.2 Faixa horizontal "collage" (2829–5972)
- Foto principal: **~314×285 px** a **643×589 px**; fotos pequenas **240–340 px**; maior bloco **602×602**.
- Disposição **assimétrica / escalonada**: alturas Y de 4161 a 4682 (±520 px de variação) dentro de um palco de 900 px → "mural" solto.
- Cada foto tem **legenda eyebrow** (local + ano): Qatar 2024 · FIA Prize Giving 2024 · Miami GP 2024 · Monaco 2023 · Britain 2025 · Battersea 2024 · High Performance Gala 2024 · Barcelona 2024 · Austria 2020 · US 2024.
- **Citação 1:** "It doesn't matter *where* you start, it's *how* you progress from there." **Citação 2:** "Since I was 7 years old and had my first experience with kart racing, I've worked tirelessly to make that dream come true." — ambas em serifa 20 px com assinatura vetorial lime.
- **Pílula "1"** (`horizontal-pill-text`, 20 px) com ícone 35×16.

### 11.3 ON TRACK / OFF TRACK (5972–7772)
- Cena **simétrica**: capacete amarelo-lima **cortado na borda esquerda**, perfil do piloto **cortado na borda direita**; no centro, **dois blocos** de título (ON TRACK à esq., OFF TRACK à dir.) separados por um **entalhe vertical** (barra preta em "L"); embaixo de cada um, 2 linhas de descrição centralizadas + botão **quadrado lime** com seta.
- "ON" tem um **traço script lime** inclinado sobreposto (assinatura gráfica).
- Textos: "Most recent results, career stats and photos from trackside." / "Campaigns, shoots and other such promotional materials for fans".
- Em seguida, **foto full-bleed 1440×900** (`is-otot-end`, `scroll-6800`) — capacete amarelo + piloto — como "respiro".

### 11.4 Helmets / Hall of Fame (7772–9468)
- Cabeçalho: "HELMETS" (Mona 60 px) + "HALL OF FAME" (Brier lime-off 62.5 px) à esquerda; parágrafo (16.67 px, `#b9bbad`, ≈ 4 linhas, 340 px de largura) à direita a partir de **x=713 (≈ 49.5 %)**.
- **Grade de 4 colunas × 4 linhas = 16 cards**, **339 × 343 px** (1440), coluna pitch ≈ **355 px** (gap ≈ 16.7 px = `--gap`). **Colunas 2 e 4 deslocadas ≈ 190 px para baixo** (≈ 55 % da altura do card) → masonry "escada".
- **Card:** fundo transparente, **borda 1 px `#535450`**, cantos levemente arredondados (raio pequeno, **[VISTO]**), **canto inferior-direito entalhado** onde fica o rótulo "**Nome** **ANO**" (12 px; ano em lime); render do capacete ao centro (PNG recortado).
- Nomes (h3) observados: Season, Discoball, Dark Glitter, Season, Porcelain, Japan, GIF, Dark Mode, Race, Las Vegas, Chrome, Beachball, Basketball, Season, Silverstone, Season. Anos confirmados por captura: Season 2025, Discoball 2025, Dark Glitter 2025, Season 2024, Porcelain 2024, Japan 2024, GIF 2024, Dark Mode 2024, Race 2023, Chrome 2023 (demais **[NÃO VERIFICADO]**).
- Fim: ícone lime + título em reveal + botão lime **"VIEW ON TRACK"**; seção termina com **arco elíptico** côncavo/convexo para entrar na seção creme.

### 11.5 Loja — "World Drivers' Champion" (9944–10851)
- Coluna esquerda (x=147 → 79 px na preview): eyebrow "LANDO STORE" com ícone de sacola, título 3 linhas **WORLD / DRIVERS' / CHAMPION** (as duas primeiras sans 700, última serifa), parágrafo de 3 linhas (16.67 px) e CTA lime "VISIT THE STORE".
- Direita/centro: **collage de produto** — foto vertical (modelo de costas, moletom; ≈ 525 px de largura **[VISTO]**) com cartão **dourado** "Champion Collection" sobreposto, camisetas em cards cinza-claro, logo dourado "1N1".
- Topo da seção tem uma **"viseira"** (`exe-top-visor`, 107 px de altura) que faz a transição visual do preto para o creme.

### 11.6 Partners & Campaigns (10851–11646)
- Título "PARTNERS &CAMPAIGNS" em **Brier 62.5 px** (sobreposto com a assinatura lime "Collab" gigante), parágrafo à direita em x=713.
- **Faixa de logos** em linha única, scroll horizontal contínuo; logos monocromáticos escuros (Pure Electric, Google, Ralph Lauren, PlayStation, Quadrant, TUMI, Hilton, Uber…). Espaçamento horizontal ≈ 80–120 px entre logos; altura de logo ≈ 25–40 px.
- Espaço morto generoso abaixo (≈ 250–270 px, `spacer _20rem`).

### 11.7 Socials (11646–12612)
- Ícone redondo (varia: bola de tênis/padel, mundo…) no topo + "**WHAT'S UP** / *ON SOCIALS*" (sans/serifa, 60 px) centralizado.
- **Leque de 7 cartões** em arco: cartão central ≈ **266×465 px** (proporção ≈ 9:16), raio ≈ 37 px (≈ 3 rem); vizinhos giram progressivamente (≈ ±8°, ±16°, ±25°) e descem; fotos coloridas verticais.
- Abaixo: "Follow Lando on social media" + links TIKTOK · INSTAGRAM · YOUTUBE · TWITCH (14 px, caixa-alta).

### 11.8 Footer (12612–13579)
- **Fundo:** creme → **gradiente lime** na base (`footer-bg-gradient`).
- **Painel verde-escuro `#282c20`**, largo (margem 1.25 rem), **raio ≈ 20 px**, **entalhe/aba arredondada no centro-topo**, linhas topográficas ao fundo.
- Conteúdo central: slogan **"ALWAYS BRINGING THE FIGHT."** (sans off-white + serifa lime-off 72.5 px) sobre **assinatura lime**; **retrato com capacete** (lime/preto) centralizado, cortado na base do painel.
- Colunas laterais (14 px, 700 caixa-alta): esquerda "PAGES" (HOME · ON TRACK · OFF TRACK · CALENDAR · **STORE** em lime); direita "FOLLOW ON" (TIKTOK · INSTAGRAM · YOUTUBE · TWITCH · **SIGN UP** em lime).
- **Faixa de logos de parceiros** (Android, PAP, Monster, Hilton, Bell, TUMI, Pure Electric, McLaren) — marquee em loop (~35 px de altura).
- CTA **"BUSINESS ENQUIRIES"** lime, centralizado, sobre o retrato.
- Base: "© 2026 Lando Norris. All rights reserved" (10 px) · Privacy Policy · Terms (13.3 px, 800).

---

## 12. Breakpoints e mobile

### 12.1 Media queries presentes no CSS **[MEDIDO]**
`≥1920` · `≥992` · `≥768` · `≤991` (tablet) · `≤767` · `≤497` · `≤479` (mobile). Token: `--min-width: 992px`, `--max-width: 1920px`.

### 12.2 Comportamento por faixa

| Faixa | Layout | Observado |
|---|---|---|
| **≥ 1920** | Mesmo desktop, **escala travada** em 1920 (`clamp`) — acima disso o conteúdo não cresce mais | Não testado acima de 1920 |
| **992–1919** | Desktop fluido: **tudo escala proporcionalmente** com `vw` (header, card, tipografia, grid) | 1920, 1440, 1280, 1024 idênticos em composição |
| **768–991** | **Tablet:** logo some do header → lockup "LANDO NORRIS" (1 linha, serifa+bold) + tagline "McLaren F1 since 2019" desce para o **corpo do hero**, centralizado sob o glifo; **Store vai para a esquerda**; menu à direita; botão **"Tap to lock"** (mão) fixo no canto **inferior direito**; card Next Race **permanece** (66×136) | `home-768x1024-hero.png` |
| **≤ 479 (390)** | **Mobile:** igual ao tablet porém com rosto 100 % da largura; **Next Race oculto**; botão "Tap to lock" 43×43 px; `touch swipe` para controlar o capacete | `home-390x844-hero.png` |
| **Orientação paisagem em mobile** | Existe bloco `.mob-landscape-block` (lime + Rive + texto) **[INFERIDO]**: tela de aviso "gire o aparelho" | `display:none` nos testes retrato |

### 12.3 Modo toque do hero **[MEDIDO: rótulos + classes; INFERIDO: fluxo]**
Botão `Toggle Swipe` (`btn-w is-touch-swipe`) com estados **unlocked/locked** (`btn-rive-w is-unlocked` / `is-locked`) e rótulos **"Tap to lock"** / **"Back to scroll"**. **[INFERIDO]** ao "travar", gestos de swipe controlam o efeito do capacete em vez de rolar a página; "Back to scroll" devolve o scroll.

### 12.4 Tipografia e proporções no mobile **[MEDIDO]**
- `rem` ≈ 10.83 px; ON/OFF TRACK em **43.3 px** (vs. 97.5 no desktop) e duas colunas lado a lado (screenshot `scroll-4300`).
- O track horizontal vira **rolagem vertical** com fotos em zigue-zague (esquerda/direita), legendas em eyebrow (`scroll-2600`); altura da seção cai de 3143 → 1892 px.
- O marquee gigante continua; cartão do retrato ocupa ≈ 37 % da largura.

---

## 13. Índice de screenshots

Pasta: `docs/reference-screenshots/` — todas salvas em **CSS px** (capturadas @2× e reduzidas para a resolução pedida).

**Resoluções pedidas (hero, estado pós-preloader):**

| Arquivo | Viewport |
|---|---|
| `home-1920x1080-hero.png` | 1920×1080 |
| `home-1440x900-hero.png` | 1440×900 |
| `home-1280x720-hero.png` | 1280×720 |
| `home-1024x768-hero.png` | 1024×768 |
| `home-768x1024-hero.png` | 768×1024 |
| `home-390x844-hero.png` | 390×844 (mobile emulado, `mobile:true`) |

**Preloader / interação (1440 e 1024):** `home-1440x900-preloader.png`, `home-1024x768-preloader-exit-logo-mask.png`, `home-1440x900-hero-mouse-reveal.png`, `home-1440x900-hero-idle-a/b/c.png`, `home-1440x900-menu-open.png`.

**Percurso de scroll @1440×900 (Y de scroll no nome do arquivo):** `home-1440x900-scroll-0450 · 0900 · 1300 · 2000 · 2829 · 4100 · 5972 · 6800 · 7772 · 8300 · 9500 · 10200 · 10900 · 11150 · 11700 · end`.

**Mobile 390×844:** `home-390x844-scroll-1000.png` (cena "Message"), `…-2600.png` (collage vertical), `…-4300.png` (On/Off Track).

---

## 14. Limitações de inspeção (leia antes de implementar)

1. **Input real bloqueado.** `Input.*` do CDP é negado; usei `browser_click`, `browser_scroll` e **eventos sintéticos** (`dispatchEvent`) → hover, cursor customizado, efeito magnético e trilha do mouse **não foram validados com ponteiro real**. O efeito do capacete reagiu a eventos sintéticos, mas não medi latência/raio/decay.
2. **Scroll programático** (`lenis.scrollTo(..., {immediate:true})`): captura posições estáticas; **não** mede a inércia (lerp 0.1) nem o *timing* real das animações de scroll (reveals, pin, paralaxe). Valores do tipo "encolhe até 472×305 em ~900 px" são pontos medidos/observados, **não curvas**.
3. **WebGL / Rive opaco.** O hero, o marquee gigante, as assinaturas lime e boa parte do fundo animado são **canvas**. Não extraí shader, uniformes, texturas nem as máscaras do capacete; **comportamento do efeito = observado por screenshot**, não por código. Texto do marquee e do "Collab" **não está no DOM** (frase completa **[NÃO VERIFICADO]**).
4. **Efeito do capacete é não-determinístico** entre capturas; não consegui separar "autônomo" de "reação a ponteiro real". Os 3 frames idle mostram padrões diferentes.
5. **Preloader:** tempos medidos são do **ambiente de teste** (rede/CPU), 8–25 s; o tempo mínimo e a lógica de "pronto" (o que dispara a saída) **não** foram isolados. O frame do tablet/desktop e do mobile mostram **saídas diferentes** — não vi a animação completa, apenas frames.
6. **Viewport emulado, não dispositivo real:** 390×844 usa `mobile:true` mas sem alterar *User-Agent*, sem safe-areas/notch e sem toque real. Comportamento de `100vh`, barra do Safari e `touch-action` **[NÃO VERIFICADO]**.
7. **Cobertura por resolução:** nas 6 resoluções capturei **o hero** e as métricas de header/card. O **percurso completo de scroll** foi feito em **1440×900**; em **390×844** capturei 3 pontos. Nas demais, seções internas **[NÃO VERIFICADO]** (inferidas pela escala fluida).
8. **Não acessadas:** páginas internas (On Track, Off Track, Calendar, Store), formulário de newsletter ("Sign Up"), estados de erro, cookie banner (não apareceu), acessibilidade com teclado/`prefers-reduced-motion`, SEO/meta, performance (LCP/CLS), e **conteúdo do estado "Load Norris" botão** (apenas `opacity 0`).
9. **Conteúdo é datado:** "2025 McLaren F1 Driver", "Lusail GP" como próxima corrida e "World Drivers' Champion" refletem o momento da captura (26/11/2026); o card Next Race é **dinâmico** (muda de circuito).
10. **Alguns valores são estimativas visuais** (marcados [VISTO]): enquadramento do rosto em %, raio dos cartões do leque, ângulos do leque, deslocamento das colunas 2/4 do grid (~190 px), proporção do cartão-retrato.
11. **Screenshots** foram capturados em 2× e reduzidos para o tamanho CSS pedido; detalhes finos (linhas de 1 px) podem perder definição.

---

## 15. Tradução para o site autoral (Jefferson Teixeira) — princípios, sem copiar

> Use como checklist de **decisões de design**, não como especificação de cópia. Fotos, marca, ícone "L7", assinatura, nomes de patrocinadores, textos e capacete são **do cliente de origem** e **não** devem ser reproduzidos.

| Princípio observado | Como aplicar de forma autoral |
|---|---|
| **Retrato central em fundo alto-key** | Retrato próprio do Jefferson recortado, centralizado, sangrando na base; fundo quase-branco com textura/linhas próprias (ex.: grafismo derivado do seu universo, não topografia genérica copiada). |
| **Header só com 4 elementos** | Marca à esq., CTA à dir., menu quadrado; **nada mais**. Margem = 1.25rem; altura de botão ≈ 4 % da largura. |
| **1 acento + 3 neutros** | Escolha **uma** cor de acento própria (não o lime `#d2ff00`) + verde/escuro profundo, off-white quente, preto quente. |
| **Par tipográfico serifa display + grotesca pesada** | Escolha duas famílias próprias; serifa só para a *palavra-chave* de cada título; tracking negativo (−2 a −3 % em ≥ 60 px), line-height ≈ 0.85. |
| **3 camadas de tamanho** | Impacto (60–120 px), parágrafo (16–20 px), eyebrow (8–12 px). |
| **Cenas pinadas com troca de fundo** | Hero (2×vh) → declaração → trilha horizontal → duas "portas" → grade → CTA → contato; troque o fundo entre cenas. |
| **Efeito de revelação no hero** | Implementar um efeito próprio (ex.: máscara por ponteiro revelando uma 2ª camada — roupa/obra/bastidor), com **modo toque** equivalente. |
| **Card contextual fixo no canto inferior esquerdo** | Troque "Next race" por **disponibilidade / próximo projeto / status** (ex.: "Disponível para projetos · Jan/2027"), mesmo tamanho (~6.9 % da largura), canto entalhado, `1.25rem` de margem, ocultar no mobile pequeno. |
| **Preloader com marca** | Tela cheia na cor de acento, glifo próprio animado + rótulo curto no rodapé; saída por máscara do glifo (desktop) / painéis inclinados (mobile). |
| **Menu fullscreen** | Overlay escuro, 4 links 70 px caixa-alta, imagens duotone 2×2, trava de scroll, botão vira "×". |
| **Fluid type por `vw`** | `html { font-size: calc(clamp(992px,100vw,1920px) / 1728 * 16) }` e tokens em `rem`; layout dedicado < 992 px. |

---

*Arquivo gerado pelo Agente 01. Todos os números marcados [MEDIDO] foram lidos do site público em 26/11/2026; valores podem mudar se o site for atualizado.*
