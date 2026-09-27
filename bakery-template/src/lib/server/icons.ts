/** Build-time PNG and ICO icons from the brand mark (uses sharp). */
import sharp from 'sharp';
import { site } from '~/config/site';
import { themes } from '~/config/themes';
import { iconSvg, pngsToIco, type IconColors } from '../brand-icon';

export function themeIconColors(): IconColors {
  const c = themes[site.theme].colors;
  return { bg: c.inverse, ink: c.onInverse, accent: c.accentOnInverse };
}

export async function iconPng(
  size: number,
  options: { rounded?: boolean; scale?: number } = {},
): Promise<Uint8Array<ArrayBuffer>> {
  const svg = iconSvg(size, themeIconColors(), options);
  return new Uint8Array(await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer());
}

export async function faviconIco(): Promise<Uint8Array<ArrayBuffer>> {
  const images = await Promise.all(
    [16, 32, 48].map(async (size) => ({ size, png: await iconPng(size, { rounded: true }) })),
  );
  return pngsToIco(images);
}
