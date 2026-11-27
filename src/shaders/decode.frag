// Digital Identity — retrato limpo em idle; no hover, uma máscara orgânica
// em volta do cursor "decodifica" regiões escuras da foto em código neon lime.
precision highp float;

uniform float uTime;
uniform vec2 uMouse;            // 0-1, origem embaixo-esquerda (mesmo espaço de vUv)
uniform float uProgress;        // 0-1, reversível
uniform vec2 uResolution;       // px do drawing buffer
uniform sampler2D uPortraitTexture;
uniform sampler2D uCodeTexture;
uniform float uNoiseIntensity;
uniform float uDistortion;
uniform float uDecodeRadius;    // raio máximo em unidades da altura do canvas

uniform float uImageAspect;     // largura/altura da foto
uniform vec2 uCodeGrid;         // colunas x linhas de caracteres na code texture
uniform float uCodeScale;       // quantas vezes a code texture se repete na altura

varying vec2 vUv;

// #D2FF00 em sRGB (texturas e saída sem conversão de espaço de cor)
const vec3 LIME = vec3(0.8235294, 1.0, 0.0);

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0));
  float d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * valueNoise(p);
    p = p * 2.03 + 17.0;
    a *= 0.5;
  }
  return v;
}

float smootherstep01(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * x * (x * (x * 6.0 - 15.0) + 10.0);
}

// "cover" da foto dentro do canvas.
vec2 coverUv(vec2 uv, float viewAspect, float imageAspect) {
  vec2 scale = vec2(1.0);
  if (viewAspect > imageAspect) {
    scale.y = imageAspect / viewAspect;
  } else {
    scale.x = viewAspect / imageAspect;
  }
  return (uv - 0.5) * scale + 0.5;
}

void main() {
  float viewAspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 aspectVec = vec2(viewAspect, 1.0);
  float progress = smootherstep01(uProgress);

  // ---------------------------------------------------------------------
  // Máscara orgânica em torno do mouse
  // ---------------------------------------------------------------------
  vec2 toMouse = (vUv - uMouse) * aspectVec;
  float dist = length(toMouse);
  float angle = atan(toMouse.y, toMouse.x);

  float blobNoise = fbm(vec2(cos(angle), sin(angle)) * 1.6 + uTime * 0.25);
  float edgeWobble = fbm(vUv * aspectVec * 5.0 + vec2(uTime * 0.12, -uTime * 0.09));
  float radius = uDecodeRadius * progress * (0.72 + 0.56 * blobNoise);
  radius *= 0.94 + 0.12 * edgeWobble;
  radius = max(radius, 0.0001); // evita smoothstep com bordas iguais (NaN)

  float mask = 1.0 - smoothstep(radius * 0.55, radius, dist);
  mask *= smoothstep(0.0, 0.06, uProgress);

  // ---------------------------------------------------------------------
  // Distorção sutil (ondulação + deslocamento em faixas) dentro da máscara
  // ---------------------------------------------------------------------
  vec2 flow = vec2(
    valueNoise(vUv * aspectVec * 8.0 + vec2(uTime * 0.4, 0.0)),
    valueNoise(vUv * aspectVec * 8.0 + vec2(0.0, -uTime * 0.35) + 31.7)
  ) - 0.5;
  float band = hash21(vec2(floor(vUv.y * 64.0), floor(uTime * 6.0)));
  float sliceShift = (band - 0.5) * step(0.82, band);

  vec2 warp = flow * 0.03 + vec2(sliceShift * 0.012, 0.0);
  warp *= uDistortion * mask;

  vec2 portraitUv = coverUv(vUv + warp, viewAspect, uImageAspect);

  // Aberração cromática leve na borda ativa
  float split = 0.0025 * uDistortion * mask * (0.4 + 0.6 * (1.0 - mask));
  vec4 texR = texture2D(uPortraitTexture, portraitUv + vec2(split, 0.0));
  vec4 texG = texture2D(uPortraitTexture, portraitUv);
  vec4 texB = texture2D(uPortraitTexture, portraitUv - vec2(split, 0.0));

  vec3 photo = vec3(texR.r, texG.g, texB.b);
  float alpha = texG.a;
  float luma = dot(photo, vec3(0.299, 0.587, 0.114));

  // ---------------------------------------------------------------------
  // Camada de código: grade de caracteres, scramble -> assenta ("decode")
  // ---------------------------------------------------------------------
  vec2 codeUv = vUv * aspectVec * uCodeScale;
  codeUv.y += uTime * 0.015; // rolagem lenta

  vec2 gridPos = codeUv * uCodeGrid;
  vec2 cell = floor(gridPos);
  vec2 inCell = fract(gridPos);
  float cellHash = hash21(cell);

  // Dissolve em "pixels": cada caractere liga em um limiar próprio.
  float reveal = step(cellHash * 0.9, mask);
  float settle = smoothstep(0.3, 0.9, mask + (cellHash - 0.5) * 0.35);

  float tick = floor(uTime * 10.0 + cellHash * 7.0);
  vec2 randomCell = floor(vec2(
    hash21(cell + tick * 1.7),
    hash21(cell.yx + tick * 3.1)
  ) * uCodeGrid);
  vec2 sourceCell = mix(randomCell, cell, step(0.5, settle));

  vec2 glyphUv = (sourceCell + inCell) / uCodeGrid;
  float glyph = texture2D(uCodeTexture, glyphUv).r;
  float glow = texture2D(uCodeTexture, glyphUv, 2.5).r;

  float flicker = 0.78 + 0.22 * sin(uTime * 3.2 + cellHash * 40.0);
  float darkness = 1.0 - smoothstep(0.16, 0.5, luma); // só em regiões escuras
  float decode = mask * reveal;

  // ---------------------------------------------------------------------
  // Composição
  // ---------------------------------------------------------------------
  vec3 color = photo;

  // Escurece levemente a foto dentro da zona decodificada (contraste p/ o lime).
  color *= 1.0 - 0.38 * mask;

  float glyphAmount = glyph * flicker * darkness * decode;
  float glowAmount = glow * darkness * decode * 0.45;
  color = mix(color, LIME, clamp(glyphAmount, 0.0, 1.0));
  color += LIME * glowAmount * 0.35;

  // Véu lime muito sutil sobre áreas claras dentro da máscara.
  color = mix(color, color * vec3(0.96, 1.0, 0.82), mask * (1.0 - darkness) * 0.5);

  // Contorno fino e orgânico da máscara.
  float ring = smoothstep(radius * 0.84, radius * 0.93, dist) *
               (1.0 - smoothstep(radius * 0.93, radius, dist));
  color = mix(color, LIME, ring * 0.28 * progress);

  // Noise / grain — só atua dentro da máscara (idle = foto limpa).
  float grain = hash21(gl_FragCoord.xy + fract(uTime) * 91.7) - 0.5;
  color += grain * uNoiseIntensity * mask;

  gl_FragColor = vec4(clamp(color, 0.0, 1.0), alpha);
}
