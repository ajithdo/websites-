/**
 * App icons and favicons drawn from the brand mark in the active theme's
 * colours, so a rebrand (new colours or mark) updates every icon.
 */
import { markDot, markHandle, markLoops } from './brand-mark';

export interface IconColors {
  bg: string;
  ink: string;
  accent: string;
}

/**
 * The mark on a solid tile. `scale` is how much of the tile the mark uses:
 * about 0.9 for favicons, 0.6 for maskable icons (Android crops to a circle).
 */
export function iconSvg(
  size: number,
  colors: IconColors,
  { rounded = false, scale = 0.92 }: { rounded?: boolean; scale?: number } = {},
): string {
  const stroke = 2.6;
  const loops = markLoops
    .map(
      (d, i) =>
        `<path d="${d}" stroke="${i === 2 ? colors.accent : colors.ink}" stroke-width="${stroke}"/>`,
    )
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}"><rect width="64" height="64"${rounded ? ' rx="14"' : ''} fill="${colors.bg}"/><g transform="translate(32 33) scale(${scale}) translate(-32 -33)" fill="none" stroke-linecap="round" stroke-linejoin="round">${loops}<path d="${markHandle}" stroke="${colors.ink}" stroke-width="${stroke * 2.2}"/><circle cx="${markDot.cx}" cy="${markDot.cy}" r="${markDot.r}" fill="${colors.accent}" stroke="none"/></g></svg>`;
}

/** Packs PNG images into one .ico file (PNG entries, understood by every current browser). */
export function pngsToIco(images: { size: number; png: Uint8Array }[]): Uint8Array<ArrayBuffer> {
  const headerSize = 6 + 16 * images.length;
  const total = headerSize + images.reduce((sum, i) => sum + i.png.length, 0);
  const out = new Uint8Array(total);
  const view = new DataView(out.buffer);
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, images.length, true);
  let offset = headerSize;
  images.forEach((image, i) => {
    const entry = 6 + i * 16;
    view.setUint8(entry, image.size >= 256 ? 0 : image.size);
    view.setUint8(entry + 1, image.size >= 256 ? 0 : image.size);
    view.setUint16(entry + 4, 1, true); // colour planes
    view.setUint16(entry + 6, 32, true); // bits per pixel
    view.setUint32(entry + 8, image.png.length, true);
    view.setUint32(entry + 12, offset, true);
    out.set(image.png, offset);
    offset += image.png.length;
  });
  return out;
}
