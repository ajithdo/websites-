/**
 * Image slots. Every photo is referenced by a path relative to
 * src/assets/images (e.g. "hero/hero.jpg"), from site.ts or content JSON.
 * Replacing a photo = dropping a new file at the same path.
 *
 * Server-only (uses sharp and astro:assets).
 */
import { join } from 'node:path';
import type { ImageMetadata } from 'astro';
import { getImage } from 'astro:assets';
import sharp from 'sharp';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

/** Resolve a slot path to its image. Fails the build if the file is missing. */
export function img(path: string): ImageMetadata {
  const mod = modules[`/src/assets/images/${path}`];
  if (!mod) {
    throw new Error(`Image not found: src/assets/images/${path} (check site.ts or content JSON)`);
  }
  return mod.default;
}

const lqipCache = new Map<string, Promise<string>>();

/** A tiny blurred WebP (≈300 bytes) inlined as a data URI for blur-up loading. */
export function lqip(path: string): Promise<string> {
  let pending = lqipCache.get(path);
  if (!pending) {
    pending = sharp(join(process.cwd(), 'src/assets/images', path))
      .resize(20, 20, { fit: 'inside' })
      .blur(1.2)
      .webp({ quality: 45 })
      .toBuffer()
      .then((buf) => `data:image/webp;base64,${buf.toString('base64')}`);
    lqipCache.set(path, pending);
  }
  return pending;
}

export interface ResponsiveImage {
  src: string;
  width: number;
  height: number;
  sizes: string;
  sources: { type: string; srcset: string }[];
  lqip: string;
}

/**
 * Pre-computed <picture> data for React islands, which cannot call
 * astro:assets themselves. `aspect` (width / height) crops with object-fit
 * cover semantics; omit it to keep the photo's own shape.
 */
export async function responsiveImage(
  path: string,
  opts: { widths: number[]; sizes: string; aspect?: number; quality?: number; blur?: boolean },
): Promise<ResponsiveImage> {
  const meta = img(path);
  const maxW = Math.min(Math.max(...opts.widths), meta.width);
  const widths = opts.widths.filter((w) => w <= meta.width);
  const width = maxW;
  const height = opts.aspect
    ? Math.round(maxW / opts.aspect)
    : Math.round((maxW * meta.height) / meta.width);
  const common = {
    src: meta,
    width,
    height,
    widths: widths.length ? widths : [maxW],
    fit: 'cover' as const,
    quality: opts.quality ?? 62,
  };
  const [avif, webp, fallback, blur] = await Promise.all([
    getImage({ ...common, format: 'avif' }),
    getImage({ ...common, format: 'webp' }),
    getImage({ ...common, widths: [width], format: 'jpg' }),
    opts.blur === false ? Promise.resolve('') : lqip(path),
  ]);
  return {
    src: fallback.src,
    width,
    height,
    sizes: opts.sizes,
    sources: [
      { type: 'image/avif', srcset: avif.srcSet.attribute },
      { type: 'image/webp', srcset: webp.srcSet.attribute },
    ],
    lqip: blur,
  };
}

export interface HeroSources {
  desktop: { avif: string; webp: string; fallback: string; width: number; height: number };
  mobile: { avif: string; webp: string } | null;
}

/** Art-directed hero: a portrait crop for phones, landscape for larger screens. */
export async function heroSources(
  desktopPath: string,
  mobilePath: string | null,
): Promise<HeroSources> {
  const desk = img(desktopPath);
  const deskWidths = [960, 1280, 1600, 1920, 2400].filter((w) => w <= desk.width);
  const deskCommon = { src: desk, width: desk.width, height: desk.height, widths: deskWidths };
  const [avif, webp, fallback] = await Promise.all([
    getImage({ ...deskCommon, format: 'avif', quality: 52 }),
    getImage({ ...deskCommon, format: 'webp', quality: 66 }),
    getImage({ src: desk, width: Math.min(1600, desk.width), format: 'jpg', quality: 72 }),
  ]);
  let mobile: HeroSources['mobile'] = null;
  if (mobilePath) {
    const mob = img(mobilePath);
    const mobCommon = {
      src: mob,
      width: mob.width,
      height: mob.height,
      widths: [480, 640, 800, 960, 1200].filter((w) => w <= mob.width),
    };
    const [mAvif, mWebp] = await Promise.all([
      getImage({ ...mobCommon, format: 'avif', quality: 50 }),
      getImage({ ...mobCommon, format: 'webp', quality: 64 }),
    ]);
    mobile = { avif: mAvif.srcSet.attribute, webp: mWebp.srcSet.attribute };
  }
  return {
    desktop: {
      avif: avif.srcSet.attribute,
      webp: webp.srcSet.attribute,
      fallback: fallback.src,
      width: desk.width,
      height: desk.height,
    },
    mobile,
  };
}
