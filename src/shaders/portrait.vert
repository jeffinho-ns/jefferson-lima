// DigitalIdentity — vertex shader (original work).
//
// O plano é um quad de 2x2 em clip-space: ignoramos a câmera e as matrizes de
// projeção de propósito. Assim o retrato ocupa exatamente o container DOM e o
// alinhamento com o <img> de fallback (object-fit: contain) é pixel-perfect,
// independentemente do FOV, do DPR ou do aspect ratio.

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
