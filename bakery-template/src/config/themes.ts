/**
 * Theme presets.
 *
 * Each theme is a full set of colour tokens plus a font pairing. The layout
 * turns the active theme (or all three in demo mode) into CSS custom
 * properties, and every component reads those properties, so a theme switch
 * restyles the whole site instantly.
 *
 * Contrast rules (enforced by tests/unit/contrast.test.ts, WCAG AA):
 * - `ink`, `inkMuted`, `accentInk`, `danger`, `success` must reach 4.5:1 on
 *   `bg`, `bgAlt` and `surface`.
 * - `onAccent` on `accent`, `onSecondary` on `secondary`, `onTertiary` on
 *   `tertiary`, and the `inverse*` text tokens on `inverse` must reach 4.5:1.
 * - `lineStrong` (input borders) and `focus` must reach 3:1 on the grounds.
 * The raw brand hue (`accent`) is for fills, seals and rules. Use `accentInk`
 * whenever the accent colour is used for text on a light ground.
 *
 * To rebrand colours: copy a preset, change the hex values, run `npm test`.
 */
import type { FontVariable } from './fonts';

export interface ThemeColors {
  /** Page ground. */
  bg: string;
  /** Alternate section ground. */
  bgAlt: string;
  /** Cards, sheets, inputs. */
  surface: string;
  ink: string;
  inkMuted: string;
  /** Brand accent fill (buttons, seals, hairline rules). */
  accent: string;
  /** Accent-coloured text/icons on bg, bgAlt and surface. */
  accentInk: string;
  /** Text on accent fills. */
  onAccent: string;
  /** Secondary brand field (whole-section colour). */
  secondary: string;
  onSecondary: string;
  onSecondaryMuted: string;
  /** Optional third field colour. */
  tertiary: string;
  onTertiary: string;
  /** Strong contrast band (e.g. the closing CTA). */
  inverse: string;
  onInverse: string;
  onInverseMuted: string;
  /** Accent colour for text/icons on the inverse band. */
  accentOnInverse: string;
  /** Decorative hairlines (no contrast requirement). */
  line: string;
  /** Input and control borders. */
  lineStrong: string;
  focus: string;
  focusOnInverse: string;
  danger: string;
  success: string;
  /** Hero photo scrim colour (rgb triplet, no alpha). */
  scrim: string;
}

export interface ThemeFonts {
  heading: FontVariable;
  body: FontVariable;
  /** Weight used for display headlines. */
  headingWeight: number;
  /** Letter-spacing for display headlines. */
  headingTracking: string;
  /** Size multiplier for display type (compensates for small x-heights). */
  headingScale: number;
}

export interface ThemeShape {
  /** Buttons and chips. */
  control: string;
  /** Cards and sheets. */
  card: string;
  /** Arched photo frames (top corners). */
  arch: string;
}

export interface Theme {
  id: ThemeId;
  name: string;
  scheme: 'light' | 'dark';
  colors: ThemeColors;
  fonts: ThemeFonts;
  shape: ThemeShape;
}

export const themeIds = ['classic', 'pastel', 'cocoa'] as const;
export type ThemeId = (typeof themeIds)[number];

export const themes: Record<ThemeId, Theme> = {
  classic: {
    id: 'classic',
    name: 'Classic Patisserie',
    scheme: 'light',
    colors: {
      bg: '#FBF6EE',
      bgAlt: '#F4EADB',
      surface: '#FFFCF7',
      ink: '#2A1D17',
      inkMuted: '#6A594D',
      accent: '#B8893B',
      accentInk: '#7E5E27',
      onAccent: '#2A1D17',
      secondary: '#E9C9C1',
      onSecondary: '#2A1D17',
      onSecondaryMuted: '#5E4B44',
      tertiary: '#F4EADB',
      onTertiary: '#2A1D17',
      inverse: '#2A1D17',
      onInverse: '#FBF6EE',
      onInverseMuted: '#C9BBAD',
      accentOnInverse: '#D4A85C',
      line: 'rgb(42 29 23 / 0.14)',
      lineStrong: '#8A7A6D',
      focus: '#2A1D17',
      focusOnInverse: '#FBF6EE',
      danger: '#A12E22',
      success: '#2F6B3A',
      scrim: '30 20 15',
    },
    fonts: {
      heading: '--font-fraunces',
      body: '--font-manrope',
      headingWeight: 440,
      headingTracking: '-0.025em',
      headingScale: 1,
    },
    shape: { control: '999px', card: '6px', arch: '999px 999px 6px 6px' },
  },
  pastel: {
    id: 'pastel',
    name: 'Modern Pastel',
    scheme: 'light',
    colors: {
      bg: '#FFFBF7',
      bgAlt: '#FBF1EA',
      surface: '#FFFFFF',
      ink: '#1F1B24',
      inkMuted: '#5F5A64',
      accent: '#D6336C',
      accentInk: '#C22D62',
      onAccent: '#FFFFFF',
      secondary: '#A8C69F',
      onSecondary: '#1F1B24',
      onSecondaryMuted: '#3F463F',
      tertiary: '#F6E3A1',
      onTertiary: '#1F1B24',
      inverse: '#1F1B24',
      onInverse: '#FFFBF7',
      onInverseMuted: '#C4BCC7',
      accentOnInverse: '#F58AB0',
      line: 'rgb(31 27 36 / 0.12)',
      lineStrong: '#86818A',
      focus: '#1F1B24',
      focusOnInverse: '#FFFBF7',
      danger: '#B3261E',
      success: '#2E6A3A',
      scrim: '31 27 36',
    },
    fonts: {
      heading: '--font-playfair',
      body: '--font-dm-sans',
      headingWeight: 560,
      headingTracking: '-0.015em',
      headingScale: 0.96,
    },
    shape: { control: '999px', card: '20px', arch: '28px' },
  },
  cocoa: {
    id: 'cocoa',
    name: 'Rich Cocoa',
    scheme: 'dark',
    colors: {
      bg: '#1E1411',
      bgAlt: '#261A15',
      surface: '#2E211B',
      ink: '#F3E9DC',
      inkMuted: '#BCAE9F',
      accent: '#C98B4B',
      accentInk: '#D69C5F',
      onAccent: '#1E1411',
      secondary: '#D8A48F',
      onSecondary: '#1E1411',
      onSecondaryMuted: '#4A3128',
      tertiary: '#2E211B',
      onTertiary: '#F3E9DC',
      inverse: '#F3E9DC',
      onInverse: '#1E1411',
      onInverseMuted: '#5C4F46',
      accentOnInverse: '#8A5A28',
      line: 'rgb(243 233 220 / 0.14)',
      lineStrong: '#85786E',
      focus: '#F3E9DC',
      focusOnInverse: '#1E1411',
      danger: '#F2A08C',
      success: '#9DD3A8',
      scrim: '20 12 9',
    },
    fonts: {
      heading: '--font-cormorant',
      body: '--font-inter',
      headingWeight: 560,
      headingTracking: '-0.01em',
      headingScale: 1.1,
    },
    shape: { control: '2px', card: '2px', arch: '999px 999px 0 0' },
  },
};

export function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && (themeIds as readonly string[]).includes(value);
}

const cssName = (key: string) => `--bb-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;

/** CSS custom properties for one theme, as a declaration block body. */
export function themeDeclarations(theme: Theme): string {
  const colorVars = Object.entries(theme.colors).map(([k, v]) => `${cssName(k)}:${v};`);
  const fontVars = [
    `--bb-font-heading:var(${theme.fonts.heading});`,
    `--bb-font-body:var(${theme.fonts.body});`,
    `--bb-heading-weight:${theme.fonts.headingWeight};`,
    `--bb-heading-tracking:${theme.fonts.headingTracking};`,
    `--bb-heading-scale:${theme.fonts.headingScale};`,
  ];
  const shapeVars = [
    `--bb-radius-control:${theme.shape.control};`,
    `--bb-radius-card:${theme.shape.card};`,
    `--bb-radius-arch:${theme.shape.arch};`,
  ];
  return [...colorVars, ...fontVars, ...shapeVars, `color-scheme:${theme.scheme};`].join('');
}

/**
 * CSS for the given themes. The default theme also applies to bare `:root`,
 * so the page is styled even before the theme attribute is set.
 */
export function themeStylesheet(ids: readonly ThemeId[], defaultId: ThemeId): string {
  const blocks = ids.map((id) => {
    const selector =
      id === defaultId ? `:root,:root[data-theme="${id}"]` : `:root[data-theme="${id}"]`;
    return `${selector}{${themeDeclarations(themes[id])}}`;
  });
  return blocks.join('');
}
