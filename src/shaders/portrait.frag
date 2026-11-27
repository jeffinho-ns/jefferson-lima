// DigitalIdentity — fragment shader (original work).
//
// Rosto humano -> código, decodificado localmente ao redor do cursor.
//
// Pipeline por fragmento:
//   1. Espaço de tela em px CSS + encaixe "contain / bottom-center" do retrato.
//   2. Máscara orgânica: distância ao mouse deformada por fbm (borda "líquida").
//   3. Decode por célula: cada célula da grade de caracteres tem um limiar
//      aleatório; na borda da máscara só algumas células "viram código" (efeito
//      de decodificação progressiva, reversível ao reduzir uProgress).
//   4. Distorção: deslocamento horizontal por linha (glitch) + ondulação suave,
//      só no anel de transição.
//   5. Composição: fundo bem escuro sob a máscara; glifos com cores de
//      syntax highlight JS (RGB da textura de código).
//   6. Ruído / grão / scanlines controlados por uNoiseIntensity.

uniform float uTime;
uniform vec2 uMouse;            // 0..1, origem no canto inferior esquerdo do container
uniform float uProgress;        // 0..1 (suavizado em JS): 0 = rosto, 1 = decode completo
uniform vec2 uResolution;       // tamanho do container em px CSS
uniform sampler2D uPortraitTexture;
uniform sampler2D uCodeTexture; // RGB = cor do token (syntax JS); preto = vazio
uniform sampler2D uFaceMask;    // máscara facial (rosto/barba/pescoço); 0 = preservar
uniform float uNoiseIntensity;  // 0..1
uniform float uDistortion;      // 0..~2
uniform float uDecodeRadius;    // raio base, normalizado pela altura do container
uniform float uImageAspect;     // largura/altura do retrato
uniform float uCodeSpan;        // px CSS cobertos por 1 repetição da textura de código
uniform vec2 uCell;             // tamanho (px CSS) de uma célula de caractere
uniform vec3 uLime;

varying vec2 vUv;

#ifndef FBM_OCTAVES
#define FBM_OCTAVES 4
#endif

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float hash11(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < FBM_OCTAVES; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec2(17.1, 9.2);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 px = vUv * uResolution;
  float aspect = uResolution.x / uResolution.y;

  // 1. Encaixe "contain" ancorado embaixo ao centro (igual ao <img> de fallback)
  vec2 imgSize = aspect > uImageAspect
    ? vec2(uResolution.y * uImageAspect, uResolution.y)
    : vec2(uResolution.x, uResolution.x / uImageAspect);
  vec2 imgOrigin = vec2((uResolution.x - imgSize.x) * 0.5, 0.0);
  vec2 pUv = (px - imgOrigin) / imgSize;
  float inside = step(0.0, pUv.x) * step(pUv.x, 1.0) * step(0.0, pUv.y) * step(pUv.y, 1.0);

  // 2. Máscara orgânica ao redor do mouse
  float h = uResolution.y;
  vec2 mousePx = uMouse * uResolution;
  float dist = length((px - mousePx) / h);

  float radius = max(uDecodeRadius * uProgress, 0.0001);
  float blob = fbm(px / (h * 0.32) + vec2(uTime * 0.17, -uTime * 0.11));
  float fine = vnoise(px / (h * 0.07) - vec2(uTime * 0.45, uTime * 0.2));
  // Borda orgânica (não-circular): noise deforma o raio como fatias fluidas
  float warped = dist + (blob - 0.5) * 0.78 * radius + (fine - 0.5) * 0.12 * radius * uNoiseIntensity;
  float mask = (1.0 - smoothstep(radius * 0.18, radius, warped)) * step(0.001, uProgress);

  // Face mask: limita decode à geometria facial (preserva boné/jaqueta)
  float face = texture2D(uFaceMask, clamp(pUv, 0.0, 1.0)).r;
  face = smoothstep(0.08, 0.55, face);
  mask *= mix(0.15, 1.0, face); // leve bleed nas bordas do rosto

  // 3. Decode por célula (limiar aleatório => borda "pixelada" / progressiva)
  vec2 cellId = floor(px / uCell);
  float cellRand = hash21(cellId);
  float decode = smoothstep(cellRand * 0.5, cellRand * 0.5 + 0.3, mask);
  float transitional = step(0.02, decode) * step(decode, 0.98);

  // 4. Distorção no anel de transição
  float ring = mask * (1.0 - mask) * 4.0;
  float rowJitter = hash11(cellId.y + floor(uTime * 14.0)) - 0.5;
  vec2 disp = vec2(rowJitter * 0.018 * ring, 0.0);
  disp += vec2(blob - 0.5, fbm(px / (h * 0.32) + 5.3) - 0.5) * 0.02 * mask;
  disp *= uDistortion;

  vec4 portrait = texture2D(uPortraitTexture, pUv + disp);
  vec3 base = portrait.rgb;
#ifdef ENABLE_CHROMA
  float split = ring * 0.006 * uDistortion;
  base.r = texture2D(uPortraitTexture, pUv + disp + vec2(split, 0.0)).r;
  base.b = texture2D(uPortraitTexture, pUv + disp - vec2(split, 0.0)).b;
#endif
  // 5. Código: textura em tile, rolando; RGB = syntax highlight JS
  vec2 codeUv = px / uCodeSpan;
  codeUv.y += uTime * 0.014;
  float scramble = hash21(cellId + floor(uTime * 9.0));
  codeUv.x += transitional * floor(scramble * 9.0) * (uCell.x / uCodeSpan);
  vec3 codeRgb = texture2D(uCodeTexture, codeUv).rgb;
  float glyph = max(codeRgb.r, max(codeRgb.g, codeRgb.b));
  vec3 glyphColor = codeRgb / max(glyph, 0.001);

  float cellFlicker = hash21(cellId + floor(uTime * 6.0) * 1.7);
  float flicker = mix(1.0, 0.5 + 0.5 * cellFlicker, uNoiseIntensity);
  // Fundo escuro → código legível em qualquer tom de pele
  float g = pow(glyph, 0.62) * decode * flicker;

  vec3 darkBase = base * 0.04 + vec3(0.01, 0.012, 0.016);
  vec3 col = mix(base, darkBase, decode * 0.98);

  col += glyphColor * g * 1.75;

  // anel de decode — brilho frio discreto (não monólito lime)
  col += vec3(0.55, 0.72, 0.95) * ring * 0.18 * (0.35 + 0.65 * blob) * decode;

  // 6. Scanlines + grão (somente onde há decode, grão leve fora)
  col *= 1.0 - decode * 0.07 * (0.5 + 0.5 * sin(px.y * 2.2 + uTime * 3.0)) * uNoiseIntensity;
  float grain = hash21(px + fract(uTime) * 91.7) - 0.5;
  col += grain * 0.06 * uNoiseIntensity * (0.25 + decode);

  float alpha = portrait.a * inside;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), alpha);
}
