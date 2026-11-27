"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  CanvasTexture,
  LinearFilter,
  LinearMipmapLinearFilter,
  ShaderMaterial,
  NoColorSpace,
  TextureLoader,
  Vector2,
  Vector3,
  type Texture,
} from "three";
import vertexShader from "@/shaders/portrait.vert";
import fragmentShader from "@/shaders/portrait.frag";
import { clamp, damp } from "@/lib/motion";
import type { GraphicsTier } from "@/hooks/useWebGLSupport";
import type { PointerSource } from "@/hooks/usePointerPosition";
import { createCodeTexture, type CodeTextureResult } from "./CodeTexture";
import { PORTRAIT_FACE_MASK_SRC } from "../portrait-assets";

export interface PortraitSceneProps {
  pointer: PointerSource;
  tier: GraphicsTier;
  src: string;
  fallbackSrc: string;
  decodeRadius: number;
  noiseIntensity: number;
  distortion: number;
  /** Incrementar/definir `true` dispara a demo automática (uma vez por mount). */
  demo: boolean;
  onReady: () => void;
  onError: () => void;
}

interface TierSettings {
  dpr: number | [number, number];
  fbmOctaves: number;
  chroma: boolean;
  codeSize: number;
  codeCols: number;
  anisotropy: number;
}

const TIERS: Record<GraphicsTier, TierSettings> = {
  high: { dpr: [1, 2], fbmOctaves: 4, chroma: true, codeSize: 2048, codeCols: 96, anisotropy: 8 },
  medium: { dpr: [1, 1.5], fbmOctaves: 3, chroma: true, codeSize: 2048, codeCols: 72, anisotropy: 4 },
  low: { dpr: 1, fbmOctaves: 2, chroma: false, codeSize: 1024, codeCols: 52, anisotropy: 1 },
};

/** #D2FF00 em sRGB (0..1) — o shader compõe em sRGB, sem conversão linear. */
const LIME_SRGB: [number, number, number] = [0xd2 / 255, 1, 0];
const DEMO_DURATION = 3.2;

interface PortraitAssets {
  portrait: Texture;
  faceMask: Texture;
  aspect: number;
  code: CodeTextureResult;
}

function prepTexture(tex: Texture, settings: TierSettings, withMipmaps: boolean) {
  tex.colorSpace = NoColorSpace;
  tex.minFilter = withMipmaps ? LinearMipmapLinearFilter : LinearFilter;
  tex.magFilter = LinearFilter;
  tex.anisotropy = settings.anisotropy;
  tex.generateMipmaps = withMipmaps;
  tex.needsUpdate = true;
  return tex;
}

/** Carrega retrato + face mask e gera a textura de código. */
function usePortraitAssets(
  src: string,
  fallbackSrc: string,
  settings: TierSettings,
  onError: () => void,
): PortraitAssets | null {
  const [assets, setAssets] = useState<PortraitAssets | null>(null);
  const onErrorRef = useRef(onError);
  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    let cancelled = false;
    let portraitTex: Texture | null = null;
    let maskTex: Texture | null = null;
    let code: CodeTextureResult | null = null;
    const loader = new TextureLoader();

    const finishBoth = (portrait: Texture, faceMask: Texture) => {
      if (cancelled) {
        portrait.dispose();
        faceMask.dispose();
        return;
      }
      try {
        prepTexture(portrait, settings, true);
        prepTexture(faceMask, settings, false);
        portraitTex = portrait;
        maskTex = faceMask;
        code = createCodeTexture({
          size: settings.codeSize,
          cols: settings.codeCols,
          anisotropy: settings.anisotropy,
        });
        const image = portrait.image as { width: number; height: number };
        setAssets({
          portrait,
          faceMask,
          aspect: image.width / image.height,
          code,
        });
      } catch {
        onErrorRef.current();
      }
    };

    const loadPortrait = (url: string, retry?: string) => {
      loader.load(
        url,
        (portrait) => {
          loader.load(
            PORTRAIT_FACE_MASK_SRC,
            (faceMask) => finishBoth(portrait, faceMask),
            undefined,
            () => {
              // Máscara ausente: textura branca 1×1 (decode em todo o sujeito)
              const canvas = document.createElement("canvas");
              canvas.width = 1;
              canvas.height = 1;
              const ctx = canvas.getContext("2d");
              if (ctx) {
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, 1, 1);
              }
              finishBoth(portrait, new CanvasTexture(canvas));
            },
          );
        },
        undefined,
        () => {
          if (cancelled) return;
          if (retry) loadPortrait(retry);
          else onErrorRef.current();
        },
      );
    };
    loadPortrait(src, fallbackSrc !== src ? fallbackSrc : undefined);

    return () => {
      cancelled = true;
      portraitTex?.dispose();
      maskTex?.dispose();
      code?.dispose();
    };
  }, [src, fallbackSrc, settings]);

  return assets;
}

interface PlaneProps extends Omit<PortraitSceneProps, "tier" | "src" | "fallbackSrc" | "onError"> {
  assets: PortraitAssets;
  settings: TierSettings;
}

function PortraitPlane({
  assets,
  settings,
  pointer,
  decodeRadius,
  noiseIntensity,
  distortion,
  demo,
  onReady,
}: PlaneProps) {
  const invalidate = useThree((s) => s.invalidate);
  const touchRadiusBoost = 1.3;

  const material = useMemo(() => {
    const defines: Record<string, string | number> = { FBM_OCTAVES: settings.fbmOctaves };
    if (settings.chroma) defines.ENABLE_CHROMA = 1;

    // Alvo de ~9px CSS por caractere (um pouco menor no mobile é ajustado em runtime).
    const charPx = typeof window !== "undefined" && window.innerWidth < 768 ? 7.5 : 9;
    const span = charPx * assets.code.cols;

    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      defines,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new Vector2(0.5, 0.5) },
        uProgress: { value: 0 },
        uResolution: { value: new Vector2(1, 1) },
        uPortraitTexture: { value: assets.portrait },
        uCodeTexture: { value: assets.code.texture },
        uFaceMask: { value: assets.faceMask },
        uNoiseIntensity: { value: noiseIntensity },
        uDistortion: { value: distortion },
        uDecodeRadius: { value: decodeRadius },
        uImageAspect: { value: assets.aspect },
        uCodeSpan: { value: span },
        uCell: { value: new Vector2(charPx, span / assets.code.rows) },
        uLime: { value: new Vector3(...LIME_SRGB) },
      },
    });
    // Props de aparência são sincronizados em useFrame; recriar só quando os assets mudam.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets, settings]);

  const materialRef = useRef<ShaderMaterial | null>(null);
  useEffect(() => {
    materialRef.current = material;
    return () => {
      materialRef.current = null;
      material.dispose();
    };
  }, [material]);

  // Estado de animação (mutável, fora do React)
  const anim = useRef({
    time: 0,
    progress: 0,
    mouse: new Vector2(0.5, 0.5),
    prev: new Vector2(0.5, 0.5),
    speed: 0,
    demoT: -1,
    demoDone: false,
  });

  // Primeiro frame + sinal de "pronto" (crossfade com o fallback)
  useEffect(() => {
    invalidate();
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(onReady);
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [invalidate, onReady]);

  // Em frameloop="demand", qualquer evento do ponteiro acorda o loop.
  useEffect(() => pointer.subscribe(invalidate), [pointer, invalidate]);

  useEffect(() => {
    const a = anim.current;
    if (demo && !a.demoDone && a.demoT < 0) {
      a.demoT = 0;
      invalidate();
    }
  }, [demo, invalidate]);

  useFrame((state, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const a = anim.current;
    const p = pointer.state;
    const material = materialRef.current;
    if (!material) return;
    const u = material.uniforms;

    // Demo automática (toque): percorre o rosto uma vez; cancela se o usuário tocar.
    let demoActive = false;
    let tx = p.x;
    let ty = p.y;
    let wantInside = p.inside;
    if (a.demoT >= 0) {
      if (p.inside) {
        a.demoT = -1;
        a.demoDone = true;
      } else {
        a.demoT += dt;
        const k = a.demoT / DEMO_DURATION;
        if (k >= 1) {
          a.demoT = -1;
          a.demoDone = true;
        } else {
          demoActive = true;
          wantInside = k > 0.06 && k < 0.8;
          tx = 0.47 + Math.sin(k * Math.PI * 2.0) * 0.13;
          ty = 0.56 + Math.sin(k * Math.PI * 3.0 + 0.8) * 0.08 - k * 0.04;
        }
      }
    }

    // Ao iniciar o decode, o círculo nasce sob o ponteiro (sem varrer o container).
    if (wantInside && a.progress < 0.02) a.mouse.set(tx, ty);

    a.mouse.x = damp(a.mouse.x, tx, 14, dt);
    a.mouse.y = damp(a.mouse.y, ty, 14, dt);
    a.progress = damp(a.progress, wantInside ? 1 : 0, wantInside ? 5.5 : 4.5, dt);
    if (a.progress < 0.002 && !wantInside) a.progress = 0;

    const moved = a.mouse.distanceTo(a.prev) / Math.max(dt, 1e-3);
    a.speed = damp(a.speed, clamp(moved * 0.6, 0, 1.5), 8, dt);
    a.prev.copy(a.mouse);

    a.time += dt;

    const touchLike = p.pointerType !== "mouse" || demoActive;
    u.uTime.value = a.time;
    u.uMouse.value.copy(a.mouse);
    u.uProgress.value = a.progress;
    u.uResolution.value.set(state.size.width, state.size.height);
    u.uNoiseIntensity.value = noiseIntensity;
    u.uDistortion.value = distortion * (1 + a.speed);
    u.uDecodeRadius.value = decodeRadius * (touchLike ? touchRadiusBoost : 1);

    // Mantém o loop vivo enquanto algo está animando; senão deixa a GPU descansar.
    const stillAnimating = a.progress > 0 || wantInside || a.demoT >= 0 || a.speed > 0.01;
    if (stillAnimating) state.invalidate();
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

/** Canvas R3F com o plano do retrato + shader de decode. */
export default function PortraitScene({
  tier,
  src,
  fallbackSrc,
  onError,
  ...rest
}: PortraitSceneProps) {
  const settings = TIERS[tier];
  const assets = usePortraitAssets(src, fallbackSrc, settings, onError);

  return (
    <Canvas
      aria-hidden="true"
      frameloop="demand"
      dpr={settings.dpr}
      gl={{
        alpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: tier === "low" ? "low-power" : "high-performance",
      }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      onCreated={({ gl }) => {
        gl.setClearColor(0x000000, 0);
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onError();
        });
      }}
    >
      {assets ? (
        <PortraitPlane assets={assets} settings={settings} {...rest} />
      ) : null}
    </Canvas>
  );
}
