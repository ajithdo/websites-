/**
 * Cuts a tiny "₹ only" font from each theme font, so pages with prices do
 * not download a whole extended-Latin font file just for the rupee sign.
 *   npm run fonts:rupee   (run again after adding a font in src/config/fonts.ts)
 *
 * Output: src/assets/fonts/rupee/<slug>-<axes>-<style>.woff2 (a few KB each,
 * variable axes kept). astro.config.ts serves ₹ from these files.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import subsetFont from 'subset-font';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'src/assets/fonts/rupee');
mkdirSync(outDir, { recursive: true });

// Read the registry without a TypeScript loader: pull the entries out of fonts.ts.
const source = readFileSync(join(root, 'src/config/fonts.ts'), 'utf8');
const entries = [
  ...source.matchAll(
    /slug: '([^']+)'[\s\S]*?axes: '([^']+)'[\s\S]*?styles: \[([^\]]*)\][\s\S]*?subsets: \[([^\]]*)\]/g,
  ),
];

for (const [, slug, axes, stylesList, subsetsList] of entries) {
  if (!subsetsList.includes('latin-ext')) continue;
  for (const style of stylesList.match(/'(\w+)'/g).map((s) => s.replaceAll("'", ''))) {
    const input = join(
      root,
      'node_modules/@fontsource-variable',
      slug,
      'files',
      `${slug}-latin-ext-${axes}-${style}.woff2`,
    );
    if (!existsSync(input)) {
      console.warn(`skip ${slug} ${style}: no latin-ext file`);
      continue;
    }
    const out = await subsetFont(readFileSync(input), '₹', { targetFormat: 'woff2' });
    const file = join(outDir, `${slug}-${axes}-${style}.woff2`);
    writeFileSync(file, out);
    console.log(`✓ ${slug} ${style}: ${out.length} bytes`);
  }
}
