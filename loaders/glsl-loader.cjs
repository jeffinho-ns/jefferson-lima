/**
 * Loader mínimo para arquivos GLSL (.vert / .frag / .glsl).
 * Exporta o conteúdo como string (default export), com comentários e linhas
 * em branco removidos para reduzir o bundle. Compatível com Turbopack e webpack.
 */
module.exports = function glslLoader(source) {
  const code = String(source)
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/.*$/gm, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .join("\n");

  return `export default ${JSON.stringify(code)};`;
};
