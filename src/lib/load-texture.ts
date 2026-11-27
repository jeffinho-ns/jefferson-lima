import { NoColorSpace, Texture, TextureLoader } from "three";

const cache = new Map<string, Promise<Texture>>();

function loadOne(url: string): Promise<Texture> {
  return new Promise<Texture>((resolve, reject) => {
    new TextureLoader().load(
      url,
      (texture) => {
        texture.colorSpace = NoColorSpace; // shader escreve valores sRGB crus
        texture.anisotropy = 4;
        resolve(texture);
      },
      undefined,
      () => reject(new Error(`Falha ao carregar textura: ${url}`)),
    );
  });
}

/**
 * Carrega a primeira textura disponível da lista (cutout -> original).
 * O resultado é cacheado por conjunto de URLs, então é seguro usar com `use()`.
 */
export function loadFirstTexture(urls: readonly string[]): Promise<Texture> {
  const key = urls.join("|");
  const hit = cache.get(key);
  if (hit) return hit;

  const promise = (async () => {
    let lastError: unknown;
    for (const url of urls) {
      try {
        return await loadOne(url);
      } catch (error) {
        lastError = error;
      }
    }
    cache.delete(key);
    throw lastError instanceof Error
      ? lastError
      : new Error("Nenhuma textura disponível");
  })();

  cache.set(key, promise);
  return promise;
}
