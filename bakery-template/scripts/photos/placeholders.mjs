/**
 * Writes a labelled placeholder JPG for every photo slot that has no file yet,
 * so the site builds before real photography is in place. Never overwrites.
 *   node scripts/photos/placeholders.mjs
 */
import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import sharp from 'sharp';
import { slots } from './slots.mjs';

const root = join(import.meta.dirname, '../../src/assets/images');
const palettes = [
  ['#E9C9C1', '#F4EADB', '#B8893B'],
  ['#F4EADB', '#E2C9A6', '#7E5E27'],
  ['#EAD7C7', '#F7EFE4', '#9C6B3C'],
  ['#E6CFC0', '#FBF6EE', '#8A5A28'],
];
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

let made = 0;
for (const [i, slot] of slots.entries()) {
  const out = join(root, slot.path);
  if (existsSync(out)) continue;
  mkdirSync(dirname(out), { recursive: true });
  const [a, b, ink] = palettes[i % palettes.length];
  const { w, h } = slot;
  const r = Math.min(w, h) * 0.28;
  const fs = Math.round(Math.min(w, h) * 0.045);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <radialGradient id="g" cx="35%" cy="30%" r="90%"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></radialGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <circle cx="${w / 2}" cy="${h / 2}" r="${r}" fill="none" stroke="${ink}" stroke-opacity="0.35" stroke-width="${Math.max(2, r * 0.02)}"/>
    <circle cx="${w / 2}" cy="${h / 2}" r="${r * 0.72}" fill="${ink}" fill-opacity="0.08"/>
    <text x="50%" y="${h - fs * 2.2}" text-anchor="middle" font-family="Georgia, serif" font-size="${fs}" fill="${ink}" fill-opacity="0.75">Photo placeholder · ${esc(slot.subject)}</text>
  </svg>`;
  await sharp(Buffer.from(svg)).jpeg({ quality: 82, mozjpeg: true }).toFile(out);
  made++;
}
console.log(`Placeholders written: ${made} (of ${slots.length} slots)`);
