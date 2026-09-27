import { readFileSync } from 'node:fs';
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
function fontsourceVariable(def: FontFamilyDef) {
  const dir = `./node_modules/@fontsource-variable/${def.slug}`;
  const unicode = JSON.parse(readFileSync(`${dir}/unicode.json`, 'utf8')) as Record<string, string>;
  const meta = JSON.parse(readFileSync(`${dir}/metadata.json`, 'utf8')) as {
    variable?: { wght?: { min: string; max: string } };
  };
  const wght = meta.variable?.wght;
  const weight = wght ? `${wght.min} ${wght.max}` : '400';

  const variants = def.styles.flatMap((style) =>
    def.subsets.map((subset) => {
      const range = unicode[subset];
      if (!range) throw new Error(`Font ${def.name}: subset "${subset}" not found in ${dir}`);
      const [first, ...rest] = range.split(',');
      return {
        weight,
        style,
        display: 'swap' as const,
        src: [`${dir}/files/${def.slug}-${subset}-${def.axes}-${style}.woff2`] as [string],
        unicodeRange: [first!, ...rest] as [string, ...string[]],
      };
    }),
  );

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
  site: siteUrl,
  trailingSlash: 'ignore',
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
