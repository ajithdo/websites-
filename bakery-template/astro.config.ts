import { existsSync, readFileSync } from 'node:fs';
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { fontFamilies, type FontFamilyDef } from './src/config/fonts';
import { siteSchema } from './src/config/schema';
import { site } from './src/config/site';
import interactionDirective from './src/directives/integration';

/**
 * Builds a local (offline) Fonts API entry from a @fontsource-variable package:
 * one variant per style × subset, each with its unicode-range so browsers only
 * download what a page actually renders.
 */
const RUPEE = 0x20b9;

/** "U+20AD-20C0" without one code point → ["U+20AD-20B8", "U+20BA-20C0"]. */
function withoutCodePoint(range: string, cp: number): string[] {
  const [start = '', end = start] = range.trim().replace(/^U\+/i, '').split('-');
  const from = parseInt(start, 16);
  const to = parseInt(end, 16);
  if (Number.isNaN(from) || cp < from || cp > to) return [range.trim()];
  const hex = (n: number) => n.toString(16).toUpperCase().padStart(4, '0');
  const span = (a: number, b: number) => (a === b ? `U+${hex(a)}` : `U+${hex(a)}-${hex(b)}`);
  const parts: string[] = [];
  if (from < cp) parts.push(span(from, cp - 1));
  if (cp < to) parts.push(span(cp + 1, to));
  return parts;
}

function fontsourceVariable(def: FontFamilyDef) {
  const dir = `./node_modules/@fontsource-variable/${def.slug}`;
  const unicode = JSON.parse(readFileSync(`${dir}/unicode.json`, 'utf8')) as Record<string, string>;
  const meta = JSON.parse(readFileSync(`${dir}/metadata.json`, 'utf8')) as {
    variable?: { wght?: { min: string; max: string } };
  };
  const wght = meta.variable?.wght;
  const weight = wght ? `${wght.min} ${wght.max}` : '400';

  const variants = def.styles.flatMap((style) => {
    // A tiny "₹ only" file (npm run fonts:rupee) keeps prices from pulling in
    // the whole extended-Latin file just for the rupee sign.
    const rupee = `./src/assets/fonts/rupee/${def.slug}-${def.axes}-${style}.woff2`;
    const hasRupee = def.subsets.includes('latin-ext') && existsSync(rupee);
    const faces = def.subsets.map((subset) => {
      const range = unicode[subset];
      if (!range) throw new Error(`Font ${def.name}: subset "${subset}" not found in ${dir}`);
      const ranges = range.split(',').flatMap((r) => (hasRupee ? withoutCodePoint(r, RUPEE) : [r]));
      return {
        weight,
        style,
        display: 'swap' as const,
        src: [`${dir}/files/${def.slug}-${subset}-${def.axes}-${style}.woff2`] as [string],
        unicodeRange: ranges as [string, ...string[]],
      };
    });
    if (hasRupee) {
      faces.push({
        weight,
        style,
        display: 'swap' as const,
        src: [rupee] as [string],
        unicodeRange: ['U+20B9'] as [string, ...string[]],
      });
    }
    return faces;
  });

  return {
    provider: fontProviders.local(),
    name: def.name,
    cssVariable: def.cssVariable,
    fallbacks: [def.fallback],
    options: { variants: variants as [(typeof variants)[number], ...typeof variants] },
  };
}

// Fail the build early, with a readable message, if src/config/site.ts has a typo.
const parsed = siteSchema.safeParse(site);
if (!parsed.success) {
  const issues = parsed.error.issues
    .map((i) => `  • site.${i.path.join('.')}: ${i.message}`)
    .join('\n');
  throw new Error(`src/config/site.ts is invalid:\n${issues}`);
}

/**
 * Canonical origin: site.url when set, otherwise the host's build variables
 * (Netlify `URL`, Cloudflare Pages `CF_PAGES_URL`), otherwise local preview.
 */
const siteUrl = site.url || process.env.URL || process.env.CF_PAGES_URL || 'http://localhost:4321';

export default defineConfig({
  // BB_OUT_DIR lets QA build a second copy (e.g. the client-mode check) beside dist/.
  outDir: process.env.BB_OUT_DIR ?? './dist',
  site: siteUrl,
  trailingSlash: 'ignore',
  // Small pages: inline the CSS so the first paint needs no extra round trip.
  build: { inlineStylesheets: 'always' },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !/\/404\/?$/.test(page),
      ...(site.features.telugu
        ? { i18n: { defaultLocale: 'en', locales: { en: 'en-IN', te: 'te-IN' } } }
        : {}),
    }),
    interactionDirective(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: fontFamilies.map(fontsourceVariable),
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
