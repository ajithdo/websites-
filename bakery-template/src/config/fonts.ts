/**
 * Font registry.
 *
 * Every family a theme can use is registered here and self-hosted from its
 * `@fontsource-variable/*` package, so builds never need the network.
 * `astro.config.ts` turns these entries into Astro Fonts API definitions
 * (with metric-matched fallbacks to avoid layout shift).
 *
 * To offer a new font to a client:
 *   1. npm install @fontsource-variable/<slug>
 *   2. add an entry below (check the package's `files/` folder for the axis name)
 *   3. use its `cssVariable` in a theme in `themes.ts`
 */
export interface FontFamilyDef {
  /** CSS family name. */
  name: string;
  /** Fontsource slug: "fraunces" → @fontsource-variable/fraunces. */
  slug: string;
  /** CSS variable the Fonts API defines, referenced by themes. */
  cssVariable: `--font-${string}`;
  /**
   * Axis file set to ship. "wght" for most families. Fraunces uses "standard"
   * (optical size + weight) so display sizes get its high-contrast cut.
   */
  axes: string;
  styles: readonly ('normal' | 'italic')[];
  /** Unicode subsets to register; the browser only downloads the ones a page uses. */
  subsets: readonly string[];
  /** Generic fallback; Astro derives size-adjusted fallback metrics from it. */
  fallback: 'serif' | 'sans-serif';
}

export const fontFamilies = [
  {
    name: 'Fraunces',
    slug: 'fraunces',
    cssVariable: '--font-fraunces',
    axes: 'standard',
    styles: ['normal', 'italic'],
    subsets: ['latin', 'latin-ext'],
    fallback: 'serif',
  },
  {
    name: 'Manrope',
    slug: 'manrope',
    cssVariable: '--font-manrope',
    axes: 'wght',
    styles: ['normal'],
    subsets: ['latin', 'latin-ext'],
    fallback: 'sans-serif',
  },
  {
    name: 'Playfair Display',
    slug: 'playfair-display',
    cssVariable: '--font-playfair',
    axes: 'wght',
    styles: ['normal', 'italic'],
    subsets: ['latin', 'latin-ext'],
    fallback: 'serif',
  },
  {
    name: 'DM Sans',
    slug: 'dm-sans',
    cssVariable: '--font-dm-sans',
    axes: 'wght',
    styles: ['normal'],
    subsets: ['latin', 'latin-ext'],
    fallback: 'sans-serif',
  },
  {
    name: 'Cormorant Garamond',
    slug: 'cormorant-garamond',
    cssVariable: '--font-cormorant',
    axes: 'wght',
    styles: ['normal', 'italic'],
    subsets: ['latin', 'latin-ext'],
    fallback: 'serif',
  },
  {
    name: 'Inter',
    slug: 'inter',
    cssVariable: '--font-inter',
    axes: 'wght',
    styles: ['normal'],
    subsets: ['latin', 'latin-ext'],
    fallback: 'sans-serif',
  },
  {
    name: 'Noto Sans Telugu',
    slug: 'noto-sans-telugu',
    cssVariable: '--font-telugu-sans',
    axes: 'wght',
    styles: ['normal'],
    subsets: ['telugu'],
    fallback: 'sans-serif',
  },
  {
    name: 'Noto Serif Telugu',
    slug: 'noto-serif-telugu',
    cssVariable: '--font-telugu-serif',
    axes: 'wght',
    styles: ['normal'],
    subsets: ['telugu'],
    fallback: 'serif',
  },
] as const satisfies readonly FontFamilyDef[];

export type FontVariable = (typeof fontFamilies)[number]['cssVariable'];
