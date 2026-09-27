/**
 * Generates the brand assets from src/config/site.ts:
 *   public/brand/logo-mark.svg   whisk-bloom mark (a whisk whose wires open like petals)
 *   public/brand/logo.svg        mark + wordmark (brand name set in Fraunces, as outlines)
 *   public/brand/grain.png       paper-grain tile used across the site
 *   src/lib/brand-mark.ts        mark geometry for the live header logo and intro
 *
 * For a new client without a vector logo, set brand.name in site.ts and run:
 *   npm run brand
 * (A client with a real logo: replace the SVG files and set brand.logo.mode to "image".)
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import opentype, { type Font } from 'opentype.js';
import sharp from 'sharp';
import { site } from '../src/config/site';
import { themes } from '../src/config/themes';

const root = join(import.meta.dirname, '..');
const out = (p: string) => join(root, p);
mkdirSync(out('public/brand'), { recursive: true });

const INK = themes.classic.colors.ink;
const GOLD = themes.classic.colors.accent;
const r2 = (n: number) => Math.round(n * 100) / 100;
const xml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

/* ── Mark geometry (64 × 64) ─────────────────────────────────────────── */
const hub = { x: 32, y: 35 };
const loops = [
  { angle: -62, length: 23, width: 6 },
  { angle: -31, length: 26.5, width: 6.3 },
  { angle: 0, length: 28.5, width: 6.6 },
  { angle: 31, length: 26.5, width: 6.3 },
  { angle: 62, length: 23, width: 6 },
].map(({ angle, length: L, width: W }) => {
  const t = (angle * Math.PI) / 180;
  const d = { x: Math.sin(t), y: -Math.cos(t) };
  const p = { x: Math.cos(t), y: Math.sin(t) };
  const pt = (a: number, b: number) =>
    `${r2(hub.x + d.x * a + p.x * b)} ${r2(hub.y + d.y * a + p.y * b)}`;
  return [
    `M${hub.x} ${hub.y}`,
    `C${pt(L * 0.22, W * 1.35)} ${pt(L * 1.02, W * 1.05)} ${pt(L, 0)}`,
    `C${pt(L * 1.02, -W * 1.05)} ${pt(L * 0.22, -W * 1.35)} ${hub.x} ${hub.y}`,
  ].join(' ');
});
const handle = `M${hub.x} ${hub.y + 3} L${hub.x} ${hub.y + 24}`;
const dot = { cx: hub.x, cy: hub.y, r: 2.4 };

const markBody = (ink: string, accent: string, stroke = 1.6) => `
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    ${loops.map((d, i) => `<path d="${d}" stroke="${i === 2 ? accent : ink}" stroke-width="${stroke}"/>`).join('\n    ')}
    <path d="${handle}" stroke="${ink}" stroke-width="${stroke * 2.2}"/>
  </g>
  <circle cx="${dot.cx}" cy="${dot.cy}" r="${dot.r}" fill="${accent}"/>`;

writeFileSync(
  out('public/brand/logo-mark.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="64" height="64" role="img" aria-label="${xml(site.brand.name)} mark">${markBody(INK, GOLD)}
</svg>
`,
);

/* ── Wordmark (outlined text) ────────────────────────────────────────── */
const fontPath = (pkg: string, file: string) =>
  join(root, 'node_modules/@fontsource', pkg, 'files', file);
const loadFont = (pkg: string, file: string) => {
  const buf = readFileSync(fontPath(pkg, file));
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const serif = loadFont('fraunces', 'fraunces-latin-500-normal.woff');
const serifItalic = loadFont('fraunces', 'fraunces-latin-400-italic.woff');
const sans = loadFont('manrope', 'manrope-latin-600-normal.woff');

/** Lays out text run by run (the "&" in italic), with optional tracking. */
function setLine(
  runs: { text: string; font: Font }[],
  x: number,
  baseline: number,
  size: number,
  tracking = 0,
) {
  let cursor = x;
  const parts: string[] = [];
  for (const { text, font } of runs) {
    for (const ch of text) {
      const glyph = font.charToGlyph(ch);
      parts.push(glyph.getPath(cursor, baseline, size).toPathData(2));
      cursor += ((glyph.advanceWidth ?? 0) / font.unitsPerEm) * size + tracking;
    }
  }
  return { d: parts.join(''), width: cursor - x - tracking };
}

const name = site.brand.name;
const ampIndex = name.indexOf('&');
const nameRuns =
  ampIndex >= 0
    ? [
        { text: name.slice(0, ampIndex), font: serif },
        { text: '&', font: serifItalic },
        { text: name.slice(ampIndex + 1), font: serif },
      ]
    : [{ text: name, font: serif }];

const descriptor = (
  typeof site.brand.descriptor === 'string' ? site.brand.descriptor : site.brand.descriptor.en
).toUpperCase();

const markSize = 64;
const gap = 18;
const nameSize = 44;
const textX = markSize + gap;
const title = setLine(nameRuns, textX, 40, nameSize, -0.4);
const desc = setLine([{ text: descriptor, font: sans }], textX + 1, 60, 10.5, 2.2);
const width = Math.ceil(textX + Math.max(title.width, desc.width) + 4);

writeFileSync(
  out('public/brand/logo.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 66" width="${width}" height="66" role="img" aria-label="${xml(name)}">
  <g transform="translate(0 1)">${markBody(INK, GOLD)}</g>
  <path d="${title.d}" fill="${INK}"/>
  <path d="${desc.d}" fill="${themes.classic.colors.accentInk}"/>
</svg>
`,
);

/* ── Geometry for the live logo and intro animation ──────────────────── */
writeFileSync(
  out('src/lib/brand-mark.ts'),
  `/** Whisk-bloom mark geometry (64 × 64). Generated by scripts/make-brand.ts. */
export const markLoops = ${JSON.stringify(loops, null, 2)};

export const markHandle = ${JSON.stringify(handle)};

export const markDot = ${JSON.stringify(dot)};
`,
);

/* ── Paper grain tile ────────────────────────────────────────────────── */
const grainSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160">
  <filter id="n" x="0" y="0"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/>
  <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.6 -0.35"/></filter>
  <rect width="160" height="160" filter="url(#n)"/>
</svg>`;
await sharp(Buffer.from(grainSvg))
  .png({ palette: true, colors: 16, compressionLevel: 9 })
  .toFile(out('public/brand/grain.png'));

console.log(`Brand assets written for "${name}" (wordmark ${width}×66).`);
