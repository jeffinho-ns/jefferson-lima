import path from "node:path";
import type { NextConfig } from "next";

const glslLoaderPath = "./loaders/glsl-loader.cjs";

const nextConfig: NextConfig = {
  /* Desativado: callbacks de client providers quebram o prerender com cacheComponents. */
  cacheComponents: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
      // Shaders GLSL importados como string (src/shaders/*.vert|frag).
      "*.vert": { loaders: [glslLoaderPath], as: "*.js" },
      "*.frag": { loaders: [glslLoaderPath], as: "*.js" },
      "*.glsl": { loaders: [glslLoaderPath], as: "*.js" },
    },
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(vert|frag|glsl)$/,
      type: "javascript/auto",
      use: [{ loader: path.resolve(process.cwd(), glslLoaderPath) }],
    });
    return config;
  },
};

export default nextConfig;
