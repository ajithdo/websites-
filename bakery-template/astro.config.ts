import { readFileSync } from 'node:fs';
import { defineConfig, fontProviders } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { fontFamilies, type FontFamilyDef } from './src/config/fonts';
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

export default defineConfig({
  site: 'http://localhost:4321',
  integrations: [react(), sitemap(), interactionDirective()],
  vite: {
    plugins: [tailwindcss()],
  },
  fonts: fontFamilies.map(fontsourceVariable),
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  devToolbar: { enabled: false },
});
