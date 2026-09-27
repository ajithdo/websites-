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
  opts: { widths: number[]; sizes: string; aspect?: number; quality?: number },
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
    quality: opts.quality ?? 72,
  };
  const [avif, webp, fallback, blur] = await Promise.all([
    getImage({ ...common, format: 'avif' }),
    getImage({ ...common, format: 'webp' }),
    getImage({ ...common, widths: [width], format: 'jpg' }),
    lqip(path),
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
