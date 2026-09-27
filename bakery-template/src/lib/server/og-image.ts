/**
 * The 1200 × 630 link-preview image (WhatsApp, Facebook, X): the hero photo
 * with the brand, headline and city set in the active theme's fonts and
 * colours. Rendered at build time with satori (layout), resvg (SVG → PNG)
 * and sharp (photo crop, compositing, JPEG under 300 KB).
 */
import { Resvg } from '@resvg/resvg-js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import type { FontVariable } from '~/config/fonts';
import { site } from '~/config/site';
import { themes } from '~/config/themes';
import { getDictionary, lt } from '~/i18n';
import { iconSvg } from '../brand-icon';

const WIDTH = 1200;
const HEIGHT = 630;

/** Static (woff) builds of each theme font, for satori. */
const fontPackages: Partial<Record<FontVariable, string>> = {
  '--font-fraunces': 'fraunces',
  '--font-manrope': 'manrope',
  '--font-playfair': 'playfair-display',
  '--font-dm-sans': 'dm-sans',
  '--font-cormorant': 'cormorant-garamond',
  '--font-inter': 'inter',
};

function fontFile(variable: FontVariable, weight: number, style: 'normal' | 'italic'): Buffer {
  const pkg = fontPackages[variable];
  if (!pkg) throw new Error(`No static font package for ${variable}`);
  return readFileSync(
    join(
      process.cwd(),
      'node_modules/@fontsource',
      pkg,
      'files',
      `${pkg}-latin-${weight}-${style}.woff`,
    ),
  );
}

type Node = { type: string; props: Record<string, unknown> };
const el = (
  type: string,
  style: Record<string, unknown>,
  children?: unknown,
  extra = {},
): Node => ({
  type,
  props: { style, children, ...extra },
});

function hexToRgba(hex: string, alpha: number): string {
  const n = parseInt(hex.replace('#', ''), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

/** Crops the photo to cover 1200 × 630 around the configured focus ("x% y%"). */
async function heroBackground(): Promise<Buffer> {
  const path = join(process.cwd(), 'src/assets/images', site.hero.image);
  const image = sharp(path);
  const { width = WIDTH, height = HEIGHT } = await image.metadata();
  const scale = Math.max(WIDTH / width, HEIGHT / height);
  const w = Math.ceil(width * scale);
  const h = Math.ceil(height * scale);
  const [x = 50, y = 50] = site.hero.position.split(/\s+/).map((v) => parseFloat(v));
  return image
    .resize(w, h)
    .extract({
      left: Math.round(((w - WIDTH) * x) / 100),
      top: Math.round(((h - HEIGHT) * y) / 100),
      width: WIDTH,
      height: HEIGHT,
    })
    .toBuffer();
}

export async function renderOgImage(): Promise<Buffer> {
  const theme = themes[site.theme];
  const c = theme.colors;
  const t = getDictionary('en');
  const weight = Math.min(600, Math.max(400, Math.round(theme.fonts.headingWeight / 100) * 100)) as
    400 | 500 | 600;

  const mark = `data:image/svg+xml;base64,${Buffer.from(
    iconSvg(64, { bg: 'none', ink: c.onInverse, accent: c.accentOnInverse }),
  ).toString('base64')}`;

  const word = (text: string, italic = false) =>
    el(
      'span',
      {
        marginRight: 18,
        ...(italic ? { fontStyle: 'italic', color: c.accentOnInverse } : {}),
      },
      text,
    );
  const { titleLead, titleAccent, titleTail } = t.home.hero;
  const headline = [
    ...titleLead.split(' ').map((w) => word(w)),
    ...titleAccent.split(' ').map((w) => word(w, true)),
    ...titleTail.split(' ').map((w) => word(w)),
  ];

  const tree = el(
    'div',
    {
      width: WIDTH,
      height: HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '60px 72px 64px',
      color: c.onInverse,
      fontFamily: 'Body',
      backgroundImage: `linear-gradient(90deg, ${hexToRgba(c.inverse, 0.95)} 0%, ${hexToRgba(
        c.inverse,
        0.88,
      )} 55%, ${hexToRgba(c.inverse, 0.35)} 85%, ${hexToRgba(c.inverse, 0)} 100%)`,
    },
    [
      el('div', { display: 'flex', alignItems: 'center' }, [
        el('img', { width: 60, height: 60, marginRight: 16 }, undefined, {
          src: mark,
          width: 60,
          height: 60,
        }),
        el('div', { fontFamily: 'Display', fontSize: 36, fontWeight: weight }, site.brand.name),
      ]),
      el('div', { display: 'flex', flexDirection: 'column', maxWidth: 860 }, [
        el(
          'div',
          {
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: c.accentOnInverse,
          },
          lt(site.brand.descriptor, 'en'),
        ),
        el(
          'div',
          {
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: 18,
            fontFamily: 'Display',
            fontWeight: weight,
            fontSize: 70 * theme.fonts.headingScale,
            lineHeight: 1.04,
            letterSpacing: -1.5,
          },
          headline,
        ),
        el(
          'div',
          { marginTop: 26, fontSize: 24, fontWeight: 500, color: c.onInverseMuted },
          `${lt(site.contact.cityName, 'en')} · ${t.cta.designCake} · ${t.cta.orderWhatsApp}`,
        ),
      ]),
    ],
  );

  const svg = await satori(tree as never, {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      {
        name: 'Display',
        data: fontFile(theme.fonts.heading, weight, 'normal'),
        weight,
        style: 'normal',
      },
      {
        name: 'Display',
        data: fontFile(theme.fonts.heading, weight, 'italic'),
        weight,
        style: 'italic',
      },
      {
        name: 'Body',
        data: fontFile(theme.fonts.body, 500, 'normal'),
        weight: 500,
        style: 'normal',
      },
      {
        name: 'Body',
        data: fontFile(theme.fonts.body, 600, 'normal'),
        weight: 600,
        style: 'normal',
      },
    ],
  });
  const overlay = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } }).render().asPng();

  return sharp(await heroBackground())
    .composite([{ input: overlay }])
    .jpeg({ quality: 82, mozjpeg: true, progressive: true })
    .toBuffer();
}
